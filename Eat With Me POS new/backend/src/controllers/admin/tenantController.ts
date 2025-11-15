import { Response } from 'express';
import { AdminRequest } from '../../middleware/adminAuth';
import { getMasterPrisma } from '../../utils/masterPrisma';
import { recordAdminAudit } from '../../utils/adminAuditLogger';
import type {
  Prisma,
  TenantModuleStatus,
  TenantPlanStatus,
  PosType,
  TenantStatus,
  BillingCycle,
} from '../../generated/master';

function toCurrencyNumber(value: number | null | undefined) {
  return typeof value === 'number' ? value / 100 : 0;
}

function getString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }
  return undefined;
}

function parseNumber(rawValue: unknown, fallback: number) {
  const value = getString(rawValue);
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function normalizePosTypeFilter(value: string | undefined): PosType | undefined {
  if (!value) return undefined;
  const normalized = value.toUpperCase();
  if (normalized === 'RESTAURANT' || normalized === 'ARTIST' || normalized === 'BUSINESS') {
    return normalized as PosType;
  }
  return undefined;
}

function normalizeTenantStatus(value: string | undefined): TenantStatus | undefined {
  if (!value) return undefined;
  const normalized = value.toUpperCase();
  if (normalized === 'TRIAL' || normalized === 'ACTIVE' || normalized === 'SUSPENDED' || normalized === 'CANCELLED') {
    return normalized as TenantStatus;
  }
  return undefined;
}

function normalizeModuleStatus(value: unknown): TenantModuleStatus {
  if (typeof value === 'string') {
    const normalized = value.toUpperCase();
    if (normalized === 'ACTIVE' || normalized === 'DISABLED' || normalized === 'PENDING') {
      return normalized as TenantModuleStatus;
    }
  }
  return 'ACTIVE';
}

function toOptionalDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return value;
  }
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

type TenantWithPlanAndModules = Prisma.TenantGetPayload<{
  include: {
    tenantPlans: {
      include: { plan: true };
    };
    modules: true;
  };
}>;

type TenantWithDetail = Prisma.TenantGetPayload<{
  include: {
    tenantPlans: {
      include: { plan: true };
    };
    modules: true;
    usageSnapshots: true;
  };
}>;

function normalizeTenant(tenant: TenantWithPlanAndModules) {
  const latestPlan = tenant.tenantPlans?.[0];
  const plan = latestPlan?.plan;

  return {
    id: tenant.id,
    name: tenant.name,
    email: tenant.email,
    posType: tenant.posType,
    status: tenant.status,
    country: tenant.country,
    city: tenant.city,
    timezone: tenant.timezone,
    createdAt: tenant.createdAt,
    lastSeenAt: tenant.lastSeenAt,
    subscription: latestPlan
      ? {
          status: latestPlan.status,
          billingCycle: latestPlan.billingCycle,
          startDate: latestPlan.startDate,
          renewalDate: latestPlan.renewalDate,
          monthlyRevenue: toCurrencyNumber(latestPlan.monthlyRevenueCents),
          totalRevenue: toCurrencyNumber(latestPlan.totalRevenueCents),
          transactionsCount: latestPlan.transactionsCount,
          allowedModules: latestPlan.allowedModulesSnapshot || [],
          plan: plan
            ? {
                id: plan.id,
                name: plan.name,
                code: plan.code,
                monthlyPrice: toCurrencyNumber(plan.monthlyPriceCents),
                annualPrice: toCurrencyNumber(plan.annualPriceCents),
                currency: plan.currency,
                defaultBillingCycle: plan.defaultBillingCycle,
                trialPeriodDays: plan.trialPeriodDays,
                allowedModules: plan.allowedModules || [],
              }
            : undefined,
        }
      : undefined,
  modules: tenant.modules?.map((module) => ({
      id: module.id,
      moduleKey: module.moduleKey,
      moduleName: module.moduleName,
      status: module.status,
      assignedAt: module.assignedAt,
      expiresAt: module.expiresAt,
      lastUsedAt: module.lastUsedAt,
    })),
  };
}

