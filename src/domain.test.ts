import { describe, expect, it } from "vitest";
import {
  actionHighlight,
  hearingHighlight,
  activeLimit,
  appendHearing,
  countOwnedActiveCases,
  csvCell,
  filterCases,
  PLANS,
  profileFields,
  registrationErrors,
  validateDocuments,
} from "./domain";
import type { CaseRecord, Profile } from "./types";
import { wouldExceedCaseLimit } from "./domain";
import { formatDate } from "./data/demo";
const profile: Profile = {
  name: "Ahmed",
  email: "a@example.com",
  phone: "",
  enrollment: "",
  association: "",
  location: "",
  proof: "",
  image: "",
  verification: "Incomplete",
};
const c: CaseRecord = {
  id: "1",
  number: "CR 123/2026",
  party: "Rahman",
  opposite: "Karim",
  court: "Dhaka",
  type: "Civil",
  status: "Active",
  hearing: "2026-10-28",
  time: "10:00",
  proceeding: "",
  advocate: "Ahmed",
  filed: "",
  notes: "",
  updated: "",
  history: [],
};
describe("action highlights", () => {
  it("gives completion precedence over an old due date", () => {
    expect(actionHighlight(true, "2026-10-20", "2026-10-29")).toEqual({
      tone: "active",
      label: "Completed",
    });
  });
  it("distinguishes past, current and future dates across a month boundary", () => {
    expect(actionHighlight(false, "2026-10-28", "2026-10-29")).toEqual({
      tone: "attention",
      label: "Past due",
    });
    expect(actionHighlight(false, "2026-10-29", "2026-10-29")).toEqual({
      tone: "pending",
      label: "Due today",
    });
    expect(actionHighlight(false, "2026-11-01", "2026-10-29")).toEqual({
      tone: "closed",
      label: "Scheduled",
    });
    expect(actionHighlight(false, "", "2026-10-29")).toEqual({
      tone: "archived",
      label: "No date",
    });
  });
});
describe("hearing date highlights", () => {
  it("labels today, tomorrow and the next seven days across a month boundary", () => {
    expect(
      hearingHighlight({ ...c, hearing: "2026-10-29" }, "2026-10-29"),
    ).toEqual({ tone: "today", label: "Today" });
    expect(
      hearingHighlight({ ...c, hearing: "2026-10-30" }, "2026-10-29"),
    ).toEqual({ tone: "soon", label: "Tomorrow" });
    expect(
      hearingHighlight({ ...c, hearing: "2026-11-05" }, "2026-10-29"),
    ).toEqual({ tone: "soon", label: "In 7 days" });
    expect(
      hearingHighlight({ ...c, hearing: "2026-11-06" }, "2026-10-29"),
    ).toBeNull();
  });
  it("flags a past active hearing for review without implying it was missed", () => {
    expect(
      hearingHighlight(
        { ...c, hearing: "2026-10-28", status: "Pending" },
        "2026-10-29",
      ),
    ).toEqual({ tone: "review", label: "Review date" });
  });
  it("does not assign urgency to closed, archived, absent or invalid dates", () => {
    for (const status of ["Closed", "Archived"] as const) {
      expect(hearingHighlight({ ...c, status }, "2026-10-29")).toBeNull();
    }
    expect(hearingHighlight({ ...c, hearing: "" }, "2026-10-29")).toBeNull();
    expect(
      hearingHighlight({ ...c, hearing: "invalid" }, "2026-10-29"),
    ).toBeNull();
  });
});
describe("review regressions", () => {
  it("permits existing and shared case edits while blocking new owned active cases over quota", () => {
    const shared = { ...c, id: "shared", shared: true };
    expect(wouldExceedCaseLimit([c, shared], shared, 1)).toBe(false);
    expect(
      wouldExceedCaseLimit(
        [c, { ...c, id: "2" }],
        { ...c, notes: "Edited" },
        1,
      ),
    ).toBe(false);
    expect(wouldExceedCaseLimit([c], { ...c, id: "new" }, 1)).toBe(true);
    expect(
      wouldExceedCaseLimit(
        [c, { ...c, id: "closed", status: "Closed" }],
        { ...c, id: "closed", status: "Active" },
        1,
      ),
    ).toBe(true);
  });
  it("dates hearing updates in Bangladesh at the UTC date boundary", () => {
    const entry = {
      id: "utc",
      date: "2026-10-28",
      proceeding: "Review",
      notes: "",
      next: "2026-11-01",
      author: "Ahmed",
      created: "2026-10-27T18:30:00.000Z",
    };
    expect(appendHearing(c, entry).updated).toBe("2026-10-28");
    expect(formatDate(entry.created)).toBe("28 Oct 2026");
    expect(formatDate("2026-10-28")).toBe("28 Oct 2026");
  });
});
describe("shared-case ownership and file boundaries", () => {
  it("counts active cases against the owning workspace only", () => {
    expect(
      countOwnedActiveCases([
        c,
        { ...c, id: "2", shared: true },
        { ...c, id: "3", status: "Pending" },
        { ...c, id: "4", status: "Closed" },
      ]),
    ).toBe(2);
    expect(countOwnedActiveCases([c], "1")).toBe(0);
  });
  it("rejects oversized or executable uploads but permits normal documents", () => {
    expect(
      validateDocuments([{ name: "order.pdf", size: 11 * 1024 * 1024 }]),
    ).toContain("10 MB");
    expect(validateDocuments([{ name: "payload.html", size: 100 }])).toContain(
      "PDF",
    );
    expect(
      validateDocuments([
        { name: "order.PDF", size: 1024 },
        { name: "notes.txt", size: 900 },
      ]),
    ).toBe("");
  });
  it("neutralizes spreadsheet formulas while quoting CSV values", () => {
    expect(csvCell('=HYPERLINK("x")')).toBe('"\'=HYPERLINK(""x"")"');
    expect(csvCell("Rahman, Ltd.")).toBe('"Rahman, Ltd."');
  });
});
describe("case search and history", () => {
  it("combines text, status, court, date and supports opposite party", () => {
    expect(filterCases([c], "KARIM", "Active", "Dhaka", "2026-10-28")).toEqual([
      c,
    ]);
    expect(filterCases([c], "Karim", "Closed")).toEqual([]);
    expect(filterCases([c], "missing")).toEqual([]);
    expect(filterCases([c], "", "All", "Sylhet")).toEqual([]);
    expect(filterCases([c], "", "All", "All", "2027-01-01")).toEqual([]);
  });
  it("appends without overwriting history and advances next date", () => {
    const entry = {
      id: "h1",
      date: "2026-10-28",
      proceeding: "Arguments",
      notes: "Adjourned",
      next: "2026-11-04",
      author: "Ahmed",
      created: "2026-10-28",
    };
    const first = appendHearing(c, entry);
    const second = appendHearing(first, {
      ...entry,
      id: "h2",
      next: "2026-11-10",
    });
    expect(second.history).toHaveLength(2);
    expect(second.hearing).toBe("2026-11-10");
    expect(c.history).toHaveLength(0);
  });
});
describe("product policy", () => {
  it("preserves every specified price and allowance", () => {
    expect(PLANS.advocate.map((p) => [p.price, p.users, p.cases])).toEqual([
      [0, 1, 1],
      [499, 1, 30],
      [999, 3, 150],
      [1999, 6, 500],
      [3499, 10, 2000],
    ]);
    expect(PLANS.personal.map((p) => [p.price, p.users, p.cases])).toEqual([
      [0, 1, 2],
      [199, 1, 10],
      [499, 3, 30],
      [999, 6, 100],
      [1499, 10, 300],
    ]);
  });
  it("does not award the profile bonus to unvalidated demo uploads", () => {
    expect(
      activeLimit(
        { name: "Free", price: 0, users: 1, cases: 1, bonus: 3 },
        {
          ...profile,
          enrollment: "A",
          association: "D",
          location: "D",
          proof: "file.pdf",
          image: "photo.png",
          verification: "Pending Verification",
        },
      ),
    ).toBe(1);
  });
  it("awards qualifying validated profiles without changing verification", () => {
    const complete = {
      ...profile,
      enrollment: "A",
      association: "D",
      location: "D",
      proof: "proof.pdf",
      image: "image.png",
      bonusEligible: true,
    };
    expect(profileFields(complete)).toEqual([true, true, true, true, true]);
    expect(
      activeLimit(
        { name: "Starter", price: 499, users: 1, cases: 30, bonus: 50 },
        complete,
      ),
    ).toBe(50);
    expect(complete.verification).toBe("Incomplete");
  });
});
describe("registration validation", () => {
  it("rejects invalid email, weak password, mismatches and missing consent", () => {
    expect(
      Object.keys(
        registrationErrors({
          name: "",
          email: "invalid",
          password: "a",
          confirm: "b",
          accepted: false,
        }),
      ).sort(),
    ).toEqual(["accepted", "confirm", "email", "name", "password"]);
  });
  it("accepts non-Gmail email providers and valid fields", () => {
    expect(
      registrationErrors({
        name: "A User",
        email: "a@example.org",
        password: "StrongPassword1!",
        confirm: "StrongPassword1!",
        accepted: true,
      }),
    ).toEqual({});
  });
});
