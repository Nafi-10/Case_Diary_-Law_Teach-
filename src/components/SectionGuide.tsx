import {
  BookOpen,
  ChevronDown,
  Compass,
  Info,
  ListOrdered,
  Sparkles,
  Target,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { getSectionGuide } from "../sectionGuides";
import { useStore } from "../store";
import type { AccountType } from "../types";

export function SectionGuide({ audience }: { audience?: AccountType }) {
  const { pathname } = useLocation();
  const { account } = useStore();
  const guide = getSectionGuide(pathname, audience ?? account);
  if (!guide) return null;

  return (
    <details
      className="section-guide"
      key={`${pathname}-${audience ?? account}`}
    >
      <summary
        aria-label={`Guide to ${guide.title}: purpose, how to use and benefits`}
      >
        <span className="guide-emblem">
          <Compass size={21} aria-hidden="true" />
        </span>
        <span className="guide-summary-copy">
          <span className="guide-kicker">
            YOUR SECTION GUIDE <span aria-hidden="true">/</span>{" "}
            <strong>{guide.title}</strong>
          </span>
          <span className="guide-overview">{guide.overview}</span>
        </span>
        <span className="guide-toggle">
          <BookOpen size={14} aria-hidden="true" />
          <span className="guide-read">Read the guide</span>
          <span className="guide-close">Close guide</span>
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </summary>
      <div className="guide-details">
        <div className="guide-columns">
          <section className="guide-purpose">
            <div className="guide-panel-label">
              <Target size={16} aria-hidden="true" />
              <span>01 / THE PURPOSE</span>
            </div>
            <h2>What this section is for</h2>
            <p>{guide.purpose}</p>
          </section>
          <section className="guide-steps">
            <div className="guide-panel-label">
              <ListOrdered size={16} aria-hidden="true" />
              <span>02 / HOW TO USE IT</span>
            </div>
            <h2>A few steps to get started</h2>
            <ol>
              {guide.steps.map(([title, text]) => (
                <li key={title}>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="guide-benefits">
            <div className="guide-panel-label">
              <Sparkles size={16} aria-hidden="true" />
              <span>03 / THE BENEFITS</span>
            </div>
            <h2>How it helps you</h2>
            <ul>
              {guide.benefits.map(([title, text]) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="guide-note">
          <Info size={15} aria-hidden="true" />
          <p>
            <strong>Good to know.</strong> {guide.note}
          </p>
        </div>
      </div>
    </details>
  );
}
