import { ArrowRight, ArrowUpRight, Leaf, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { todayISO } from "../data/demo";

function FooterContents() {
  return (
    <div className="footer-contents">
      <div className="footer-editorial">
        <span className="footer-eyebrow">
          <Leaf size={14} aria-hidden="true" /> THOUGHTFULLY MADE FOR YOUR LEGAL
          LIFE
        </span>
        <h2>
          Every case.
          <br />A clearer <em>next chapter.</em>
        </h2>
        <p>
          A little more order for your cases, your people and everything that
          comes next.
        </p>
        <Link to="/about" className="footer-story-link">
          Discover our story <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <nav className="footer-navigation" aria-label="Footer navigation">
        <div>
          <h3>Explore Case Diary</h3>
          <Link to="/welcome">
            The product <ArrowRight size={12} aria-hidden="true" />
          </Link>
          <Link to="/pricing">Plans & pricing</Link>
          <Link to="/signin">Try a demo workspace</Link>
        </div>
        <div>
          <h3>A little guidance</h3>
          <Link to="/help">Help & support</Link>
          <Link to="/about#about-parent">The people behind it</Link>
          <Link to="/privacy">Privacy notice</Link>
          <Link to="/terms">Terms preview</Link>
        </div>
      </nav>
      <div className="footer-signature">
        <Link to="/welcome" className="footer-wordmark">
          <Scale size={24} aria-hidden="true" />
          Case Diary<span>CLARITY. EVERY DAY.</span>
        </Link>
        <p>
          A product of <Link to="/about#about-parent">The Legal Doors</Link>
          <span>Created with Bangladesh in mind.</span>
          <span>
            Designed and developed by{" "}
            <a
              href="https://kazi-jawad.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              Kazi Jawad
            </a>
          </span>
        </p>
      </div>
      <div className="footer-fineprint">
        <span>© {todayISO().slice(0, 4)} Case Diary</span>
        <span>
          <i aria-hidden="true" />
          Product preview · Sample data resets on refresh
        </span>
      </div>
    </div>
  );
}

export function ProjectFooter({
  variant = "workspace",
}: {
  variant?: "workspace" | "public";
}) {
  return (
    <footer
      className={`project-footer project-footer--${variant}`}
      aria-label="Case Diary footer"
    >
      <FooterContents />
    </footer>
  );
}
