export class MissingPlanSelectionError extends Error {
  constructor(message = 'Subscription plan is required.') {
    super(message);
    this.name = 'MissingPlanSelectionError';
  }
}

export function extractPlanId(rawPlan: unknown): string {
  if (typeof rawPlan === 'string') {
    const trimmed = rawPlan.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  if (rawPlan && typeof rawPlan === 'object' && 'id' in rawPlan) {
    const value = (rawPlan as { id?: unknown }).id;
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  throw new MissingPlanSelectionError();
}
