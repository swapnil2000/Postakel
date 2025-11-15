import process from 'node:process';
import bcrypt from 'bcryptjs';
import { PrismaClient, AdminRole, PosType, BillingCycle } from '../src/generated/master';

const prisma = new PrismaClient();

async function seedServicePlans() {
  const plans = [
    {
      code: 'starter',
      name: 'Starter',
      description: 'Essential modules to start taking in-person and takeaway orders.',
      posType: PosType.RESTAURANT,
      featureHighlights: ['Basic POS', 'Order Management', 'Customer List'],
      allowedModules: ['dashboard', 'pos', 'customers'],
      monthlyPriceCents: 2499,
      annualPriceCents: 2499 * 10,
      defaultBillingCycle: BillingCycle.MONTHLY,
      trialPeriodDays: 14,
      isFeatured: false,
    },
    {
      code: 'growth',
      name: 'Growth',
      description: 'Unlock inventory tracking, table management, and kitchen coordination.',
      posType: PosType.RESTAURANT,
      featureHighlights: ['Inventory', 'Kitchen Display', 'Table Management'],
      allowedModules: ['dashboard', 'pos', 'tables', 'kitchen', 'inventory', 'customers'],
      monthlyPriceCents: 4999,
      annualPriceCents: 4999 * 10,
      defaultBillingCycle: BillingCycle.MONTHLY,
      trialPeriodDays: 21,
      isFeatured: true,
    },
    {
      code: 'premium',
      name: 'Premium',
      description: 'Full suite with advanced reports and staff management tools.',
      posType: PosType.RESTAURANT,
      featureHighlights: ['Advanced Reports', 'Staff Permissions', 'Priority Support'],
      allowedModules: ['dashboard', 'pos', 'tables', 'kitchen', 'inventory', 'reports', 'staff', 'customers'],
      monthlyPriceCents: 7999,
      annualPriceCents: 7999 * 10,
      defaultBillingCycle: BillingCycle.ANNUAL,
      trialPeriodDays: 30,
      isFeatured: false,
    },
  ];

  for (const plan of plans) {
    await prisma.servicePlan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        description: plan.description,
        posType: plan.posType,
        featureHighlights: plan.featureHighlights,
        allowedModules: plan.allowedModules,
        monthlyPriceCents: plan.monthlyPriceCents,
        annualPriceCents: plan.annualPriceCents,
        defaultBillingCycle: plan.defaultBillingCycle,
        trialPeriodDays: plan.trialPeriodDays,
        isFeatured: plan.isFeatured,
        isActive: true,
      },
      create: {
        id: plan.code,
        name: plan.name,
        code: plan.code,
        description: plan.description,
        posType: plan.posType,
        featureHighlights: plan.featureHighlights,
        allowedModules: plan.allowedModules,
        monthlyPriceCents: plan.monthlyPriceCents,
        annualPriceCents: plan.annualPriceCents,
        currency: 'INR',
        defaultBillingCycle: plan.defaultBillingCycle,
        trialPeriodDays: plan.trialPeriodDays,
        isFeatured: plan.isFeatured,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${plans.length} service plans.`);
}

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL || 'owner@eatwithme.pos';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.SEED_ADMIN_NAME || 'Super Admin';

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      isActive: true,
      role: AdminRole.SUPER,
    },
    create: {
      email,
      name,
      passwordHash,
      role: AdminRole.SUPER,
      isActive: true,
    },
  });

  console.log('Admin user ready:', {
    email: admin.email,
    password,
  });
}

async function main() {
  try {
    await seedServicePlans();
    await seedAdminUser();
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Failed to seed master data:', error);
  process.exit(1);
});
