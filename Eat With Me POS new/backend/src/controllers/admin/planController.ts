import { Response } from 'express';
import { AdminRequest } from '../../middleware/adminAuth';
import { getMasterPrisma } from '../../utils/masterPrisma';
import { recordAdminAudit } from '../../utils/adminAuditLogger';
import type { Prisma, ServicePlan, PosType, BillingCycle } from '../../generated/master';

function toCents(value: unknown) {
  if (typeof value === 'number') {
    return Math.round(value * 100);
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
  }
  return 0;
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => String(item).trim()).filter(Boolean)));
}

function mapPlan(plan: ServicePlan) {
  return {
    id: plan.id,
    name: plan.name,
    code: plan.code,
    posType: plan.posType,
    description: plan.description,
    featureHighlights: plan.featureHighlights || [],
    allowedModules: plan.allowedModules || [],
  monthlyPrice: plan.monthlyPriceCents / 100,
  annualPrice: plan.annualPriceCents / 100,
    currency: plan.currency,
    defaultBillingCycle: plan.defaultBillingCycle,
    trialPeriodDays: plan.trialPeriodDays,
    isFeatured: plan.isFeatured,
    isActive: plan.isActive,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

function normalizePosType(posType: unknown): PosType {
  if (typeof posType !== 'string') return 'RESTAURANT';
  const upper = posType.toUpperCase();
  return ['RESTAURANT', 'ARTIST', 'BUSINESS'].includes(upper) ? (upper as PosType) : 'RESTAURANT';
}

function normalizeBillingCycle(billingCycle: unknown): BillingCycle {
  if (typeof billingCycle !== 'string') return 'MONTHLY';
  const upper = billingCycle.toUpperCase();
  return upper === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
}

export async function createServicePlan(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const {
    name,
    code,
    posType,
    description,
    featureHighlights,
    allowedModules,
    monthlyPrice,
    annualPrice,
    currency,
    defaultBillingCycle,
    trialPeriodDays,
    isFeatured,
  } = req.body || {};

  if (!name || !code) {
    return res.status(400).json({ message: 'name and code are required.' });
  }

  const plan = await masterPrisma.servicePlan.create({
    data: {
      name,
      code,
      posType: normalizePosType(posType),
      description: description || null,
      featureHighlights: sanitizeStringArray(featureHighlights),
      allowedModules: sanitizeStringArray(allowedModules),
      monthlyPriceCents: toCents(monthlyPrice ?? req.body?.monthlyPriceCents),
      annualPriceCents: toCents(annualPrice ?? req.body?.annualPriceCents),
      currency: typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'INR',
      defaultBillingCycle: normalizeBillingCycle(defaultBillingCycle),
      trialPeriodDays: Number.isInteger(trialPeriodDays) ? trialPeriodDays : 14,
      isFeatured: Boolean(isFeatured),
      isActive: true,
    },
  });

  await recordAdminAudit(req.admin?.id, 'CREATE_SERVICE_PLAN', 'ServicePlan', plan.id, {
    code: plan.code,
    posType: plan.posType,
  });

  return res.status(201).json({ plan: mapPlan(plan) });
}

export async function updateServicePlan(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const { id } = req.params;
  const updates: Prisma.ServicePlanUpdateInput = {};
  const payload = req.body || {};

  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.featureHighlights !== undefined) updates.featureHighlights = sanitizeStringArray(payload.featureHighlights);
  if (payload.allowedModules !== undefined) updates.allowedModules = sanitizeStringArray(payload.allowedModules);
  if (payload.monthlyPrice !== undefined || payload.monthlyPriceCents !== undefined) {
    updates.monthlyPriceCents = toCents(payload.monthlyPrice ?? payload.monthlyPriceCents);
  }
  if (payload.annualPrice !== undefined || payload.annualPriceCents !== undefined) {
    updates.annualPriceCents = toCents(payload.annualPrice ?? payload.annualPriceCents);
  }
  if (payload.currency !== undefined) {
    updates.currency = typeof payload.currency === 'string' && payload.currency.trim()
      ? payload.currency.trim().toUpperCase()
      : 'INR';
  }
  if (payload.defaultBillingCycle !== undefined) {
    updates.defaultBillingCycle = normalizeBillingCycle(payload.defaultBillingCycle);
  }
  if (payload.trialPeriodDays !== undefined) {
    updates.trialPeriodDays = Number.isInteger(payload.trialPeriodDays)
      ? payload.trialPeriodDays
      : 14;
  }
  if (payload.isFeatured !== undefined) {
    updates.isFeatured = Boolean(payload.isFeatured);
  }
  if (payload.isActive !== undefined) {
    updates.isActive = Boolean(payload.isActive);
  }
  if (payload.posType !== undefined) {
    updates.posType = normalizePosType(payload.posType);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No valid plan fields were provided for update.' });
  }

  const plan = await masterPrisma.servicePlan.update({
    where: { id },
    data: updates,
  });

  await recordAdminAudit(req.admin?.id, 'UPDATE_SERVICE_PLAN', 'ServicePlan', plan.id, updates);

  return res.json({ plan: mapPlan(plan) });
}
