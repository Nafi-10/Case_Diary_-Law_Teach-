# Verification — 28 October 2026

## Automated checks

- `npm test`: 12 tests passed.
- `npm run lint`: passed with no errors.
- `npm run typecheck`: passed.
- `npm run build`: passed, production assets generated in `dist/`.
- Dependency audit after upgrading the test runner and installing the formatter: 0 vulnerabilities reported.

The tests first reproduced the consequential business-rule issues, then passed after the fixes. They cover case filters, append-only hearing history, both plan tables, validated bonus eligibility, registration validation, owning-workspace quotas, file validation, safe CSV export, edits after downgrades, and dates at the UTC/Bangladesh midnight boundary.

## Browser checks

Verified in the Codex in-app browser against the local Vite server:

- Created a fictional case and opened its detail workspace; case counts updated.
- Added a hearing entry using the native date picker; next date and chronological history updated.
- Created a reminder, completed it, and confirmed it moved to the Completed tab.
- Switched to Common Person; chamber-only test records were absent and the owning-workspace allowance excluded the shared case.
- Confirmed the personal profile and personal onboarding omit Bar Council fields.
- Opened a labeled sample document preview.
- Uploaded `docs/sample-upload.txt` through the file chooser and opened its local preview.
- Filled a valid sample registration, confirmed the onboarding action became enabled, and opened the tailored personal onboarding screen. No real registration occurred.
- Inspected desktop dashboard and public landing page screenshots.
- Checked the dashboard and 21 other main routes at 390 px with no document-level horizontal overflow.
- Checked dashboard, cases, calendar, billing, landing, and pricing at 320 px, 768 px, and 1280 px with no document-level horizontal overflow.
- Confirmed the closed mobile sidebar is hidden, removing it from keyboard/screen-reader navigation.

The native date picker was used for the browser date test because this browser adapter’s programmatic `fill` did not commit date-input values. Human date-picker selection correctly updated the controlled form.

Source reformatting during development temporarily invalidated hot-reload context identities. Fresh navigations after edits rendered correctly; these were development refresh errors rather than errors in the built artifact. Changes intentionally reset after browser refresh.

## Independent review

A read-only review identified and resolved three issues:

1. Quota checks now apply only when increasing the owning workspace’s active-case usage. Shared and existing active cases remain editable after a downgrade.
2. Closed mobile navigation is hidden rather than merely translated offscreen. Escape returns focus to the menu trigger.
3. Hearing timestamps are converted to Asia/Dhaka before deriving their displayed and updated date.

No production backend, identity, authorization, notification, verification, or payment integration was represented as tested. Those services do not exist in this workspace. See `README.md` for the integration boundary and setup instructions.

## Preview artifact

`docs/screenshots/dashboard.jpg` records the finished dashboard. The local preview starts at `/`; the public website is at `/welcome`.

## Compact UI and reference pricing update — 29 October 2026

- `/signin`: one-click Common person and Advocate demos open the correct isolated workspace without credentials. Public demo links now lead here.
- `/register`: all fields, consent, action and footer fit at 1366 × 680. A valid sample registration enabled Continue to profile setup and opened personal onboarding without Bar Council fields.
- `/calendar`: all 42 cells fit within the viewport, including the bottom week. Month navigation and Schedule/Deadlines controls work. Growing lists paginate, with contained overflow for unusually long content.
- `/reports`: four panels, filters and export remain visible; status filtering, reset and hearing pagination work. Two edited sample cases produced five assigned advocates (including a long name); both pages and pagination stayed inside the panel without overlap.
- `/billing`: all five plans fit at 1920 × 945, 1366 × 680 and 1150 × 680. Details dialog, plan-selection confirmation and demo plan change work. Downgrade warnings reuse the compact notice and preserve records. Personal cards also fit at 1366 × 680.
- Follow-up reference design: dark forest plan panels, champagne-gold recommendation treatment and diagonal ribbon, raised center card, features followed by button and price. Current-plan controls remain readable and disabled; other cards still open plan confirmation.
- Mobile views checked at 390 × 844 without horizontal page overflow. Vertical scrolling remains available for readable small-screen content; short desktop windows below 680px also use natural flow.
- Independent review identified two layout problems (narrow desktop pricing columns and growing advocate list clipping); both were fixed and checked in the browser.
- Existing automated suite: 12/12 passed. Lint and TypeScript/Vite build run after final styling changes.

New screenshots: `signin-compact.jpg`, `register-compact.jpg`, `calendar-compact.jpg`, `reports-compact.jpg`, and `billing-reference.jpg` under `docs/screenshots/`.

## Public pricing and case table refinement — 29 October 2026

- Both public pricing audiences now use the shared forest-and-gold reference cards. Full feature lists and existing prices remain intact; Plus and Family retain the gold recommendation treatment.
- Verified the audience toggle and registration links: Plus opens `type=advocate&plan=Plus`; Family opens `type=personal&plan=Family`.
- Inspected pricing at 1366px desktop and 320/390/768px responsive widths. No document-level horizontal overflow; card text and buttons remain within their cards. Phone buttons are 46px tall and cards stack in one column. The decorative ribbon is intentionally clipped to its card.
- Case table rows and mobile cards share pastel status colors with a text legend and badges. Active, Pending and Closed rows were inspected; Archived correctly displayed the empty state in the seed dataset.
- Hearing chips show Today, Tomorrow and days within the next week. Closed cases have no urgency labels. Unit tests cover the seven-day/month boundary, past dates, missing/invalid dates and closed/archived cases.
- Verified status filtering, reset, search with no matches, and clearing filters. Case views fit horizontally at 320/390/768px; mobile court, date and sort controls remain readable, and all five status tabs fit at 320px.
- Confirmed billing still displays all five cards with no page scrolling at 1366 × 680 after the shared component change.
- `npm test`: 15/15 passed. Final `npm run lint` and TypeScript/Vite production build passed. No browser console errors were captured in the final pricing check.
- Saved previews in `docs/screenshots/`: `public-pricing-advocates.jpg`, `public-pricing-personal.jpg`, `public-pricing-mobile.jpg`, `cases-highlighted.jpg`, and `cases-mobile.jpg`.

