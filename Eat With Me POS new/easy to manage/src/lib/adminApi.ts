const DEFAULT_API_BASE = 'http://localhost:4000';

const ADMIN_ACCESS_TOKEN_KEY = 'adminAccessToken';
const ADMIN_REFRESH_TOKEN_KEY = 'adminRefreshToken';
const ADMIN_PROFILE_KEY = 'adminProfile';

function getApiBaseUrl(): string {
  const meta = (import.meta as unknown as { env?: Record<string, unknown> })?.env;
  const configured = typeof meta?.VITE_API_URL === 'string' ? (meta.VITE_API_URL as string) : undefined;
  const candidate = configured ?? DEFAULT_API_BASE;

  return candidate.replace(/\/$/, '');
}

function buildAdminUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}/api/admin${normalizedPath}`;
}

function parseJsonResponse<T>(response: Response, rawBody: string): T {
  if (!rawBody) {
    return {} as T;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch (error) {
    throw new Error('Received an invalid response from the server.');
  }
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_PROFILE_KEY);
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = buildAdminUrl(path);
  const headers = new Headers(options.headers ?? {});
  const token = localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });
  const rawBody = await response.text();

  if (response.status === 204) {
    return {} as T;
  }

  const data = parseJsonResponse<T>(response, rawBody);

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminSession();
    }

    const message = (data as { message?: string }).message || 'Failed to process admin request.';
    throw new Error(message);
  }

  return data;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken?: string;
  admin: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    lastLoginAt?: string;
  };
}

export interface ServicePlanDto {
  id: string;
  name: string;
  code: string;
  posType: 'RESTAURANT' | 'ARTIST' | 'BUSINESS';
  description?: string | null;
  featureHighlights: string[];
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  defaultBillingCycle: 'MONTHLY' | 'ANNUAL';
  trialPeriodDays: number;
  allowedModules: string[];
  isFeatured: boolean;
}

export interface CreateServicePlanPayload {
  name: string;
  code: string;
  posType: 'RESTAURANT' | 'ARTIST' | 'BUSINESS';
  description?: string;
  featureHighlights: string[];
  allowedModules: string[];
  monthlyPrice: number;
  annualPrice: number;
  currency?: string;
  defaultBillingCycle: 'MONTHLY' | 'ANNUAL';
  trialPeriodDays: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateServicePlanPayload {
  name?: string;
  description?: string;
  featureHighlights?: string[];
  allowedModules?: string[];
  monthlyPrice?: number;
  annualPrice?: number;
  currency?: string;
  defaultBillingCycle?: 'MONTHLY' | 'ANNUAL';
  trialPeriodDays?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  posType?: 'RESTAURANT' | 'ARTIST' | 'BUSINESS';
}

export async function adminLogin(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<AdminLoginResponse> {
  const response = await fetch(buildAdminUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  const rawBody = await response.text();
  const data = parseJsonResponse<AdminLoginResponse | { message?: string }>(response, rawBody);

  if (!response.ok) {
    const message = (data as { message?: string }).message || 'Invalid admin credentials.';
    throw new Error(message);
  }

  return data as AdminLoginResponse;
}

export async function fetchServicePlans(): Promise<ServicePlanDto[]> {
  const data = await adminRequest<{ plans: ServicePlanDto[] }>('/plans');
  return data.plans;
}

export async function createServicePlan(payload: CreateServicePlanPayload): Promise<ServicePlanDto> {
  const data = await adminRequest<{ plan: ServicePlanDto }>('/plans', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.plan;
}

export async function updateServicePlan(
  id: string,
  payload: UpdateServicePlanPayload
): Promise<ServicePlanDto> {
  const data = await adminRequest<{ plan: ServicePlanDto }>(`/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data.plan;
}

export function persistAdminSession(session: AdminLoginResponse) {
  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, session.accessToken);
  if (session.refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, session.refreshToken);
  } else {
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  }
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(session.admin));
}

export function getStoredAdminProfile(): AdminLoginResponse['admin'] | null {
  const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    clearAdminSession();
    return null;
  }
}

export function clearAdminAuth() {
  clearAdminSession();
}

export function getAdminSessionTokens() {
  return {
    accessToken: localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY) || null,
    refreshToken: localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY) || null,
  };
}
