export type AccountType = "advocate" | "personal";
export type CaseStatus = "Active" | "Pending" | "Closed" | "Archived";
export type CaseRecord = {
  id: string;
  number: string;
  party: string;
  opposite: string;
  court: string;
  type: string;
  status: CaseStatus;
  hearing: string;
  time: string;
  proceeding: string;
  advocate: string;
  filed: string;
  notes: string;
  updated: string;
  shared?: boolean;
  history: Hearing[];
};
export type Hearing = {
  id: string;
  date: string;
  proceeding: string;
  notes: string;
  next: string;
  author: string;
  created: string;
};
export type Task = {
  id: string;
  title: string;
  caseId: string;
  assignee: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};
export type Reminder = {
  id: string;
  title: string;
  caseId: string;
  date: string;
  time: string;
  done: boolean;
};
export type DocumentRecord = {
  id: string;
  name: string;
  caseId: string;
  category: string;
  size: number;
  date: string;
  uploader: string;
  url?: string;
  mime: string;
  sample?: boolean;
};
export type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Advocate" | "Assistant" | "Viewer";
  status: "Active" | "Pending";
  scope: string;
};
export type Profile = {
  name: string;
  email: string;
  phone: string;
  enrollment: string;
  association: string;
  location: string;
  proof: string;
  image: string;
  bonusEligible?: boolean;
  verification: "Incomplete" | "Pending Verification" | "Verified" | "Rejected";
};
export type WorkspaceData = {
  cases: CaseRecord[];
  tasks: Task[];
  reminders: Reminder[];
  documents: DocumentRecord[];
  members: Member[];
  profile: Profile;
  name: string;
  plan: string;
  notificationPreferences: {
    hearings: boolean;
    tasks: boolean;
    updates: boolean;
  };
  activity: { id: string; text: string; date: string }[];
};
export type Plan = {
  name: string;
  price: number;
  users: number;
  cases: number;
  bonus?: number;
  recommended?: boolean;
};