## Shared table colors and About Case Diary — 29 October 2026

- Centralized the light status palette in `src/records.css` and applied it to every actual table: cases, dashboard recent cases, and document list. Equivalent document cards, mobile recent cases, members, tasks and reminders use the same palette with text labels.
- Added `actionHighlight` and `ActionStatus`. Completed records take precedence over overdue dates; past-due actions use soft rose, due-today actions champagne, scheduled actions blue, and completed actions sage. Two new tests cover these transitions and date boundaries; all 17 tests pass.
- Browser-checked task and reminder completion: the badge and background change together. Reset the task test; demo records reset on navigation reload as documented.
- Document list becomes labeled cards at phone widths, retaining document/category/case/uploaded/actions. Preview dialog works at 320px. Filters, long member details and role selectors stay inside the layout.
- About is located directly after Settings and before Help for both account types. Sidebar click, mobile navigation close, section anchors and FAQ expansion work. Content is adapted from the supplied DOCX; implementation claims are bounded to the demo. The parent-brand information links to the official firm site.
- Added the user-supplied portrait of Advocate Md. Masum Billah unchanged as a local asset. It appears in an arched gold frame with an accessible description and founder caption. Verified the image loads at its source width of 450px and stacks cleanly on mobile.
- Checked About and portrait at 1366/768/390/320px, document list at desktop/390/320px, tasks/reminders at 320px, and dashboard/team/cases at 320/768px. No document-level horizontal overflow. Desktop billing and the expanded sidebar still fit at 1366 × 680.
- Fresh read-only review found no significant issues; dashboard status labeling and final-card borders were polished following the review. Lint and TypeScript/Vite build passed.
- Saved `about-desktop.jpg`, `about-mobile.jpg`, `about-founder.jpg`, `about-founder-mobile.jpg`, `documents-highlighted.jpg`, `documents-mobile.jpg`, and `dashboard-highlighted.jpg` in `docs/screenshots/`.

## Section guides and project footer — 29 October 2026

- Added a contextual guide above every workspace section, including case creation, details and editing. Public pricing also has a guide. Personal profile and family-member wording matches the selected account. Each guide includes purpose, three detailed steps, benefits and a relevant demo note.
- Native disclosures are keyboard operable and reset on route/account changes. Three columns become two on tablets and one on phones. Expanded content uses natural page flow.
- Added a forest-green and gold project footer with product/help links, parent-brand attribution and demo information. Workspace footer is expandable; the public website shows the full design.
- Verified every sidebar route, case route precedence, personal account guides, pricing audience toggle, footer navigation and keyboard expansion. Checked widths 320, 390, 768, 1100 and 1366px without horizontal overflow in the added components.
- Calendar, reports and billing remain 680px tall at a 1366×680 viewport with guides/footer collapsed. Main content ends before the footer. Billing may grow naturally on narrower desktop widths; open guides and footer never overlap the workspace.
- Reports show two overdue/hearing entries per page, with all remaining results available through existing pagination. Billing header actions wrap on mobile, with a 44px cancellation button.
- Independent review found no structural blockers. Corrected three guide-copy discrepancies against the actual controls and report metric.
- Final verification: 17 tests passed, lint passed, production build passed. Screenshots: `section-guide-desktop.png`, `section-guide-mobile.png`, `project-footer-desktop.png`, `footer-mobile.png`. Browser viewport restored.

## Always-visible footer — 29 October 2026

- Removed the footer disclosure and its toggle styles. The full forest-green/gold footer now renders directly on workspace, public, sign-in, registration, recovery and onboarding routes.
- Workspace footer follows the main content as a separate block, preserving the compact work area while allowing the full footer to appear below it in normal page flow. Section guides remain closed by default and keyboard-collapsible.
- At 1366×680, calendar, reports and billing content ended at 672px and the footer began at 680px, without overlap. Expanded billing guidance also left the footer below the content.
- Checked all four account routes and all four public routes at 390px: one footer each, no disclosure and no horizontal overflow. Verified the workspace footer at 390px, and guide open/close behavior plus 44px footer links at 320px.
- TypeScript check, all 17 tests, lint and production build passed. Saved `footer-visible-desktop.png` and `footer-visible-mobile.png`. Restored the viewport and dashboard.

## Account footer adjustment and source handoff — 29 October 2026

- Sign-in and registration now render outside the footer-bearing account layout. Browser checks confirmed zero project footers on `/signin`, `/register` and `/register/`; recovery and onboarding still each have one footer.
- Kept the existing compact account design and inline privacy/terms links. Saved `signin-no-footer.png` as a visual check.
- Updated README with extraction, VS Code folder selection, Node/npm setup, Windows terminal guidance, dependency installation and localhost commands. The source package includes code, assets, tests, configuration, lockfile, documentation/screenshots and the supplied product brief; generated dependencies, builds and logs are excluded.
- All 17 tests, lint and production build passed before packaging.
