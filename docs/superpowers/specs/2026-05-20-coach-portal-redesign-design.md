# Coach Portal Redesign — Design Spec
**Date:** 2026-05-20  
**Status:** Approved  
**Scope:** Full UI redesign + 15 new screens + Login + Font Size Settings

---

## 1. Objective

Redesign the existing 5-screen Coach Portal prototype with Ocean Blue colour palette, Inter font, yellow primary buttons, black body text, a 3-level font size setting, and email/password login. Build all 15 screens from the README spec that are currently missing.

---

## 2. Colour Palette

| Token | Hex | Use |
|---|---|---|
| Ocean Primary | `#0369A1` | Top bar, active nav, labels |
| Sky Accent | `#0EA5E9` | Gradient, hover states |
| Deep Blue Text | `#0C4A6E` | Headings, button text on yellow |
| Sky Light | `#E0F2FE` | Card backgrounds, chips |
| Ice Blue BG | `#F0F9FF` | Screen background |
| Amber Yellow | `#FBBF24` | All primary buttons, active nav indicator |
| Near-Black | `#1E293B` | Body text |
| Alert Red | `#DC2626` | Urgent banners, alert chips |

---

## 3. Typography — Inter (Google Fonts)

| Element | Size (Normal) | Size (Large) | Size (XL) | Weight |
|---|---|---|---|---|
| Page Title | 28px | 30px | 32px | 800 |
| Card Heading | 22px | 24px | 26px | 700 |
| Section Label | 18px | 20px | 22px | 600 |
| Body Text | 18px | 20px | 22px | 400 |
| Primary Button | 18px | 20px | 22px | 700 |
| Eyebrow / Meta | 12px | 13px | 14px | 700 · Uppercase |

Font size level persists in React state, propagated via CSS custom property `--font-scale` on `<html>`. All rem/em sizes scale relative to base.

---

## 4. Component System

- **Primary Button:** Amber Yellow `#FBBF24`, `#0C4A6E` text, 52px min-height, 14px border-radius, full-width for key actions
- **Secondary Button:** `#E0F2FE` background, `#0369A1` text, same sizing
- **Ghost Button:** transparent, `#0369A1` border + text (used inside gradient cards)
- **Attendance Chip:** tap-toggle, 3 states (Present / Absent / Late / ML / No Show), 48px tall
- **Status Badge:** pill shape, colour-coded (yellow=pending, green=done, red=urgent)
- **Alert Banner:** red `#DC2626` border-left 4px, `#FFF1F2` background, bold copy + action button
- **Bottom Nav:** 5 tabs, yellow `#FBBF24` 3px top-border on active tab, 10px label
- **Overlay Sheet:** slides up from bottom, 90% viewport height, tap backdrop to close
- **Font Size Toggle:** 3-segment pill selector (Normal / Large / Extra Large) in Settings

---

## 5. Screen Architecture — All 27 Screens

### Already Built (12 screens — to be restyled)
1. Today Dashboard
2. Class List / Schedule
3. Class Detail (overlay)
4. Child Attendance (inside class overlay)
5. Student Profiles list
6. Student Profile detail (overlay)
7. Child Progress (inside student overlay)
8. Equipment Checklist (inside class overlay)
9. Lightning Alert + Land Drill (overlay)
10. Coach Inbox
11. Parent WhatsApp Placeholder (overlay)
12. Admin Request Form (overlay)

### New Screens to Build (15)
13. **Coach Login** — ocean gradient top, white card bottom, email field, password + show/hide toggle, Sign In button (yellow), Forgot password link, static only
14. **Attendance Summary** — totals (Present / Absent / Late) with confirm submit
15. **Coach Attendance / Check-In** — location, Check In / Check Out buttons, timestamp, status badge
16. **Test Readiness** — eligible student list, Flag Ready / Needs More Practice buttons, coach note
17. **Equipment Issue Report** — issue type selector, description, Submit to Admin button
18. **Admin Request Status** — list of pending requests with status badges (Pending / In Review / Done / Rejected)
19. **Student Transfer Request** — student selector, current slot, new slot placeholder, reason, submit flow + success screen
20. **Trial Student Notes** — trial badge, Mark Trial Attended, trial outcome, Recommend Level, Message Parent
21. **New Student First-Class Notes** — new badge, parent concern, water confidence level, suggested approach
22. **Incident / Safety Note** — incident type, severity (Low/Medium/High/Urgent), notes, parent informed toggle, submit
23. **Coach Handover Notes** — class-level + per-student handover notes, covering coach info
24. **Coach Referrals** — referral type (Student/Coach/Partner), form, submit, referral status tracker
25. **Leave / MC / Availability** — static request types (Apply Leave, Submit MC, Mark Unavailable), placeholder forms
26. **Coach Performance Snapshot** — this-week summary (classes, attendance, progress, pending requests)
27. **Settings / More** — font size toggle (3 levels + live preview), alert sound, screen-wake toggle, coach profile, sign out

---

## 6. Navigation Structure

```
Login (pre-auth)
  └── Today Dashboard (default after login)
      Bottom Nav:
      ├── Today — Dashboard, alerts, next class, quick actions
      ├── Classes — Schedule list, Class Detail overlay
      │     └── Class Detail → Attendance → Attendance Summary
      │                     → Equipment Checklist → Equipment Issue Report
      │                     → Handover Notes
      ├── Students — Profile list, Student Profile overlay
      │     └── Student Profile → Progress Update → Test Readiness
      │                        → Trial Notes / New Student Notes
      │                        → Student Transfer Request
      ├── Inbox — Notifications list (Urgent / Schedule / Students / Admin)
      └── More — Coach Performance Snapshot
                Coach Attendance / Check-In
                Referrals
                Leave / MC
                Incident / Safety Note
                Admin Request Status
                Settings
```

---

## 7. Font Size Feature

- Stored in React state: `'normal' | 'large' | 'xl'`
- Applied as class on `<html>` (`font-normal`, `font-large`, `font-xl`)
- CSS custom properties on each class set `--fs-body`, `--fs-heading`, etc.
- All font-size declarations in CSS use `var(--fs-*)` 
- Settings screen shows live preview paragraph that updates immediately on selection

---

## 8. Login Screen

- Static prototype — no real auth
- Email field (text input, pre-filled with mock value)
- Password field (type=password) with Show/Hide toggle button
- Sign In button (yellow, full-width)
- "Forgot password?" link (placeholder, no action)
- On Sign In tap: transitions to Today Dashboard
- No validation required for prototype — any input works

---

## 9. Mock Data

All existing mock data (coach, classes, students, notifications) is retained. New screens add:

- `mockAdminRequests` — 3 requests with different statuses
- `mockReferrals` — 2 referrals with statuses
- `mockIncidents` — 1 sample incident
- `mockHandoverNotes` — per-class handover notes (already partially in classes)
- `mockLeaveRequests` — 1 pending leave request
- `mockPerformance` — this-week snapshot object

---

## 10. Out of Scope

- Real authentication (no Supabase, no JWT)
- Real WATI / WhatsApp integration
- Backend API or database
- Real push notifications
- PWA / offline caching
- Production build or deployment

---

## 11. Success Criteria

- All 27 screens are reachable via navigation or overlay flows
- Ocean Blue palette applied consistently across every screen
- Yellow primary buttons on every action
- Inter font loaded via Google Fonts
- Font size setting changes all text sizes live across all screens
- Login screen is the first screen shown; Sign In transitions to Today
- Coaches aged 50+ can navigate without confusion
- Prototype runs on `npm run dev` with no errors
