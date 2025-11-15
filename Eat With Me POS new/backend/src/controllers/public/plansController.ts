import { Request, Response } from 'express';
import { getMasterPrisma } from '../../utils/masterPrisma';

function toNumber(value: number | null | undefined) {
  return typeof value === 'number' ? value / 100 : 0;
}

export async function listPublicPlans(req: Request, res: Response) {
  const masterPrisma = getMasterPrisma();
  const { posType } = req.query;

  const where: Record<string, unknown> = { isActive: true };
  if (typeof posType === 'string' && posType.trim()) {
    where.posType = posType.trim().toUpperCase();
  }

  const plans = await masterPrisma.servicePlan.findMany({
    where,
    orderBy: [{ posType: 'asc' }, { monthlyPriceCents: 'asc' }],
  });

  return res.json({
  plans: plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      code: plan.code,
      posType: plan.posType,
      description: plan.description,
      featureHighlights: plan.featureHighlights || [],
      allowedModules: plan.allowedModules || [],
      monthlyPrice: toNumber(plan.monthlyPriceCents),
      annualPrice: toNumber(plan.annualPriceCents),
      currency: plan.currency,
      defaultBillingCycle: plan.defaultBillingCycle,
      trialPeriodDays: plan.trialPeriodDays,
      isFeatured: plan.isFeatured,
    })),
  });
}
