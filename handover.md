# AI Progress Handover

## Current State

The prototype is **live and running** at `http://localhost:5173` (`npm run dev`).

All major navigation and core flows are implemented. TypeScript compiles clean — no unused locals, no unused parameters.

---

## What Has Been Built

### Navigation

Bottom nav: **Today / Classes / Coach / Inbox / More**

| Tab | Status |
|---|---|
| Today | ✅ Hero dashboard, lightning alert, next class, quick actions |
| Classes | ✅ Schedule overview, filters, full drill-down to transfer |
| Coach | ✅ Leave application (hero card), revenue, monthly attendance history |
| Inbox | ✅ Unread / read notification cards |
| More | ✅ Emergency/safety, admin request, text size setting |

---

### Login Screen

- Blue gradient panel (`linear-gradient(135deg, var(--primary) → var(--sky))`)
- TSS logo image (`tss-logo.png`) in white-background brand mark
- Email + password fields; any credential accepted
- "Forgot your password?" text link (non-functional in prototype)

---

### Today Tab

- `hero-card clean` — blue gradient, coach name, next class details, metric chips
- Lightning alert banner (`alert-card`) — active by default in mock; Turn off / View procedure
- Quick-action grid: Message Parent, Inform Admin, Safety (each tap opens a sub-page)

---

### Classes Tab

- Classes grouped by day (Saturday → Sunday)
- Three filters: Pool, Day, Timeslot — dropdown selects; defaults to Saturday
- Blue badge shows class count in filter card header
- Each class card: timeslot range as `h3`, student count badge, pool name
- Class Detail → Compact Roster (`CompactRosterRow`) → Student Profile → Transfer

---

### Coach Tab

**Card 1 — Leave Application** (`section-card hero`)
- Blue gradient background matching Today hero card
- CSS custom properties scoped locally — all `var()` references resolve to white-transparent inside the card
- Amber `primary-button` for Apply here / View applied leave
- Sub-pages: Leave Application Form, Applied Leave History

**Card 2 — Revenue** (standard white `section-card`)
- Monthly revenue (current month) + lifetime revenue
- Rate: $90 per student per session (constant `COACH_RATE_PER_STUDENT`)
- Month badge shows shortcode (e.g. "May-26")

**Card 3 — Coach Attendance History** (standard white `section-card`)
- Sessions aggregated by month via `buildMonthlyHistory()`
- Each row: month name + year, attended/on-leave counts, monthly revenue (green badge)
- Approved leave cross-referenced — matching session dates marked "On Leave" with $0 revenue
- Shows 5 most recent months; `student-detail-arrow` chevron → full Attendance History page
- "View all records" secondary button appears when > 5 months exist

---

### Inbox Tab

- Unread notifications with mark-as-read checkmark button
- Read section below; tone matches notification variant (alert/success/blue/default)

---

### More Tab

- Emergency / Safety shortcut → safety page
- Admin request → AdminComment screen (coach-to-admin text)
- Text size setting (Normal / Large / Extra Large)

---

### Hamburger Drawer

- Rendered inside `.phone-screen` (not at App root) — constrained by `overflow: hidden`
- Lists all 5 nav tabs + Settings + Sign out
- Receives `menuOpen` as prop from App → AppShell

---

### Sub-pages

All back-navigable. Page state managed as a stack in App root (`pageStack: PageState[]`).

| Key | Description |
|---|---|
| `classDetail` | Class info + compact student roster |
| `attendance` | Full attendance workspace per class |
| `studentProfile` | Student detail + transfer launch |
| `transferStudent` | Transfer form (pool / day / timeslot dropdowns) |
| `leaveApplication` | Leave application form |
| `leaveHistory` | Applied leave history (pending / upcoming / past) |
| `attendanceHistory` | All monthly attendance records |
| `lightningAlert` | Lightning alert toggle + land drill mode |
| `emergency` | Emergency / safety quick actions |
| `adminRequest` | Coach-to-admin comment form |
| `messageParent` | WATI message draft |
| `settings` | Text size accessibility setting |
| `coachAttendance` | Coach check-in status stub |
| `equipmentIssue` | Equipment issue report stub |

---

## Key Decisions Made

| Decision | Detail |
|---|---|
| **Login screen is hero-styled** | Blue gradient panel, TSS logo image, white field labels |
| **Hero theme on Leave Application only** | `section-card hero` on Leave Application card; Revenue + Attendance History remain white |
| **Attendance history is month-on-month** | Aggregated via `buildMonthlyHistory()` — no per-date/timeslot rows |
| **5-record limit on Coach tab** | `monthlyHistory.slice(0, 5)`; full history on separate page via chevron arrow |
| **Drawer inside phone frame** | `<Drawer>` rendered inside `AppShell` → `.phone-screen`; `overflow: hidden` clips it correctly |
| **Topbar pinned to `#F0F9FF`** | `.topbar { background: #F0F9FF }` — does not follow `--surface` token |
| **Card gap 18px** | `.screen-scroll { gap: 18px }` |
| **Phone frame uses CSS variables** | `--app-shell-padding`, `--app-max-width`, `--app-radius` for shell layout |
| **Font scale fully reactive** | All sizes use CSS variables; set via `data-font-scale` on `<html>` |
| **Transfer state at App root** | `Record<string, TransferRequest>` keyed by `studentId` — shared across screens |
| **No Students standalone tab** | Students accessed within class drill-down only |
| **Attendance chips** | Present / Absent only — Late removed |
| **Equipment card conditional** | Only shown when `equipmentStatus !== "Not Required"` |
| **Revenue rate** | `COACH_RATE_PER_STUDENT = 90` constant in App.tsx |

---

## CSS Tokens (current values)

```css
--surface:           #ddeefa    /* phone screen background */
--surface-soft:      #f7fbff
--border:            #b1ddfa
--bg:                #f0f9ff    /* topbar, app shell background */
--primary:           #0369a1
--sky:               #0ea5e9
--amber:             #fbbf24
--app-shell-padding: 16px
--app-max-width:     430px
--app-radius:        28px
```

---

## Remaining Work / Next Priorities

### High priority
- **classDetail page**: consider simplifying the flow — currently goes Classes → classDetail → attendance roster; may be cleaner to go directly to the roster

### Medium priority
- Expand stub screens: Progress Update submission, Test Readiness sign-off, Equipment issue with photo placeholder
- Realistic per-class student rosters (currently each class has its own set of students in mock data; ensure class detail page only shows its assigned students)
- Parent portal placeholder screen (referenced in transfer confirmation)

### Low priority / nice to have
- Transition animations on attendance card expand/collapse
- Swipe-to-mark-present for faster poolside use
- Search/filter within class roster

---

## Open Blockers / Risks

- Headless browser automation (`playwright`) unavailable in this WSL2 environment. Manual review via `http://localhost:5173` required.
- Revenue calculation is fixed at $90/student/session — actual rate logic (per hour, per level, contracted rate) needs clarification from business before backend implementation.

---

## File Reference

| File | Purpose |
|---|---|
| `src/App.tsx` | All screens, components, state — single file |
| `src/mockData.ts` | Typed mock data: coach, classes, students, notifications |
| `src/styles.css` | Design tokens, all component styles |
| `src/tss-logo.png` | TSS brand logo |
| `src/main.tsx` | React entry point |
| `README.md` | Developer quick-start |
| `handover.md` | This file — AI session progress notes |
| `coach-portal-documentation.md` | Full UI/UX spec for backend integration |
| `coach-portal-readme.md` | Original product requirements |
