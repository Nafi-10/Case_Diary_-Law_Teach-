import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Archive,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Download,
  FileText,
  FolderOpen,
  Info,
  Landmark,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  CheckRow,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Pagination,
  Panel,
  Tabs,
  TextLink,
  downloadText,
} from "../components/ui";
import {
  activeLimit,
  actionHighlight,
  appendHearing,
  wouldExceedCaseLimit,
  csvCell,
  filterCases,
  hearingHighlight,
  PLANS,
  validateDocuments,
} from "../domain";
import { formatDate, formatTime, todayISO, uid } from "../data/demo";
import { useStore } from "../store";
import { ActionStatus } from "../components/ActionStatus";
import type { CaseRecord, CaseStatus, Hearing } from "../types";
const statuses: CaseStatus[] = ["Active", "Pending", "Closed", "Archived"];
function HearingDate({ record }: { record: CaseRecord }) {
  const highlight = hearingHighlight(record, todayISO());
  return (
    <div
      className={`case-hearing ${highlight ? `hearing-${highlight.tone}` : ""}`}
    >
      <span className="cell-date">
        <CalendarDays size={13} />
        {record.hearing
          ? formatDate(record.hearing, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Not scheduled"}
      </span>
      {record.hearing && (
        <span className="hearing-meta">
          {record.time && <span>{formatTime(record.time)}</span>}
          {highlight && (
            <span className="hearing-timing">{highlight.label}</span>
          )}
        </span>
      )}
    </div>
  );
}
export function Cases({ shared = false }: { shared?: boolean }) {
  const { data } = useStore();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [status, setStatus] = useState("All");
  const [court, setCourt] = useState("All");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("hearing");
  const [page, setPage] = useState(1);
  const source = shared ? data.cases.filter((c) => c.shared) : data.cases;
  const results = filterCases(source, query, status, court, date).sort(
    (a, b) =>
      sort === "number"
        ? a.number.localeCompare(b.number)
        : sort === "updated"
          ? b.updated.localeCompare(a.updated)
          : a.hearing.localeCompare(b.hearing),
  );
  const safePage = Math.min(page, Math.max(1, Math.ceil(results.length / 8)));
  const visible = results.slice((safePage - 1) * 8, safePage * 8);
  const reset = () => {
    setParams({});
    setStatus("All");
    setCourt("All");
    setDate("");
    setPage(1);
  };
  const csv = () =>
    downloadText(
      "case-diary-cases.csv",
      "\uFEFF" +
        [
          [
            "Case number",
            "Party name",
            "Opposite party",
            "Court",
            "Type",
            "Next hearing",
            "Status",
          ],
          ...results.map((c) => [
            c.number,
            c.party,
            c.opposite,
            c.court,
            c.type,
            c.hearing,
            c.status,
          ]),
        ]
          .map((row) => row.map(csvCell).join(","))
          .join("\r\n"),
      "text/csv;charset=utf-8",
    );
  return (
    <>
      <PageHeader
        eyebrow="YOUR CASEWORK, IN ORDER"
        title={shared ? "Shared cases" : "My cases"}
        description={
          shared
            ? "The cases you’re working on together. Access is limited to each shared case."
            : "Every matter deserves your full attention. Keep the details in one place."
        }
        actions={
          <>
            <Button variant="secondary" onClick={csv}>
              <Download size={14} />
              Export CSV
            </Button>
            <Link to="/cases/new" className="button primary">
              <Plus size={15} />
              Add new case
            </Link>
          </>
        }
      />
      <Panel className="case-list-panel">
        <Tabs
          items={["All cases", "Active", "Pending", "Closed", "Archived"]}
          value={status === "All" ? "All cases" : status}
          onChange={(v) => {
            setStatus(v === "All cases" ? "All" : v);
            setPage(1);
          }}
        />
        <div className="filters">
          <div className="search-field">
            <Search size={15} />
            <input
              aria-label="Search cases"
              placeholder="Search case number, party, or court…"
              value={query}
              onChange={(e) => {
                setParams(e.target.value ? { q: e.target.value } : {});
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Filter by court"
            value={court}
            onChange={(e) => {
              setCourt(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All courts</option>
            {[...new Set(source.map((c) => c.court))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            aria-label="Filter by hearing date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
          />
          <select
            aria-label="Sort cases"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="hearing">Hearing date</option>
            <option value="number">Case number</option>
            <option value="updated">Last updated</option>
          </select>
          {(query || court !== "All" || date || status !== "All") && (
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
          )}
        </div>
        <div className="case-color-key" aria-label="Case status color guide">
          <span className="color-key-title">Status guide</span>
          {statuses.map((s) => (
            <span
              key={s}
              className={`color-key-item status-${s.toLowerCase()}`}
            >
              <i aria-hidden="true" />
              {s}
            </span>
          ))}
          <span className="case-view-count">
            {results.length} {results.length === 1 ? "case" : "cases"} in this
            view
          </span>
        </div>
        {results.length ? (
          <>
            <div className="table-wrap desktop-case-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      CASE NUMBER <ArrowDownUp size={10} />
                    </th>
                    <th>PARTIES</th>
                    <th>COURT & TYPE</th>
                    <th>NEXT HEARING</th>
                    <th>STATUS</th>
                    <th>UPDATED</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((c) => (
                    <tr
                      key={c.id}
                      className={`case-row status-${c.status.toLowerCase()}`}
                    >
                      <td>
                        <Link
                          className="case-title case-number-link"
                          to={`/cases/${c.id}`}
                        >
                          {c.number}
                        </Link>
                      </td>
                      <td>
                        <span className="case-title">{c.party}</span>
                        <span className="subtext">vs. {c.opposite}</span>
                      </td>
                      <td>
                        <div className="case-court-name">{c.court}</div>
                        <span
                          className={`case-type-chip type-${c.type.toLowerCase()}`}
                        >
                          {c.type}
                        </span>
                      </td>
                      <td>
                        <HearingDate record={c} />
                      </td>
                      <td>
                        <Badge>{c.status}</Badge>
                      </td>
                      <td>
                        {formatDate(c.updated, {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td>
                        <Link
                          to={`/cases/${c.id}`}
                          aria-label={`Open ${c.number}`}
                          className="case-open-button"
                        >
                          <ChevronRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-case-list">
              {visible.map((c) => (
                <Link
                  to={`/cases/${c.id}`}
                  className={`mobile-case-card status-${c.status.toLowerCase()}`}
                  key={c.id}
                >
                  <div className="case-card-top">
                    <strong>{c.number}</strong>
                    <Badge>{c.status}</Badge>
                  </div>
                  <h3>
                    {c.party} vs. {c.opposite}
                  </h3>
                  <p>{c.court}</p>
                  <span
                    className={`case-type-chip type-${c.type.toLowerCase()}`}
                  >
                    {c.type}
                  </span>
                  <div className="case-card-footer">
                    <HearingDate record={c} />
                    <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
            <Pagination
              page={safePage}
              total={results.length}
              perPage={8}
              onChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            title={
              source.length
                ? "No cases match your search"
                : shared
                  ? "No shared cases yet"
                  : "Your next chapter starts here"
            }
            description={
              source.length
                ? "Try a different name, court, or hearing date. You can also clear your filters."
                : shared
                  ? "Cases shared with this workspace will appear here."
                  : "Add your first case and keep every hearing and document within reach."
            }
            action={
              source.length ? (
                <Button variant="secondary" onClick={reset}>
                  Clear filters
                </Button>
              ) : (
                <Link to="/cases/new" className="button primary">
                  <Plus size={14} />
                  Add a case
                </Link>
              )
            }
          />
        )}
      </Panel>
    </>
  );
}
const emptyCase = (): CaseRecord => ({
  id: uid(),
  number: "",
  party: "",
  opposite: "",
  court: "",
  type: "Civil",
  status: "Active",
  hearing: "",
  time: "10:00",
  proceeding: "",
  advocate: "",
  filed: todayISO(),
  notes: "",
  updated: todayISO(),
  history: [],
});
export function CaseForm() {
  const { id } = useParams();
  const { data, account, update, notify, log } = useStore();
  const navigate = useNavigate();
  const existing = data.cases.find((c) => c.id === id);
  const [values, setValues] = useState<CaseRecord>(() =>
    existing
      ? { ...existing }
      : { ...emptyCase(), advocate: data.profile.name },
  );
  const [error, setError] = useState("");
  const [remind, setRemind] = useState(true);
  const [previousDate, setPreviousDate] = useState(
    existing?.history.at(-1)?.date || "",
  );
  const [previousNotes, setPreviousNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const change = (key: keyof CaseRecord, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const plan = PLANS[account].find((p) => p.name === data.plan)!;
    if (
      wouldExceedCaseLimit(data.cases, values, activeLimit(plan, data.profile))
    ) {
      setError(
        "Your active-case allowance is full. Choose another plan or close a completed case. Existing records are preserved.",
      );
      return;
    }
    if (
      !values.number.trim() ||
      !values.party.trim() ||
      !values.opposite.trim() ||
      !values.court.trim()
    ) {
      setError("Enter the case number, court, and both party names.");
      return;
    }
    if (
      data.cases.some(
        (c) =>
          c.id !== id &&
          c.number.trim().toLowerCase() === values.number.trim().toLowerCase(),
      )
    ) {
      setError("This case number already exists in your workspace.");
      return;
    }
    const fileError = validateDocuments(files);
    if (fileError) {
      setError(fileError);
      return;
    }
    const record = {
      ...values,
      number: values.number.trim(),
      party: values.party.trim(),
      opposite: values.opposite.trim(),
      updated: todayISO(),
      history:
        !existing && previousDate
          ? [
              {
                id: uid(),
                date: previousDate,
                proceeding: "Previous hearing",
                notes: previousNotes,
                next: values.hearing,
                author: data.profile.name,
                created: new Date().toISOString(),
              },
            ]
          : values.history,
    };
    update((d) => ({
      ...d,
      cases: existing
        ? d.cases.map((c) => (c.id === id ? record : c))
        : [record, ...d.cases],
      reminders:
        remind && values.hearing && !existing
          ? [
              {
                id: uid(),
                title: `Prepare for ${record.number}`,
                caseId: record.id,
                date: record.hearing,
                time: "09:00",
                done: false,
              },
              ...d.reminders,
            ]
          : d.reminders,
      documents: [
        ...files.map((file) => ({
          id: uid(),
          name: file.name,
          caseId: record.id,
          category: "Other",
          size: file.size,
          date: todayISO(),
          uploader: data.profile.name,
          url: URL.createObjectURL(file),
          mime: file.type,
        })),
        ...d.documents,
      ],
    }));
    log(`${existing ? "Updated" : "Added"} case ${record.number}`);
    notify(
      `${record.number} ${existing ? "updated" : "created"} in this demo session.`,
    );
    navigate(`/cases/${record.id}`);
  };
  if (id && !existing)
    return (
      <EmptyState
        title="Case not found"
        description="This case is not available in the current demo workspace."
        action={
          <Link className="button secondary" to="/cases">
            Back to cases
          </Link>
        }
      />
    );
  return (
    <>
      <Link
        to={existing ? `/cases/${id}` : "/cases"}
        className="text-link"
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={13} />
        Back to {existing ? "case" : "my cases"}
      </Link>
      <PageHeader
        eyebrow="MAKE ROOM FOR WHAT MATTERS"
        title={existing ? "Edit case" : "Add a new case"}
        description="Start with the essentials. You can add more details as your case progresses."
      />
      <div className="form-layout">
        <form onSubmit={submit}>
          <div className="notice">
            <Info size={16} />
            <span>
              This is a demo workspace. Entries remain in this browser tab and
              reset on refresh. Use sample information only.
            </span>
          </div>
          {error && (
            <div className="notice warning" role="alert">
              {error}
            </div>
          )}
          <section className="panel form-section">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>Basic case information</h2>
                <p>The details that identify this matter.</p>
              </div>
            </div>
            <div className="form-grid">
              <Field label="Case number *">
                <input
                  required
                  value={values.number}
                  onChange={(e) => change("number", e.target.value)}
                  placeholder="e.g. TS 145/2026"
                />
              </Field>
              <Field label="Court *">
                <input
                  required
                  list="courts"
                  value={values.court}
                  onChange={(e) => change("court", e.target.value)}
                  placeholder="Select or enter a court"
                />
                <datalist id="courts">
                  {[...new Set(data.cases.map((c) => c.court))].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Case type">
                <select
                  value={values.type}
                  onChange={(e) => change("type", e.target.value)}
                >
                  {[
                    "Civil",
                    "Criminal",
                    "Family",
                    "Labour",
                    "Commercial",
                    "Other",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={values.status}
                  onChange={(e) => change("status", e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Filing date">
                <input
                  type="date"
                  value={values.filed}
                  onChange={(e) => change("filed", e.target.value)}
                />
              </Field>
            </div>
          </section>
          <section className="panel form-section">
            <div className="section-heading">
              <span className="section-number">02</span>
              <div>
                <h2>The people involved</h2>
                <p>
                  Party and opposite party, just as they appear on the record.
                </p>
              </div>
            </div>
            <div className="form-grid">
              <Field label="Party name *" hint="Party Name (P.M.)">
                <input
                  required
                  value={values.party}
                  onChange={(e) => change("party", e.target.value)}
                  placeholder="Full name or organization"
                />
              </Field>
              <Field
                label="Opposite party name *"
                hint="Opposite Party Name (Opposite P.M.)"
              >
                <input
                  required
                  value={values.opposite}
                  onChange={(e) => change("opposite", e.target.value)}
                  placeholder="Full name or organization"
                />
              </Field>
              <Field
                label="Responsible advocate / team member"
                className="full"
              >
                <input
                  list="advocates"
                  value={values.advocate}
                  onChange={(e) => change("advocate", e.target.value)}
                  placeholder="Name of the person handling this case"
                />
                <datalist id="advocates">
                  {data.members.map((m) => (
                    <option key={m.id} value={m.name} />
                  ))}
                </datalist>
              </Field>
            </div>
          </section>
          <section className="panel form-section">
            <div className="section-heading">
              <span className="section-number">03</span>
              <div>
                <h2>The next hearing</h2>
                <p>A clear view of what comes next.</p>
              </div>
            </div>
            <div className="form-grid">
              <Field
                label="Previous hearing date"
                hint={
                  existing
                    ? "Recorded hearing history is preserved. Add new entries from the case workspace."
                    : "Optional. Adds the previous date to the hearing history."
                }
              >
                <input
                  type="date"
                  value={previousDate}
                  readOnly={Boolean(existing)}
                  max={values.hearing || undefined}
                  onChange={(e) => setPreviousDate(e.target.value)}
                />
              </Field>
              <Field label="Next hearing date">
                <input
                  type="date"
                  value={values.hearing}
                  min={!existing ? previousDate || undefined : undefined}
                  onChange={(e) => change("hearing", e.target.value)}
                />
              </Field>
              <Field label="Hearing time (Bangladesh)">
                <input
                  type="time"
                  value={values.time}
                  onChange={(e) => change("time", e.target.value)}
                />
              </Field>
              <Field label="Step / proceeding" className="full">
                <input
                  value={values.proceeding}
                  onChange={(e) => change("proceeding", e.target.value)}
                  placeholder="e.g. Argument hearing, witness examination"
                />
              </Field>
              {!existing && (
                <div className="full">
                  <CheckRow
                    checked={remind}
                    onChange={() => setRemind(!remind)}
                  >
                    Add an in-app preparation reminder at 9:00 AM on the hearing
                    date
                  </CheckRow>
                </div>
              )}
              {!existing && previousDate && (
                <Field label="Previous hearing notes" className="full">
                  <textarea
                    value={previousNotes}
                    onChange={(e) => setPreviousNotes(e.target.value)}
                    placeholder="Record the proceeding or outcome from the previous date…"
                  />
                </Field>
              )}
              {existing && (
                <div className="notice full" style={{ marginBottom: 0 }}>
                  Previous hearing records are preserved. Add a dated hearing
                  update from the case workspace to record a proceeding or
                  outcome.
                </div>
              )}
            </div>
          </section>
          <section className="panel form-section">
            <div className="section-heading">
              <span className="section-number">04</span>
              <div>
                <h2>Documents & notes</h2>
                <p>Keep the supporting details close.</p>
              </div>
            </div>
            <div className="form-grid">
              <Field
                label="Supporting documents"
                hint="Up to 10 MB per file. Stored in memory for this session only."
                className="full"
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
              </Field>
              <Field label="Private case notes" className="full">
                <textarea
                  value={values.notes}
                  onChange={(e) => change("notes", e.target.value)}
                  placeholder="Add helpful context, client instructions, or points to remember…"
                />
              </Field>
            </div>
          </section>
          <div className="form-actions">
            <Link
              to={existing ? `/cases/${id}` : "/cases"}
              className="button secondary"
            >
              Cancel
            </Link>
            <Button type="submit">
              <Plus size={14} />
              {existing ? "Save changes" : "Create case"}
            </Button>
          </div>
        </form>
        <aside className="panel sticky-panel">
          <span className="stat-icon gold">
            <BriefcaseIcon />
          </span>
          <h3 style={{ marginTop: 17 }}>A well-kept diary starts here.</h3>
          <p>
            Add the essentials now. Documents, hearing updates, and
            collaborators can be added at any time.
          </p>
          <div className="notice" style={{ margin: 0 }}>
            <ShieldCheck size={17} />
            <span>
              Only this workspace’s sample members appear in this demo. Real
              access control requires a backend.
            </span>
          </div>
          <div style={{ fontSize: 10, color: "#8a967e", marginTop: 20 }}>
            Fields marked * are required.
          </div>
        </aside>
      </div>
    </>
  );
}
function BriefcaseIcon() {
  return <FolderOpen size={20} />;
}
export function CaseDetails() {
  const { id } = useParams();
  const { data, update, notify, log } = useStore();
  const c = data.cases.find((x) => x.id === id);
  const [tab, setTab] = useState("Overview");
  const [hearingModal, setHearingModal] = useState(false);
  const [archive, setArchive] = useState(false);
  const [entry, setEntry] = useState({
    date: todayISO(),
    proceeding: "",
    notes: "",
    next: "",
  });
  if (!c)
    return (
      <EmptyState
        title="This case isn’t available"
        description="It may belong to another demo workspace, or the page may have been refreshed."
        action={
          <Link to="/cases" className="button primary">
            Back to my cases
          </Link>
        }
      />
    );
  const documents = data.documents.filter((d) => d.caseId === c.id);
  const tasks = data.tasks.filter((t) => t.caseId === c.id);
  const addHearing = (e: FormEvent) => {
    e.preventDefault();
    const hearing: Hearing = {
      ...entry,
      id: uid(),
      author: data.profile.name,
      created: new Date().toISOString(),
    };
    update((d) => ({
      ...d,
      cases: d.cases.map((x) => (x.id === id ? appendHearing(x, hearing) : x)),
    }));
    log(`Hearing update added to ${c.number}`);
    notify("Hearing added. Previous records have been preserved.");
    setHearingModal(false);
    setTab("Hearing history");
  };
  return (
    <>
      <Link className="text-link" to="/cases" style={{ marginBottom: 20 }}>
        <ArrowLeft size={13} />
        My cases
      </Link>
      <PageHeader
        eyebrow={`${c.type.toUpperCase()} CASE · ${c.number}`}
        title={`${c.party} vs. ${c.opposite}`}
        description={c.court}
        actions={
          <>
            <Link className="button secondary" to={`/cases/${c.id}/edit`}>
              <Pencil size={14} />
              Edit case
            </Link>
            <Button onClick={() => setHearingModal(true)}>
              <Plus size={14} />
              Add hearing update
            </Button>
          </>
        }
      />
      <dl className="panel detail-summary">
        <div>
          <dt>CASE STATUS</dt>
          <dd>
            <Badge>{c.status}</Badge>
          </dd>
        </div>
        <div>
          <dt>NEXT HEARING</dt>
          <dd>
            <CalendarDays size={13} /> {formatDate(c.hearing)}
            <small className="muted" style={{ display: "block", marginTop: 5 }}>
              {formatTime(c.time)} · Bangladesh time
            </small>
          </dd>
        </div>
        <div>
          <dt>RESPONSIBLE ADVOCATE</dt>
          <dd style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <Avatar name={c.advocate || "Unassigned"} size="small" />
            {c.advocate || "Unassigned"}
          </dd>
        </div>
        <div>
          <dt>FILED ON</dt>
          <dd>{formatDate(c.filed)}</dd>
        </div>
      </dl>
      <Panel>
        <Tabs
          items={[
            "Overview",
            "Hearing history",
            "Documents",
            "Tasks",
            "Access & collaboration",
          ]}
          value={tab}
          onChange={setTab}
        />
        <div className="detail-content">
          {tab === "Overview" && (
            <div className="detail-grid">
              <div>
                <h2>Case overview</h2>
                <p style={{ margin: "15px 0 24px" }}>
                  {c.notes || "No case notes yet. Add context using Edit case."}
                </p>
                <h3 style={{ marginBottom: 15 }}>Latest proceeding</h3>
                <div className="notice">
                  <Landmark size={18} />
                  <span>
                    <strong>{c.proceeding || "Not recorded"}</strong>
                    <br />
                    Next hearing: {formatDate(c.hearing)}
                  </span>
                </div>
                <TextLink to={`/cases/${c.id}/edit`}>
                  Update case details
                </TextLink>
              </div>
              <div className="stack">
                <h3>Keep things moving</h3>
                <Link
                  className="button secondary"
                  to={`/reminders?new=1&case=${c.id}`}
                >
                  <Bell size={14} />
                  Set a reminder
                </Link>
                <Link
                  className="button secondary"
                  to={`/documents?upload=1&case=${c.id}`}
                >
                  <Upload size={14} />
                  Upload a document
                </Link>
                <Link
                  className="button secondary"
                  to={`/tasks?new=1&case=${c.id}`}
                >
                  <Plus size={14} />
                  Create a task
                </Link>
                {!["Closed", "Archived"].includes(c.status) && (
                  <Button variant="ghost" onClick={() => setArchive(true)}>
                    <Archive size={14} />
                    Close or archive case
                  </Button>
                )}
              </div>
            </div>
          )}
          {tab === "Hearing history" && (
            <>
              <div className="notice">
                <Info size={16} />A chronological record of every update. New
                entries never overwrite previous hearings.
              </div>
              <div className="timeline">
                {[...c.history]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((h) => (
                    <article className="timeline-entry" key={h.id}>
                      <div className="eyebrow" style={{ fontSize: 9 }}>
                        {formatDate(h.date)}
                      </div>
                      <h3>{h.proceeding}</h3>
                      <p>{h.notes || "No additional notes."}</p>
                      <Badge tone="info">Next: {formatDate(h.next)}</Badge>
                      <small>
                        Added by {h.author} · {formatDate(h.created)}
                      </small>
                    </article>
                  ))}
              </div>
              {!c.history.length && (
                <EmptyState
                  title="A fresh start"
                  description="Add the first hearing update to begin a chronological record."
                />
              )}
              <Button variant="secondary" onClick={() => setHearingModal(true)}>
                <Plus size={14} />
                Add hearing update
              </Button>
            </>
          )}
          {tab === "Documents" && (
            <>
              <div className="header-actions" style={{ marginBottom: 20 }}>
                <Link
                  to={`/documents?upload=1&case=${c.id}`}
                  className="button primary"
                >
                  <Upload size={14} />
                  Upload document
                </Link>
                <TextLink to={`/documents?case=${c.id}`}>
                  Open document library
                </TextLink>
              </div>
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="member-row record-card"
                  data-tone={d.sample ? "pending" : "closed"}
                >
                  <FileText size={24} />
                  <div>
                    <h3>{d.name}</h3>
                    <p>
                      {d.category} · {formatDate(d.date)} ·{" "}
                      {d.sample ? "Sample document" : "Local file"}
                    </p>
                  </div>
                  <Link
                    className="button secondary"
                    to={`/documents?case=${c.id}`}
                  >
                    View
                  </Link>
                </div>
              ))}
              {!documents.length && (
                <EmptyState
                  title="A place for every document"
                  description="Upload a court order, petition, or supporting file for this case."
                />
              )}
            </>
          )}
          {tab === "Tasks" && (
            <>
              <div className="header-actions" style={{ marginBottom: 20 }}>
                <Link
                  className="button primary"
                  to={`/tasks?new=1&case=${c.id}`}
                >
                  <Plus size={14} />
                  Add task
                </Link>
              </div>
              {tasks.map((t) => (
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
                    </span>
                    <span className="record-badges">
                      <ActionStatus done={t.done} due={t.due} />
                      <Badge>{t.priority}</Badge>
                    </span>
                  </div>
                </div>
              ))}
              {!tasks.length && (
                <EmptyState
                  title="Nothing left on the list"
                  description="Create a task to track the next step for this case."
                />
              )}
            </>
          )}
          {tab === "Access & collaboration" && (
            <>
              <div className="notice">
                <ShieldCheck size={16} />
                This preview shows sample access. A case invitation never grants
                access to unrelated cases. Real invitations and permission
                enforcement require a connected backend.
              </div>
              <h3 style={{ marginBottom: 15 }}>People on this case</h3>
              {data.members
                .filter((m) => m.role === "Owner" || m.name === c.advocate)
                .map((m, i) => (
                  <div
                    className="member-row record-card"
                    key={m.id}
                    data-tone={m.status.toLowerCase()}
                  >
                    <Avatar name={m.name} index={i} />
                    <div>
                      <h3>{m.name}</h3>
                      <p>{m.email}</p>
                    </div>
                    <Badge>{m.role}</Badge>
                  </div>
                ))}
              <div style={{ marginTop: 22 }}>
                <Link to="/team" className="button secondary">
                  <Users size={14} />
                  Manage collaboration
                </Link>
              </div>
            </>
          )}
        </div>
      </Panel>
      {hearingModal && (
        <Modal
          title="Add a hearing update"
          description={`${c.number} · Keep a clear record of today’s progress.`}
          onClose={() => setHearingModal(false)}
        >
          <form onSubmit={addHearing}>
            <div className="form-grid">
              <Field label="Hearing date *">
                <input
                  type="date"
                  required
                  value={entry.date}
                  onChange={(e) => setEntry({ ...entry, date: e.target.value })}
                />
              </Field>
              <Field label="Next hearing date">
                <input
                  type="date"
                  min={entry.date}
                  value={entry.next}
                  onChange={(e) => setEntry({ ...entry, next: e.target.value })}
                />
              </Field>
              <Field label="Step / proceeding *" className="full">
                <input
                  required
                  value={entry.proceeding}
                  onChange={(e) =>
                    setEntry({ ...entry, proceeding: e.target.value })
                  }
                  placeholder="e.g. Witness examination"
                />
              </Field>
              <Field label="Notes / outcome" className="full">
                <textarea
                  value={entry.notes}
                  onChange={(e) =>
                    setEntry({ ...entry, notes: e.target.value })
                  }
                  placeholder="What happened at this hearing?"
                />
              </Field>
            </div>
            <div className="form-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setHearingModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add to history</Button>
            </div>
          </form>
        </Modal>
      )}
      {archive && (
        <Modal
          title="Keep the record. Close the chapter."
          description="Closing or archiving removes this case from the active allowance. All documents and hearing history stay available."
          onClose={() => setArchive(false)}
        >
          <div className="form-actions">
            {(["Closed", "Archived"] as const).map((status) => (
              <Button
                key={status}
                variant={status === "Closed" ? "primary" : "secondary"}
                onClick={() => {
                  update((d) => ({
                    ...d,
                    cases: d.cases.map((x) =>
                      x.id === id ? { ...x, status, updated: todayISO() } : x,
                    ),
                  }));
                  log(`${c.number} marked ${status.toLowerCase()}`);
                  notify(
                    `Case ${status.toLowerCase()}. All records preserved.`,
                  );
                  setArchive(false);
                }}
              >
                {status === "Closed" ? "Close case" : "Archive case"}
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
