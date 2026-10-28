import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate, todayISO } from "../data/demo";
import { useStore } from "../store";
import { Panel, TextLink } from "./ui";
export function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function monthDates(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - ((first.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
export function MiniCalendar() {
  const { data } = useStore();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date(`${todayISO()}T12:00:00`));
  const [selected, setSelected] = useState(todayISO());
  const activeCases = data.cases.filter((c) =>
    ["Active", "Pending"].includes(c.status),
  );
  const n = activeCases.filter((c) => c.hearing === selected).length;
  return (
    <Panel
      title="Your calendar"
      action={<TextLink to="/calendar">View calendar</TextLink>}
    >
      <div className="calendar-nav">
        <span>
          {formatDate(dateKey(month), { month: "long", year: "numeric" })}
        </span>
        <div>
          <button
            className="icon-button"
            aria-label="Previous month"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className="icon-button"
            aria-label="Next month"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="mini-calendar">
        <div className="calendar-weekdays">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="calendar-days">
          {monthDates(month).map((d) => {
            const key = dateKey(d);
            return (
              <button
                key={key}
                aria-label={formatDate(key)}
                onClick={() => setSelected(key)}
                className={`${d.getMonth() !== month.getMonth() ? "outside" : ""} ${key === todayISO() ? "today" : ""} ${activeCases.some((c) => c.hearing === key) ? "event" : ""} ${key === selected ? "selected" : ""}`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      <div className="calendar-legend">
        <span>
          <i className="legend-dot" />
          Hearing
        </span>
        <span>
          <i className="legend-dot gold" />
          Reminder
        </span>
      </div>
      <button
        className="today-note"
        style={{ width: "calc(100% - 40px)", textAlign: "left" }}
        onClick={() => navigate(`/calendar?date=${selected}`)}
      >
        <CalendarDays size={17} />
        <span>
          <strong>
            {n
              ? `${n} hearing${n !== 1 ? "s" : ""} ${selected === todayISO() ? "today" : "on " + formatDate(selected, { day: "numeric", month: "short" })}`
              : "A little breathing room"}
          </strong>
          {n
            ? "Everything you need, in one place."
            : "No hearings scheduled on this day."}
        </span>
      </button>
    </Panel>
  );
}
