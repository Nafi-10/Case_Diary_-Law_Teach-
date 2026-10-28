import type { AccountType } from "./types";

export type SectionGuideContent = {
  title: string;
  overview: string;
  purpose: string;
  steps: [string, string][];
  benefits: [string, string][];
  note: string;
};

const guides: Record<string, SectionGuideContent> = {
  "/": {
    title: "Dashboard",
    overview:
      "Start with today’s priorities, then go straight to the work that needs you.",
    purpose:
      "Your dashboard brings upcoming hearings, recent case activity and outstanding actions into one starting point. Use it at the beginning of the day to understand what is coming up, then open the relevant case or section for the full details.",
    steps: [
      [
        "Review the overview",
        "Read the summary cards to understand your current workload. Open a card or its linked section to explore the records behind the number.",
      ],
      [
        "Plan your next steps",
        "Switch between Today, Tomorrow and This week in upcoming hearings. Check the case, court and time before opening a hearing.",
      ],
      [
        "Continue your work",
        "Open a recent case, review your reminders and mark finished actions complete. Add a new case when a new matter needs its own record.",
      ],
    ],
    benefits: [
      [
        "A focused start",
        "See the day’s priorities without opening every section separately.",
      ],
      [
        "Less searching",
        "Reach the relevant matter directly from its summary or hearing.",
      ],
      [
        "A clearer routine",
        "Review unfinished work alongside the dates coming next.",
      ],
    ],
    note: "Summary figures reflect the sample records in your selected workspace. Switching accounts opens a separate demo experience.",
  },
  "/cases": {
    title: "My Cases",
    overview:
      "Find a matter quickly and keep its parties, court, status and next hearing together.",
    purpose:
      "My Cases is your workspace’s case register. Each record connects the identifying details of a matter with its hearing history, documents and related actions, so you can return to the same place whenever that case needs attention.",
    steps: [
      [
        "Find the right matter",
        "Search by case number, party or court. Combine a status tab with the court and hearing-date filters to narrow the list, then use the sort control to change its order.",
      ],
      [
        "Open or add a case",
        "Select a case row to review the full workspace for that matter. Choose Add new case to enter a new record and complete its required fields.",
      ],
      [
        "Review and export",
        "Use the page controls to browse remaining results. Export the filtered case list when you need a CSV copy of the visible selection.",
      ],
    ],
    benefits: [
      [
        "One reliable starting point",
        "Keep the essential details of each matter in a structured record.",
      ],
      [
        "Quicker preparation",
        "Spot the next hearing and current status while scanning your cases.",
      ],
      [
        "Useful organization",
        "Combine filters to focus on a court, date or stage of work.",
      ],
    ],
    note: "Use sample information in this demo. New records and edits remain in this tab and reset on refresh.",
  },
  "/shared": {
    title: "Shared Cases",
    overview:
      "Follow the matters shared with you without mixing them up with your own cases.",
    purpose:
      "Shared Cases gives personal workspace users a focused view of matters marked as shared in the demo. It helps you follow a case involving other people while keeping the distinction between your own records and shared matters visible.",
    steps: [
      [
        "Locate a shared matter",
        "Use the search box and status, court or hearing-date filters to find the relevant record. Browse additional results with the page controls.",
      ],
      [
        "Read the case context",
        "Open the case to review its parties, court, next hearing and available history. Use the case tabs to inspect related information.",
      ],
      [
        "Check access separately",
        "Open Family & Members to understand roles and case-specific access. A shared record is a starting point for reviewing a matter, not a sign of access to every case.",
      ],
    ],
    benefits: [
      [
        "A separate view",
        "Recognize which matters are shared and which belong to your own case list.",
      ],
      [
        "Better preparation",
        "Find the next date and key details before discussing a case.",
      ],
      [
        "Clearer context",
        "Read case history and related records from the same place.",
      ],
    ],
    note: "Sharing and permissions are illustrated with local sample data; this preview does not grant access to another person’s live records.",
  },
  "/cases/new": {
    title: "Add a new case",
    overview:
      "Create an organized case record by starting with the essential details.",
    purpose:
      "This form creates the central record for a new matter. A clear case number, named parties and the correct court make the record easier to find later and provide context for the hearings, documents and tasks you add as work progresses.",
    steps: [
      [
        "Identify the matter",
        "Enter the case number, court and parties. Choose the case type and status, and check the required fields before continuing.",
      ],
      [
        "Add the useful context",
        "Record the relevant dates, next hearing details and notes where available. Check names and dates against your source information.",
      ],
      [
        "Review and save",
        "Save the form to create the demo record. If a field is missing, a number is duplicated or a plan limit is reached, follow the on-screen message before trying again.",
      ],
    ],
    benefits: [
      [
        "Consistent records",
        "Capture essential information in a familiar structure.",
      ],
      ["Easier follow-up", "Connect later updates to one identifiable matter."],
      [
        "Fewer avoidable mistakes",
        "Review required details and duplicate-number messages before saving.",
      ],
    ],
    note: "Saving adds a record to this demo session only. It does not file a case with a court.",
  },
  "case-edit": {
    title: "Edit a case",
    overview: "Keep a case’s core information accurate as its details change.",
    purpose:
      "Edit case lets you correct or update the identifying details of an existing matter. Use it for the case’s current information; use the hearing-history function inside the case workspace when you need to record a proceeding as a dated event.",
    steps: [
      [
        "Confirm the record",
        "Check the case number and parties before changing anything. Review the pre-filled court, type, status and date fields.",
      ],
      [
        "Update the details",
        "Change the relevant fields and notes. Keep the case number distinct from other records and review any validation messages.",
      ],
      [
        "Save and check",
        "Save your changes, then review the case workspace to confirm the updated information is shown correctly.",
      ],
    ],
    benefits: [
      [
        "Current information",
        "Keep the details used throughout the workspace up to date.",
      ],
      [
        "Less duplication",
        "Correct an existing record instead of creating the same matter again.",
      ],
      [
        "Clearer history",
        "Separate edits to core information from dated hearing updates.",
      ],
    ],
    note: "Edits affect this demo session only and reset on refresh. A saved change is not a court-system update.",
  },
  "case-detail": {
    title: "Case workspace",
    overview:
      "Bring the story of one case into focus, from its next hearing to its supporting records.",
    purpose:
      "The case workspace gathers the details and activity for one matter. Use its overview and tabs to move between the current position, hearing history, documents, tasks and access information without losing the context of the case you are working on.",
    steps: [
      [
        "Check the essentials",
        "Confirm the case number, parties, court, status and next hearing. Use Edit case when a core detail needs correcting.",
      ],
      [
        "Record progress",
        "Open the hearing-history area to add a dated update and the next hearing information. Existing history stays available so earlier proceedings remain easy to review.",
      ],
      [
        "Review connected work",
        "Use Documents, Tasks and Access to inspect related files, actions and members. Read the confirmation carefully before changing the case to closed or archived.",
      ],
    ],
    benefits: [
      [
        "Full context",
        "Read a matter’s current details alongside its past activity.",
      ],
      [
        "Better handovers",
        "Keep related records organized around the case they support.",
      ],
      [
        "Clear next steps",
        "Check what is due and who is involved before continuing work.",
      ],
    ],
    note: "Files, history and access changes are local demo records. This workspace is not connected to court records or live collaborators.",
  },
  "/calendar": {
    title: "Calendar",
    overview:
      "See hearings, reminders and deadlines in the context of your day, week or month.",
    purpose:
      "The calendar turns the dates in your case records and reminders into a visual schedule. Use it to prepare for upcoming hearings, see how busy a period looks and open the relevant case when you need more detail about an appointment.",
    steps: [
      [
        "Choose your view",
        "Switch between Month, Week and Day. Use the previous and next arrows to move through time, or Today to return to the current date.",
      ],
      [
        "Explore a date",
        "Select a date to see its schedule, then open a hearing to review the case. Use the Schedule and Deadlines tabs and their page controls to browse all entries.",
      ],
      [
        "Add a reminder",
        "Choose Create reminder, enter the action, date and time, and link a case if helpful. On a phone, use the agenda-style list to read the same schedule comfortably.",
      ],
    ],
    benefits: [
      [
        "A clearer schedule",
        "Understand how hearings and personal reminders fit together.",
      ],
      [
        "Earlier preparation",
        "Review upcoming dates before the day becomes busy.",
      ],
      [
        "Easy context switching",
        "Move directly from a hearing to its case record.",
      ],
    ],
    note: "Dates and times use Bangladesh time. Reminders are displayed in the app; this demo does not send email, SMS or push alerts.",
  },
  "/reminders": {
    title: "Reminders",
    overview:
      "Give important follow-ups a date and keep track of what you have finished.",
    purpose:
      "Reminders keep small but important actions visible alongside your case work. Use them for preparation, follow-ups or other dated prompts that you want to revisit, with a case link where the reminder relates to a particular matter.",
    steps: [
      [
        "Create a clear prompt",
        "Choose Set reminder and describe the action in its title. Set its date and time, then select a related case if needed.",
      ],
      [
        "Review what is coming",
        "Use the Upcoming, Completed and All tabs to change your view. Read the date and status label to distinguish a past-due action from one scheduled ahead.",
      ],
      [
        "Keep the list current",
        "Mark a reminder complete after the action is finished. Review completed reminders when you need to check what has already been handled.",
      ],
    ],
    benefits: [
      [
        "Less to remember",
        "Give each follow-up a visible place in your routine.",
      ],
      ["Useful context", "Connect reminders with the cases they concern."],
      [
        "Visible progress",
        "Separate finished actions from those still requiring attention.",
      ],
    ],
    note: "These are in-app reminders for the current demo session. No external notification is delivered.",
  },
  "/documents": {
    title: "Documents",
    overview:
      "Find supporting files by case, category or date and keep their context close at hand.",
    purpose:
      "Documents is a searchable library of the files associated with your workspace. Use it to locate supporting material, review its case and category, and open a preview or download when the file is available in this demo session.",
    steps: [
      [
        "Locate a document",
        "Search by name and combine category, case, uploader and date filters. Switch between Grid and List depending on how you prefer to scan the results.",
      ],
      [
        "Add a sample file",
        "Choose Upload document, select a supported file up to 10 MB and enter its category and case association. Check the upload message before continuing.",
      ],
      [
        "Preview or download",
        "Open the preview control to inspect a supported file. Use Download when you need to open it elsewhere; sample placeholders are labeled separately from local uploads.",
      ],
    ],
    benefits: [
      [
        "Faster retrieval",
        "Use several filters together instead of searching every case individually.",
      ],
      [
        "Better organization",
        "Keep the file’s category and related matter visible.",
      ],
      [
        "Flexible browsing",
        "Choose cards or a table, with a readable layout on mobile.",
      ],
    ],
    note: "Uploaded files are available only in this tab and are lost on refresh. The demo is not permanent document storage.",
  },
  "/tasks": {
    title: "Tasks",
    overview:
      "Turn case work into clear actions with an assignee, priority and due date.",
    purpose:
      "Tasks helps an advocate workspace organize the work around its cases. Each action can carry an owner, deadline and priority, making it easier to distinguish work that is still outstanding from work that has already been completed.",
    steps: [
      [
        "Define the action",
        "Choose Create task and write a specific title. Select an assignee, related case, due date and priority to give the task useful context.",
      ],
      [
        "Review the workload",
        "Use To do, Completed or All tasks to focus the list. Read the priority badge and the Past due, Due today or Scheduled label together.",
      ],
      [
        "Record completion",
        "Mark the task complete when the work is done. Return to the completed view to review finished actions, or reopen a task if more work is needed.",
      ],
    ],
    benefits: [
      [
        "Clear responsibility",
        "Show who is associated with an action in the workspace.",
      ],
      [
        "Better prioritization",
        "Compare urgency and due dates before choosing the next task.",
      ],
      [
        "Visible progress",
        "Keep outstanding and completed work easy to distinguish.",
      ],
    ],
    note: "Assignments and completion changes are local demo state. They do not notify or synchronize with another person.",
  },
  "/reports": {
    title: "Reports",
    overview:
      "Understand your case mix, team workload and upcoming actions at a glance.",
    purpose:
      "Reports summarizes the records already in your workspace. It combines case counts by status and assigned advocate with overdue actions and upcoming hearings, helping you review the shape of the workload and decide which records need closer attention.",
    steps: [
      [
        "Set the scope",
        "Choose a case status and optional hearing-date range. The selected view updates from those filters; use Reset to return to the full view.",
      ],
      [
        "Read the overview",
        "Compare the status and team bars, then inspect the overdue actions and upcoming hearings. Use page controls to see additional entries without losing your place.",
      ],
      [
        "Keep a snapshot",
        "Choose Export report to download the selected report as JSON. Open the underlying case or task section when you need to act on an item.",
      ],
    ],
    benefits: [
      [
        "Workload visibility",
        "Compare how cases are distributed across statuses and team members.",
      ],
      [
        "Focused review",
        "Look at a relevant date range instead of every matter at once.",
      ],
      [
        "Actionable context",
        "Review upcoming hearings alongside overdue work.",
      ],
    ],
    note: "These figures describe the current demo records. They are not predictions of legal outcomes or independent performance assessments.",
  },
  "/team": {
    title: "Team & Collaboration",
    overview:
      "Understand who is involved, what each role means and which cases they can access.",
    purpose:
      "This section organizes the people associated with your advocate workspace. Review member roles, case-specific access and available plan seats before preparing an invitation or changing how someone is represented in the demo.",
    steps: [
      [
        "Review your members",
        "Read each member’s role, status and scope. Use the role-permissions explanation to understand the intended responsibilities before making a change.",
      ],
      [
        "Prepare an invitation",
        "Enter the person’s details, choose a role and set workspace or case-specific scope. Check the plan’s seat allowance and save the invitation draft.",
      ],
      [
        "Manage access carefully",
        "Review and confirm any member role changes. The workspace owner has a protected role. Choose case-specific access when preparing a new invitation if only selected matters are relevant; existing scopes are shown for reference.",
      ],
    ],
    benefits: [
      [
        "Clearer responsibilities",
        "Distinguish roles instead of treating every member the same.",
      ],
      [
        "More deliberate access",
        "Review which matters are associated with each person.",
      ],
      [
        "Better capacity planning",
        "See members and invitation drafts against your plan’s seats.",
      ],
    ],
    note: "Invitations are saved as local drafts and are not sent. Role changes do not grant real access to another account.",
  },
  "/billing": {
    title: "Subscription & Billing",
    overview:
      "Compare capacity, understand your usage and preview the plan that fits your workspace.",
    purpose:
      "Subscription & Billing brings your current plan, active-case allowance, member seats and document count into one view. Use it to understand your workspace’s capacity and compare the available plans before trying a different configuration in the demo.",
    steps: [
      [
        "Check current usage",
        "Read the active-case and member counts alongside their limits. Document counts describe files in this session; they are not a measure of permanent storage.",
      ],
      [
        "Compare and preview",
        "Compare each plan’s monthly price and included allowances. Select a plan, read the preview dialog and choose Apply to demo if you want to try it.",
      ],
      [
        "Review billing details",
        "Open Billing details for the payment and renewal status. Read Cancellation options to understand the preview’s limits and the emphasis on preserving existing records.",
      ],
    ],
    benefits: [
      [
        "Transparent capacity",
        "See what your plan allows and how much of it is in use.",
      ],
      [
        "A considered choice",
        "Compare the available plans before changing your demo setup.",
      ],
      [
        "Records stay visible",
        "A lower demo limit restricts new additions rather than deleting existing cases.",
      ],
    ],
    note: "No payment is taken and no real subscription is created or cancelled. Plan changes last only for this demo session.",
  },
  "/profile": {
    title: "Advocate Profile",
    overview:
      "Keep your contact and professional details together, with a clear view of profile completeness.",
    purpose:
      "Your advocate profile records the person behind the workspace, including contact information and professional details. It makes these details easier to maintain and clearly separates completing the form from any professional validation process.",
    steps: [
      [
        "Update your contact details",
        "Review your name, email, phone and practice location. Choose a profile-image file if you want to preview its filename in the form.",
      ],
      [
        "Add professional information",
        "Enter your Bar Council enrollment number and bar association, and choose a supporting proof file where appropriate. Review the completion checklist.",
      ],
      [
        "Save the profile",
        "Check the information and save your changes for this session. Read the verification label and plan-bonus explanation separately from the completion score.",
      ],
    ],
    benefits: [
      [
        "Consistent identity",
        "Keep the name and contact details used in your workspace current.",
      ],
      [
        "Structured information",
        "Maintain professional and contact details in one familiar place.",
      ],
      [
        "Clear expectations",
        "Understand what is complete and what still requires validation.",
      ],
    ],
    note: "Profile files retain their names only in the demo. Saving a profile does not verify professional status or automatically qualify you for a bonus.",
  },
  "/settings": {
    title: "Settings",
    overview:
      "Make the workspace yours and understand exactly what each preference changes.",
    purpose:
      "Settings gathers account details, security information, notification preferences, workspace naming and data controls. Use the category menu to find the setting you need, then read its explanation before saving or resetting anything.",
    steps: [
      [
        "Personalize your details",
        "Open Personal account to edit contact details, or Workspace to rename the workspace. Save in the relevant area; use Edit full profile for the complete profile form.",
      ],
      [
        "Review preferences",
        "Open Notifications to try the preference switches. Read Security to see which sign-in and account-protection services are not yet connected.",
      ],
      [
        "Manage demo data",
        "Open Data & privacy to export a JSON snapshot or reset the sample workspaces. Read the reset confirmation: it restores both demo accounts and removes session changes.",
      ],
    ],
    benefits: [
      [
        "A familiar workspace",
        "Use names and contact details that make the demo easier to recognize.",
      ],
      [
        "Clear controls",
        "Find related preferences together with an explanation of their effect.",
      ],
      [
        "Intentional data handling",
        "Review export and reset choices before taking action.",
      ],
    ],
    note: "Preferences are local to this session. Exports contain record metadata, not uploaded file contents; security and notification delivery are not connected.",
  },
  "/about": {
    title: "About Case Diary",
    overview:
      "Meet the purpose, principles and people behind a more organized legal workspace.",
    purpose:
      "About Case Diary introduces the product’s mission and the people it is designed to help. It connects the everyday features with the broader aim of making case information, dates and collaboration easier to understand and manage.",
    steps: [
      [
        "Discover the purpose",
        "Read the opening story, mission and vision to understand the problem Case Diary aims to address and the approach behind the product.",
      ],
      [
        "Find your perspective",
        "Explore the sections for individuals, families, advocates and chambers. Review the tools and principles to see how they relate to your own workflow.",
      ],
      [
        "Meet the people behind it",
        "Read about The Legal Doors and Advocate Md. Masum Billah, then explore the frequently asked questions or follow a link back into the product.",
      ],
    ],
    benefits: [
      [
        "A clear introduction",
        "Understand the product before exploring its detailed features.",
      ],
      ["Human context", "Learn about its parent brand and founder."],
      [
        "A useful next step",
        "Connect the product’s purpose with the sections you want to try.",
      ],
    ],
    note: "This page introduces Case Diary and its product direction. The interactive workspace remains a demo.",
  },
  "/help": {
    title: "Help & Support",
    overview:
      "Find a useful starting point and clear answers to common product questions.",
    purpose:
      "Help & Support explains the main Case Diary workflows and the boundaries of this preview. Use its quick-start cards to reach a relevant function, or read the expandable questions when you need more context about cases, plans and collaboration.",
    steps: [
      [
        "Choose a starting point",
        "Use the cards to add your first case, explore collaboration or open settings. Each card takes you directly to that part of the workspace.",
      ],
      [
        "Read an answer",
        "Select a question to expand its explanation. You can close it again when you are ready to move to the next topic.",
      ],
      [
        "Explore further",
        "Open the public website, privacy notice or terms preview from the links below. Every workspace page also has its own guide at the top.",
      ],
    ],
    benefits: [
      [
        "Less guesswork",
        "Read the intended workflow before trying an unfamiliar function.",
      ],
      [
        "Faster orientation",
        "Start with direct links to the most common setup tasks.",
      ],
      [
        "Clear expectations",
        "Understand which features are interactive demos and which services are not connected.",
      ],
    ],
    note: "Help content is available locally. Support contact details and a live support service are not configured.",
  },
  "/pricing": {
    title: "Pricing",
    overview:
      "Choose your audience, compare the allowances and find a sensible starting plan.",
    purpose:
      "The public Pricing page presents the plan options for individuals and families as well as advocates and chambers. It helps you compare monthly costs and capacity before exploring the registration preview or entering a demo workspace.",
    steps: [
      [
        "Choose your audience",
        "Switch between Advocates & chambers and Individuals & families. The cards update to show the plans available for the selected audience.",
      ],
      [
        "Compare what is included",
        "Review the monthly price in Bangladeshi Taka, active-case allowance, user seats and listed features. On mobile, scroll through the stacked cards to compare each option.",
      ],
      [
        "Explore your choice",
        "Select a plan to carry that choice into the registration preview. Read the helpful details below the cards for explanations of limits and profile bonuses.",
      ],
    ],
    benefits: [
      ["Relevant choices", "Compare plans built for your type of workspace."],
      ["Clear allowances", "See price and capacity together before choosing."],
      [
        "Room to grow",
        "Consider both your current needs and the next stage of your work.",
      ],
    ],
    note: "Pricing and registration are previews. Checkout is not connected and selecting a plan does not charge you.",
  },
};

