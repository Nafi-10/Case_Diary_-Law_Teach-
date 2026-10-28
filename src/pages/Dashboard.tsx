import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarCheck2,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileText,
  Landmark,
  Leaf,
  Plus,
  Users,
} from "lucide-react";
import { useStore } from "../store";
import { formatDate, formatTime, offsetDate, todayISO } from "../data/demo";
import {
  Avatar,
  Badge,
  CheckRow,
  EmptyState,
  PageHeader,
  Panel,
  TextLink,
} from "../components/ui";
import { MiniCalendar } from "../components/Calendar";
import { actionHighlight, activeLimit, PLANS, profileFields } from "../domain";
import { ActionStatus } from "../components/ActionStatus";
export function Dashboard() {
  const { data, account, update } = useStore();
  const [period, setPeriod] = useState("Today");
  const today = todayISO();
  const active = data.cases.filter((c) =>
    ["Active", "Pending"].includes(c.status),
  );
  const todays = active.filter((c) => c.hearing === today);
  const upcoming = active.filter(
    (c) => c.hearing > today && c.hearing <= offsetDate(7),
  );
  const hearings = (
    period === "Today"
      ? todays
      : period === "Tomorrow"
        ? active.filter((c) => c.hearing === offsetDate(1))
        : [...todays, ...upcoming]
  ).sort((a, b) =>
    `${a.hearing}${a.time}`.localeCompare(`${b.hearing}${b.time}`),
  );
  const pending = data.tasks.filter((t) => !t.done);
  const personal = account === "personal";
  const stats = [
    {
      label: "Active cases",
      value: active.length,
      icon: BriefcaseBusiness,
      detail: `Across ${new Set(active.map((c) => c.court)).size} courts`,
      highlight: "Your practice, organized",
      path: "/cases",
    },
    {
      label: personal ? "Upcoming hearings" : "Today’s hearings",
      value: personal ? upcoming.length : todays.length,
      icon: CalendarCheck2,
      detail: personal ? "In the next 7 days" : "All set for your day",
      highlight: personal
        ? "Plan ahead"
        : todays.length
          ? `Next at ${formatTime(todays[0].time)}`
          : "Your calendar is clear",
      path: "/calendar",
    },
    {
      label: personal ? "Pending reminders" : "Upcoming hearings",
      value: personal
        ? data.reminders.filter((r) => !r.done).length
        : upcoming.length,
      icon: CalendarDays,
      detail: personal
        ? "Keep the little things in view"
        : "In the next 7 days",
      highlight: "Stay one step ahead",
      path: personal ? "/reminders" : "/calendar",
    },
    {
      label: personal ? "Shared cases" : "Pending tasks",
      value: personal
        ? data.cases.filter((c) => c.shared).length
        : pending.length,
      icon: personal ? Users : CheckSquare,
      detail: personal
        ? "With people you trust"
        : `${pending.filter((t) => t.due <= today).length} need your attention`,
      highlight: personal
        ? "Better, together"
        : "A little focus goes a long way",
      path: personal ? "/shared" : "/tasks",
    },
  ];
  return (
    <>
      <PageHeader
        className="dashboard-header"
        eyebrow="YOUR DAY, AT A GLANCE"
        title={`Good ${new Date().getHours() < 12 ? "morning" : "afternoon"}, ${data.profile.name.split(" ")[0]}.`}
        description={
          personal
            ? "A clear view of your cases. Peace of mind for what’s next."
            : "Here’s what’s happening in your practice today."
        }
        actions={
          <>
            <div className="greeting-date">
              <CalendarDays size={13} />
              {formatDate(today, {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="greeting-actions">
              <Link className="button secondary" to="/reminders?new=1">
                <Bell size={14} />
                Set reminder
              </Link>
              <Link
                className="button primary"
                to="/cases/new"
                aria-label="Add new case"
              >
                <Plus size={15} />
                Add new case
              </Link>
            </div>
          </>
        }
      />
      <div className="stats-grid">
        {stats.map(
          ({ label, value, icon: Icon, detail, highlight, path }, i) => (
            <Link key={label} to={path} className="panel stat-card">
              <div className="stat-top">
                <span className="stat-label">{label}</span>
                <span className={`stat-icon ${i % 2 ? "gold" : ""}`}>
                  <Icon size={17} />
                </span>
              </div>
              <div className="stat-number">
                {String(value).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#86917d",
                  marginTop: -8,
                  marginBottom: 12,
                }}
              >
                {detail}
              </div>
              <div className="stat-bottom">
                <span className="highlight">{highlight}</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          ),
        )}
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <Panel
            title="Upcoming hearings"
            meta={<span className="count">{hearings.length}</span>}
            action={<TextLink to="/calendar">View all</TextLink>}
          >
            <div className="hearing-toolbar">
              <div className="segmented">
                {["Today", "Tomorrow", "This week"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={period === p ? "active" : ""}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <span>
                {formatDate(today, { day: "numeric", month: "short" })}
              </span>
            </div>
            <div className="hearing-list">
              {hearings.length ? (
                hearings.slice(0, 4).map((c) => (
                  <Link
                    to={`/cases/${c.id}`}
                    className="hearing-row"
                    key={c.id}
                  >
                    <div className="hearing-time">
                      <strong>{formatTime(c.time).split(" ")[0]}</strong>
                      <small>
                        {period === "Today"
                          ? formatTime(c.time).split(" ")[1]
                          : formatDate(c.hearing, {
                              day: "numeric",
                              month: "short",
                            })}
                      </small>
                    </div>
                    <div className="hearing-info">
                      <div className="case-number">
                        {c.number}{" "}
                        <span style={{ color: "#adb59e" }}>
                          {" "}
                          · {c.proceeding}
                        </span>
                      </div>
                      <h3>
                        {c.party}{" "}
                        <span className="muted" style={{ fontWeight: 400 }}>
                          vs.
                        </span>{" "}
                        {c.opposite}
                      </h3>
                      <p>
                        <Landmark size={10} />
                        {c.court}
                      </p>
                    </div>
                    <Badge tone={c.type.toLowerCase()}>{c.type}</Badge>
                    <ChevronRight size={13} color="#9aa58f" />
                  </Link>
                ))
              ) : (
                <EmptyState
                  title="A clear calendar"
                  description="No hearings in this period. Your next dates will appear here."
                />
              )}
            </div>
            <div className="hearing-footer">
              <span>
                <Clock3 size={10} /> &nbsp;All times in Bangladesh Standard Time
              </span>
              <TextLink to="/calendar">Open calendar</TextLink>
            </div>
          </Panel>
          <Panel
            title="Recently updated cases"
            action={<TextLink to="/cases">All cases</TextLink>}
          >
            <div className="table-wrap">
              <table className="compact-table themed-table">
                <thead>
                  <tr>
                    <th>CASE & PARTIES</th>
                    <th className="court-cell">CASE TYPE</th>
                    <th>NEXT HEARING</th>
                    <th>STATUS</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.cases.slice(0, 4).map((c) => (
                    <tr key={c.id} data-tone={c.status.toLowerCase()}>
                      <td>
                        <Link to={`/cases/${c.id}`} className="case-title">
                          {c.number}
                        </Link>
                        <span className="subtext">{c.party}</span>
                      </td>
                      <td className="court-cell">{c.type}</td>
                      <td>
                        <span className="cell-date">
                          <CalendarDays size={11} />
                          {formatDate(c.hearing, {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="subtext">{formatTime(c.time)}</span>
                      </td>
                      <td>
                        <Badge>{c.status}</Badge>
                      </td>
                      <td>
                        <Link
                          to={`/cases/${c.id}`}
                          aria-label={`Open ${c.number}`}
                        >
                          <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-recent-cases">
              {data.cases.slice(0, 4).map((c) => (
                <Link
                  to={`/cases/${c.id}`}
                  className="mobile-case-card record-card"
                  data-tone={c.status.toLowerCase()}
                  key={c.id}
                >
                  <div className="case-card-top">
                    <strong>{c.number}</strong>
                    <Badge>{c.status}</Badge>
                  </div>
                  <h3>{c.party}</h3>
                  <div className="case-card-footer">
                    <span>
                      <CalendarDays size={11} />{" "}
                      {formatDate(c.hearing, {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {formatTime(c.time)}
                    </span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
            {!data.cases.length && (
              <EmptyState
                title="Your first case starts here"
                description="Add a case to keep its dates, documents, and updates together."
                action={
                  <Link to="/cases/new" className="button primary">
                    Add your first case
                  </Link>
                }
              />
            )}
            <div className="table-footer">
              <span>Every detail, right where you left it.</span>
              <span>{data.cases.length} total cases</span>
            </div>
          </Panel>
          <div className="bottom-grid" style={{ marginTop: 0 }}>
            <Panel
              title="Recent activity"
              action={<span className="badge">Workspace</span>}
            >
              <div style={{ paddingBottom: 9 }}>
                {data.activity.slice(0, 3).map((a, i) => (
                  <div className="activity-row" key={a.id}>
                    <span className="activity-dot">
                      {i === 1 ? (
                        <FileText size={12} />
                      ) : (
                        <CircleCheck size={12} />
                      )}
                    </span>
                    <div>
                      <p>{a.text}</p>
                      <small>
                        {formatDate(a.date, { day: "numeric", month: "short" })}{" "}
                        · Demo activity
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel
              title={personal ? "Your people" : "Team at a glance"}
              action={
                <Link to="/team" aria-label="View team">
                  <ArrowRight size={14} />
                </Link>
              }
            >
              <div style={{ paddingBottom: 16 }}>
                {data.members
                  .filter((m) => m.status === "Active")
                  .map((m, i) => (
                    <div className="workload-row" key={m.id}>
                      <Avatar name={m.name} index={i} />
                      <div>
                        <strong>{m.name}</strong>
                        <br />
                        <small>{m.role}</small>
                      </div>
                      <span style={{ fontSize: 9, color: "#7b8d6c" }}>
                        {
                          data.cases.filter(
                            (c) =>
                              c.advocate === m.name && c.status === "Active",
                          ).length
                        }{" "}
                        cases
                      </span>
                    </div>
                  ))}
              </div>
            </Panel>
          </div>
        </div>
        <div className="dashboard-right">
          {account === "advocate" &&
            ["Free", "Starter"].includes(data.plan) && (
              <Panel title="A little more room to grow">
                <div className="panel-body">
                  <p style={{ fontSize: 12 }}>
                    Complete your profile to qualify for{" "}
                    {data.plan === "Free" ? 3 : 50} active cases after
                    validation.
                  </p>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${profileFields(data.profile).filter(Boolean).length * 20}%`,
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 11, marginBottom: 14 }}>
                    {profileFields(data.profile).filter(Boolean).length} of 5
                    fields provided · Current limit:{" "}
                    {activeLimit(
                      PLANS.advocate.find((p) => p.name === data.plan)!,
                      data.profile,
                    )}
                  </p>
                  <TextLink to="/profile">Review missing fields</TextLink>
                </div>
              </Panel>
            )}
          <MiniCalendar />
          <Panel
            title={personal ? "Your reminders" : "Pending tasks"}
            meta={
              <span className="count">
                {personal
                  ? data.reminders.filter((r) => !r.done).length
                  : pending.length}
              </span>
            }
            action={
              <TextLink to={personal ? "/reminders" : "/tasks"}>
                View all
              </TextLink>
            }
          >
            <div className="task-list">
              {personal
                ? data.reminders.slice(0, 3).map((r) => (
                    <div
                      className="task-item record-card"
                      key={r.id}
                      data-tone={actionHighlight(r.done, r.date, today).tone}
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
                          {formatDate(r.date, {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          · {formatTime(r.time)}
                        </span>
                        <ActionStatus done={r.done} due={r.date} />
                      </div>
                    </div>
                  ))
                : data.tasks.slice(0, 3).map((t) => (
                    <div
                      className="task-item record-card"
                      key={t.id}
                      data-tone={actionHighlight(t.done, t.due, today).tone}
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
                          {t.due === today
                            ? "Due today"
                            : formatDate(t.due, {
                                day: "numeric",
                                month: "short",
                              })}
                        </span>
                        <span className="record-badges">
                          <ActionStatus done={t.done} due={t.due} />
                          <Badge>{t.priority}</Badge>
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
            <div className="task-footer">
              <Link
                to={personal ? "/reminders?new=1" : "/tasks?new=1"}
                className="text-link"
              >
                <Plus size={12} />
                {personal ? "Add a reminder" : "Create a task"}
              </Link>
            </div>
          </Panel>
          <div className="chamber-note">
            <div
              className="eyebrow"
              style={{ fontSize: 8, letterSpacing: 1.4 }}
            >
              A MORE CONNECTED {personal ? "JOURNEY" : "PRACTICE"}
            </div>
            <h3>
              {personal
                ? "Good company. Greater clarity."
                : "Great work happens together."}
            </h3>
            <p>
              {personal
                ? "Keep your family and advocate in the loop, one case at a time."
                : "Keep your team on the same page. Share a case, assign a task, move forward."}
            </p>
            <TextLink to="/team">
              Meet your {personal ? "people" : "team"}
            </TextLink>
            <Leaf size={65} />
          </div>
          <Link className="button secondary" to="/documents?upload=1">
            <ArrowDownToLine size={14} />
            Upload a document
          </Link>
        </div>
      </div>
    </>
  );
}
