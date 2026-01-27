import { parseISO, isValid, format } from 'date-fns';

export function parseToDate(value: any): Date | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') {
    const d = new Date(value);
    return isValid(d) ? d : null;
  }
  if (typeof value === 'string') {
    // Try ISO parse first
    try {
      const parsed = parseISO(value);
      if (isValid(parsed)) return parsed;
    } catch (e) {
      // fallthrough
    }
    // Fallback to Date.parse
    const n = Date.parse(value);
    if (!isNaN(n)) return new Date(n);
    return null;
  }
  return null;
}

export function formatYMD(value: any): string {
  const d = value instanceof Date ? value : parseToDate(value);
  if (!d) return '';
  return format(d, 'yyyy-MM-dd');
}

export function normalizeToYMD(value: any): string | null {
  const d = value instanceof Date ? value : parseToDate(value);
  if (!d) return null;
  return format(d, 'yyyy-MM-dd');
}

export function formatLocale(value: any, options?: Intl.DateTimeFormatOptions): string {
  const d = value instanceof Date ? value : parseToDate(value);
  if (!d) return '—';
  return d.toLocaleDateString(undefined, options);
}