export async function listTenants(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const planId = getString(req.query.planId);
  const limit = parseNumber(req.query.limit, 50);
  const page = parseNumber(req.query.page, 1);
  const skip = (page - 1) * limit;

  const where: Prisma.TenantWhereInput = {};

  const search = getString(req.query.search);
  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
      { restaurantId: { contains: term, mode: 'insensitive' } },
    ];
  }

  const posType = normalizePosTypeFilter(getString(req.query.posType));
  if (posType) {
    where.posType = posType;
  }

  const status = normalizeTenantStatus(getString(req.query.status));
  if (status) {
    where.status = status;
  }

  if (planId) {
    where.tenantPlans = {
      some: {
        planId,
      },
    };
  }

  const tenants = await masterPrisma.tenant.findMany({
    where,
    include: {
      tenantPlans: {
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      modules: true,
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  const totalCount = await masterPrisma.tenant.count({ where });

  return res.json({
    tenants: tenants.map(normalizeTenant),
    pagination: {
      page,
      limit,
      total: totalCount,
    },
  });
}

export async function getTenantDetail(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const { id } = req.params;

  const tenant = await masterPrisma.tenant.findUnique({
    where: { id },
    include: {
      tenantPlans: {
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
      },
      modules: true,
      usageSnapshots: {
        orderBy: { snapshotDate: 'desc' },
        take: 24,
      },
    },
  });

  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found.' });
  }

  return res.json({
    tenant: normalizeTenant(tenant),
    usageSnapshots: tenant.usageSnapshots,
  });
}

export async function updateTenantModules(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const { id } = req.params;
  const { modules } = req.body || {};

  if (!Array.isArray(modules)) {
    return res.status(400).json({ message: 'Modules payload must be an array.' });
  }

  const tenant = await masterPrisma.tenant.findUnique({ where: { id } });
  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found.' });
  }

  const normalizedModules = modules
    .filter((module) => module && module.moduleKey)
    .map((module) => {
      const moduleKey = String(module.moduleKey);
      const moduleName = module.moduleName ? String(module.moduleName) : undefined;
      const status = normalizeModuleStatus(module.status);
      const hasExpiresAt = module.expiresAt !== undefined && module.expiresAt !== null;
      const hasLastUsedAt = module.lastUsedAt !== undefined && module.lastUsedAt !== null;

      return {
        moduleKey,
        moduleName,
        status,
        hasExpiresAt,
        expiresAt: hasExpiresAt ? toOptionalDate(module.expiresAt) : undefined,
        hasLastUsedAt,
        lastUsedAt: hasLastUsedAt ? toOptionalDate(module.lastUsedAt) : undefined,
      };
    });

  if (!normalizedModules.length) {
    await masterPrisma.tenantModule.deleteMany({ where: { tenantId: id } });
    await recordAdminAudit(req.admin?.id, 'UPDATE_TENANT_MODULES', 'Tenant', id, {
      moduleCount: 0,
    });

    return res.json({ modules: [] });
  }

  const moduleKeys = normalizedModules.map((module) => module.moduleKey);

  await masterPrisma.$transaction([
    masterPrisma.tenantModule.deleteMany({
      where: {
        tenantId: id,
        moduleKey: { notIn: moduleKeys },
      },
    }),
    ...normalizedModules.map((module) =>
      masterPrisma.tenantModule.upsert({
        where: {
          tenantId_moduleKey: {
            tenantId: id,
            moduleKey: module.moduleKey,
          },
        },
        update: {
          moduleName: module.moduleName,
          status: module.status,
          expiresAt: module.hasExpiresAt ? module.expiresAt ?? null : null,
          lastUsedAt: module.hasLastUsedAt ? module.lastUsedAt ?? null : null,
        },
        create: {
          tenantId: id,
          moduleKey: module.moduleKey,
          moduleName: module.moduleName,
          status: module.status,
          ...(module.hasExpiresAt && module.expiresAt ? { expiresAt: module.expiresAt } : {}),
          ...(module.hasLastUsedAt && module.lastUsedAt ? { lastUsedAt: module.lastUsedAt } : {}),
        },
      })
    ),
  ]);

  await recordAdminAudit(req.admin?.id, 'UPDATE_TENANT_MODULES', 'Tenant', id, {
    moduleCount: normalizedModules.length,
  });

  const latestTenantPlan = await masterPrisma.tenantPlan.findFirst({
    where: { tenantId: id },
    orderBy: { createdAt: 'desc' },
  });

  if (latestTenantPlan) {
    await masterPrisma.tenantPlan.update({
      where: { id: latestTenantPlan.id },
      data: {
        allowedModulesSnapshot: moduleKeys,
      },
    });
  }

  const updatedModules = await masterPrisma.tenantModule.findMany({
    where: { tenantId: id },
    orderBy: { moduleKey: 'asc' },
  });

  return res.json({
    modules: updatedModules,
  });
}

export async function listServicePlans(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();

  const plans = await masterPrisma.servicePlan.findMany({
    where: { isActive: true },
    orderBy: [
      { posType: 'asc' },
      { monthlyPriceCents: 'asc' },
    ],
  });

  return res.json({
    plans: plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      code: plan.code,
      posType: plan.posType,
      description: plan.description,
      featureHighlights: plan.featureHighlights,
      monthlyPrice: plan.monthlyPriceCents / 100,
      annualPrice: plan.annualPriceCents / 100,
      currency: plan.currency,
      defaultBillingCycle: plan.defaultBillingCycle,
      trialPeriodDays: plan.trialPeriodDays,
      allowedModules: plan.allowedModules || [],
      isFeatured: plan.isFeatured,
    })),
  });
}

