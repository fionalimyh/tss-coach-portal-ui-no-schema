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

A clickable UI/UX prototype for swim coaches to manage daily class operations — attendance, student progress, equipment, safety alerts, parent communication, and admin requests.

Designed to be usable by coaches aged 50+ with large fonts, clear buttons, and minimal typing.

**Not** a production app. All data is static mock data.

---

## Design System

| Token | Value |
|---|---|
| Primary colour | Ocean Blue `#0369A1` |
| Accent | Sky `#0EA5E9` |
| Primary buttons | Amber Yellow `#FBBF24` |
| Body text | Near-black `#1E293B` |
| Background | Ice Blue `#F0F9FF` |
| Font | Inter (Google Fonts) |
| Min body font | 18px (scales up to 22px via Settings) |
| Min button height | 52px |

---

## Screens (27 total)

### Authentication
- Login (email + password — static, any input works)

### Main Navigation (5 tabs)
- **Today** — dashboard, alerts, next class, check-in, quick actions
- **Classes** — weekly schedule, class detail, attendance, equipment
- **Students** — profiles, progress, test readiness, trial notes
- **Inbox** — alerts, schedule updates, admin replies, parent messages
- **More** — coach attendance, referrals, leave/MC, admin requests, settings

### Overlays / Sub-screens
Class Detail · Child Attendance · Attendance Summary · Equipment Checklist · Equipment Issue Report · Coach Handover Notes · Lightning Alert · Land Drill Mode · Student Profile · Child Progress · Test Readiness · Trial Student Notes · New Student First-Class Notes · Student Transfer Request · Parent WhatsApp Placeholder · Admin Request Form · Admin Request Status · Incident / Safety Note · Coach Referrals · Leave / MC · Performance Snapshot · Emergency Safety Shortcut · Settings

---

## Font Size Setting

Users can change text size in **More → Settings**:

| Level | Body | Heading |
|---|---|---|
| Normal | 18px | 28px |
| Large | 20px | 30px |
| Extra Large | 22px | 32px |

Implemented via CSS custom properties on `<html>`. Changes apply instantly across all screens.

---

## Project Structure

```
src/
  App.tsx        — all screens, overlays, state
  mockData.ts    — typed mock data (coach, classes, students, notifications, etc.)
  styles.css     — design tokens, Ocean Blue palette, component styles
  main.tsx       — React root

docs/superpowers/specs/
  2026-05-20-coach-portal-redesign-design.md   — approved design spec

coach-portal-readme.md   — full product requirements (27 screens, 8 scenarios)
handover.md              — AI session progress handover
```

---

## Mock Scenarios Covered

1. Normal class day (check-in, attendance, equipment)
2. Attendance pending reminder
3. Lightning alert + land drill mode
4. Student transfer request to admin
5. Trial student attends class
6. Progress update due
7. Equipment missing report
8. Coach covering another class (handover notes)

---

## Out of Scope

No database schema · No API · No real login · No WATI/WhatsApp · No Supabase · No Airtable · No payment logic · No production deployment

See `coach-portal-readme.md` section 18 for full out-of-scope list.

---

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- No UI library — custom CSS only
- No routing library — screen state in React `useState`
