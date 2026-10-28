import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Grid2X2,
  Info,
  List,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  CheckRow,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Panel,
  Tabs,
  downloadText,
} from "../components/ui";
import { dateKey, monthDates } from "../components/Calendar";
import { useStore } from "../store";
import {
  formatDate,
  formatTime,
  offsetDate,
  todayISO,
  uid,
} from "../data/demo";
import type { DocumentRecord, Task } from "../types";
import { actionHighlight, validateDocuments } from "../domain";
import { ActionStatus } from "../components/ActionStatus";
import { PagedItems } from "../components/PagedItems";

export function CalendarPage() {
  const { data } = useStore();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(params.get("date") || todayISO());
  const [month, setMonth] = useState(new Date(`${selected}T12:00:00`));
  const [view, setView] = useState("Month");
  const [reminder, setReminder] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("Schedule");
  const cases = data.cases.filter(
    (c) => ["Active", "Pending"].includes(c.status) && c.hearing,
  );
  const reminders = data.reminders.filter((r) => !r.done);
  const selectedCases = cases
    .filter((c) => c.hearing === selected)
    .sort((a, b) => a.time.localeCompare(b.time));
  const weekStart = offsetDate(
    -(new Date(`${selected}T12:00:00`).getDay() + 6) % 7,
    selected,
  );
  const agendaCases = cases
    .filter((c) =>
      view === "Day"
        ? c.hearing === selected
        : c.hearing >= weekStart && c.hearing <= offsetDate(6, weekStart),
    )
    .sort(
      (a, b) =>
        a.hearing.localeCompare(b.hearing) || a.time.localeCompare(b.time),
    );
  const move = (dir: number) => {
    if (view === "Month") {
      const next = new Date(month.getFullYear(), month.getMonth() + dir, 1);
      setMonth(next);
      setSelected(dateKey(next));
    } else {
      const next = offsetDate(dir * (view === "Week" ? 7 : 1), selected);
      setSelected(next);
      setMonth(new Date(`${next}T12:00:00`));
    }
  };
  const agenda = (rows: typeof cases) => (
    <div className="agenda-list">
      {rows.map((c) => (
        <Link className="agenda-item" key={c.id} to={`/cases/${c.id}`}>
          <div className="date-block">
            {formatDate(c.hearing, { month: "short" })}
            <strong>{formatDate(c.hearing, { day: "numeric" })}</strong>
          </div>
          <div>
            <h3>
              {c.party} vs. {c.opposite}
            </h3>
            <p>
              {c.number} · {c.proceeding}
            </p>
            <p>
              {formatTime(c.time)} · {c.court}
            </p>
          </div>
        </Link>
      ))}
      {!rows.length && (
        <EmptyState
          title="Room to breathe"
          description="No hearings scheduled for this period."
        />
      )}
    </div>
  );
  return (
    <div className="calendar-page viewport-page">
      <PageHeader
        eyebrow="STAY ONE STEP AHEAD"
        title="Hearing calendar"
        description="Select a date to see its hearings and reminders."
        actions={
          <Button onClick={() => setReminder(true)}>
            <Plus size={14} />
            Create reminder
          </Button>
        }
      />
      <div className="calendar-layout">
        <Panel className="calendar-main">
          <div className="panel-header">
            <div className="calendar-nav">
              <span style={{ fontSize: 18 }}>
                {formatDate(dateKey(month), { month: "long", year: "numeric" })}
              </span>
              <div style={{ marginLeft: 20 }}>
                <button
                  className="icon-button"
                  aria-label="Previous calendar period"
                  onClick={() => move(-1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Next calendar period"
                  onClick={() => move(1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="header-actions">
              <Button
                variant="secondary"
                className="small"
                onClick={() => {
                  setMonth(new Date(`${todayISO()}T12:00:00`));
                  setSelected(todayISO());
                }}
              >
                Today
              </Button>
              <div className="segmented">
                {["Month", "Week", "Day"].map((v) => (
                  <button
                    key={v}
                    aria-pressed={v === view}
                    className={v === view ? "active" : ""}
                    onClick={() => setView(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {view === "Month" ? (
            <>
              <div className="full-calendar">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div className="weekday" key={d}>
                    {d}
                  </div>
                ))}
                {monthDates(month).map((d) => {
                  const key = dateKey(d);
                  const dayCases = cases.filter((c) => c.hearing === key);
                  const dayReminders = reminders.filter((r) => r.date === key);
                  return (
                    <div
                      key={key}
                      className={`calendar-cell ${key === selected ? "selected-day" : ""} ${key === todayISO() ? "today" : ""} ${d.getMonth() !== month.getMonth() ? "outside" : ""}`}
                    >
                      <button
                        aria-label={`Select ${formatDate(key)}`}
                        className="calendar-date"
                        aria-pressed={selected === key}
                        onClick={() => {
                          setSelected(key);
                          setSidebarTab("Schedule");
                        }}
                      >
                        {d.getDate()}
                      </button>
                      {(dayCases.length > 0 || dayReminders.length > 0) && (
                        <button
                          className="calendar-day-summary"
                          aria-label={`${formatDate(key)}: ${dayCases.length} hearings, ${dayReminders.length} reminders. Show schedule`}
                          onClick={() => {
                            setSelected(key);
                            setSidebarTab("Schedule");
                          }}
                        >
                          {dayCases.length > 0 && (
                            <span>
                              <i className="legend-dot" />
                              {dayCases.length} hearing
                              {dayCases.length !== 1 ? "s" : ""}
                            </span>
                          )}
                          {dayReminders.length > 0 && (
                            <span
                              className="day-reminder-count"
                              title={`${dayReminders.length} reminders`}
                            >
                              <i className="legend-dot gold" />
                              {dayReminders.length}
                              <span className="reminder-word">
                                {" "}
                                reminder{dayReminders.length !== 1 ? "s" : ""}
                              </span>
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mobile-agenda">
                <Field label="Select a day">
                  <input
                    type="date"
                    value={selected}
                    onChange={(e) =>
                      e.target.value && setSelected(e.target.value)
                    }
                  />
                </Field>
                <div style={{ marginTop: 20 }}>{agenda(selectedCases)}</div>
              </div>
            </>
          ) : (
            <div className="panel-body">
              <Field
                label={view === "Day" ? "Choose a day" : "Week containing"}
              >
                <input
                  type="date"
                  value={selected}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelected(e.target.value);
                      setMonth(new Date(`${e.target.value}T12:00:00`));
                    }
                  }}
                />
              </Field>
              <div style={{ marginTop: 22 }}>{agenda(agendaCases)}</div>
              {reminders
                .filter((r) =>
                  view === "Day"
                    ? r.date === selected
                    : r.date >= weekStart && r.date <= offsetDate(6, weekStart),
                )
                .map((r) => (
                  <div className="notice" key={r.id} style={{ marginTop: 15 }}>
                    <Bell size={16} />
                    <Link to="/reminders">
                      {r.title} · {formatDate(r.date)} {formatTime(r.time)}
                    </Link>
                  </div>
                ))}
            </div>
          )}
          <div className="calendar-legend">
            <span>
              <i className="legend-dot" />
              Hearings
            </span>
            <span>
              <i className="legend-dot gold" />
              Reminders
            </span>
            <span>Bangladesh Standard Time</span>
          </div>
        </Panel>
        <div className="calendar-side">
          <div
            className="segmented schedule-tabs"
            aria-label="Calendar details"
          >
            {["Schedule", "Deadlines"].map((tab) => (
              <button
                key={tab}
                className={sidebarTab === tab ? "active" : ""}
                aria-pressed={sidebarTab === tab}
                onClick={() => setSidebarTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {sidebarTab === "Schedule" ? (
            <Panel
              title={
                selected === todayISO()
                  ? "Today’s schedule"
                  : formatDate(selected)
              }
              className="calendar-schedule"
            >
              <div className="panel-body">
                <p className="schedule-caption">
                  {selectedCases.length} hearings ·{" "}
                  {reminders.filter((r) => r.date === selected).length}{" "}
                  reminders
                </p>
                <PagedItems
                  key={selected}
                  label="schedule items"
                  pageSize={4}
                  empty={
                    <div className="compact-empty">
                      <CalendarDays size={24} />
                      <strong>No events on this date</strong>
                      <p>Choose another day or add a reminder.</p>
                    </div>
                  }
                  items={[
                    ...selectedCases.map((c) => (
                      <Link
                        to={`/cases/${c.id}`}
                        key={c.id}
                        className="hearing-row"
                      >
                        <div className="hearing-info">
                          <div className="case-number">
                            {formatTime(c.time)} · {c.number}
                          </div>
                          <h3>{c.party}</h3>
                          <p>{c.proceeding}</p>
                        </div>
                        <ChevronRight size={13} />
                      </Link>
                    )),
                    ...reminders
                      .filter((r) => r.date === selected)
                      .map((r) => (
                        <Link
                          to="/reminders"
                          className="schedule-reminder"
                          key={r.id}
                        >
                          <Bell size={14} />
                          <span>
                            {r.title}
                            <br />
                            {formatTime(r.time)}
                          </span>
                        </Link>
                      )),
                  ]}
                />
              </div>
            </Panel>
          ) : (
            <Panel title="Upcoming deadlines" className="calendar-schedule">
              <div className="panel-body">
                <PagedItems
                  label="deadlines"
                  pageSize={4}
                  empty={
                    <p className="compact-empty">No outstanding deadlines.</p>
                  }
                  items={data.tasks
                    .filter((t) => !t.done)
                    .sort((a, b) => a.due.localeCompare(b.due))
                    .map((t) => (
                      <Link to="/tasks" className="hearing-row" key={t.id}>
                        <div className="hearing-info">
                          <h3>{t.title}</h3>
                          <p>{formatDate(t.due)}</p>
                        </div>
                        <Badge>{t.priority}</Badge>
                      </Link>
                    ))}
                />
              </div>
            </Panel>
          )}
          <div className="calendar-help">
            <Info size={16} />
            Demo reminders stay in this app. Email and SMS are not sent.
          </div>
        </div>
      </div>
      {reminder && (
        <ReminderModal
          initialDate={selected}
          onClose={() => setReminder(false)}
        />
      )}
    </div>
  );
}
function CaseSelect({
  value,
  onChange,
  optional = true,
}: {
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
}) {
  const { data } = useStore();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={!optional}
    >
      <option value="">{optional ? "No related case" : "Select a case"}</option>
      {data.cases.map((c) => (
        <option key={c.id} value={c.id}>
          {c.number} · {c.party}
        </option>
      ))}
    </select>
  );
}
export function ReminderModal({
  onClose,
  initialCase = "",
  initialDate = todayISO(),
}: {
  onClose: () => void;
  initialCase?: string;
  initialDate?: string;
}) {
  const { update, notify } = useStore();
  const [v, setV] = useState({
    title: "",
    caseId: initialCase,
    date: initialDate,
    time: "09:00",
  });
  return (
    <Modal
      title="A little reminder"
      description="Give your future self one less thing to remember."
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!v.title.trim()) return;
          update((d) => ({
            ...d,
            reminders: [
              { ...v, title: v.title.trim(), id: uid(), done: false },
              ...d.reminders,
            ],
          }));
          notify(
            "Reminder added to this demo workspace. No notification will be sent.",
          );
          onClose();
        }}
      >
        <div className="form-grid">
          <Field label="What would you like to remember? *" className="full">
            <input
              required
              value={v.title}
              onChange={(e) => setV({ ...v, title: e.target.value })}
              placeholder="e.g. Bring original documents"
            />
          </Field>
          <Field label="Related case" className="full">
            <CaseSelect
              value={v.caseId}
              onChange={(caseId) => setV({ ...v, caseId })}
            />
          </Field>
          <Field label="Date *">
            <input
              type="date"
              required
              value={v.date}
              onChange={(e) => setV({ ...v, date: e.target.value })}
            />
          </Field>
          <Field label="Time (Bangladesh) *">
            <input
              type="time"
              required
              value={v.time}
              onChange={(e) => setV({ ...v, time: e.target.value })}
            />
          </Field>
          <Field label="Notification preference" className="full">
            <select value="in-app" onChange={() => {}}>
              <option value="in-app">In-app only</option>
              <option disabled>Email — not configured</option>
              <option disabled>SMS — not configured</option>
              <option disabled>Push — not configured</option>
            </select>
          </Field>
        </div>
        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Bell size={14} />
            Create reminder
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export function Reminders() {
  const { data, update } = useStore();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(params.has("new"));
  const [filter, setFilter] = useState("Upcoming");
  const rows = data.reminders
    .filter(
      (r) => filter === "All" || (filter === "Completed" ? r.done : !r.done),
    )
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const close = () => {
    setOpen(false);
    setParams({});
  };
  return (
    <>
      <PageHeader
        eyebrow="SMALL PROMPTS, BIG PEACE OF MIND"
        title="Reminders"
        description="Keep the next step in view, even on your busiest days."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={14} />
            Set reminder
          </Button>
        }
      />
      <div className="notice">
        <Bell size={16} />
        Reminders appear in this workspace. Email, SMS, and push delivery
        require provider configuration.
      </div>
      <Panel>
        <Tabs
          items={["Upcoming", "Completed", "All"]}
          value={filter}
          onChange={setFilter}
        />
        <div className="panel-body" style={{ paddingTop: 10 }}>
          {rows.map((r) => (
            <div
              className="task-item record-card"
              key={r.id}
              data-tone={actionHighlight(r.done, r.date, todayISO()).tone}
            >
              <CheckRow
                checked={r.done}
                onChange={() =>
                  update((d) => ({
                    ...d,
                    reminders: d.reminders.map((x) =>
                      x.id === r.id ? { ...x, done: !x.done } : x,
                    ),
                  }))
                }
              >
                {r.title}
              </CheckRow>
              <div className="task-meta">
                <span>
                  {formatDate(r.date)} · {formatTime(r.time)}
                  {r.caseId && (
                    <>
                      {" "}
                      ·{" "}
                      <Link to={`/cases/${r.caseId}`}>
                        {data.cases.find((c) => c.id === r.caseId)?.number}
                      </Link>
                    </>
                  )}
                </span>
                <ActionStatus done={r.done} due={r.date} />
              </div>
            </div>
          ))}
          {!rows.length && (
            <EmptyState
              title="Nothing to remember here"
              description="Create a reminder for a hearing, a document, or a conversation."
              action={
                <Button onClick={() => setOpen(true)}>Set a reminder</Button>
              }
            />
          )}
        </div>
      </Panel>
      {open && (
        <ReminderModal onClose={close} initialCase={params.get("case") || ""} />
      )}
    </>
  );
}
export function Tasks() {
  const { data, update, notify } = useStore();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(params.has("new"));
  const [filter, setFilter] = useState("To do");
  const [v, setV] = useState({
    title: "",
    caseId: params.get("case") || "",
    assignee: data.profile.name,
    due: todayISO(),
    priority: "Medium" as Task["priority"],
  });
  const rows = data.tasks.filter(
    (t) =>
      filter === "All tasks" || (filter === "Completed" ? t.done : !t.done),
  );
  const close = () => {
    setOpen(false);
    setParams({});
  };
  return (
    <>
      <PageHeader
        eyebrow="MAKE SPACE FOR PROGRESS"
        title="Tasks"
        description="Turn a busy day into a few clear next steps."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={14} />
            Create task
          </Button>
        }
      />
      <Panel>
        <Tabs
          items={["To do", "Completed", "All tasks"]}
          value={filter}
          onChange={setFilter}
        />
        <div className="panel-body" style={{ paddingTop: 12 }}>
          {rows.map((t) => (
            <div
              className="task-item record-card"
              key={t.id}
              data-tone={actionHighlight(t.done, t.due, todayISO()).tone}
            >
              <CheckRow
                checked={t.done}
                onChange={() =>
                  update((d) => ({
                    ...d,
                    tasks: d.tasks.map((x) =>
                      x.id === t.id ? { ...x, done: !x.done } : x,
                    ),
                  }))
                }
              >
                {t.title}
              </CheckRow>
              <div className="task-meta">
                <span>
                  {t.assignee} · {formatDate(t.due)}
                  {t.caseId && (
                    <>
                      {" "}
                      ·{" "}
                      <Link to={`/cases/${t.caseId}`}>
                        {data.cases.find((c) => c.id === t.caseId)?.number}
                      </Link>
                    </>
                  )}
                </span>
                <span className="record-badges">
                  <ActionStatus done={t.done} due={t.due} />
                  <Badge>{t.priority}</Badge>
                </span>
              </div>
            </div>
          ))}
          {!rows.length && (
            <EmptyState
              title={
                filter === "Completed"
                  ? "Progress starts with one step"
                  : "All caught up"
              }
              description="Your tasks will appear here as you create or complete them."
            />
          )}
        </div>
      </Panel>
      {open && (
        <Modal
          title="Create a task"
          description="Make the next step clear for you or your team."
          onClose={close}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!v.title.trim()) return;
              update((d) => ({
                ...d,
                tasks: [
                  { ...v, title: v.title.trim(), id: uid(), done: false },
                  ...d.tasks,
                ],
              }));
              notify("Task created in this demo workspace.");
              setV({ ...v, title: "" });
              close();
            }}
          >
            <div className="form-grid">
              <Field label="Task title *" className="full">
                <input
                  required
                  value={v.title}
                  onChange={(e) => setV({ ...v, title: e.target.value })}
                  placeholder="What needs to get done?"
                />
              </Field>
              <Field label="Related case" className="full">
                <CaseSelect
                  value={v.caseId}
                  onChange={(caseId) => setV({ ...v, caseId })}
                />
              </Field>
              <Field label="Assigned to">
                <select
                  value={v.assignee}
                  onChange={(e) => setV({ ...v, assignee: e.target.value })}
                >
                  {data.members.map((m) => (
                    <option key={m.id}>{m.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Due date *">
                <input
                  type="date"
                  required
                  value={v.due}
                  onChange={(e) => setV({ ...v, due: e.target.value })}
                />
              </Field>
              <Field label="Priority">
                <select
                  value={v.priority}
                  onChange={(e) =>
                    setV({ ...v, priority: e.target.value as Task["priority"] })
                  }
                >
                  {["High", "Medium", "Low"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="form-actions">
              <Button variant="secondary" type="button" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Create task</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
const sampleText = (d: DocumentRecord) =>
  `CASE DIARY — DEMONSTRATION DOCUMENT\n\n${d.name}\nCategory: ${d.category}\n\nThis is sample content for the interface preview. It is not an actual court order, petition, evidence, or legal document.\n\nUse the upload flow to preview your own sample files locally. Files remain in memory and reset on refresh.`;
const sizeLabel = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
export function Documents() {
  const { data, update, notify, log } = useStore();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(params.has("upload"));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [caseId, setCaseId] = useState(params.get("case") || "");
  const [mode, setMode] = useState("grid");
  const [preview, setPreview] = useState<DocumentRecord | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadCase, setUploadCase] = useState(params.get("case") || "");
  const [uploadCategory, setUploadCategory] = useState("Court Orders");
  const [error, setError] = useState("");
  const [uploader, setUploader] = useState("All");
  const [date, setDate] = useState("");
  const categories = [
    "Court Orders",
    "Petitions",
    "Evidence",
    "Notices",
    "Agreements",
    "Other",
  ];
  const rows = data.documents.filter(
    (d) =>
      (!query || d.name.toLowerCase().includes(query.toLowerCase())) &&
      (category === "All" || d.category === category) &&
      (!caseId || d.caseId === caseId) &&
      (uploader === "All" || d.uploader === uploader) &&
      (!date || d.date === date),
  );
  const close = () => {
    setOpen(false);
    setParams(caseId ? { case: caseId } : {});
  };
  const download = (d: DocumentRecord) => {
    if (d.sample) downloadText(d.name, sampleText(d));
    else if (d.url) {
      const a = document.createElement("a");
      a.href = d.url;
      a.download = d.name;
      a.click();
    }
  };
  const upload = (e: FormEvent) => {
    e.preventDefault();
    if (!files.length) {
      setError("Choose at least one document.");
      return;
    }
    const fileError = validateDocuments(files);
    if (fileError) {
      setError(fileError);
      return;
    }
    update((d) => ({
      ...d,
      documents: [
        ...files.map((f) => ({
          id: uid(),
          name: f.name,
          caseId: uploadCase,
          category: uploadCategory,
          size: f.size,
          date: todayISO(),
          uploader: data.profile.name,
          url: URL.createObjectURL(f),
          mime: f.type,
        })),
        ...d.documents,
      ],
    }));
    log(
      `${files.length} document${files.length > 1 ? "s" : ""} added to the library`,
    );
    notify(
      `${files.length} file${files.length > 1 ? "s" : ""} added locally for this session.`,
    );
    setFiles([]);
    setError("");
    close();
  };
  return (
    <>
      <PageHeader
        eyebrow="THE RIGHT DOCUMENT, RIGHT HERE"
        title="Document library"
        description="Court orders, evidence, and everything in between. Thoughtfully organized."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Upload size={14} />
            Upload document
          </Button>
        }
      />
      <div className="notice">
        <Info size={16} />
        Demo documents are labeled samples. Uploaded files stay in browser
        memory and are removed when you refresh. No files are sent to a server.
      </div>
      <Panel className="document-library">
        <div className="filters">
          <div className="search-field">
            <Search size={15} />
            <input
              aria-label="Search documents"
              placeholder="Search documents…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            aria-label="Document category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Related case filter"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
          >
            <option value="">All cases</option>
            {data.cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.number}
              </option>
            ))}
          </select>
          <div className="segmented">
            <button
              aria-label="Grid view"
              aria-pressed={mode === "grid"}
              className={mode === "grid" ? "active" : ""}
              onClick={() => setMode("grid")}
            >
              <Grid2X2 size={14} />
            </button>
            <button
              aria-label="List view"
              aria-pressed={mode === "list"}
              className={mode === "list" ? "active" : ""}
              onClick={() => setMode("list")}
            >
              <List size={14} />
            </button>
          </div>
        </div>
        <div className="filters" style={{ paddingTop: 0 }}>
          <select
            aria-label="Uploader filter"
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
          >
            <option value="All">All uploaders</option>
            {[...new Set(data.documents.map((d) => d.uploader))].map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <input
            type="date"
            aria-label="Upload date filter"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {(query ||
            category !== "All" ||
            caseId ||
            uploader !== "All" ||
            date) && (
            <Button
              variant="ghost"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setCaseId("");
                setUploader("All");
                setDate("");
              }}
            >
              Reset filters
            </Button>
          )}
        </div>
        {rows.length ? (
          mode === "grid" ? (
            <div className="document-grid">
              {rows.map((d) => (
                <article
                  className="document-card record-card"
                  key={d.id}
                  data-tone={d.sample ? "pending" : "closed"}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <span className="document-icon">
                      <FileText size={24} />
                    </span>
                    <Badge tone={d.sample ? "warning" : "info"}>
                      {d.sample ? "Sample" : "Local file"}
                    </Badge>
                  </div>
                  <h3>{d.name}</h3>
                  <p>
                    {data.cases.find((c) => c.id === d.caseId)?.number ||
                      "General document"}{" "}
                    · {d.category}
                  </p>
                  <p>
                    {formatDate(d.date)} · {d.uploader}
                  </p>
                  <footer>
                    <small>
                      {sizeLabel(
                        d.sample ? new Blob([sampleText(d)]).size : d.size,
                      )}
                    </small>
                    <span>
                      <button
                        className="icon-button"
                        aria-label={`Preview ${d.name}`}
                        onClick={() => setPreview(d)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Download ${d.name}`}
                        onClick={() => download(d)}
                      >
                        <Download size={16} />
                      </button>
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <div className="table-wrap document-table-wrap">
              <table className="themed-table document-table">
                <thead>
                  <tr>
                    <th>DOCUMENT</th>
                    <th>CATEGORY</th>
                    <th>CASE</th>
                    <th>UPLOADED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id} data-tone={d.sample ? "pending" : "closed"}>
                      <td data-label="Document">
                        <span className="case-title">{d.name}</span>
                        <span className="subtext">
                          {d.sample
                            ? "Sample document"
                            : `Local file · ${sizeLabel(d.size)}`}
                        </span>
                      </td>
                      <td data-label="Category">{d.category}</td>
                      <td data-label="Case">
                        {data.cases.find((c) => c.id === d.caseId)?.number ||
                          "General"}
                      </td>
                      <td data-label="Uploaded">{formatDate(d.date)}</td>
                      <td data-label="Actions">
                        <button
                          className="icon-button"
                          aria-label={`Preview ${d.name}`}
                          onClick={() => setPreview(d)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={`Download ${d.name}`}
                          onClick={() => download(d)}
                        >
                          <Download size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <EmptyState
            title="No documents found"
            description="Try another filter, or upload the first document for this case."
            action={
              <Button onClick={() => setOpen(true)}>Upload a document</Button>
            }
          />
        )}
      </Panel>
      {open && (
        <Modal
          title="Add to your library"
          description="PDF, Word, JPG, PNG, and TXT. Maximum 10 MB per file."
          onClose={close}
        >
          <form onSubmit={upload}>
            <div className="dropzone">
              <Upload size={27} />
              <p>Choose the files you’d like to keep together.</p>
              <input
                type="file"
                multiple
                required
                aria-label="Select documents"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                onChange={(e) => {
                  setFiles(Array.from(e.target.files || []));
                  setError("");
                }}
              />
              {files.length > 0 && (
                <p style={{ marginTop: 12 }}>
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            {error && (
              <div className="notice warning" role="alert">
                {error}
              </div>
            )}
            <div className="form-grid">
              <Field label="Related case" className="full">
                <CaseSelect value={uploadCase} onChange={setUploadCase} />
              </Field>
              <Field label="Category" className="full">
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <p style={{ fontSize: 10, marginTop: 18 }}>
              Files stay in memory in this tab. Use sample documents, not
              confidential records.
            </p>
            <div className="form-actions">
              <Button variant="secondary" type="button" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">
                <Upload size={14} />
                Add files locally
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {preview && (
        <Modal
          title={preview.name}
          description={`${preview.category} · ${preview.sample ? "Sample document" : "Local preview"}`}
          wide
          onClose={() => setPreview(null)}
        >
          {preview.sample ? (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                font: "12px/1.9 Inter",
                background: "#f6f7f4",
                padding: 20,
                borderRadius: 9,
              }}
            >
              {sampleText(preview)}
            </pre>
          ) : preview.mime.startsWith("image/") ? (
            <img
              src={preview.url}
              alt={preview.name}
              style={{ maxWidth: "100%", maxHeight: 450, objectFit: "contain" }}
            />
          ) : preview.mime === "application/pdf" ||
            preview.mime === "text/plain" ? (
            <iframe
              title={preview.name}
              src={preview.url}
              sandbox=""
              style={{
                border: "1px solid #e4e8e3",
                width: "100%",
                height: 420,
                borderRadius: 8,
              }}
            />
          ) : (
            <EmptyState
              title="Ready to download"
              description="This file format doesn’t have a browser preview. Download it to open it in a compatible application."
            />
          )}
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setPreview(null)}>
              <X size={13} />
              Close
            </Button>
            <Button onClick={() => download(preview)}>
              <Download size={14} />
              Download
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function Reports() {
  const { data, account } = useStore();
  const [status, setStatus] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const rows = data.cases.filter(
    (c) =>
      (status === "All" || c.status === status) &&
      (!from || c.hearing >= from) &&
      (!to || c.hearing <= to),
  );
  const overdue = data.tasks.filter(
    (t) => !t.done && t.due < todayISO() && rows.some((c) => c.id === t.caseId),
  );
  const counts = ["Active", "Pending", "Closed", "Archived"].map((s) => ({
    label: s,
    value: rows.filter((c) => c.status === s).length,
  }));
  return (
    <div className="reports-page viewport-page">
      <PageHeader
        eyebrow="A CLEARER PICTURE"
        title={account === "advocate" ? "Practice reports" : "Case reports"}
        description="See case progress, workload and what needs your attention."
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              downloadText(
                "case-diary-report.json",
                JSON.stringify(
                  {
                    generated: todayISO(),
                    filters: { status, from, to },
                    caseCounts: counts,
                    overdueActions: overdue,
                    hearingHistory: rows.map((c) => ({
                      number: c.number,
                      history: c.history,
                    })),
                  },
                  null,
                  2,
                ),
                "application/json",
              )
            }
          >
            <Download size={14} />
            Export report
          </Button>
        }
      />
      <Panel className="report-filters">
        <div className="filters">
          <Field label="Case status">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {["All", "Active", "Pending", "Closed", "Archived"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Hearing date from">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </Field>
          <Field label="Hearing date to">
            <input
              type="date"
              min={from}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Field>
          <Button
            variant="ghost"
            onClick={() => {
              setFrom("");
              setTo("");
              setStatus("All");
            }}
          >
            Reset
          </Button>
          <span className="report-source">
            <i className="legend-dot" />
            Live from demo records
          </span>
        </div>
      </Panel>
      <div className="report-grid">
        <Panel title="Cases by status">
          <div className="panel-body">
            <div className="report-total">
              <strong>{rows.length}</strong>
              <span>cases in this view</span>
            </div>
            {counts.map((c) => (
              <div className="bar-row" key={c.label}>
                <span>{c.label}</span>
                <div className="bar-track">
                  <span
                    style={{
                      width: `${rows.length ? (c.value / rows.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <strong>{c.value}</strong>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Cases by assigned advocate">
          <div className="panel-body">
            <PagedItems
              key={`${status}-${from}-${to}`}
              label="advocates"
              pageSize={3}
              empty={
                <p className="compact-empty">No cases match these filters.</p>
              }
              items={[...new Set(rows.map((c) => c.advocate))].map((name) => {
                const n = rows.filter((c) => c.advocate === name).length;
                return (
                  <div className="bar-row" key={name}>
                    <span title={name || "Unassigned"}>
                      {name || "Unassigned"}
                    </span>
                    <div className="bar-track">
                      <span
                        style={{
                          width: `${(n / Math.max(1, rows.length)) * 100}%`,
                          background: "#bca870",
                        }}
                      />
                    </div>
                    <strong>{n}</strong>
                  </div>
                );
              })}
            />
          </div>
        </Panel>
        <Panel
          title="Overdue actions"
          meta={<span className="count">{overdue.length}</span>}
        >
          <div className="panel-body">
            <PagedItems
              key={`${status}-${from}-${to}`}
              label="overdue actions"
              pageSize={2}
              empty={
                <div className="compact-empty">
                  <strong>You’re up to date</strong>
                  <p>No overdue tasks for these cases.</p>
                </div>
              }
              items={overdue.map((t) => (
                <Link to="/tasks" className="hearing-row" key={t.id}>
                  <div className="hearing-info">
                    <h3>{t.title}</h3>
                    <p>Due {formatDate(t.due)}</p>
                  </div>
                  <Badge tone="warning">Overdue</Badge>
                </Link>
              ))}
            />
          </div>
        </Panel>
        <Panel title="Upcoming hearings">
          <div className="panel-body">
            <PagedItems
              key={`${status}-${from}-${to}`}
              label="upcoming hearings"
              pageSize={2}
              empty={
                <p className="compact-empty">
                  No upcoming hearings in this view.
                </p>
              }
              items={rows
                .filter(
                  (c) =>
                    c.hearing >= todayISO() &&
                    ["Active", "Pending"].includes(c.status),
                )
                .sort((a, b) => a.hearing.localeCompare(b.hearing))
                .map((c) => (
                  <Link
                    to={`/cases/${c.id}`}
                    className="hearing-row"
                    key={c.id}
                  >
                    <div className="hearing-info">
                      <h3>
                        {c.number} · {c.party}
                      </h3>
                      <p>
                        {formatDate(c.hearing)} · {c.proceeding}
                      </p>
                    </div>
                    <CalendarDays size={15} />
                  </Link>
                ))}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
