# Coach Portal — UI/UX Documentation for Backend Integration

This document describes every screen, data field, user action, and API/database requirement for the Swim Starter Coach Portal. It is written for the engineer or team connecting this prototype to a real schema, backend, and database.

---

## 1. Overview

The Coach Portal is a mobile-first web app used by swim coaches at Swim Starter. Coaches use it poolside to:
- View their daily class schedule
- Take attendance and manage student flags
- Track student progress and initiate transfers
- Apply for leave and view their revenue
- Communicate safety alerts and admin requests to head office

**Users:** Swim coaches (internal staff). One coach per login session.

**Target device:** Mobile phone (430px width frame). Designed for coaches aged 50+ — large fonts, minimal typing, clear buttons.

---

## 2. Authentication

### Login Screen

| Field | Type | Notes |
|---|---|---|
| Email address | string | Coach's registered email |
| Password | string | Coach's password |

**UI behaviour:** Pre-filled with mock credentials. Any input accepted in prototype.

**Backend requirement:**
- Authenticate against a `coaches` table
- Return a session token (JWT or cookie)
- Session should identify the coach (`coach_id`) — all subsequent API calls are scoped to this coach

---

## 3. Data Entities

### 3.1 Coach (`coaches` table)

| Field | Type | Notes |
|---|---|---|
| `coach_id` | UUID | Primary key |
| `name` | string | Display name (e.g. "Coach Ryan") |
| `email` | string | Login credential |
| `password_hash` | string | Hashed password |
| `location` | string | Primary pool location |
| `rate_per_student` | decimal | Revenue rate per student per session (currently $90) |
| `created_at` | timestamp | |

**Currently mocked as:**
```ts
coach = { name: "Coach Ryan", classesToday: 4, firstClass: "9:00 AM", location: "Bishan" }
```

`classesToday` and `firstClass` should be derived from the `classes` table at runtime, not stored.

---

### 3.2 Classes (`classes` table)

| Field | Type | Notes |
|---|---|---|
| `class_id` | UUID | Primary key |
| `coach_id` | UUID (FK → coaches) | Which coach runs this class |
| `day_label` | string | "Monday"–"Sunday" |
| `start_time` | time | e.g. "09:00:00" |
| `duration_minutes` | integer | Always 45 in current design |
| `pool` | string | Pool name (e.g. "Bishan", "Sengkang") |
| `level` | string | e.g. "Stage 1", "Stage 2", "Stage 3" |
| `focus` | string | Session focus description |
| `equipment` | string[] / JSON | List of equipment items |
| `safety_notes` | string[] / JSON | Safety reminders for this class |
| `handover_notes` | string | Text from previous coach or admin |
| `attendance_status` | enum | "Not marked" / "Pending submission" / "Ready" / "Submitted" |
| `badges` | string[] / JSON | Labels shown on the class card (e.g. "Starting Soon", "Test Window") |

**Display rules:**
- Classes are grouped by `day_label` in the UI (Saturday → Sunday order)
- Timeslot displayed as `start_time – (start_time + 45 min)` formatted as `H:MM AM/PM`
- `classesToday` on Today dashboard = count of classes for this coach on the current calendar date
- `firstClass` = the earliest `start_time` class for this coach today

**Filter options in the UI:**
- Pool: unique values from `pool` column for this coach's classes
- Day: Monday–Sunday
- Timeslot: unique `start_time` values (formatted), contextual to selected day

---

### 3.3 Students (`students` table)

