import { useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  FolderOpen,
  Landmark,
  Leaf,
  LockKeyhole,
  Menu,
  Scale,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Brand } from "../components/Shell";
import { ProjectFooter } from "../components/ProjectFooter";
import { SectionGuide } from "../components/SectionGuide";
import { Badge, Button, Field, Panel } from "../components/ui";
import { PlanCards, faqItems } from "./Workspace";
import { registrationErrors } from "../domain";
import { useStore } from "../store";
import type { AccountType } from "../types";

export function PublicLayout() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="public-site">
      <header className="public-header">
        <Link to="/welcome" onClick={() => setMenu(false)}>
          <Brand />
        </Link>
        <nav className={menu ? "visible" : ""} aria-label="Website navigation">
          <Link to="/welcome#features" onClick={() => setMenu(false)}>
            Features
          </Link>
          <Link to="/welcome#how-it-works" onClick={() => setMenu(false)}>
            How it works
          </Link>
          <Link to="/pricing" onClick={() => setMenu(false)}>
            Pricing
          </Link>
          <Link to="/help" onClick={() => setMenu(false)}>
            Help
          </Link>
        </nav>
        <div className="header-actions">
          <Link to="/signin" className="public-signin">
            Sign in
          </Link>
          <Link to="/register" className="button primary">
            Get started free
            <ArrowRight size={14} />
          </Link>
          <button
            className="icon-button public-menu"
            aria-label="Toggle website navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
      <Outlet />
      <ProjectFooter variant="public" />
    </div>
  );
}
function ProductPreview() {
  return (
    <div
      className="product-preview"
      aria-label="Sample Case Diary dashboard preview"
    >
      <div className="preview-sidebar">
        <Scale size={24} />
        <div />
        <span className="active">
          <BriefcaseBusiness size={13} />
          Overview
        </span>
        <span>
          <FolderOpen size={13} />
          My cases
        </span>
        <span>
          <CalendarDays size={13} />
          Calendar
        </span>
        <span>
          <Users size={13} />
          My team
        </span>
        <Leaf className="preview-leaf" size={60} />
      </div>
      <div className="preview-main">
        <div className="preview-bar">
          <span>
            Workspace <ChevronRight size={9} /> Dashboard
          </span>
          <Badge tone="info">Sample preview</Badge>
        </div>
        <div className="preview-greeting">
          <div>
            <small>A CLEARER KIND OF WORKDAY</small>
            <h3>Good morning, Ahmed.</h3>
          </div>
          <span className="preview-add">+ Add new case</span>
        </div>
        <div className="preview-stats">
          {[
            ["Active cases", "24"],
            ["Today’s hearings", "03"],
            ["Pending tasks", "04"],
          ].map(([label, n], i) => (
            <div key={label}>
              <span>
                {label}
                {i === 0 ? (
                  <BriefcaseBusiness size={12} />
                ) : i === 1 ? (
                  <CalendarDays size={12} />
                ) : (
                  <CheckCircle2 size={12} />
                )}
              </span>
              <strong>{n}</strong>
              <small>Everything in perspective</small>
            </div>
          ))}
        </div>
        <div className="preview-panel">
          <h3>
            Your next hearings <span>View all →</span>
          </h3>
          {[
            ["10:30", "Rahman & Associates vs. Alam Properties", "Civil"],
            ["11:00", "Md. Karim Uddin vs. The State", "Criminal"],
            ["14:00", "Fatima Begum vs. Rahim Ahmed", "Family"],
          ].map(([time, name, type]) => (
            <div className="preview-hearing" key={time}>
              <span>
                {time}
                <small>BST</small>
              </span>
              <div>
                <strong>{name}</strong>
                <small>Dhaka · Scheduled hearing</small>
              </div>
              <Badge tone={type.toLowerCase()}>{type}</Badge>
            </div>
          ))}
        </div>
      </div>
      <div className="floating-note">
        <span>
          <CheckCircle2 size={19} />
        </span>
        <div>
          <strong>One less thing to worry about.</strong>
          <small>Your next hearing is in your diary.</small>
        </div>
      </div>
    </div>
  );
}
export function Landing() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label">
            <span />A LITTLE CLARITY CHANGES EVERYTHING
          </div>
          <h1>
            Your legal cases.
            <br />
            Organized with
            <br />
            <span>confidence.</span>
          </h1>
          <p>
            Bring your cases, hearing dates, documents, and people together. A
            calmer way to manage what matters.
          </p>
          <div className="hero-buttons">
            <Link className="button primary" to="/register">
              Get started free
              <ArrowRight size={16} />
            </Link>
            <Link className="button secondary" to="/signin">
              Explore the demo
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="hero-footnote">
            <Check size={12} /> For advocates. For families. For a little more
            peace of mind.
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit" />
          <ProductPreview />
        </div>
      </section>
      <div className="value-strip">
        <span>
          <BriefcaseBusiness size={19} />
          Every case, in one place
        </span>
        <span>
          <CalendarDays size={19} />A clearer view of what’s next
        </span>
        <span>
          <Users size={19} />
          Thoughtful collaboration
        </span>
        <span>
          <Landmark size={19} />
          Built for Bangladesh
        </span>
      </div>
      <section id="features" className="public-section">
        <div className="section-intro">
          <div className="eyebrow">LESS SCATTER. MORE CERTAINTY.</div>
          <h2>
            The details are many.
            <br />
            Your workspace doesn’t have to be.
          </h2>
          <p>
            From the first filing to the final hearing, keep the story of every
            case together.
          </p>
        </div>
        <div className="feature-grid">
          {[
            {
              icon: BriefcaseBusiness,
              title: "A proper home for every case",
              text: "Keep parties, courts, notes, and a complete hearing history in a single, organized case workspace.",
            },
            {
              icon: CalendarDays,
              title: "Stay ahead of the next date",
              text: "See hearings and deadlines in a clear calendar. Set in-app reminders for the little things that matter.",
            },
            {
              icon: FolderOpen,
              title: "Find the right document",
              text: "Organize court orders, petitions, and evidence by case. Spend less time searching and more time moving forward.",
            },
            {
              icon: Users,
              title: "Bring your people together",
              text: "Assign work and share specific cases with advocates, colleagues, or family members through individual accounts.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article className="feature-card" key={title}>
              <span className="feature-icon">
                <Icon size={24} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="audience-section">
        <div className="audience-card">
          <div className="eyebrow">FOR ADVOCATES & LAW CHAMBERS</div>
          <h2>
            Your practice.
            <br />A clearer perspective.
          </h2>
          <p>
            From a solo practice to a growing chamber, give your cases and your
            team a shared place to move forward.
          </p>
          <ul>
            <li>
              <Check size={15} />A daily overview of hearings and casework
            </li>
            <li>
              <Check size={15} />
              Individual team roles and case assignments
            </li>
            <li>
              <Check size={15} />
              Plans that grow with your practice
            </li>
          </ul>
          <Link to="/register?type=advocate" className="text-link">
            Build a calmer practice
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="audience-card personal">
          <div className="eyebrow">FOR INDIVIDUALS & FAMILIES</div>
          <h2>
            Less uncertainty.
            <br />
            More peace of mind.
          </h2>
          <p>
            You don’t need to be an advocate to stay informed. Keep your own
            cases, dates, and documents close at hand.
          </p>
          <ul>
            <li>
              <Check size={15} />
              Simple case tracking without the jargon
            </li>
            <li>
              <Check size={15} />
              Important dates and helpful reminders
            </li>
            <li>
              <Check size={15} />
              Work together with people you trust
            </li>
          </ul>
          <Link to="/register?type=personal" className="text-link">
            Make room for clarity
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <section id="how-it-works" className="public-section">
        <div className="section-intro centered">
          <div className="eyebrow">A SIMPLE START</div>
          <h2>From scattered to settled.</h2>
          <p>A few thoughtful steps. A better way forward.</p>
        </div>
        <div className="steps-grid">
          {[
            [
              "01",
              "Make yourself at home",
              "Choose an individual account and a workspace that fits your needs.",
            ],
            [
              "02",
              "Bring your cases together",
              "Add the essentials, hearing dates, documents, and notes.",
            ],
            [
              "03",
              "Stay a step ahead",
              "Follow your calendar, complete tasks, and keep everyone in the loop.",
            ],
          ].map(([n, title, text]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pricing-preview">
        <div>
          <div className="eyebrow">START SMALL. GROW THOUGHTFULLY.</div>
          <h2>A plan for your next chapter.</h2>
          <p>
            Start free. Choose more room for cases and collaboration when you
            need it.
          </p>
          <Link to="/pricing" className="button primary">
            Find your fit
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="price-pair">
          <div>
            <span>For a growing practice</span>
            <h3>Plus</h3>
            <strong>
              ৳999<small> / month</small>
            </strong>
            <p>150 active cases · Up to 3 users</p>
          </div>
          <div>
            <span>For your people</span>
            <h3>Family</h3>
            <strong>
              ৳499<small> / month</small>
            </strong>
            <p>30 active cases · Up to 3 users</p>
          </div>
        </div>
      </section>
      <section className="public-section faq-section">
        <div className="section-intro">
          <div className="eyebrow">A FEW THINGS YOU MAY WONDER</div>
          <h2>Questions, answered.</h2>
          <p>A little clarity before you begin.</p>
        </div>
        <div>
          {faqItems.slice(0, 5).map(([q, a]) => (
            <details key={q} className="faq">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="final-cta">
        <Leaf size={37} />
        <h2>A clearer day starts here.</h2>
        <p>Your cases. Your people. Your peace of mind.</p>
        <Link to="/register" className="button">
          Get started free
          <ArrowRight size={15} />
        </Link>
        <Link to="/signin" className="text-link">
          Or take a look around the demo
        </Link>
      </section>
    </>
  );
}
export function Pricing() {
  const navigate = useNavigate();
  const [account, setAccount] = useState<AccountType>("advocate");
  return (
    <section className="public-section public-pricing">
      <div className="section-intro centered">
        <div className="eyebrow">THOUGHTFUL PLANS. CLEAR POSSIBILITIES.</div>
        <h1>Room for what’s next.</h1>
        <p>
          From your first case to a growing practice. Find a plan that feels
          right.
        </p>
        <div className="audience-toggle">
          <button
            onClick={() => setAccount("advocate")}
            className={account === "advocate" ? "active" : ""}
            aria-pressed={account === "advocate"}
          >
            <Scale size={16} />
            Advocates & chambers
          </button>
          <button
            onClick={() => setAccount("personal")}
            className={account === "personal" ? "active" : ""}
            aria-pressed={account === "personal"}
          >
            <Users size={16} />
            Individuals & families
          </button>
        </div>
      </div>
      <SectionGuide audience={account} />
      <PlanCards
        account={account}
        onChoose={(p) =>
          navigate(
            `/register?type=${account}&plan=${encodeURIComponent(p.name)}`,
          )
        }
      />
      <div className="notice" style={{ marginTop: 28 }}>
        <ShieldCheck size={18} />
        <span>
          Prices are monthly in Bangladeshi Taka. This is a pricing preview;
          checkout is not connected. Profile bonuses require validation and do
          not imply professional verification.
        </span>
      </div>
      <div className="section-intro centered" style={{ marginTop: 70 }}>
        <h2>A few helpful details.</h2>
      </div>
      {faqItems.slice(1, 5).map(([q, a]) => (
        <details className="faq" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </section>
  );
}
export function AccountLayout() {
  return (
    <>
      <Outlet />
      <ProjectFooter variant="public" />
    </>
  );
}

export function Auth({ mode }: { mode: "signin" | "register" | "recovery" }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { switchAccount } = useStore();
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState<AccountType>(
    params.get("type") === "personal" ? "personal" : "advocate",
  );
  const [v, setV] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    accepted: false,
  });
  const errors = registrationErrors(v);
  const register = mode === "register";
  const recovery = mode === "recovery";
  const change = (key: string, value: string | boolean) =>
    setV({ ...v, [key]: value });
  return (
    <div className={`auth-page compact-auth auth-${mode}`}>
      <div className="auth-story">
        <Link to="/welcome">
          <Brand />
        </Link>
        <div>
          <div className="eyebrow">CLARITY. EVERY DAY.</div>
          <h2>
            A little more order.
            <br />A little more
            <br />
            <span>peace of mind.</span>
          </h2>
          <p>
            One considered space for your cases, your people, and everything
            that comes next.
          </p>
          <div className="auth-benefits">
            <span>
              <CheckCircle2 size={17} />
              Your cases, thoughtfully organized
            </span>
            <span>
              <CalendarDays size={17} />
              Important dates, always in view
            </span>
            <span>
              <Users size={17} />
              Your people, on the same page
            </span>
          </div>
        </div>
        <small>MADE WITH BANGLADESH IN MIND</small>
        <Scale className="auth-decoration" size={270} />
      </div>
      <div className="auth-main">
        <Link className="text-link" to="/welcome">
          <ArrowLeft size={13} />
          Back to Case Diary
        </Link>
        <div className="auth-form-wrap">
          <div className="eyebrow">
            {register
              ? "MAKE YOURSELF AT HOME"
              : recovery
                ? "LET’S FIND YOUR WAY BACK"
                : "GOOD TO SEE YOU AGAIN"}
          </div>
          <h1>
            {register
              ? "Create your workspace"
              : recovery
                ? "Forgot your password?"
                : "Choose your demo workspace"}
          </h1>
          <p>
            {register
              ? "Use sample details to preview account setup."
              : recovery
                ? "Enter your email to preview the account recovery flow."
                : "Explore with sample cases. No email or password needed."}
          </p>
          <div className="notice auth-demo-note">
            <LockKeyhole size={16} />
            <span>
              Demo only · Changes reset on refresh. No real account is created.
            </span>
          </div>
          {mode === "signin" && (
            <div className="demo-signin-options">
              {(
                [
                  {
                    type: "personal",
                    title: "Common person",
                    subtitle: "For individuals & families",
                    description: "Track your cases, hearings and documents.",
                    Icon: Users,
                  },
                  {
                    type: "advocate",
                    title: "Advocate",
                    subtitle: "For lawyers & law chambers",
                    description:
                      "Manage cases, your team and daily court work.",
                    Icon: Scale,
                  },
                ] as const
              ).map(({ type, title, subtitle, description, Icon }) => (
                <button
                  key={type}
                  className="demo-signin-card"
                  onClick={() => {
                    switchAccount(type);
                    navigate("/");
                  }}
                  aria-label={`Sign in to ${title.toLowerCase()} demo`}
                >
                  <span className="demo-role-icon">
                    <Icon size={23} />
                  </span>
                  <span className="demo-role-copy">
                    <strong>{title}</strong>
                    <small>{subtitle}</small>
                    <p>{description}</p>
                  </span>
                  <span className="demo-enter">
                    Open demo <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          )}
          {message && (
            <div className="notice warning" role="status">
              {message}
            </div>
          )}
          <details className="auth-email-preview" open={mode !== "signin"}>
            <summary>
              Email sign-in preview <span>Not connected</span>
            </summary>
            <form
              onBlur={() => setTouched(true)}
              onSubmit={(e) => {
                e.preventDefault();
                if (register) {
                  if (Object.keys(errors).length) {
                    setTouched(true);
                    return;
                  }
                  switchAccount(account);
                  navigate("/onboarding", {
                    state: { name: v.name, email: v.email },
                  });
                  setV({ ...v, password: "", confirm: "" });
                } else {
                  setMessage(
                    recovery
                      ? "Recovery delivery is not configured. No email has been sent. Contact the product administrator after authentication is connected."
                      : "Sign-in is not configured. No authentication has taken place. Use the demo button below to explore the product.",
                  );
                  setV({ ...v, password: "", confirm: "" });
                }
              }}
            >
              <div className={register ? "registration-grid" : "stack"}>
                {register && (
                  <Field
                    label="Full name *"
                    error={touched ? errors.name : undefined}
                  >
                    <input
                      autoComplete="name"
                      required
                      value={v.name}
                      onChange={(e) => change("name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </Field>
                )}
                <Field
                  label="Email address *"
                  error={register && touched ? errors.email : undefined}
                >
                  <input
                    autoComplete="email"
                    type="email"
                    required
                    value={v.email}
                    onChange={(e) => change("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </Field>
                {!recovery && (
                  <Field
                    label={register ? "New password *" : "Password *"}
                    error={register && touched ? errors.password : undefined}
                  >
                    <span className="password-input">
                      <input
                        type={show ? "text" : "password"}
                        autoComplete={
                          register ? "new-password" : "current-password"
                        }
                        required
                        value={v.password}
                        onChange={(e) => change("password", e.target.value)}
                        placeholder={
                          register
                            ? "At least 10 characters"
                            : "Enter your password"
                        }
                      />
                      <button
                        type="button"
                        aria-label={show ? "Hide password" : "Show password"}
                        className="icon-button"
                        onClick={() => setShow(!show)}
                      >
                        {show ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </span>
                  </Field>
                )}
                {register && (
                  <>
                    <Field
                      label="Confirm password *"
                      error={touched ? errors.confirm : undefined}
                    >
                      <input
                        autoComplete="new-password"
                        type={show ? "text" : "password"}
                        required
                        value={v.confirm}
                        onChange={(e) => change("confirm", e.target.value)}
                        placeholder="Enter your password again"
                      />
                    </Field>
                    <small className="registration-full password-hint">
                      Password: 10+ characters with uppercase, lowercase and a
                      number.
                    </small>
                    <Field label="Workspace type" className="registration-full">
                      <select
                        value={account}
                        onChange={(e) =>
                          setAccount(e.target.value as AccountType)
                        }
                      >
                        <option value="advocate">Advocate / Law Chamber</option>
                        <option value="personal">Common person / Family</option>
                      </select>
                    </Field>
                    <div className="registration-full">
                      <label className="terms-check">
                        <input
                          type="checkbox"
                          checked={v.accepted}
                          onChange={(e) => change("accepted", e.target.checked)}
                        />
                        <span>
                          I’ve reviewed the{" "}
                          <Link to="/terms">terms preview</Link> and{" "}
                          <Link to="/privacy">privacy notice</Link>.
                        </span>
                      </label>
                      {touched && errors.accepted && (
                        <small className="field-error">{errors.accepted}</small>
                      )}
                    </div>
                  </>
                )}
                {mode === "signin" && (
                  <Link
                    to="/forgot-password"
                    className="text-link"
                    style={{ justifyContent: "flex-end" }}
                  >
                    Forgot password?
                  </Link>
                )}
                <Button
                  className="registration-full"
                  type="submit"
                  disabled={register && Object.keys(errors).length > 0}
                >
                  {register
                    ? "Continue to profile setup"
                    : recovery
                      ? "Preview recovery request"
                      : "Sign in"}
                  <ArrowRight size={15} />
                </Button>
              </div>
            </form>
          </details>
          <div className="auth-switch">
            {register ? (
              <>
                Want to try it first?{" "}
                <Link to="/signin">Open a demo workspace</Link>
              </>
            ) : recovery ? (
              <Link to="/signin">Back to sign in</Link>
            ) : (
              <>
                Want to personalize your workspace?{" "}
                <Link to="/register">Preview account setup</Link>
              </>
            )}
          </div>
          <p className="auth-legal">
            <Link to="/terms">Terms preview</Link> ·{" "}
            <Link to="/privacy">Privacy notice</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export function Onboarding() {
  const { account, data, update, notify } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state as { name?: string; email?: string } | null;
  const [v, setV] = useState({
    ...data.profile,
    name: incoming?.name || data.profile.name,
    email: incoming?.email || data.profile.email,
  });
  return (
    <div className="onboarding-page">
      <Link to="/welcome">
        <Brand />
      </Link>
      <div className="onboarding-card panel">
        <div className="eyebrow">A THOUGHTFUL FIRST STEP</div>
        <h1>Make this space yours.</h1>
        <p style={{ margin: "12px 0 24px", fontSize: 12 }}>
          A few details to personalize your{" "}
          {account === "advocate" ? "practice" : "personal"} workspace.
        </p>
        <div className="notice">
          <InfoIcon />
          Demo onboarding only. Email ownership, account creation, and
          enrollment verification are not configured.
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update((d) => ({
              ...d,
              profile: {
                ...v,
                verification: "Incomplete",
                bonusEligible: false,
              },
            }));
            notify(
              "Demo profile personalized. No real account has been created.",
            );
            navigate("/");
          }}
        >
          <div className="form-grid">
            <Field label="Full name *">
              <input
                required
                value={v.name}
                onChange={(e) => setV({ ...v, name: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <input
                value={v.location}
                onChange={(e) => setV({ ...v, location: e.target.value })}
              />
            </Field>
            {account === "advocate" && (
              <>
                <Field label="Bar Council enrollment number">
                  <input
                    value={v.enrollment}
                    onChange={(e) => setV({ ...v, enrollment: e.target.value })}
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
                  hint="Demo file selection only. PDF or image, up to 10 MB."
                  className="full"
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f && f.size <= 10 * 1024 * 1024)
                        setV({ ...v, proof: f.name });
                      else if (f)
                        notify("File is too large. Choose a file under 10 MB.");
                    }}
                  />
                </Field>
              </>
            )}
            <Field
              label="Profile image"
              hint="JPG or PNG, up to 10 MB. Demo metadata only."
              className="full"
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size <= 10 * 1024 * 1024)
                    setV({ ...v, image: f.name });
                  else if (f)
                    notify("File is too large. Choose a file under 10 MB.");
                }}
              />
            </Field>
          </div>
          {account === "advocate" && (
            <p style={{ fontSize: 11, lineHeight: 1.8, marginTop: 24 }}>
              Completing your profile does not mean your professional status is
              verified. Verification stays incomplete until a connected review
              process validates it.
            </p>
          )}
          <div className="form-actions">
            <Link className="button secondary" to="/">
              Finish later
            </Link>
            <Button type="submit">
              Open my demo workspace
              <ArrowRight size={14} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function InfoIcon() {
  return <ShieldCheck size={17} />;
}
export function LegalNotice({ type }: { type: "privacy" | "terms" }) {
  return (
    <section className="public-section legal-page">
      <div className="eyebrow">PRODUCT PREVIEW</div>
      <h1>{type === "privacy" ? "Privacy notice" : "Terms preview"}</h1>
      <div className="notice warning" style={{ marginTop: 25 }}>
        This is an informational demo notice. Production legal terms and a
        reviewed privacy policy have not been published.
      </div>
      <Panel>
        <div className="settings-body">
          <h2>
            {type === "privacy"
              ? "How this preview handles data"
              : "About this preview"}
          </h2>
          <p>
            {type === "privacy"
              ? "Sample records and your changes are held in browser memory. Refreshing resets them. Uploaded files use local object URLs and are not transmitted by this application. Passwords are not stored or logged."
              : "Case Diary is currently a frontend demonstration. Sign-in, account creation, payments, invitation delivery, verification, and notification delivery are not connected to a backend."}
          </p>
          <h3>Use sample information</h3>
          <p>
            Do not enter confidential legal information or upload sensitive
            documents. This interface does not provide production security or
            access enforcement.
          </p>
          <h3>Before a production launch</h3>
          <p>
            The product owner must configure identity services, secure storage,
            permissions, retention practices, and appropriate reviewed terms and
            privacy disclosures.
          </p>
          <Link className="button primary" to="/welcome">
            Back to Case Diary
          </Link>
        </div>
      </Panel>
    </section>
  );
}
