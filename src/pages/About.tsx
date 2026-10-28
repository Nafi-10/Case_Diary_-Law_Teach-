import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  FolderOpen,
  HeartHandshake,
  History,
  MapPin,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHeader } from "../components/ui";

const tools = [
  {
    icon: BriefcaseBusiness,
    title: "Case details, together",
    text: "Keep case numbers, parties, courts and important notes in one structured record.",
    to: "/cases",
    action: "Open my cases",
  },
  {
    icon: History,
    title: "A history you can follow",
    text: "Record each hearing as a separate entry, so the next date never replaces the story so far.",
    to: "/cases",
    action: "Explore case records",
  },
  {
    icon: CalendarDays,
    title: "A clearer view of dates",
    text: "Move between month, week and day views to plan around hearings and follow-up work.",
    to: "/calendar",
    action: "Open calendar",
  },
  {
    icon: Bell,
    title: "Your next steps, in view",
    text: "Keep a practical list of reminders and mark each follow-up complete as you go.",
    to: "/reminders",
    action: "View reminders",
  },
  {
    icon: FolderOpen,
    title: "Documents with context",
    text: "Find related files alongside the cases they belong to, with previews and useful categories.",
    to: "/documents",
    action: "Browse documents",
  },
  {
    icon: Users,
    title: "Thoughtful collaboration",
    text: "Explore individual roles and case-specific sharing in the demo’s access and invitation previews.",
    to: "/team",
    action: "Explore collaboration",
  },
];
const principles = [
  {
    icon: BookOpen,
    title: "Clarity",
    text: "Plain language, useful details and timelines that are easy to follow.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible access",
    text: "A product direction built around clear permissions and considered sharing.",
  },
  {
    icon: HeartHandshake,
    title: "Accessibility",
    text: "A calm experience for different levels of digital familiarity, including mobile use.",
  },
  {
    icon: History,
    title: "Accountability",
    text: "Distinct hearing entries and understandable updates help preserve the case story.",
  },
];

