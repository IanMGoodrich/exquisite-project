export const REMINDER_DAYS = [1, 3, 8] as const;
export const MAX_STAGE = REMINDER_DAYS.length;
export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Which reminder (1, 2, or 3) is due now, or null if none.
 * If several are overdue, returns only the highest, so one email, not a pile.
 */
export function dueStage(
  turnStartedAt: Date,
  now: Date,
  remindersSent: number,
): number | null {
  const elapsedDays = (now.getTime() - turnStartedAt.getTime()) / DAY_MS;
  const stage = REMINDER_DAYS.filter((day) => elapsedDays >= day).length;
  return stage > remindersSent ? stage : null;
}