| Field | Type | Notes |
|---|---|---|
| `student_id` | UUID | Primary key |
| `name` | string | Student's full name |
| `age` | integer | Age in years |
| `level` | string | SwimSafer stage or internal level |
| `type` | enum | "Regular Student" / "Replacement Student" / "Trial Student" |
| `focus` | string | Current coaching focus |
| `last_attended` | date | Most recent attendance date |
| `parent_name` | string | Parent/guardian name |
| `parent_phone` | string | Parent/guardian phone (Singapore format) |
| `safety_notes` | string | Safety flags for coach awareness |
| `current_test_level` | string | e.g. "SwimSafer Stage 2", "Trial Beginner", "Internal 200M" |
| `student_status` | enum | "Active" / "Replacement" / "Trial" |
| `equipment_status` | enum | "Not Required" / "Swim Cap Pending" / "Goggles Pending" / etc. |
| `payment_status` | enum | "Paid" / "Payment Not Sent" / "Overdue" / "Trial" |
| `pause_quit_status` | enum | "None" / "Pending Pause" / "Pending Quit" |
| `readiness` | enum | "On Track" / "Flag Ready Soon" / "Ready for Assessment" / "Needs More Practice" / "Suitable for Stage X" |
| `notes` | string | Coach-facing notes |

**UI display logic (derived in frontend, should match backend):**

| UI label | Logic |
|---|---|
| Enrolment status display | `type === "Trial Student"` → "Trial"; `pause_quit_status === "Pending Pause"` → "Pending Pause"; `pause_quit_status === "Pending Quit"` → "Pending Quit"; otherwise → "Enrolled" |
| Payment status display | `payment_status === "Trial"` → hidden; `"Paid"` → "Paid"; `"Payment Not Sent"` → "Pending Payment"; else → "Overdue Payment" |
| Assessment due flag | `readiness === "Ready for Assessment"` |
| Parent follow-up flag | `pause_quit_status` is "Pending Pause" or "Pending Quit" |
| Equipment distribution flag | `equipment_status !== "Not Required"` |
| Flag count (badge) | Count of above three that are true |

---

### 3.4 Class–Student Enrolment (`class_students` table)

Many-to-many join between classes and students.

| Field | Type | Notes |
|---|---|---|
| `class_id` | UUID (FK → classes) | |
| `student_id` | UUID (FK → students) | |
| `enrolled_at` | timestamp | |

A student can be in multiple classes (e.g. regular class + replacement slot).

---

### 3.5 Student Progress (`student_progress` table)

| Field | Type | Notes |
|---|---|---|
| `progress_id` | UUID | Primary key |
| `student_id` | UUID (FK → students) | |
| `skill` | string | e.g. "Breathing control", "Floating", "Kicking" |
| `status` | enum | "Not Started" / "Learning" / "Improving" / "Can Do Independently" / "Strong" / "Ready for Next Level" |
| `updated_at` | timestamp | |
| `updated_by_coach_id` | UUID (FK → coaches) | |

Currently stored as `progress: Array<[string, string]>` in the mock (tuple of skill + status).

---

### 3.6 Attendance (`attendance_records` table)

| Field | Type | Notes |
|---|---|---|
| `attendance_id` | UUID | Primary key |
| `class_id` | UUID (FK → classes) | |
| `student_id` | UUID (FK → students) | |
| `session_date` | date | The actual calendar date of the session |
| `status` | enum | "Present" / "Absent" |
| `marked_by_coach_id` | UUID (FK → coaches) | |
| `marked_at` | timestamp | |

**UI behaviour:** Coach marks Present/Absent per student in the Attendance Workspace. Buttons disappear once marked. Attendance cannot be changed after "Submit attendance" is tapped.

---

### 3.7 Coach Session History (`coach_sessions` table)

Tracks which sessions a coach has taught (for revenue and attendance history).

| Field | Type | Notes |
|---|---|---|
| `session_id` | UUID | Primary key |
| `coach_id` | UUID (FK → coaches) | |
| `class_id` | UUID (FK → classes) | |
| `session_date` | date | Calendar date of the session |
| `student_count` | integer | Number of students present (for revenue calculation) |
| `revenue` | decimal | Calculated: `student_count × rate_per_student` |
| `on_leave` | boolean | True if coach was on approved leave this date |

**Revenue calculation rule:**
- If `on_leave = true` → revenue = $0
- Else → revenue = `student_count × coach.rate_per_student`

**UI aggregation (month-on-month):**
- Group by `YYYY-MM` of `session_date`
- Sum: `sessions`, `attended` (where `on_leave = false`), `on_leave` count, `revenue`
- Sorted descending by month
- Coach tab shows 5 most recent months; full history page shows all

