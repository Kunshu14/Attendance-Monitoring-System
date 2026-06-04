import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format an ISO date string to a human-readable date + time.
 * e.g. "Jun 4, 2026, 10:30 AM"
 */
export function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy, h:mm a');
  } catch {
    return iso;
  }
}

/**
 * Format an ISO date string to just the date portion.
 * e.g. "Jun 4, 2026"
 */
export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

/**
 * Returns a relative time string: "5 minutes ago", "2 hours ago", etc.
 */
export function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

/**
 * Format a duration in minutes to "1h 23m" style.
 */
export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Compute elapsed time in minutes between two ISO strings.
 */
export function elapsedMinutes(start: string, end?: string | null): number {
  try {
    const startMs = parseISO(start).getTime();
    const endMs = end ? parseISO(end).getTime() : Date.now();
    return Math.floor((endMs - startMs) / 60000);
  } catch {
    return 0;
  }
}

/**
 * Generate an array of the last N days as "YYYY-MM-DD" strings,
 * including today.
 */
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(format(d, 'yyyy-MM-dd'));
  }
  return days;
}

/**
 * Truncate a string to maxLength with ellipsis.
 */
export function truncate(str: string, maxLength = 30): string {
  return str.length > maxLength ? str.slice(0, maxLength - 1) + '…' : str;
}

/**
 * Generate initials from a full name (up to 2 chars).
 */
export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Clamp a number between min and max.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
