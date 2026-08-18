// Single source of truth for contest timing/rules. Edit these two lines to reconfigure.
export const CONTEST_START_ISO = "2026-08-18T00:00:00Z";
export const CONTEST_DURATION_HOURS = 72;

export const ONE_SUBMISSION_PER_PERSON = true;
export const REQUIRE_LOGO = true;

export const CONTEST_START = new Date(CONTEST_START_ISO);
export const CONTEST_DEADLINE = new Date(
  CONTEST_START.getTime() + CONTEST_DURATION_HOURS * 60 * 60 * 1000
);

export function isContestOpen(now: Date = new Date()): boolean {
  return now >= CONTEST_START && now < CONTEST_DEADLINE;
}
