import { Scale, Sparkles } from "lucide-react";

export function StartupScreen() {
  return (
    <main className="startup-screen" role="status" aria-live="polite">
      <div className="startup-glow startup-glow--left" aria-hidden="true" />
      <div className="startup-glow startup-glow--right" aria-hidden="true" />
      <div className="startup-content">
        <div className="startup-emblem" aria-hidden="true">
          <span className="startup-emblem-ring" />
          <Scale size={34} strokeWidth={1.5} />
          <Sparkles className="startup-sparkle" size={16} />
        </div>
        <h1>Case Diary</h1>
        <p className="startup-tagline">Clarity. Every day.</p>
        <p className="startup-credit">
          This project is a product of{" "}
          <a href="https://thelegaldoors.com/" target="_blank" rel="noreferrer">
            thelegaldoors.com
          </a>
        </p>
        <p className="startup-message">Preparing your workspace</p>
        <div className="startup-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </main>
  );
}