export function About() {
  return (
    <div className="about-page">
      <PageHeader
        eyebrow="THE STORY BEHIND YOUR WORKSPACE"
        title="About Case Diary"
        description="Made for the details that matter. Built with Bangladesh in mind."
      />

      <section className="about-hero" aria-labelledby="about-headline">
        <div className="about-hero-copy">
          <span className="about-brand-note">
            <Scale size={15} /> A product of The Legal Doors
          </span>
          <h2 id="about-headline">
            Every case.
            <br />
            <em>Clearly organized.</em>
          </h2>
          <p>
            Case Diary brings case details, hearing dates, chronological updates
            and related documents into one considered workspace—for advocates,
            law chambers, individuals and families.
          </p>
          <div className="about-actions">
            <Link to="/cases" className="button primary">
              Open my cases <ArrowRight size={15} />
            </Link>
            <a href="#about-tools" className="button secondary">
              Explore the tools
            </a>
          </div>
          <span className="about-hero-caption">
            <MapPin size={13} /> Designed around everyday legal casework in
            Bangladesh
          </span>
        </div>
        <div className="about-story-card">
          <div className="about-story-heading">
            <span className="about-mark">
              <Scale size={27} />
            </span>
            <div>
              <small>A CLEARER CASE JOURNEY</small>
              <h3>Keep the whole story in view.</h3>
            </div>
          </div>
          <ol className="about-journey">
            <li>
              <span>
                <FileText size={18} />
              </span>
              <div>
                <strong>Bring the details together</strong>
                <p>Parties, court, case number and documents.</p>
              </div>
            </li>
            <li>
              <span>
                <History size={18} />
              </span>
              <div>
                <strong>Preserve each update</strong>
                <p>A chronological record of hearings and notes.</p>
              </div>
            </li>
            <li>
              <span>
                <CalendarDays size={18} />
              </span>
              <div>
                <strong>Prepare for what comes next</strong>
                <p>The next hearing, reminder and follow-up.</p>
              </div>
            </li>
          </ol>
          <div className="about-story-foot">
            <Check size={15} /> Less searching. More clarity.
          </div>
        </div>
      </section>

      <nav className="about-section-nav" aria-label="About page sections">
        <a href="#about-purpose">Our purpose</a>
        <a href="#about-people">Who it’s for</a>
        <a href="#about-tools">Everyday tools</a>
        <a href="#about-principles">Our principles</a>
        <a href="#about-parent">The Legal Doors</a>
      </nav>

      <section
        className="about-purpose"
        id="about-purpose"
        aria-labelledby="purpose-heading"
      >
        <div>
          <div className="eyebrow">WHY WE EXIST</div>
          <h2 id="purpose-heading">
            A little less scattered.
            <br />A lot more understandable.
          </h2>
          <p>
            Legal matters bring together dates, documents, people and ongoing
            updates. When those details live across notebooks, messages and
            separate files, following a case takes more effort than it should.
          </p>
          <p>
            Case Diary gives that information a clear home, helping people find
            what they need and keep a record they can follow.
          </p>
        </div>
        <div className="about-purpose-notes">
          <article>
            <span>01 / OUR MISSION</span>
            <h3>Make case information easier to manage.</h3>
            <p>
              A clear, accessible and responsible digital workspace for
              organizing, following and managing legal case information.
            </p>
          </article>
          <article>
            <span>02 / OUR VISION</span>
            <h3>A trusted companion for Bangladesh.</h3>
            <p>
              Help advocates and the public follow their legal matters with
              greater clarity and confidence.
            </p>
          </article>
        </div>
      </section>

      <section id="about-people" aria-labelledby="people-heading">
        <div className="about-section-heading">
          <div>
            <div className="eyebrow">TWO AUDIENCES. ONE CLEAR PURPOSE.</div>
            <h2 id="people-heading">Designed around the way you work.</h2>
          </div>
          <p>
            Professional casework and personal matters deserve an experience
            that feels right for each.
          </p>
        </div>
        <div className="about-audiences">
          <article className="about-audience">
            <span className="about-audience-icon">
              <Scale size={24} />
            </span>
            <h3>Advocates & law chambers</h3>
            <p>
              For independent advocates, junior advocates, chamber owners and
              the people supporting their daily work.
            </p>
            <ul>
              <li>
                <Check />
                Organize case records and hearing history
              </li>
              <li>
                <Check />
                Plan follow-ups and keep documents close
              </li>
              <li>
                <Check />
                Review team roles and case assignments
              </li>
            </ul>
          </article>
          <article className="about-audience personal">
            <span className="about-audience-icon">
              <Users size={24} />
            </span>
            <h3>Common people & families</h3>
            <p>
              For individuals and families who want an approachable way to keep
              track of their own legal matters.
            </p>
            <ul>
              <li>
                <Check />
                Keep important case details in one place
              </li>
              <li>
                <Check />
                Follow dates, notes and related documents
              </li>
              <li>
                <Check />
                Understand what is shared and with whom
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section id="about-tools" aria-labelledby="tools-heading">
        <div className="about-section-heading">
          <div>
            <div className="eyebrow">PRACTICAL BY DESIGN</div>
            <h2 id="tools-heading">The everyday essentials, connected.</h2>
          </div>
          <span className="about-preview-label">Explore the current demo</span>
        </div>
        <div className="about-tools-grid">
          {tools.map(({ icon: Icon, title, text, to, action }) => (
            <Link
              to={to}
              className="about-tool"
              key={title}
              aria-label={action}
            >
              <Icon size={23} />
              <h3>{title}</h3>
              <p>{text}</p>
              <span>
                {action}
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="about-principles"
        id="about-principles"
        aria-labelledby="principles-heading"
      >
        <div className="about-section-heading">
          <div>
            <div className="eyebrow">WHAT GUIDES US</div>
            <h2 id="principles-heading">
              Useful technology. Considered choices.
            </h2>
          </div>
        </div>
        <div className="about-principles-grid">
          {principles.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="about-parent"
        id="about-parent"
        aria-labelledby="parent-heading"
      >
        <figure className="about-founder">
          <div className="about-founder-frame">
            <img
              src="/images/advocate-md-masum-billah.png"
              alt="Advocate Md. Masum Billah, founder of The Legal Doors"
              width="450"
              height="676"
              loading="lazy"
            />
          </div>
          <figcaption>
            <span>THE LEGAL DOORS</span>
            <strong>Advocate Md. Masum Billah</strong>
            <small>Founder · Khulna, Bangladesh</small>
          </figcaption>
        </figure>
        <div className="about-parent-copy">
          <div className="eyebrow">OUR LEGAL-SERVICES ROOTS</div>
          <h2 id="parent-heading">A product of The Legal Doors.</h2>
          <p>
            Based in Khulna, Bangladesh, and founded by Advocate Md. Masum
            Billah, The Legal Doors brings a legal-services perspective to Case
            Diary’s practical approach to organizing case information.
          </p>
          <span>
            <MapPin size={14} /> Khulna, Bangladesh
          </span>
          <div className="about-parent-purpose">
            <Scale size={24} />
            <p>
              Legal experience informs the purpose.
              <br />
              <strong>Everyday clarity guides the design.</strong>
            </p>
          </div>
          <a
            href="https://thelegaldoors.com/about/"
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Meet The Legal Doors <ExternalLink size={14} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>

      <section className="about-questions" aria-labelledby="questions-heading">
        <div>
          <div className="eyebrow">GOOD TO KNOW</div>
          <h2 id="questions-heading">
            A clear understanding,
            <br />
            from the start.
          </h2>
          <p>
            Case Diary supports organization and preparation. Important dates
            and procedural information should still be checked with your legal
            professional or an official source.
          </p>
          <Link to="/help" className="text-link">
            Visit Help & Support <ArrowRight size={14} />
          </Link>
        </div>
        <div className="about-faqs">
          <details>
            <summary>
              Does Case Diary provide legal advice?
              <ChevronDown size={16} />
            </summary>
            <p>
              Case Diary is a case-organization tool. Using it does not create
              an advocate-client relationship with The Legal Doors, provide
              legal representation or replace professional legal advice or
              official court records. The product is not presented as court- or
              government-endorsed.
            </p>
          </details>
          <details>
            <summary>
              What is available in this demo?
              <ChevronDown size={16} />
            </summary>
            <p>
              You can explore sample cases, hearing history, calendars,
              reminders, documents, reports and plan selection. Changes stay in
              browser memory and reset on refresh. Real sign-in, external
              notifications, shared access and payments are not connected. Use
              sample information only.
            </p>
          </details>
          <details>
            <summary>
              How is collaboration intended to work?
              <ChevronDown size={16} />
            </summary>
            <p>
              The product model uses individual accounts and permissions for a
              workspace or a specific case. Sharing one case should not expose
              unrelated cases. This demo previews roles and local invitation
              drafts; live sharing and enforced access controls require the
              connected service.
            </p>
          </details>
          <details>
            <summary>
              Where can I find plans and product information?
              <ChevronDown size={16} />
            </summary>
            <p>
              Explore <Link to="/billing">Subscription & Billing</Link> for the
              current demo plans, or read the{" "}
              <Link to="/privacy">privacy notice</Link> and{" "}
              <Link to="/terms">terms preview</Link>. Product-support contact
              details are not yet published; The Legal Doors link is for the
              parent firm’s information.
            </p>
          </details>
        </div>
      </section>
      <footer className="about-closing">
        <span>
          <Scale size={17} />
          <strong>Case Diary</strong>
          <span>Clarity. Every day.</span>
        </span>
        <Link to="/cases">
          Back to your cases <ArrowRight size={15} />
        </Link>
      </footer>
    </div>
  );
}
