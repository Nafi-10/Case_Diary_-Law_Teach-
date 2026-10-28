import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./store";
import { Shell } from "./components/Shell";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { Cases, CaseDetails, CaseForm } from "./pages/Cases";
import {
  CalendarPage,
  Documents,
  Reminders,
  Reports,
  Tasks,
} from "./pages/Productivity";
import { Billing, Help, Profile, Settings, Team } from "./pages/Workspace";
import {
  Auth,
  AccountLayout,
  Landing,
  LegalNotice,
  Onboarding,
  Pricing,
  PublicLayout,
} from "./pages/Public";
import "./styles.css";
import "./public.css";
import "./compact.css";
import "./plans.css";
import "./records.css";
import "./cases.css";
import "./about.css";
import "./guidance.css";
import { ScrollToTop } from "./components/RouteSupport";
import { StartupScreen } from "./components/StartupScreen";
import { useEffect, useState } from "react";

function App() {
  const [showStartup, setShowStartup] = useState(
    () => window.location.pathname === "/",
  );

  useEffect(() => {
    if (!showStartup) return;
    const timer = window.setTimeout(() => setShowStartup(false), 1400);
    return () => window.clearTimeout(timer);
  }, [showStartup]);

  if (showStartup) return <StartupScreen />;

  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="cases" element={<Cases />} />
            <Route path="shared" element={<Cases shared />} />
            <Route path="cases/new" element={<CaseForm />} />
            <Route path="cases/:id" element={<CaseDetails />} />
            <Route path="cases/:id/edit" element={<CaseForm />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="documents" element={<Documents />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="reports" element={<Reports />} />
            <Route path="team" element={<Team />} />
            <Route path="billing" element={<Billing />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<Help />} />
          </Route>
          <Route element={<PublicLayout />}>
            <Route path="welcome" element={<Landing />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="privacy" element={<LegalNotice type="privacy" />} />
            <Route path="terms" element={<LegalNotice type="terms" />} />
          </Route>
          <Route path="signin" element={<Auth key="signin" mode="signin" />} />
          <Route
            path="register"
            element={<Auth key="register" mode="register" />}
          />
          <Route element={<AccountLayout />}>
            <Route
              path="forgot-password"
              element={<Auth key="recovery" mode="recovery" />}
            />
            <Route path="onboarding" element={<Onboarding />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
