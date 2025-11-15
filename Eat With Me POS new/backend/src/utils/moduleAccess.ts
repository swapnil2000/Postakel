function toUniqueStringArray(input: unknown): string[] {
	if (!Array.isArray(input)) {
		return [];
	}

	const seen = new Set<string>();
	const result: string[] = [];

	for (const value of input) {
		if (typeof value !== 'string') {
			continue;
		}
		const trimmed = value.trim();
		if (!trimmed || seen.has(trimmed)) {
			continue;
		}
		seen.add(trimmed);
		result.push(trimmed);
	}

	return result;
}

export interface ModuleAccessInput {
	roleModules?: unknown;
	tenantActiveModules?: unknown;
}

export interface ModuleAccessResult {
	dashboardModules: string[];
	allowedModules: string[];
}

/**
 * Computes the dashboard modules that should be exposed to the staff user during login.
 * The tenantActiveModules array always takes precedence. If the tenant has no modules assigned,
 * the roleModules list becomes both the allowed modules and the dashboard modules.
 */
export function resolveModuleAccess({
	roleModules,
	tenantActiveModules,
}: ModuleAccessInput): ModuleAccessResult {
	const normalizedRoleModules = toUniqueStringArray(roleModules);
	const normalizedTenantModules = toUniqueStringArray(tenantActiveModules);

	if (normalizedTenantModules.length === 0) {
		return {
			dashboardModules: normalizedRoleModules,
			allowedModules: normalizedRoleModules,
		};
	}

	const tenantModuleSet = new Set(normalizedTenantModules);
	const filteredDashboardModules = normalizedRoleModules.filter((moduleId) => tenantModuleSet.has(moduleId));

	return {
		dashboardModules: filteredDashboardModules,
		allowedModules: normalizedTenantModules,
	};
}

export function mergeAllowedModules(...moduleLists: Array<unknown>): string[] {
	const combined = moduleLists.flat();
	return toUniqueStringArray(combined);
}

export function hasActiveTenantModules(modules: unknown): boolean {
	return toUniqueStringArray(modules).length > 0;
}

