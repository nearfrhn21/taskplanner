// Date utilities for dual-input (manual typed text or visual calendar picker)
import { format, parse, isValid, parseISO, differenceInCalendarDays, isPast, isToday, isTomorrow, addDays } from 'date-fns';

/**
 * Standard formats supported for manual typing
 */
export const ACCEPTED_FORMATS = [
  'yyyy-MM-dd',
  'dd/MM/yyyy',
  'MM/dd/yyyy',
  'dd-MM-yyyy',
  'yyyy/MM/dd'
];

/**
 * Parse any user typed date string into a standard Date object
 * Returns null if invalid
 */
export function parseUserDate(input) {
  if (!input) return null;
  if (input instanceof Date && isValid(input)) return input;

  const trimmed = String(input).trim();
  if (!trimmed) return null;

  // Try standard ISO first
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = parseISO(trimmed);
    if (isValid(d)) return d;
  }

  // Try each supported human format
  for (const fmt of ACCEPTED_FORMATS) {
    try {
      const parsed = parse(trimmed, fmt, new Date());
      if (isValid(parsed)) {
        // Sanity check year range (e.g. 2000 - 2100)
        const year = parsed.getFullYear();
        if (year >= 1990 && year <= 2100) {
          return parsed;
        }
      }
    } catch {
      // continue to next format
    }
  }

  // Fallback to Date.parse
  const fallback = new Date(trimmed);
  if (isValid(fallback) && !isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

/**
 * Format a Date to standard storage string YYYY-MM-DD
 */
export function formatToStorageDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : parseUserDate(date);
  if (!d || !isValid(d)) return '';
  return format(d, 'yyyy-MM-dd');
}

/**
 * Format date for friendly UI display e.g. "Fri, Nov 10, 2026"
 */
export function formatFriendlyDate(dateStr) {
  const d = parseUserDate(dateStr);
  if (!d) return dateStr || 'No date set';
  
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  
  const daysDiff = differenceInCalendarDays(d, new Date());
  if (daysDiff === -1) return 'Yesterday';
  if (daysDiff > 0 && daysDiff <= 6) return `In ${daysDiff} days (${format(d, 'EEE')})`;
  if (daysDiff < -1 && daysDiff >= -6) return `${Math.abs(daysDiff)} days ago`;

  return format(d, 'MMM d, yyyy');
}

/**
 * Calculate due status:
 * - 'overdue': due date is past
 * - 'due-today': due date is today
 * - 'due-tomorrow': due date is tomorrow
 * - 'due-soon': due date is within thresholdDays (e.g. <= 2 days)
 * - 'upcoming': further out
 * - 'completed': if completed
 */
export function getDueStatus(dueDateStr, isCompleted = false, thresholdDays = 2) {
  if (isCompleted) return { status: 'completed', text: 'Completed', color: 'green', days: 0 };
  if (!dueDateStr) return { status: 'none', text: 'No due date', color: 'slate', days: 999 };

  const d = parseUserDate(dueDateStr);
  if (!d) return { status: 'invalid', text: 'Invalid date', color: 'slate', days: 999 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);

  const diffDays = differenceInCalendarDays(target, today);

  if (diffDays < 0) {
    return {
      status: 'overdue',
      text: `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'}`,
      color: 'rose',
      days: diffDays,
      urgent: true
    };
  }

  if (diffDays === 0) {
    return {
      status: 'due-today',
      text: 'Due Today!',
      color: 'amber',
      days: 0,
      urgent: true
    };
  }

  if (diffDays === 1) {
    return {
      status: 'due-tomorrow',
      text: 'Due Tomorrow',
      color: 'amber',
      days: 1,
      urgent: true
    };
  }

  if (diffDays <= thresholdDays) {
    return {
      status: 'due-soon',
      text: `Due in ${diffDays} days`,
      color: 'amber',
      days: diffDays,
      urgent: true
    };
  }

  return {
    status: 'upcoming',
    text: `Due in ${diffDays} days`,
    color: 'indigo',
    days: diffDays,
    urgent: false
  };
}

/**
 * Check if working date aligns reasonably with due date
 */
export function validateDateRange(workingDateStr, dueDateStr) {
  if (!workingDateStr || !dueDateStr) return { valid: true };
  const workD = parseUserDate(workingDateStr);
  const dueD = parseUserDate(dueDateStr);

  if (!workD || !dueD) return { valid: true };

  const diff = differenceInCalendarDays(dueD, workD);
  if (diff < 0) {
    return {
      valid: false,
      warning: `Working date (${formatFriendlyDate(workingDateStr)}) is after Due date (${formatFriendlyDate(dueDateStr)})! You might run out of time.`
    };
  }
  return { valid: true, daysDifference: diff };
}

/**
 * Quick date helpers for fast buttons
 */
export function getQuickDates() {
  const today = new Date();
  return [
    { label: 'Today', value: format(today, 'yyyy-MM-dd') },
    { label: 'Tomorrow', value: format(addDays(today, 1), 'yyyy-MM-dd') },
    { label: 'In 3 Days', value: format(addDays(today, 3), 'yyyy-MM-dd') },
    { label: 'Next Week', value: format(addDays(today, 7), 'yyyy-MM-dd') },
  ];
}
