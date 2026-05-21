# Swim Starter — Coach Portal UI Prototype

A **mobile-first, frontend-only prototype** for the Swim Starter Coach Portal. Built with React + Vite + TypeScript. No backend, no real auth, no database.

---

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## What This Is

A clickable UI/UX prototype for swim coaches to manage daily class operations — attendance, student progress, equipment, safety alerts, parent communication, student transfers, leave management, and admin requests.

Designed to be usable by coaches aged 50+ with large fonts, clear buttons, and minimal typing.

**Not** a production app. All data is static mock data in `src/mockData.ts`.

---

## Design System

| Token | Value |
|---|---|
| Primary colour | Ocean Blue `#0369A1` |
| Accent | Sky `#0EA5E9` |
| Body text | Near-black `#1E293B` |
| App background | Ice Blue `#F0F9FF` |
| Phone surface | Light Blue `#DDEEFA` |
| Border | Blue-tinted `#B1DDFA` |
| Topbar background | Fixed `#F0F9FF` (independent of `--surface`) |
| Font | Inter (Google Fonts) |
| Min body font | 18px (scales to 22px via More → Text size) |
| Min button height | 42px |
| Card gap | 18px |
| Phone frame width | 430px max |
| Phone frame radius | 28px |

### UI Principles

- **Minimal and clean** — flat cards, blue-tinted borders, 18px gap between cards
- **HelpTip ("?")** — tap `?` beside any section header for a plain-language tooltip
- **Bottom navigation** — 5 tabs always visible (Today / Classes / Coach / Inbox / More)
- **Hamburger drawer** — slides in from the left, contained inside the phone frame
- **Login screen** — blue gradient panel with TSS logo image (`tss-logo.png`)
- **Static login** — any email + password is accepted

### Hero Card Theme

Two components use the blue gradient (`linear-gradient(135deg, #0369A1 → #0EA5E9)`):
- **Today tab** — `hero-card clean` (dashboard card)
- **Coach tab — Leave Application card** — `section-card hero`

Inside hero-themed cards, CSS custom properties are scoped locally so `var(--text-soft)`, `var(--border)`, and `var(--surface-soft)` all resolve to white-transparent equivalents automatically. Buttons inside hero cards use the amber `primary-button` style.

---

## Navigation (5 tabs)

| Tab | Contents |
|---|---|
| **Today** | Daily dashboard hero card, lightning alert banner, quick-action grid |
| **Classes** | Schedule grouped by day, pool/day/timeslot filters, drill into class roster |
| **Coach** | Leave application, revenue summary, monthly attendance history |
| **Inbox** | Notification cards (unread / read) |
| **More** | Emergency/safety, admin request form, text size setting |

---

## Screens & Pages

### Login
- Blue gradient panel, TSS logo, email + password fields, Sign in button
- Any credential is accepted (prototype only)

### Today (root tab)
- Hero card: coach name, next class level · day · start time, pool, metrics (classes today / first class time)
- Lightning alert banner (active by default in mock)
- Quick-action grid: Message Parent, Inform Admin, Safety

### Classes (root tab)
- Schedule grouped by day (Saturday → Sunday)
- Filters: Pool, Day, Timeslot — dropdown selects; blue badge shows class count
- Each class card: timeslot `h3`, student count badge, pool name; taps to Class Detail
- Class Detail → Compact Roster → Student Profile → Transfer

### Coach (root tab)
Three cards:
1. **Leave Application** (hero gradient) — Apply leave / View applied leave; amber buttons
2. **Revenue** (white card) — Monthly + lifetime revenue at $90/student
3. **Attendance History** (white card) — Month-on-month summary; 5 months shown; chevron arrow → full history page

### Inbox (root tab)
- Unread notifications with mark-as-read button
- Read notifications section below

### More (root tab)
- Emergency / Safety shortcut
- Admin request (coach-to-admin comment)
- Text size accessibility setting

### Sub-pages (back-navigable)

| Page | Accessed from |
|---|---|
| Class Detail | Classes → class card |
| Attendance Workspace | Class Detail |
| Student Profile | Attendance roster row arrow |
| Student Transfer | Student Profile → Transfer → |
| Leave Application Form | Coach → Apply here |
| Applied Leave History | Coach → View applied leave |
| Attendance History (all months) | Coach → attendance card chevron |
| Lightning Alert | Today alert / topbar lightning icon |
| Emergency / Safety | More → Open safety tools |
| Admin Request | More / Today quick action |
| WATI Message | Today / Student Profile |
| Settings | Drawer → Settings |

---

## Student Transfer Flow

1. Classes → tap class card → Class Detail
2. Class Detail → tap student arrow → Student Profile
3. Student Profile → Transfer → Transfer screen
4. Pick Pool / Day / Timeslot via dropdowns; closest class auto-selected
5. **Transfer** (green) → "Pending Parent Approval" state; success banner shown
6. **Cancel** (red) → discards and returns

Transfer state is lifted to the App root (`Record<string, TransferRequest>` keyed by `studentId`), so pending transfers are visible across screens.

---

## Coach Attendance History

Sessions aggregated month-on-month via `buildMonthlyHistory()`:
- Each row: month label, attended count, on-leave count, monthly revenue badge
- Approved leave dates cross-referenced with session dates — matching sessions marked "On Leave" with $0 revenue
- Coach tab shows 5 most recent months; full list on Attendance History page

---

## Mock Data Summary

**5 classes** — Saturday × 3 (Bishan + Shelter), Sunday × 2 (Bishan + Sengkang)

**20 students** across all classes with varying: `studentStatus`, `paymentStatus`, `equipmentStatus`, `pauseQuitStatus`, `readiness`, `progress`

**8 coach sessions** across April–May 2026 for attendance history demo

**4 notifications** (alert, action-required, success, info)

---

## Font Size Setting

| Level | Body | Heading |
|---|---|---|
| Normal | 18px | 28px |
| Large | 20px | 30px |
| Extra Large | 22px | 32px |

Applied via `data-font-scale` attribute on `<html>`. All elements use CSS variables — no hardcoded `px` font sizes.

---

## Project Structure

```
src/
  App.tsx            — all screens, components, state (single-file)
  mockData.ts        — typed mock data (coach, classes, students, notifications)
  styles.css         — design tokens, all component styles
  tss-logo.png       — TSS brand logo (used in login + drawer)
  main.tsx           — React entry point

README.md                        — developer quick-start (this file)
handover.md                      — AI session handover notes
coach-portal-documentation.md   — full UI/UX documentation for backend integration
coach-portal-readme.md           — original product requirements
```

---

## Out of Scope (prototype)

No database · No API · No real auth · No WATI integration · No Supabase · No Airtable · No payment processing · No parent portal · No production deployment

---

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- No UI library — custom CSS only
- No routing library — screen state via React `useState`