function calculatePlanRenewal(trialDays: number, billingCycle: string) {
  const date = new Date();
  if (trialDays > 0) {
    date.setDate(date.getDate() + trialDays);
    return date;
  }
  if (billingCycle === 'ANNUAL') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date;
}

export async function assignTenantPlan(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const { id } = req.params;
  const { planId, billingCycle } = req.body || {};

  if (!planId || typeof planId !== 'string') {
    return res.status(400).json({ message: 'planId is required.' });
  }

  const tenant = await masterPrisma.tenant.findUnique({ where: { id } });
  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found.' });
  }

  const plan = await masterPrisma.servicePlan.findFirst({
    where: {
      id: planId,
      isActive: true,
    },
  });

  if (!plan) {
    return res.status(400).json({ message: 'Selected plan is not available.' });
  }

  const normalizedModules: string[] = Array.isArray(plan.allowedModules)
    ? Array.from(new Set(plan.allowedModules.filter((module: string) => Boolean(module))))
    : [];

  const normalizedBillingCycle: BillingCycle =
    typeof billingCycle === 'string' && billingCycle.toUpperCase() === 'ANNUAL'
      ? 'ANNUAL'
      : plan.defaultBillingCycle;

  const now = new Date();
  const renewalDate = calculatePlanRenewal(plan.trialPeriodDays, normalizedBillingCycle);

  const status: TenantPlanStatus = plan.trialPeriodDays > 0 ? 'TRIAL' : 'ACTIVE';

  const result = await masterPrisma.$transaction(async (tx) => {
    await tx.tenantPlan.updateMany({
      where: {
        tenantId: id,
        status: {
          in: ['TRIAL', 'ACTIVE', 'IN_GRACE_PERIOD'],
        },
      },
      data: {
        status: 'CANCELLED',
        endDate: now,
      },
    });

    const tenantPlan = await tx.tenantPlan.create({
      data: {
        tenantId: id,
        planId: plan.id,
        status,
        billingCycle: normalizedBillingCycle,
        startDate: now,
        renewalDate,
        monthlyRevenueCents: plan.monthlyPriceCents,
        totalRevenueCents: 0,
        transactionsCount: 0,
        allowedModulesSnapshot: normalizedModules,
      },
      include: {
        plan: true,
      },
    });

    await tx.tenant.update({
      where: { id },
      data: {
        status,
        posType: plan.posType,
      },
    });

    await tx.tenantModule.deleteMany({ where: { tenantId: id } });

    if (normalizedModules.length > 0) {
      await tx.tenantModule.createMany({
        data: normalizedModules.map((moduleKey: string) => ({
          tenantId: id,
          moduleKey,
          status: 'ACTIVE',
        })),
      });
    }

    return tenantPlan;
  });

  await recordAdminAudit(req.admin?.id, 'ASSIGN_TENANT_PLAN', 'Tenant', id, {
    planId: plan.id,
    billingCycle: normalizedBillingCycle,
    moduleCount: normalizedModules.length,
  });

  const refreshedTenant = await masterPrisma.tenant.findUnique({
    where: { id },
    include: {
      tenantPlans: {
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      modules: true,
    },
  });

  return res.json({
    tenant: refreshedTenant ? normalizeTenant(refreshedTenant) : normalizeTenant({
      ...tenant,
      tenantPlans: [result],
      modules: [],
    }),
  });
}