---

### 3.8 Leave Applications (`leave_applications` table)

| Field | Type | Notes |
|---|---|---|
| `leave_id` | UUID | Primary key |
| `coach_id` | UUID (FK → coaches) | |
| `type` | enum | "Annual Leave" / "Medical Leave" / "Unavailable" |
| `start_date` | date | |
| `end_date` | date | |
| `status` | enum | "Pending" / "Approved" / "Cancelled" |
| `note` | string | Coach's comment |
| `mc_attached` | boolean | True if MC document was attached (Medical Leave only) |
| `submitted_at` | timestamp | |
| `reviewed_by` | UUID (FK → admins) | Null until reviewed |
| `reviewed_at` | timestamp | |

**UI behaviour:**
- Coach submits form → status = "Pending"
- Medical Leave requires MC attachment before submit is enabled
- Admin approves → status = "Approved"
- Approved leave dates are cross-referenced with `coach_sessions.session_date` → matching sessions shown as "On Leave" with $0 revenue
- Coach can cancel a Pending leave from the Applied Leave History screen
- Leave history grouped into: Pending / Upcoming Approved / Past

---

### 3.9 Transfer Requests (`transfer_requests` table)

| Field | Type | Notes |
|---|---|---|
| `transfer_id` | UUID | Primary key |
| `student_id` | UUID (FK → students) | |
| `from_class_id` | UUID (FK → classes) | |
| `to_class_id` | UUID (FK → classes) | |
| `requested_by_coach_id` | UUID (FK → coaches) | |
| `status` | enum | "Pending Parent Approval" / "Approved" / "Rejected" / "Cancelled" |
| `requested_at` | timestamp | |
| `resolved_at` | timestamp | |

**UI behaviour:**
- Coach selects destination class via Pool / Day / Timeslot dropdowns
- `selectTransferClass()` resolves the closest matching class when a single dimension changes
- On submit → status = "Pending Parent Approval"; success banner shown
- Badge appears on the student's roster row in all class views while pending
- Coach can cancel from the roster row (removes record or sets status = "Cancelled")
- Parent approves/rejects via parent portal (out of scope for coach portal)

---

### 3.10 Notifications (`notifications` table)

| Field | Type | Notes |
|---|---|---|
| `notification_id` | UUID | Primary key |
| `coach_id` | UUID (FK → coaches) | Target coach |
| `title` | string | Notification headline |
| `meta` | string | Short label (e.g. "Urgent • Safety") |
| `body` | string | Full notification text |
| `variant` | enum | "" / "alert" / "success" / "yellow" — controls badge/card colour |
| `read` | boolean | False until coach marks as read |
| `created_at` | timestamp | |

**UI behaviour:**
- Inbox shows Unread first, Read below
- Coach marks as read via checkmark button → `read = true`
- Notification tap opens linked page (Lightning Alert or Admin Request based on variant)

---

### 3.11 Admin Requests / Coach Comments (`admin_requests` table)

| Field | Type | Notes |
|---|---|---|
| `request_id` | UUID | Primary key |
| `coach_id` | UUID (FK → coaches) | |
| `class_id` | UUID (FK → classes) | Optional — linked class context |
| `student_id` | UUID (FK → students) | Optional — linked student context |
| `body` | string | Coach's free-text comment |
| `submitted_at` | timestamp | |
| `read_by_admin` | boolean | |

---

### 3.12 Parent Messages (`parent_messages` table)

Coach-initiated WATI (WhatsApp) messages to parents.

| Field | Type | Notes |
|---|---|---|
| `message_id` | UUID | Primary key |
| `coach_id` | UUID (FK → coaches) | |
| `student_id` | UUID (FK → students) | |
| `parent_phone` | string | Recipient phone number |
| `draft_body` | string | Pre-filled draft text |
| `sent_at` | timestamp | Null until sent via WATI |
| `wati_message_id` | string | Reference from WATI API |

