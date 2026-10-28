import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  CreditCard,
  Crown,
  FolderOpen,
  Globe,
  House,
  LogOut,
  Menu,
  Scale,
  Search,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { Avatar } from "./ui";
import { SectionGuide } from "./SectionGuide";
import { ProjectFooter } from "./ProjectFooter";
import { ViewErrorBoundary } from "./RouteSupport";
import { useStore } from "../store";
import { activeLimit, countOwnedActiveCases, PLANS } from "../domain";

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <Scale size={25} />
      </span>
      <span className="brand-word">
        Case Diary<small>CLARITY. EVERY DAY.</small>
      </span>
    </span>
  );
}
export function Shell() {
  const { data, account, switchAccount } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState<"account" | "notifications" | null>(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
        if (window.matchMedia("(max-width: 800px)").matches)
          mobileMenuRef.current?.focus();
      }
    };
    const click = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node))
        setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", click);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", click);
    };
  }, []);
  const nav = [
    { label: "Dashboard", path: "/", icon: House },
    { label: "My Cases", path: "/cases", icon: BriefcaseBusiness },
    { label: "Calendar", path: "/calendar", icon: CalendarDays },
    { label: "Reminders", path: "/reminders", icon: Bell },
    { label: "Documents", path: "/documents", icon: FolderOpen },
    ...(account === "advocate"
      ? [
          { label: "Tasks", path: "/tasks", icon: CheckSquare },
          { label: "Reports", path: "/reports", icon: ChartNoAxesCombined },
        ]
      : [{ label: "Shared Cases", path: "/shared", icon: Users }]),
  ];
  const workspaceNav = [
    {
      label:
        account === "advocate" ? "Team & Collaboration" : "Family & Members",
      path: "/team",
      icon: Users,
    },
    { label: "Subscription & Billing", path: "/billing", icon: CreditCard },
    {
      label: account === "advocate" ? "Advocate Profile" : "My Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];
  const plan = PLANS[account].find((p) => p.name === data.plan)!;
  const used = countOwnedActiveCases(data.cases);
  const limit = activeLimit(plan, data.profile);
  const page =
    [
      ...nav,
      ...workspaceNav,
      { label: "Settings", path: "/settings" },
      { label: "About Case Diary", path: "/about" },
      { label: "Help & Support", path: "/help" },
    ].find((x) => x.path === location.pathname)?.label ??
    (location.pathname.includes("/cases/new")
      ? "Add New Case"
      : location.pathname.includes("/cases/")
        ? "Case Workspace"
        : "Workspace");
  const choose = (type: "advocate" | "personal") => {
    switchAccount(type);
    setMenu(null);
    navigate("/");
  };
  return (
    <div
      className={`app guided-workspace ${["/calendar", "/reports", "/billing"].includes(location.pathname) ? "compact-workspace" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <button
        aria-label="Close navigation"
        className={`mobile-backdrop ${mobile ? "show" : ""}`}
        onClick={() => setMobile(false)}
      />
      <aside
        className={`sidebar ${mobile ? "open" : ""}`}
        aria-label="Main navigation"
      >
        <Link to="/" onClick={() => setMobile(false)}>
          <Brand />
        </Link>
        <button
          className="workspace-switch"
          onClick={() => {
            setMenu(menu === "account" ? null : "account");
            setMobile(false);
          }}
        >
          <span className="workspace-icon">
            <Building2 size={16} />
          </span>
          <span>
            {data.name}
            <small>
              {account === "advocate"
                ? "Advocate workspace"
                : "Personal workspace"}
            </small>
          </span>
          <ChevronsUpDown size={12} />
        </button>
        <div className="nav-section">
          <div className="nav-label">WORKSPACE</div>
          {nav.map(({ label, path, icon: Icon }) => (
            <NavLink
              to={path}
              end={path === "/"}
              key={path}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon />
              {label}
              {path === "/cases" && <span className="nav-count">{used}</span>}
              {path === "/tasks" && (
                <span className="nav-count">
                  {data.tasks.filter((t) => !t.done).length}
                </span>
              )}
            </NavLink>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-label">MANAGE</div>
          {workspaceNav.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            className="nav-link"
            onClick={() => setMobile(false)}
          >
            <Settings />
            Settings
          </NavLink>
          <NavLink
            to="/about"
            className="nav-link"
            onClick={() => setMobile(false)}
          >
            <BookOpen />
            About Case Diary
          </NavLink>
          <NavLink
            to="/help"
            className="nav-link"
            onClick={() => setMobile(false)}
          >
            <CircleHelp />
            Help & Support
          </NavLink>
          <div className="plan-teaser">
            <div className="plan-line">
              <span>
                <Crown size={13} /> &nbsp;{plan.name} plan
              </span>
              <span className="demo-badge">DEMO</span>
            </div>
            <p>
              {used} of {limit} active cases
            </p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
              />
            </div>
            <Link to="/billing" onClick={() => setMobile(false)}>
              Explore your plan
              <ArrowRight size={12} />
            </Link>
          </div>
          <Link
            to="/profile"
            className="sidebar-profile"
            onClick={() => setMobile(false)}
          >
            <Avatar name={data.profile.name} />
            <span>
              <strong>{data.profile.name}</strong>
              <small>
                {account === "advocate"
                  ? "Advocate · Workspace owner"
                  : "Personal · Workspace owner"}
              </small>
            </span>
            <ChevronsUpDown size={13} />
          </Link>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-context">
            <button
              className="icon-button mobile-menu"
              ref={mobileMenuRef}
              aria-label="Open navigation"
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={20} />
            </button>
            <House size={14} />
            <span>Workspace</span>
            <ChevronRight size={11} />
            <strong>{page}</strong>
          </div>
          <div className="topbar-right" ref={popupRef}>
            <form
              className="global-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/cases?q=${encodeURIComponent(query)}`);
              }}
            >
              <Search size={14} />
              <input
                ref={searchRef}
                aria-label="Search all cases"
                placeholder="Search anything…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd>⌘ K</kbd>
            </form>
            <span
              className="demo-badge"
              title="Sample records. Changes stay in this tab and reset on refresh."
            >
              Demo workspace
            </span>
            <span className="topbar-divider" />
            <div className="popover-anchor">
              <button
                aria-label="Notifications"
                aria-expanded={menu === "notifications"}
                className="icon-button notification-button"
                onClick={() =>
                  setMenu(menu === "notifications" ? null : "notifications")
                }
              >
                <Bell size={18} />
              </button>
              {menu === "notifications" && (
                <div className="popover">
                  <div className="popover-title">Your activity</div>
                  {data.activity.slice(0, 3).map((a) => (
                    <Link to="/cases" key={a.id} onClick={() => setMenu(null)}>
                      <span>
                        <strong>{a.text}</strong>
                        <small>{a.date} · Sample activity</small>
                      </span>
                    </Link>
                  ))}
                  <div className="separator" />
                  <Link to="/settings" onClick={() => setMenu(null)}>
                    Notification preferences
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
            <div className="popover-anchor">
              <button
                className="account-button"
                aria-label="Account and workspace menu"
                aria-expanded={menu === "account"}
                onClick={() => setMenu(menu === "account" ? null : "account")}
              >
                <Avatar name={data.profile.name} />
                <ChevronDown size={12} />
              </button>
              {menu === "account" && (
                <div className="popover account-popover">
                  <div className="popover-title">
                    Explore both experiences
                    <small>Separate sample workspaces</small>
                  </div>
                  <button onClick={() => choose("advocate")}>
                    <Scale size={18} />
                    <span>
                      Advocate / Law Chamber
                      <small>Cases, hearings, and your legal team</small>
                    </span>
                  </button>
                  <button onClick={() => choose("personal")}>
                    <UserRound size={18} />
                    <span>
                      Common Person<small>Your personal and shared cases</small>
                    </span>
                  </button>
                  <div className="separator" />
                  <Link to="/profile" onClick={() => setMenu(null)}>
                    <UserRound size={15} />
                    My profile
                  </Link>
                  <Link to="/welcome" onClick={() => setMenu(null)}>
                    <Globe size={15} />
                    Visit public website
                  </Link>
                  <Link to="/signin" onClick={() => setMenu(null)}>
                    <LogOut size={15} />
                    Leave demo
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main
          className="content"
          id="main-content"
          key={`${account}-${location.pathname}`}
        >
          <SectionGuide />
          <ViewErrorBoundary>
            <Outlet />
          </ViewErrorBoundary>
        </main>
        <div className="content workspace-footer-wrap">
          <ProjectFooter />
        </div>
      </div>
    </div>
  );
}
