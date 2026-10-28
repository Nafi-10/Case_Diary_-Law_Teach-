import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Check,
  CreditCard,
  Crown,
  Download,
  FileText,
  HelpCircle,
  Info,
  LockKeyhole,
  Mail,
  Plus,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Field,
  Modal,
  PageHeader,
  Panel,
  downloadText,
} from "../components/ui";
import { useStore } from "../store";
import {
  activeLimit,
  countOwnedActiveCases,
  PLANS,
  profileFields,
} from "../domain";
import { uid } from "../data/demo";
import type { AccountType, Member, Plan } from "../types";

const roleHelp: Record<Member["role"], string> = {
  Owner: "Manages workspace, billing, members, and all workspace cases.",
  Admin: "Manages members and workspace cases. Cannot transfer ownership.",
  Advocate: "Works on assigned cases, hearing updates, and related documents.",
  Assistant:
    "Updates assigned tasks and documents. Cannot manage billing or access.",
  Viewer: "Reads explicitly shared cases and their permitted documents.",
};
export function Team() {
  const { data, account, update, notify, log } = useStore();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({
    name: "",
    email: "",
    role: "Viewer" as Member["role"],
    scope: "",
  });
  const [error, setError] = useState("");
  const [roleChange, setRoleChange] = useState<{
    id: string;
    role: Member["role"];
  } | null>(null);
  const plan = PLANS[account].find((p) => p.name === data.plan)!;
  return (
    <>
      <PageHeader
        eyebrow="GOOD WORK, TOGETHER"
        title={
          account === "advocate" ? "Team & collaboration" : "Family & members"
        }
        description="The right people. The right access. A shared sense of progress."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={14} />
            Prepare invitation
          </Button>
        }
      />
      <div className="notice">
        <ShieldCheck size={17} />
        <span>
          Demo access preview. Invitations are saved as local drafts and are not
          emailed. Each person needs an individual login; a shared case does not
          grant workspace-wide access.
        </span>
      </div>
      <div className="detail-grid">
        <Panel
          title="Workspace members"
          meta={
            <span className="count">
              {data.members.filter((m) => m.status === "Active").length} /{" "}
              {plan.users} seats
            </span>
          }
        >
          <div className="member-list">
            {data.members.map((m, i) => (
              <div
                className="member-row record-card"
                key={m.id}
                data-tone={m.status.toLowerCase()}
              >
                <Avatar name={m.name} index={i} />
                <div>
                  <h3>{m.name}</h3>
                  <p>{m.email}</p>
                  <p>
                    {m.scope}{" "}
                    {m.status === "Pending" ? "· Local invitation draft" : ""}
                  </p>
                </div>
                {m.role === "Owner" ? (
                  <Badge>Owner</Badge>
                ) : (
                  <select
                    aria-label={`Role for ${m.name}`}
                    value={m.role}
                    onChange={(e) =>
                      setRoleChange({
                        id: m.id,
                        role: e.target.value as Member["role"],
                      })
                    }
                  >
                    {(["Admin", "Advocate", "Assistant", "Viewer"] as const)
                      .filter((r) => account === "advocate" || r !== "Advocate")
                      .map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                  </select>
                )}
                <Badge tone={m.status === "Pending" ? "warning" : ""}>
                  {m.status === "Pending" ? "Draft" : m.status}
                </Badge>
              </div>
            ))}
          </div>
          <div
            className="panel-body"
            style={{ paddingTop: 20, fontSize: 11, color: "#829275" }}
          >
            Workspace case allowance belongs to the owning workspace.
            Collaborators do not duplicate the case count.
          </div>
        </Panel>
        <Panel title="Permission guide">
          <div className="panel-body">
            {Object.entries(roleHelp).map(([role, help]) => (
              <div key={role} style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 12, marginBottom: 5 }}>{role}</h3>
                <p style={{ fontSize: 10, lineHeight: 1.8 }}>{help}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      {open && (
        <Modal
          title="Prepare an invitation"
          description="Choose a specific case or workspace scope. This creates a local draft only."
          onClose={() => setOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!v.name.trim()) return;
              if (
                data.members.some(
                  (m) => m.email.toLowerCase() === v.email.toLowerCase().trim(),
                )
              ) {
                setError("This email is already listed in the workspace.");
                return;
              }
              if (data.members.length >= plan.users) {
                setError(
                  `Your ${plan.name} demo has ${plan.users} seats. Select a larger demo plan to preview another member.`,
                );
                return;
              }
              update((d) => ({
                ...d,
                members: [
                  ...d.members,
                  {
                    ...v,
                    name: v.name.trim(),
                    email: v.email.trim(),
                    id: uid(),
                    status: "Pending",
                  },
                ],
              }));
              log(`Invitation draft prepared for ${v.name}`);
              notify("Invitation draft saved locally. No email has been sent.");
              setOpen(false);
              setV({ name: "", email: "", role: "Viewer", scope: "" });
            }}
          >
            {error && (
              <div className="notice warning" role="alert">
                {error}
              </div>
            )}
            <div className="form-grid">
              <Field label="Name *">
                <input
                  required
                  value={v.name}
                  onChange={(e) => setV({ ...v, name: e.target.value })}
                />
              </Field>
              <Field label="Email *">
                <input
                  type="email"
                  required
                  value={v.email}
                  onChange={(e) => setV({ ...v, email: e.target.value })}
                />
              </Field>
              <Field label="Role">
                <select
                  value={v.role}
                  onChange={(e) =>
                    setV({ ...v, role: e.target.value as Member["role"] })
                  }
                >
                  {["Admin", "Advocate", "Assistant", "Viewer"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="Access scope *">
                <select
                  value={v.scope}
                  required
                  onChange={(e) => setV({ ...v, scope: e.target.value })}
                >
                  <option value="">Choose a scope</option>
                  <option value="Workspace">Entire workspace</option>
                  {data.cases.map((c) => (
                    <option key={c.id} value={c.number}>
                      {c.number} only
                    </option>
                  ))}
                </select>
              </Field>
              <div className="notice full" style={{ marginBottom: 0 }}>
                <Info size={15} />
                {roleHelp[v.role]}
              </div>
            </div>
            <div className="form-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save invitation draft</Button>
            </div>
          </form>
        </Modal>
      )}
      {roleChange && (
        <Modal
          title="Preview a role change"
          description="This updates the sample member’s role. It does not change access in any real system."
          onClose={() => setRoleChange(null)}
        >
          <div className="notice">{roleHelp[roleChange.role]}</div>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setRoleChange(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                update((d) => ({
                  ...d,
                  members: d.members.map((m) =>
                    m.id === roleChange.id
                      ? { ...m, role: roleChange.role }
                      : m,
                  ),
                }));
                notify(
                  "Demo role updated. Backend permission enforcement is not configured.",
                );
                setRoleChange(null);
              }}
            >
              Update demo role
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export function PlanCards({
  account,
  current,
  onChoose,
  compact = false,
}: {
  account: AccountType;
  current?: string;
  onChoose: (p: Plan) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`pricing-grid reference-plans ${compact ? "compact-plans" : "public-plan-grid"}`}
    >
      {PLANS[account].map((p) => (
        <article
          key={p.name}
          className={`plan-card ${p.recommended ? "recommended" : ""}`}
        >
          {p.recommended && (
            <div className="recommended-label">RECOMMENDED</div>
          )}
          {p.recommended && (
            <span className="plan-ribbon" aria-hidden="true">
              Popular
            </span>
          )}
          <div className="plan-card-heading">
            <h3>{p.name}</h3>
            {p.recommended ? (
              <Crown size={18} />
            ) : p.users > 1 ? (
              <Users size={18} />
            ) : (
              <FileText size={18} />
            )}
          </div>
          <ul>
            <li>
              <Check />
              {p.cases.toLocaleString()} active{" "}
              {p.cases === 1 ? "case" : "cases"}
            </li>
            <li>
              <Check />
              {p.users === 1 ? "1 individual user" : `Up to ${p.users} members`}
            </li>
            {!compact && (
              <li>
                <Check />
                Hearing calendar & reminders
              </li>
            )}
            {!compact && (
              <li>
                <Check />
                Case documents & history
              </li>
            )}
            {p.users > 1 && (
              <li>
                <Check />
                Shared workspace
              </li>
            )}
            {p.bonus && (
              <li>
                <Check />
                {compact
                  ? `${p.bonus} cases with profile bonus*`
                  : `${p.bonus} cases after qualifying profile completion`}
              </li>
            )}
          </ul>
          <Button
            variant={
              p.name === current
                ? "secondary"
                : p.recommended
                  ? "primary"
                  : "secondary"
            }
            onClick={() => onChoose(p)}
            disabled={p.name === current}
          >
            {p.name === current
              ? compact
                ? "Current plan"
                : "Current demo plan"
              : p.price === 0
                ? "Start free"
                : `Choose ${p.name}`}
          </Button>
          <div className="plan-price">
            <span>৳{p.price.toLocaleString("en-BD")}</span>
            <small> / month</small>
            <p>
              {p.price === 0 ? "Free to get started" : "Billed monthly · BDT"}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
export function Billing() {
  const { data, account, update, notify } = useStore();
  const [selected, setSelected] = useState<Plan | null>(null);
  const [cancel, setCancel] = useState(false);
  const [history, setHistory] = useState(false);
  const plan = PLANS[account].find((p) => p.name === data.plan)!;
  const active = countOwnedActiveCases(data.cases);
  const limit = activeLimit(plan, data.profile);
  const overLimit = active > limit || data.members.length > plan.users;
  return (
    <div className="billing-page viewport-page">
      <PageHeader
        eyebrow="ROOM TO GROW"
        title="Subscription & billing"
        description="Compare plans, check your usage and manage billing."
        actions={
          <Button variant="secondary" onClick={() => setHistory(true)}>
            <CreditCard size={15} />
            Billing details
          </Button>
        }
      />
      <div className={`notice billing-notice ${overLimit ? "warning" : ""}`}>
        <CreditCard size={17} />
        <span>
          {overLimit
            ? "Demo limit exceeded. Existing records stay available; choose a larger plan to add more. No charges."
            : "Demo billing · Try any plan below. No payment is taken; changes last for this session."}
        </span>
      </div>
      <div className="billing-overview">
        <Panel
          title="Your current plan"
          action={
            <div className="current-plan-actions">
              <Badge>Demo</Badge>
              <Button
                variant="ghost"
                className="small"
                onClick={() => setCancel(true)}
              >
                Cancellation options
              </Button>
            </div>
          }
          className="current-plan-panel"
        >
          <div className="panel-body">
            <div className="current-plan-summary">
              <span
                className="stat-icon gold"
                style={{ width: 48, height: 48 }}
              >
                <Crown size={23} />
              </span>
              <div>
                <h2 style={{ fontSize: 24 }}>{plan.name}</h2>
                <p style={{ fontSize: 11 }}>
                  ৳{plan.price.toLocaleString("en-BD")} / month ·{" "}
                  {account === "advocate"
                    ? "Advocate / Law Chamber"
                    : "Common Person"}
                </p>
              </div>
            </div>
          </div>
        </Panel>
        <Panel title="Workspace usage" className="workspace-usage-panel">
          <div className="panel-body usage-columns">
            {[
              { label: "Active cases", used: active, max: limit },
              {
                label: "Members & invite drafts",
                used: data.members.length,
                max: plan.users,
              },
            ].map((u) => (
              <div className="usage-row" key={u.label}>
                <div>
                  <span>{u.label}</span>
                  <small>
                    {u.used} / {u.max.toLocaleString()}
                  </small>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (u.used / u.max) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="usage-row">
              <div>
                <span>Documents</span>
                <small>{data.documents.length} session files</small>
              </div>
              <p style={{ fontSize: 10, marginTop: 10 }}>
                Files are stored for this session only.
              </p>
            </div>
          </div>
        </Panel>
      </div>
      <section id="plans" className="billing-plans">
        <div className="plans-heading">
          <h2>Compare plans</h2>
          <span>Monthly prices · Bangladeshi Taka (৳)</span>
        </div>
        <PlanCards
          account={account}
          current={data.plan}
          onChoose={setSelected}
          compact
        />
      </section>
      <div className="billing-footnotes">
        <p>
          <Check size={14} />
          Every plan includes a hearing calendar, reminders, documents and case
          history.
        </p>
        {account === "advocate" && (
          <small>
            * Profile bonuses require qualifying validation; completing a
            profile does not verify professional status.
          </small>
        )}
      </div>
      {history && (
        <Modal
          title="Billing details & payment history"
          description="This workspace uses a demo subscription."
          onClose={() => setHistory(false)}
        >
          <dl className="billing-details">
            <div>
              <dt>Payment method</dt>
              <dd>Not connected</dd>
            </div>
            <div>
              <dt>Next renewal</dt>
              <dd>Not scheduled</dd>
            </div>
            <div>
              <dt>Billing status</dt>
              <dd>Demo only · No charges</dd>
            </div>
          </dl>
          <div className="compact-empty">
            <CreditCard size={24} />
            <strong>No transactions yet</strong>
            <p>Payment history will appear when billing is connected.</p>
          </div>
          <div className="form-actions">
            <Button onClick={() => setHistory(false)}>Done</Button>
          </div>
        </Modal>
      )}
      {selected && (
        <Modal
          title={`Preview the ${selected.name} plan`}
          description={`৳${selected.price.toLocaleString("en-BD")} per month · ${selected.users} ${selected.users === 1 ? "user" : "users"} · ${selected.cases} active cases`}
          onClose={() => setSelected(null)}
        >
          <div className="notice">
            <Info size={17} />
            This only changes the plan used by the demo. No payment or
            subscription transaction takes place. Cases and documents are always
            preserved.
          </div>
          {(active > selected.cases ||
            data.members.length > selected.users) && (
            <div className="notice warning">
              Your current usage exceeds this plan. New cases or invitations
              will be restricted, while your existing records remain available.
            </div>
          )}
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Keep current plan
            </Button>
            <Button
              onClick={() => {
                update((d) => ({ ...d, plan: selected.name }));
                notify(
                  `${selected.name} demo plan applied. No charge or real subscription change.`,
                );
                setSelected(null);
              }}
            >
              Apply to demo
            </Button>
          </div>
        </Modal>
      )}
      {cancel && (
        <Modal
          title="Your records come first"
          description="No paid subscription exists in this demo."
          onClose={() => setCancel(false)}
        >
          <p style={{ fontSize: 12, lineHeight: 1.9 }}>
            In a connected product, cancellation takes effect according to the
            billing period. Legal records must remain available in a disclosed
            restricted or read-only mode. They are never deleted to enforce a
            plan limit.
          </p>
          <div className="form-actions">
            <Button onClick={() => setCancel(false)}>Understood</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export function Profile() {
  const { data, account, update, notify } = useStore();
  const [v, setV] = useState({ ...data.profile });
  const [error, setError] = useState("");
  const filled = profileFields(v);
  const plan = PLANS[account].find((p) => p.name === data.plan)!;
  const fileChange = (file: File | undefined, key: "proof" | "image") => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Files must be 10 MB or smaller.");
      return;
    }
    setError("");
    setV({ ...v, [key]: file.name });
  };
  return (
    <>
      <PageHeader
        eyebrow="A LITTLE ABOUT YOU"
        title={account === "advocate" ? "Advocate profile" : "My profile"}
        description="The person behind the practice. Keep your details up to date."
      />
      <div className="detail-grid">
        <Panel>
          <div className="settings-body">
            <div className="profile-banner">
              <Avatar name={v.name} size="xlarge" />
              <div>
                <h2>{v.name}</h2>
                <p>
                  {account === "advocate"
                    ? "Advocate / Law Chamber"
                    : "Common Person"}{" "}
                  · Workspace owner
                </p>
                {account === "advocate" && (
                  <Badge tone="warning">{v.verification}</Badge>
                )}
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!v.name.trim()) {
                  setError("Enter your name.");
                  return;
                }
                update((d) => ({
                  ...d,
                  profile: { ...v, name: v.name.trim(), bonusEligible: false },
                }));
                notify(
                  "Profile updated for this demo session. Professional verification has not been requested.",
                );
              }}
            >
              {error && (
                <div className="notice warning" role="alert">
                  {error}
                </div>
              )}
              <div className="form-grid">
                <Field label="Full name *">
                  <input
                    required
                    value={v.name}
                    onChange={(e) => setV({ ...v, name: e.target.value })}
                  />
                </Field>
                <Field label="Email address *">
                  <input
                    required
                    type="email"
                    value={v.email}
                    onChange={(e) => setV({ ...v, email: e.target.value })}
                  />
                </Field>
                <Field label="Phone number">
                  <input
                    type="tel"
                    value={v.phone}
                    onChange={(e) => setV({ ...v, phone: e.target.value })}
                    placeholder="+880"
                  />
                </Field>
                <Field
                  label={
                    account === "advocate" ? "Practice location" : "Location"
                  }
                >
                  <input
                    value={v.location}
                    onChange={(e) => setV({ ...v, location: e.target.value })}
                  />
                </Field>
                <Field
                  label="Profile image"
                  hint={
                    v.image
                      ? `Selected: ${v.image} (metadata only)`
                      : "JPG or PNG, up to 10 MB. Metadata is kept only for this demo."
                  }
                  className="full"
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => fileChange(e.target.files?.[0], "image")}
                  />
                </Field>
                {account === "advocate" && (
                  <>
                    <Field label="Bar Council enrollment number">
                      <input
                        value={v.enrollment}
                        onChange={(e) =>
                          setV({ ...v, enrollment: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Bar association">
                      <input
                        value={v.association}
                        onChange={(e) =>
                          setV({ ...v, association: e.target.value })
                        }
                      />
                    </Field>
                    <Field
                      label="Proof of enrollment"
                      className="full"
                      hint={
                        v.proof
                          ? `Selected: ${v.proof} (not submitted)`
                          : "PDF, JPG, or PNG, up to 10 MB. File selection does not submit a verification request."
                      }
                    >
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          fileChange(e.target.files?.[0], "proof")
                        }
                      />
                    </Field>
                  </>
                )}
              </div>
              <div className="form-actions">
                <Button type="submit">Save profile in demo</Button>
              </div>
            </form>
          </div>
        </Panel>
        <div className="stack">
          {account === "advocate" ? (
            <>
              <Panel title="Profile completion">
                <div className="panel-body">
                  <span className="report-number">
                    {Math.round((filled.filter(Boolean).length / 5) * 100)}
                    <small>%</small>
                  </span>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${filled.filter(Boolean).length * 20}%`,
                      }}
                    />
                  </div>
                  {[
                    "Enrollment number",
                    "Bar association",
                    "Practice location",
                    "Proof of enrollment",
                    "Profile image",
                  ].map((label, i) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 15,
                        fontSize: 11,
                        color: filled[i] ? "#547440" : "#9a967e",
                      }}
                    >
                      {filled[i] ? (
                        <Check size={14} />
                      ) : (
                        <span style={{ width: 14 }}>○</span>
                      )}
                      {label}
                    </div>
                  ))}
                  {plan.bonus && (
                    <div className="notice" style={{ margin: "24px 0 0" }}>
                      Your {plan.name} allowance can grow from {plan.cases} to{" "}
                      {plan.bonus} active cases after the required profile
                      information is validated. Current limit:{" "}
                      {activeLimit(plan, data.profile)}.
                    </div>
                  )}
                </div>
              </Panel>
              <div className="notice warning">
                <ShieldCheck size={18} />
                <span>
                  Profile completion is separate from professional verification.
                  This demo does not validate enrollment, award the profile
                  bonus, or certify an advocate.
                </span>
              </div>
            </>
          ) : (
            <Panel title="Made for your everyday">
              <div className="panel-body">
                <p style={{ fontSize: 12, lineHeight: 1.9 }}>
                  You don’t need professional enrollment details to keep track
                  of your own legal matters. Add your cases, set reminders, and
                  work with people you trust.
                </p>
                <Link
                  className="button secondary"
                  to="/cases"
                  style={{ marginTop: 20 }}
                >
                  Explore your cases
                </Link>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
export function Settings() {
  const { data, update, notify, reset } = useStore();
  const [section, setSection] = useState("Personal account");
  const [workspace, setWorkspace] = useState(data.name);
  const [resetOpen, setResetOpen] = useState(false);
  const [email, setEmail] = useState(data.profile.email);
  return (
    <>
      <PageHeader
        eyebrow="MAKE YOURSELF AT HOME"
        title="Settings"
        description="A workspace that feels right for the way you work."
      />
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections">
          {[
            "Personal account",
            "Security",
            "Notifications",
            "Workspace",
            "Data & privacy",
          ].map((s) => (
            <button
              key={s}
              className={section === s ? "active" : ""}
              onClick={() => setSection(s)}
            >
              {s}
            </button>
          ))}
        </nav>
        <Panel>
          <div className="settings-body">
            {section === "Personal account" && (
              <>
                <h2>Personal account</h2>
                <p>
                  Your individual identity, separate from the workspaces you
                  belong to.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    update((d) => ({ ...d, profile: { ...d.profile, email } }));
                    notify(
                      "Demo contact email updated. Email ownership has not been verified.",
                    );
                  }}
                >
                  <Field label="Contact email">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <div className="notice" style={{ marginTop: 20 }}>
                    This is a local contact-field preview, not a login-email
                    change. Real account changes require email ownership
                    verification.
                  </div>
                  <div className="header-actions">
                    <Button type="submit">Save in demo</Button>
                    <Link className="button secondary" to="/profile">
                      Edit full profile
                    </Link>
                  </div>
                </form>
              </>
            )}
            {section === "Security" && (
              <>
                <h2>Security & sign-in</h2>
                <p>
                  Authentication must be connected before these settings can be
                  enabled.
                </p>
                {[
                  ["Password", "No password account is created in this demo."],
                  ["Google account", "OAuth provider is not configured."],
                  [
                    "Multi-factor authentication",
                    "Requires an identity provider.",
                  ],
                  ["Active sessions", "Session management is not configured."],
                  ["Account recovery", "Recovery emails are not configured."],
                ].map(([title, desc]) => (
                  <div className="toggle-row" key={title}>
                    <div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                    <Badge tone="warning">Not connected</Badge>
                  </div>
                ))}
                <div className="notice" style={{ marginTop: 25 }}>
                  <LockKeyhole size={18} />
                  Passwords are never stored or logged by this frontend.
                  Production authentication and session enforcement belong on
                  the server.
                </div>
              </>
            )}
            {section === "Notifications" && (
              <>
                <h2>A thoughtful amount of notice</h2>
                <p>
                  Choose what you want to see in your workspace. Preferences
                  last for this demo session.
                </p>
                {(
                  [
                    [
                      "hearings",
                      "Hearing reminders",
                      "Keep upcoming court dates in view.",
                    ],
                    ["tasks", "Task reminders", "A prompt for the next step."],
                    [
                      "updates",
                      "Case updates & invitations",
                      "Follow activity from your collaborators.",
                    ],
                  ] as const
                ).map(([key, title, desc]) => (
                  <div className="toggle-row" key={key}>
                    <div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={data.notificationPreferences[key]}
                      aria-label={title}
                      className={`toggle ${data.notificationPreferences[key] ? "on" : ""}`}
                      onClick={() => {
                        update((d) => ({
                          ...d,
                          notificationPreferences: {
                            ...d.notificationPreferences,
                            [key]: !d.notificationPreferences[key],
                          },
                        }));
                        notify(
                          "Demo preference updated. Notification delivery is not configured.",
                        );
                      }}
                    />
                  </div>
                ))}
                <div className="notice warning" style={{ marginTop: 24 }}>
                  <Mail size={16} />
                  Email, push, and SMS delivery are not connected. These
                  controls preview saved preferences only.
                </div>
              </>
            )}
            {section === "Workspace" && (
              <>
                <h2>Your shared working space</h2>
                <p>
                  Cases, members, and subscriptions belong to the workspace.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!workspace.trim()) return;
                    update((d) => ({ ...d, name: workspace.trim() }));
                    notify("Workspace name updated in this session.");
                  }}
                >
                  <Field label="Workspace name *">
                    <input
                      required
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                    />
                  </Field>
                  <div className="form-actions">
                    <Button type="submit">Save workspace</Button>
                  </div>
                </form>
                <div className="header-actions" style={{ marginTop: 23 }}>
                  <Link className="button secondary" to="/team">
                    <Users size={14} />
                    Manage members
                  </Link>
                  <Link className="button secondary" to="/billing">
                    <CreditCard size={14} />
                    Subscription
                  </Link>
                </div>
              </>
            )}
            {section === "Data & privacy" && (
              <>
                <h2>Your records stay yours</h2>
                <p>
                  This preview uses in-memory data. Refreshing resets the
                  workspace, including selected files.
                </p>
                <div className="notice">
                  <Info size={16} />
                  No authentication, secure persistence, or production access
                  controls are configured. Do not enter confidential information
                  in this preview.
                </div>
                <div className="header-actions">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const safe = {
                        ...data,
                        documents: data.documents.map(({ url, ...doc }) => ({
                          ...doc,
                          fileAvailableInExport: false,
                          wasLocal: Boolean(url),
                        })),
                      };
                      downloadText(
                        "case-diary-demo-export.json",
                        JSON.stringify(safe, null, 2),
                        "application/json",
                      );
                    }}
                  >
                    <Download size={14} />
                    Export demo data
                  </Button>
                  <Button variant="ghost" onClick={() => setResetOpen(true)}>
                    Reset demo workspace
                  </Button>
                </div>
                <div className="toggle-row">
                  <div>
                    <h3>Workspace closure</h3>
                    <p>
                      Not available until a backend and record-retention policy
                      are configured.
                    </p>
                  </div>
                  <Badge tone="warning">Not connected</Badge>
                </div>
              </>
            )}
          </div>
        </Panel>
      </div>
      {resetOpen && (
        <Modal
          title="Reset the demo?"
          description="This removes session edits and local file references, then restores the original sample workspaces. Download any demo data you want to keep first."
          onClose={() => setResetOpen(false)}
        >
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Keep my changes
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                reset();
                setResetOpen(false);
                notify("Demo workspaces restored.");
              }}
            >
              Reset sample data
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
export const faqItems = [
  [
    "How do I add my first case?",
    "Open My Cases and choose Add new case. Enter the case number, court, party name, and opposite party. Hearing dates, documents, and notes can be added now or later.",
  ],
  [
    "Can advocates and clients work together?",
    "Yes. The interface distinguishes a person’s account from the workspace and allows case-specific collaboration. An invitation to one case does not grant access to unrelated cases. Real invitations require a backend.",
  ],
  [
    "What happens if I exceed a plan limit?",
    "Existing records are preserved. The demo restricts creation of additional active cases or member drafts until your usage fits the selected plan.",
  ],
  [
    "Does profile completion mean professional verification?",
    "No. Profile completeness, qualifying profile validation, and professional verification are separate. Uploading a file or filling a form does not certify an advocate.",
  ],
  [
    "Will the demo send reminders or charge me?",
    "No. Reminder delivery, authentication, payment processing, and email invitations are not connected. Data stays in memory and resets on refresh.",
  ],
  [
    "Can I use Bangla names?",
    "Yes. Unicode names and notes are accepted. Dates use readable Bangladeshi conventions; a full Bangla translation is a future integration.",
  ],
];
export function Help() {
  return (
    <>
      <PageHeader
        eyebrow="A LITTLE GUIDANCE"
        title="Help & support"
        description="Clear answers, so you can get back to what matters."
      />
      <div className="help-grid">
        {[
          {
            icon: BookOpen,
            title: "Start with your first case",
            text: "A few essential details are all it takes to bring a matter into focus.",
            link: "/cases/new",
            label: "Add a case",
          },
          {
            icon: Users,
            title: "Work better, together",
            text: "Understand individual roles, workspace seats, and case-specific access.",
            link: "/team",
            label: "Explore collaboration",
          },
          {
            icon: Settings2,
            title: "Make it your own",
            text: "Update your profile, preferences, and workspace details.",
            link: "/settings",
            label: "Open settings",
          },
        ].map(({ icon: Icon, title, text, link, label }) => (
          <Panel key={title} className="help-card">
            <Icon size={26} />
            <h3>{title}</h3>
            <p>{text}</p>
            <Link className="text-link" style={{ marginTop: 18 }} to={link}>
              {label} →
            </Link>
          </Panel>
        ))}
      </div>
      <Panel title="Questions, answered">
        <div className="panel-body">
          {faqItems.map(([q, a]) => (
            <details className="faq" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </Panel>
      <div className="notice" style={{ marginTop: 24 }}>
        <HelpCircle size={17} />
        Support contact details are not configured. This is a product preview;
        the help content above is available locally.
      </div>
      <div className="header-actions">
        <Link className="button secondary" to="/welcome">
          Visit public website
        </Link>
        <Link className="button ghost" to="/privacy">
          <FileText size={14} />
          Privacy notice
        </Link>
        <Link className="button ghost" to="/terms">
          Terms preview
        </Link>
      </div>
    </>
  );
}
