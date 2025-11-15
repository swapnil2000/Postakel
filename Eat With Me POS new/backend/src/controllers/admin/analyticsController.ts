import { Response } from 'express';
import { AdminRequest } from '../../middleware/adminAuth';
import { getMasterPrisma } from '../../utils/masterPrisma';
import type { Prisma, PosType } from '../../generated/master';

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function subMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

function centsToNumber(value: number | null | undefined) {
  return typeof value === 'number' ? value / 100 : 0;
}

function monthKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split('-').map((part) => parseInt(part, 10));
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
}

function initializeTrendBuckets(months: number) {
  const buckets: string[] = [];
  let cursor = startOfMonth(new Date());

  for (let i = 0; i < months; i += 1) {
    const key = monthKey(cursor);
    buckets.unshift(key);
    cursor = subMonths(cursor, 1);
  }

  return buckets;
}

type TenantWithLatestPlan = Prisma.TenantGetPayload<{
  include: {
    tenantPlans: {
      include: { plan: true };
      orderBy: { startDate: 'desc' };
      take: 1;
    };
  };
}>;

type RevenueSnapshotWithTenant = Prisma.TenantUsageSnapshotGetPayload<{
  include: {
    tenant: {
      select: { posType: true };
    };
  };
}>;

type TenantLocationSummary = Prisma.TenantGetPayload<{
  select: {
    country: true;
    tenantPlans: {
      take: 1;
      orderBy: { startDate: 'desc' };
      select: { monthlyRevenueCents: true };
    };
  };
}>;

export async function getAdminOverview(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();

  const [tenants, totals, activeCount] = await Promise.all([
    masterPrisma.tenant.findMany({
      include: {
        tenantPlans: {
          include: { plan: true },
          orderBy: { startDate: 'desc' },
          take: 1,
        },
      },
    }),
    masterPrisma.tenantPlan.aggregate({
      _sum: {
        monthlyRevenueCents: true,
        totalRevenueCents: true,
        transactionsCount: true,
      },
    }),
    masterPrisma.tenant.count({ where: { status: 'ACTIVE' } }),
  ]);

  const totalTenants = tenants.length;
  const monthlyRevenue = centsToNumber(totals._sum?.monthlyRevenueCents);
  const totalRevenue = centsToNumber(totals._sum?.totalRevenueCents);
  const transactions = totals._sum?.transactionsCount || 0;

  const userDistribution = tenants.reduce(
    (acc: Record<string, number>, tenant: TenantWithLatestPlan) => {
      acc[tenant.posType] = (acc[tenant.posType] || 0) + 1;
      return acc;
    },
    {}
  );

  const locationMap = tenants.reduce(
    (acc: Record<string, { country: string; users: number; revenue: number }>, tenant: TenantWithLatestPlan) => {
      if (!tenant.country) return acc;
      const key = tenant.country.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          country: tenant.country,
          users: 0,
          revenue: 0,
        };
      }

      acc[key].users += 1;
      const latestPlan = tenant.tenantPlans?.[0];
      if (latestPlan?.monthlyRevenueCents) {
        acc[key].revenue += centsToNumber(latestPlan.monthlyRevenueCents);
      }
      return acc;
    },
    {}
  );

  const recentTenants = [...tenants]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      posType: tenant.posType,
      status: tenant.status,
      monthlyRevenue: centsToNumber(tenant.tenantPlans?.[0]?.monthlyRevenueCents),
      lastActive: tenant.tenantPlans?.[0]?.lastActive,
    }));

  return res.json({
    stats: {
      totalTenants,
      activeTenants: activeCount,
      monthlyRevenue,
      totalRevenue,
      transactions,
    },
    userDistribution: Object.entries(userDistribution).map(([key, value]) => ({
      posType: key,
      count: value,
    })),
    locationBreakdown: Object.values(locationMap),
    recentTenants,
  });
}

export async function getRevenueTrend(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const monthsToShow = parseInt(getString(req.query.months) || '8', 10);
  const buckets = initializeTrendBuckets(monthsToShow);
  const bucketMap = new Map<string, Record<PosType, number>>();

  buckets.forEach((bucket) => {
    bucketMap.set(bucket, { RESTAURANT: 0, ARTIST: 0, BUSINESS: 0 });
  });

  const snapshots = await masterPrisma.tenantUsageSnapshot.findMany({
    where: {
      metricType: 'REVENUE',
      snapshotDate: {
        gte: startOfMonth(subMonths(new Date(), monthsToShow - 1)),
      },
    },
    include: {
      tenant: {
        select: {
          posType: true,
        },
      },
    },
    orderBy: { snapshotDate: 'asc' },
  });

  snapshots.forEach((snapshot: RevenueSnapshotWithTenant) => {
    const key = monthKey(new Date(snapshot.snapshotDate));
    const bucket = bucketMap.get(key);
    if (!bucket) {
      return;
    }

    const posType: PosType = snapshot.tenant?.posType ?? 'RESTAURANT';
    bucket[posType] = (bucket[posType] || 0) + centsToNumber(snapshot.value);
  });

  const trend = buckets.map((bucket) => {
    const values = bucketMap.get(bucket) || { RESTAURANT: 0, ARTIST: 0, BUSINESS: 0 };
    return {
      month: formatMonthLabel(bucket),
      restaurant: values.RESTAURANT || 0,
      artist: values.ARTIST || 0,
      business: values.BUSINESS || 0,
    };
  });

  return res.json({ trend });
}

export async function getLocationBreakdown(req: AdminRequest, res: Response) {
  const masterPrisma = getMasterPrisma();
  const tenants = await masterPrisma.tenant.findMany({
    select: {
      country: true,
      tenantPlans: {
        take: 1,
        orderBy: { startDate: 'desc' },
        select: { monthlyRevenueCents: true },
      },
    },
  });

  const locationMap = tenants.reduce(
    (acc: Record<string, { country: string; users: number; revenue: number }>, tenant: TenantLocationSummary) => {
      if (!tenant.country) return acc;
      const key = tenant.country.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          country: tenant.country,
          users: 0,
          revenue: 0,
        };
      }

      acc[key].users += 1;
      const latestPlan = tenant.tenantPlans?.[0];
      if (latestPlan?.monthlyRevenueCents) {
        acc[key].revenue += centsToNumber(latestPlan.monthlyRevenueCents);
      }

      return acc;
    },
    {}
  );

  const locations = (Object.values(locationMap) as Array<{ country: string; users: number; revenue: number }>).sort(
    (a, b) => b.users - a.users
  );

  return res.json({ locations });
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