**UI behaviour:** Coach sees a draft pre-filled with student/parent name. Tapping "Open WATI Message" hands off to the WATI integration. The draft body is not editable in this prototype (textarea is shown but integration is a stub).

---

### 3.13 Lightning Alerts (`lightning_alerts` table)

| Field | Type | Notes |
|---|---|---|
| `alert_id` | UUID | Primary key |
| `pool` | string | Which pool the alert applies to |
| `activated_by` | UUID (FK → admins or coaches) | |
| `activated_at` | timestamp | |
| `deactivated_at` | timestamp | Null while active |
| `active` | boolean | Derived: `deactivated_at IS NULL` |

**UI behaviour:**
- Lightning alert is active by default in mock (`lightningAlertActive = true`)
- Shown as a red `alert-card` on the Today tab and in the Lightning Alert page
- Coach can turn off from either location
- In production: alert should be pushed to all coaches at the affected pool (push notification or real-time subscription)

---

## 4. Screen-by-Screen API Requirements

### 4.1 Login
- `POST /auth/login` → `{ email, password }` → `{ token, coach_id }`

### 4.2 Today Tab
- `GET /coach/today` → `{ name, classesToday, firstClass, nextClass, lightningAlertActive }`
- `nextClass` = first upcoming class sorted by day + start_time

### 4.3 Classes Tab — Schedule Overview
- `GET /coach/classes?pool=&day=&timeslot=` → array of class objects with `studentCount`

### 4.4 Class Detail
- `GET /classes/:class_id` → class object with full equipment, safety, handover fields
- `GET /classes/:class_id/students` → array of students with enrolment + transfer status

### 4.5 Attendance Workspace
- `GET /classes/:class_id/attendance?date=` → array of students with today's attendance status
- `PATCH /attendance` → `{ class_id, student_id, date, status: "Present" | "Absent" }` — update per student
- `POST /attendance/submit` → `{ class_id, date }` — lock attendance for the session

### 4.6 Student Profile
- `GET /students/:student_id` → full student object with progress array, current class, transfer status

### 4.7 Student Transfer
- `GET /classes?exclude=:class_id` → list of available destination classes
- `POST /transfers` → `{ student_id, from_class_id, to_class_id }` → creates transfer request
- `DELETE /transfers/:transfer_id` → cancel a pending transfer

### 4.8 Coach Tab — Leave Application
- `POST /leave` → `{ type, start_date, end_date, note, mc_attached }` → creates leave application
- `GET /leave?coach_id=` → list of all leave applications for this coach
- `DELETE /leave/:leave_id` → cancel a pending leave application

### 4.9 Coach Tab — Revenue + Attendance History
- `GET /coach/sessions?coach_id=` → list of coach sessions (or paginated)
- Frontend aggregates by month; alternatively: `GET /coach/revenue/monthly` → pre-aggregated array

### 4.10 Inbox
- `GET /notifications?coach_id=&read=false` → unread notifications
- `GET /notifications?coach_id=&read=true` → read notifications
- `PATCH /notifications/:notification_id` → `{ read: true }` — mark as read

### 4.11 Admin Request
- `POST /admin-requests` → `{ class_id?, student_id?, body }` → creates admin comment

### 4.12 WATI Message
- `POST /parent-messages` → `{ student_id, parent_phone, draft_body }` → saves draft + triggers WATI API

### 4.13 Lightning Alert
- `GET /lightning-alerts?pool=` → current alert status for this coach's pool
- `POST /lightning-alerts` → activate alert
- `PATCH /lightning-alerts/:alert_id` → deactivate alert

---

## 5. Real-Time / Push Considerations

The following events should be pushed to the coach's device rather than polled:

| Event | Trigger |
|---|---|
| Lightning alert activated | Admin or another coach activates an alert for the same pool |
| Notification received | Admin sends a message/update to this coach |
| Transfer approved/rejected | Parent responds via parent portal |
| Leave approved | Admin approves a leave application |

Recommended: WebSocket subscription or Supabase Realtime on the relevant tables.

---

