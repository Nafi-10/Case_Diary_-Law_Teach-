import type { AccountType, CaseRecord, WorkspaceData } from "../types";
import { toDhakaDate } from "./dates";
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function offsetDate(days: number, base = todayISO()) {
  const d = new Date(`${base}T12:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function formatDate(date: string, opts?: Intl.DateTimeFormatOptions) {
  return date
    ? new Intl.DateTimeFormat(
        "en-GB",
        opts ?? { day: "numeric", month: "short", year: "numeric" },
      ).format(new Date(`${toDhakaDate(date)}T12:00:00`))
    : "Not scheduled";
}
export function formatTime(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
export const uid = () => crypto.randomUUID();
const parties = [
  ["Rahman & Associates", "Alam Properties"],
  ["Md. Karim Uddin", "The State"],
  ["Fatima Begum", "Rahim Ahmed"],
  ["Eastern Trading Ltd.", "Hossain Enterprises"],
  ["Abdul Mannan", "Dhaka Development Ltd."],
  ["Nasreen Akter", "Kamal Hossain"],
  ["Meghna Textiles Ltd.", "City Distributors"],
  ["Shafiqul Islam", "Jamal Uddin"],
  ["Sultana Begum", "Hasan Ali"],
  ["Greenfield Holdings", "United Construction"],
  ["Rafiqul Islam", "The State"],
  ["Ayesha Rahman", "Anwar Hossain"],
];
const courts = [
  "District & Sessions Judge, Dhaka",
  "Chief Metropolitan Magistrate, Dhaka",
  "Family Court, Dhaka",
  "Joint District Judge, Dhaka",
];
export function createDemo(account: AccountType): WorkspaceData {
  const today = todayISO();
  const personal = account === "personal";
  const cases: CaseRecord[] = Array.from(
    { length: personal ? 3 : 27 },
    (_, i) => {
      const pair = parties[i % parties.length];
      const type = ["Civil", "Criminal", "Family", "Civil"][i % 4];
      const hearing = offsetDate(i < 3 ? 0 : i < 6 ? 1 : 2 + (i % 20));
      return {
        id: `${account}-case-${i + 1}`,
        number: `${type === "Criminal" ? "CR" : type === "Family" ? "FC" : "TS"} ${[145, 287, 64, 312, 178, 91][i % 6] + Math.floor(i / 6) * 40}/2026`,
        party: personal
          ? ["Ayesha Rahman", "Ayesha Rahman", "Rahman Family"][i]
          : pair[0],
        opposite: pair[1],
        court: courts[i % 4],
        type,
        status:
          i >= (personal ? 2 : 24)
            ? "Closed"
            : i % 7 === 6
              ? "Pending"
              : "Active",
        hearing,
        time: ["10:30", "11:00", "14:00", "11:30"][i % 4],
        proceeding: [
          "Argument hearing",
          "Witness examination",
          "Mediation",
          "Document submission",
        ][i % 4],
        advocate: ["Ahmed Rahman", "Sarah Islam", "Tanvir Hasan"][i % 3],
        filed: offsetDate(-75 - i),
        notes:
          "Review the filed documents and prepare the brief before the next hearing. Confirm attendance with the client.",
        updated: today,
        shared: personal && i === 1,
        history: [
          {
            id: `history-${i}`,
            date: offsetDate(-14 - i),
            proceeding: "Initial hearing",
            notes:
              "Documents placed on record. The matter was listed for further hearing.",
            next: hearing,
            author: "Ahmed Rahman",
            created: offsetDate(-14 - i),
          },
        ],
      };
    },
  );
  return {
    cases,
    name: personal ? "Ayesha’s workspace" : "Rahman & Associates",
    plan: personal ? "Family" : "Plus",
    profile: {
      name: personal ? "Ayesha Rahman" : "Ahmed Rahman",
      email: personal ? "ayesha@example.com" : "ahmed@example.com",
      phone: "",
      enrollment: personal ? "" : "A-24816",
      association: personal ? "" : "Dhaka Bar Association",
      location: "Dhaka, Bangladesh",
      proof: "",
      image: "",
      verification: "Incomplete",
    },
    tasks: [
      {
        id: "t1",
        title: "Prepare brief for Rahman case",
        caseId: cases[0].id,
        assignee: "Ahmed Rahman",
        due: today,
        priority: "High",
        done: false,
      },
      {
        id: "t2",
        title: "Review witness statements",
        caseId: cases[1].id,
        assignee: "Sarah Islam",
        due: offsetDate(1),
        priority: "Medium",
        done: false,
      },
      {
        id: "t3",
        title: "Collect certified court order",
        caseId: cases[2].id,
        assignee: "Tanvir Hasan",
        due: offsetDate(2),
        priority: "Low",
        done: false,
      },
      {
        id: "t4",
        title: "Confirm client consultation",
        caseId: cases[0].id,
        assignee: "Ahmed Rahman",
        due: offsetDate(-1),
        priority: "High",
        done: false,
      },
      {
        id: "t5",
        title: "Organize case documents",
        caseId: cases[1].id,
        assignee: "Ahmed Rahman",
        due: today,
        priority: "Low",
        done: true,
      },
    ],
    reminders: [
      {
        id: "r1",
        title: "Bring original documents to court",
        caseId: cases[0].id,
        date: today,
        time: "09:00",
        done: false,
      },
      {
        id: "r2",
        title: "Client consultation",
        caseId: cases[1].id,
        date: offsetDate(1),
        time: "16:00",
        done: false,
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Court order — 14 October.txt",
        caseId: cases[0].id,
        category: "Court Orders",
        size: 824,
        date: offsetDate(-14),
        uploader: "Ahmed Rahman",
        mime: "text/plain",
        sample: true,
      },
      {
        id: "d2",
        name: "Petition — case summary.txt",
        caseId: cases[1].id,
        category: "Petitions",
        size: 642,
        date: offsetDate(-5),
        uploader: "Sarah Islam",
        mime: "text/plain",
        sample: true,
      },
      {
        id: "d3",
        name: "Evidence index.txt",
        caseId: cases[2].id,
        category: "Evidence",
        size: 512,
        date: offsetDate(-2),
        uploader: "Tanvir Hasan",
        mime: "text/plain",
        sample: true,
      },
    ],
    members: personal
      ? [
          {
            id: "m1",
            name: "Ayesha Rahman",
            email: "ayesha@example.com",
            role: "Owner",
            status: "Active",
            scope: "Workspace",
          },
          {
            id: "m2",
            name: "Hasan Rahman",
            email: "hasan@example.com",
            role: "Viewer",
            status: "Active",
            scope: cases[1].number,
          },
        ]
      : [
          {
            id: "m1",
            name: "Ahmed Rahman",
            email: "ahmed@example.com",
            role: "Owner",
            status: "Active",
            scope: "Workspace",
          },
          {
            id: "m2",
            name: "Sarah Islam",
            email: "sarah@example.com",
            role: "Advocate",
            status: "Active",
            scope: "Assigned cases",
          },
          {
            id: "m3",
            name: "Tanvir Hasan",
            email: "tanvir@example.com",
            role: "Assistant",
            status: "Active",
            scope: "Assigned cases",
          },
        ],
    notificationPreferences: { hearings: true, tasks: true, updates: true },
    activity: [
      {
        id: "a1",
        text: `Sarah added a hearing update to ${cases[1].number}`,
        date: today,
      },
      {
        id: "a2",
        text: `Court order added to ${cases[0].number}`,
        date: today,
      },
      {
        id: "a3",
        text: `${cases[2].number} is ready for the next hearing`,
        date: offsetDate(-1),
      },
    ],
  };
}
