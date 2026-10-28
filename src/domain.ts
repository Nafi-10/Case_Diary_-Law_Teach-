import type { AccountType, CaseRecord, Plan, Profile } from "./types";
import { toDhakaDate } from "./data/dates";
export function actionHighlight(done: boolean, due: string, today: string) {
  if (done) return { tone: "active", label: "Completed" };
  if (!due) return { tone: "archived", label: "No date" };
  if (due < today) return { tone: "attention", label: "Past due" };
  if (due === today) return { tone: "pending", label: "Due today" };
  return { tone: "closed", label: "Scheduled" };
}
export function hearingHighlight(
  record: Pick<CaseRecord, "hearing" | "status">,
  today: string,
): { tone: "today" | "soon" | "review"; label: string } | null {
  if (!["Active", "Pending"].includes(record.status) || !record.hearing)
    return null;
  const days =
    (Date.parse(`${record.hearing}T00:00:00Z`) -
      Date.parse(`${today}T00:00:00Z`)) /
    86_400_000;
  if (!Number.isFinite(days)) return null;
  if (days < 0) return { tone: "review", label: "Review date" };
  if (days === 0) return { tone: "today", label: "Today" };
  if (days <= 7)
    return { tone: "soon", label: days === 1 ? "Tomorrow" : `In ${days} days` };
  return null;
}
export function wouldExceedCaseLimit(
  cases: CaseRecord[],
  candidate: CaseRecord,
  limit: number,
) {
  if (candidate.shared || !["Active", "Pending"].includes(candidate.status))
    return false;
  const existing = cases.find((c) => c.id === candidate.id);
  if (
    existing &&
    !existing.shared &&
    ["Active", "Pending"].includes(existing.status)
  )
    return false;
  return countOwnedActiveCases(cases, candidate.id) >= limit;
}
export function countOwnedActiveCases(cases: CaseRecord[], excludeId?: string) {
  return cases.filter(
    (c) =>
      !c.shared &&
      c.id !== excludeId &&
      ["Active", "Pending"].includes(c.status),
  ).length;
}
export function validateDocuments(files: { name: string; size: number }[]) {
  if (files.some((f) => f.size > 10 * 1024 * 1024))
    return "Each file must be 10 MB or smaller. Please choose a smaller file.";
  if (files.some((f) => !/\.(pdf|docx?|png|jpe?g|txt)$/i.test(f.name)))
    return "Choose PDF, Word, JPG, PNG, or TXT files.";
  return "";
}
export function csvCell(value: string) {
  const safe = /^[\s]*[=+@\-\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export const PLANS: Record<AccountType, Plan[]> = {
  advocate: [
    { name: "Free", price: 0, users: 1, cases: 1, bonus: 3 },
    { name: "Starter", price: 499, users: 1, cases: 30, bonus: 50 },
    { name: "Plus", price: 999, users: 3, cases: 150, recommended: true },
    { name: "Pro", price: 1999, users: 6, cases: 500 },
    { name: "Max", price: 3499, users: 10, cases: 2000 },
  ],
  personal: [
    { name: "Free", price: 0, users: 1, cases: 2 },
    { name: "Personal", price: 199, users: 1, cases: 10 },
    { name: "Family", price: 499, users: 3, cases: 30, recommended: true },
    { name: "Community Pro", price: 999, users: 6, cases: 100 },
    { name: "Community Max", price: 1499, users: 10, cases: 300 },
  ],
};
export function filterCases(
  cases: CaseRecord[],
  query: string,
  status = "All",
  court = "All",
  date = "",
) {
  const q = query.toLocaleLowerCase().trim();
  return cases.filter(
    (c) =>
      (!q ||
        `${c.number} ${c.party} ${c.opposite} ${c.court} ${c.type}`
          .toLocaleLowerCase()
          .includes(q)) &&
      (status === "All" || c.status === status) &&
      (court === "All" || c.court === court) &&
      (!date || c.hearing === date),
  );
}
export function profileFields(profile: Profile): boolean[] {
  return [
    profile.enrollment,
    profile.association,
    profile.location,
    profile.proof,
    profile.image,
  ].map((v) => Boolean(v.trim()));
}
export function activeLimit(plan: Plan, profile: Profile) {
  return plan.bonus &&
    profile.bonusEligible &&
    profileFields(profile).every(Boolean)
    ? plan.bonus
    : plan.cases;
}
export function registrationErrors(values: {
  name: string;
  email: string;
  password: string;
  confirm: string;
  accepted: boolean;
}) {
  const errors: Record<string, string> = {};
  if (!values.name.trim()) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (
    values.password.length < 10 ||
    !/[A-Z]/.test(values.password) ||
    !/[a-z]/.test(values.password) ||
    !/[0-9]/.test(values.password)
  )
    errors.password =
      "Use 10 or more characters with uppercase, lowercase, and a number.";
  if (values.password !== values.confirm)
    errors.confirm = "The passwords do not match.";
  if (!values.accepted)
    errors.accepted = "Accept the terms and privacy policy to continue.";
  return errors;
}
export function appendHearing(
  record: CaseRecord,
  entry: CaseRecord["history"][number],
): CaseRecord {
  return {
    ...record,
    history: [...record.history, entry],
    hearing: entry.next,
    proceeding: entry.proceeding,
    updated: toDhakaDate(entry.created),
  };
}