## 6. Permission & Role Model

| Role | Access |
|---|---|
| Coach | Own classes, own students, own leave, own sessions, own notifications |
| Admin | All coaches, all classes, all students, all transfers, approve/reject actions |
| Parent | Own child's data, transfer approval only |

The prototype does not implement role-based access control — all data is static. Backend must enforce row-level security scoped to `coach_id` from the session token.

---

## 7. Enumerations Reference

### `student_status`
`"Active"` | `"Replacement"` | `"Trial"`

### `payment_status`
`"Paid"` | `"Payment Not Sent"` | `"Overdue"` | `"Trial"`

### `pause_quit_status`
`"None"` | `"Pending Pause"` | `"Pending Quit"`

### `readiness`
`"On Track"` | `"Flag Ready Soon"` | `"Ready for Assessment"` | `"Needs More Practice"` | `"Suitable for Stage 1"` (or other stage)

### `equipment_status`
`"Not Required"` | `"Swim Cap Pending"` | `"Goggles Pending"` | (other equipment descriptions)

### `leave_type`
`"Annual Leave"` | `"Medical Leave"` | `"Unavailable"`

### `leave_status`
`"Pending"` | `"Approved"` | `"Cancelled"`

### `transfer_status`
`"Pending Parent Approval"` | `"Approved"` | `"Rejected"` | `"Cancelled"`

### `progress_status`
`"Not Started"` | `"Learning"` | `"Improving"` | `"Can Do Independently"` | `"Strong"` | `"Ready for Next Level"`

### `notification_variant`
`""` (default/blue) | `"alert"` (red) | `"success"` (green) | `"yellow"` (amber)

---

## 8. Computed / Derived Values

These values are computed in the frontend from raw data. Backend may pre-compute them for performance.

| Displayed value | Derived from |
|---|---|
| `classesToday` | Count of classes where `coach_id = current` and `day_label` matches today |
| `firstClass` | Min `start_time` of today's classes for this coach |
| `nextClass` | First class sorted by day-of-week offset from today, then start_time |
| `studentCount` on class card | Count of rows in `class_students` where `class_id = this` |
| Timeslot display | `start_time` formatted + `(start_time + 45 min)` formatted |
| `enrolmentStatus` display | Derived from `type` + `pause_quit_status` (see §3.3) |
| `paymentStatus` display | Derived from `payment_status` enum (see §3.3) |
| Flag count badge | Count of: assessment due + parent follow-up + equipment needed |
| Monthly revenue | `SUM(revenue)` from `coach_sessions` grouped by `YYYY-MM` |
| On-leave session | `coach_sessions.session_date` intersects any approved leave date range |

---

## 9. Mock Data Reference

All current mock data lives in `src/mockData.ts`. It maps directly to the schema above.

| Mock constant | Maps to |
|---|---|
| `coach` | `coaches` table (single row) |
| `classes` (5 items) | `classes` table |
| `students` (20 items) | `students` + `class_students` tables |
| `notifications` (4 items) | `notifications` table |
| `COACH_SESSION_HISTORY` (8 items) | `coach_sessions` table |
| `INITIAL_LEAVE_APPLICATIONS` (3 items) | `leave_applications` table |
| `COACH_RATE_PER_STUDENT = 90` | `coaches.rate_per_student` |
| `TODAY_DATE = "2026-05-21"` | Replace with `new Date()` in production |

---

## 10. Out of Scope (not implemented in prototype)

| Feature | Notes |
|---|---|
| Parent portal | Transfer approval UI exists on parent side; not built here |
| Real WATI integration | Message draft UI exists; API call is a stub |
| SwimSafer test sign-off | UI mentions readiness; no submission flow built |
| Progress update submission | Coach can view progress; editing is a stub |
| Equipment issue photos | Equipment issue page exists; no photo upload |
| Push notifications | Lightning alert and inbox are polling/static |
| Multi-coach views | Prototype shows one coach's data only |
| Admin portal | Out of scope entirely |
| Payment processing | Revenue display only; no invoicing or payment gateway |