const personalGuides: Partial<Record<string, SectionGuideContent>> = {
  "/team": {
    ...guides["/team"],
    title: "Family & Members",
    overview:
      "Keep the people involved in your matters organized, with clear roles and case access.",
    purpose:
      "Family & Members shows the people associated with your personal workspace. Use it to review roles, prepare a member invitation and understand case-specific access before involving someone in a matter. It is designed around personal and family case organization.",
    steps: [
      [
        "Review the people involved",
        "Check each person’s role, status and case scope. Read the permission guide to understand the responsibilities attached to each role.",
      ],
      [
        "Prepare a member invitation",
        "Enter the person’s details and choose an available role. Select workspace or specific-case scope, review the seat limit and save the invitation draft.",
      ],
      [
        "Check access",
        "Review the cases associated with each member and confirm any role changes. Keep case-specific access focused on the matters relevant to that person.",
      ],
    ],
  },
  "/profile": {
    title: "My Profile",
    overview:
      "Keep your name and contact information up to date in your personal workspace.",
    purpose:
      "My Profile holds the basic details used to identify you in your personal workspace. Use it to maintain your name, email, phone and location in one place, making the workspace easier to recognize as you explore your cases and shared matters.",
    steps: [
      [
        "Review your details",
        "Check the name and email shown in the form, then add or update your phone number and location where useful.",
      ],
      [
        "Choose a profile image",
        "Select a JPG or PNG file within the stated size limit if you want to preview an image filename. The demo records the filename rather than uploading a profile photo.",
      ],
      [
        "Save the changes",
        "Review the form and save it. Your updated details are used in this demo session; changing a contact email does not change a live sign-in account.",
      ],
    ],
    benefits: [
      [
        "A recognizable workspace",
        "See the right name as you move around the app.",
      ],
      [
        "Organized contact details",
        "Keep basic information together instead of across separate screens.",
      ],
      [
        "Simple maintenance",
        "Return to one form whenever a detail needs updating.",
      ],
    ],
    note: "Use sample details. Profile changes and selected filenames reset on refresh; no real account is updated.",
  },
};

export function getSectionGuide(
  pathname: string,
  account: AccountType,
): SectionGuideContent | undefined {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  if (account === "personal" && personalGuides[path])
    return personalGuides[path];
  if (guides[path]) return guides[path];
  if (/^\/cases\/[^/]+\/edit$/.test(path)) return guides["case-edit"];
  if (/^\/cases\/[^/]+$/.test(path)) return guides["case-detail"];
  return undefined;
}
