# The Swim Starter Coach Portal - Mobile Web UI/UX Prototype

## 1. Project Overview

The Swim Starter Coach Portal is a **frontend-first, UI/UX-driven mobile web prototype** for coaches.

This phase is focused on **visualising the ideal coach experience only**.

This prototype should not include:

- Database schema
- Backend logic
- API design
- Real authentication
- Real WATI / WhatsApp integration
- Real admin workflow automation
- Real attendance or timetable logic
- Real payment, CRM, Supabase, Airtable, or Splash integration

The goal is to first build a simple, clear, and user-friendly interface before deciding how the backend should support it later.

---

## 2. Core Portal Objective

The Coach Portal should act as a **daily class operation assistant** for coaches.

The main objective is:

> Help coaches easily know what class they are teaching, who is attending, what each child needs to work on, what equipment is needed, and what needs to be communicated to parents or admin.

The portal should make the coach's daily work easier by reducing confusion, repeated admin follow-up, missed attendance updates, unclear student progress, and scattered communication.

The coach should be able to open the portal and immediately understand:

```text
What class do I have today?
Who are my students?
Who is present or absent?
What does each child need to work on?
Is there any urgent alert?
Do I need to message a parent?
Do I need to inform admin about anything?
What button should I tap next?
```

---

## 3. Design Direction

The Coach Portal should follow the same overall product strategy as the Parent Portal:

```text
User journey -> UI screens -> UX rules -> Mock data -> Later backend support
```

This means the UI should be designed from the coach's perspective first.

Do not design the portal like an internal CRM or database system.

Design it like a simple mobile tool that coaches can use quickly before, during, and after class.

---

## 4. Target Users

The primary users are swim coaches.

Important design assumption:

> Some coaches may be aged 50 and above and may not be tech-savvy.

Therefore, the UI must be extremely simple, clear, and easy to read.

The portal should be suitable for elderly or less tech-confident users who may prefer:

- Bigger fonts
- Clear buttons
- Fewer steps
- Less clutter
- Simple wording
- Clear icons
- High contrast
- Obvious next actions
- Minimal typing
- Large tap areas
- Clear confirmation messages

---

## 5. Elderly-Friendly UI Requirements

The Coach Portal must be designed to be friendly for users aged 50 and above.

### 5.1 Font and Readability

Recommended design rules:

```text
Minimum body font size: 18px
Important labels: 20px
Card titles: 22px
Main page titles: 24px to 28px
Primary buttons: 18px to 20px
```

Avoid small grey text.

Use strong contrast between text and background.

Do not overload screens with too many words.

### 5.2 Button Design

Buttons should be large, clear, and easy to tap.

Recommended button rules:

```text
Minimum button height: 48px to 56px
Full-width buttons for important actions
Large spacing between buttons
Clear action labels
Avoid icon-only buttons for important actions
```

Good button examples:

```text
[Mark Attendance]
[View Class]
[Message Parent]
[Inform Admin]
[Submit Update]
```

Avoid unclear labels:

```text
[Proceed]
[Update]
[Manage]
[Action]
```

### 5.3 Simple Navigation

The navigation should be simple and predictable.

Recommended bottom navigation:

```text
Today
Classes
Students
Inbox
More
```

Each tab should have:

- Simple icon
- Clear text label
- No hidden meaning
- No complex menu structure

### 5.4 Low Typing Requirement

Coaches should not need to type long messages often.

Use:

- Tap buttons
- Dropdown options
- Message templates
- Pre-filled notes
- Quick status chips
- Simple checklists

Example:

```text
Attendance:
[Present] [Absent] [Late]

Progress:
[Improving] [Needs Practice] [Ready for Test]
```

### 5.5 Clear Confirmation Messages

Every important action should show a clear confirmation.

Example:

```text
Attendance submitted successfully.

5 students marked present.
1 student marked absent.
```

Example:

```text
Admin request submitted.

The student will remain in the current slot until admin confirms the change.
```

---

## 6. Scope of This Prototype

## 6.1 What This Prototype Is

This prototype is:

- A mobile web UI/UX prototype
- A coach-facing clickable experience
- A visualisation of daily coach workflows
- A tool for internal alignment with management, product, ops, coaches, and design
- A way to test whether coaches can understand the portal without technical training
- A mock interface using static sample data only

## 6.2 What This Prototype Is Not

This prototype is not:

- A production-ready app
- A backend build
- A schema design project
- A live timetable system
- A real attendance system
- A real WATI / WhatsApp integration
- A real coach login system
- A real admin approval system
- A real student transfer system
- A real class capacity engine
- A real notification broadcast system

---

## 7. Expected Output

The expected output is a **mobile-first UI/UX prototype** for the Coach Portal.

The output should include:

1. Clear mobile screens
2. Simple user flows
3. Static mock data
4. Coach-friendly copywriting
5. Elderly-friendly font sizing and layout
6. Large tap-friendly buttons
7. Clear status cards
8. Clear alert states
9. Placeholder WhatsApp / WATI actions
10. Placeholder admin instruction/request flows
11. No backend, schema, or database logic

The prototype should allow stakeholders to review:

```text
Can coaches understand what to do?
Can older coaches use it without confusion?
Are the daily class actions clear?
Are attendance and progress updates easy?
Are alerts obvious?
Can coaches communicate with parents and admin through clear UI flows?
```

---

## 8. Portal Components

The Coach Portal should include the following major components.

## 8.1 Coach Login / Welcome

Purpose:

Allow coaches to enter the portal and understand their day at a glance.

UI components:

- Welcome message
- Coach name
- Today's class count
- First class timing
- Check-in button
- View today's classes button

Example copy:

```text
Welcome back, Coach Ryan.

You have 4 classes today.
Your first class starts at 9:00 AM.
```

---

## 8.2 Today Dashboard

Purpose:

Show the most important information for the coach's day.

Coach questions answered:

- What classes do I have today?
- What time is my next class?
- Where am I teaching?
- Is there any urgent alert?
- Do I need to mark attendance?
- Do I need to update progress?
- Do I need to message any parent?
- Do I need to inform admin about anything?

Suggested UI components:

- Today's class summary
- Next class card
- Urgent alert banner
- Coach check-in status
- Pending attendance card
- Progress update reminder
- Admin request shortcut
- WhatsApp / WATI shortcut

Example copy:

```text
Good morning, Coach Ryan.

You have 4 classes today at Bishan Swimming Complex.
Your first class starts at 9:00 AM.
```

---

## 8.3 Class Schedule / Timetable

Purpose:

Show coach's assigned classes by day and time.

UI components:

- Date selector
- Class cards
- Pool location
- Class level
- Timeslot
- Number of students
- Attendance status
- Alert badge
- Open class button

Example class card:

```text
9:00 AM - 9:45 AM
Bishan Swimming Complex
Stage 2
6 students

Attendance: Not marked

[Open Class]
```

Recommended class status labels:

```text
Starting Soon
In Progress
Completed
Attendance Pending
Progress Pending
Affected by Alert
```

---

## 8.4 Class Detail

Purpose:

Give the coach everything needed for one class.

UI components:

- Class date
- Class time
- Pool
- Level
- Student list
- Equipment checklist
- Safety notes
- Attendance button
- Progress update button
- Message parent button
- Inform admin button

Example copy:

```text
Stage 2 Class
Sat, 25 May 2026
9:00 AM - 9:45 AM
Bishan Swimming Complex

Students: 6
Equipment: Kickboards, noodles, sink toys
```

---

## 8.5 Child Attendance

Purpose:

Allow coaches to mark student attendance quickly and accurately.

Suggested attendance statuses:

```text
Present
Absent
Late
Medical Leave
Parent Informed
No Show
Transferred
Trial Attended
Trial No Show
```

UI components:

- Student cards
- One-tap attendance buttons
- Bulk mark present button
- Add note button
- Transfer timeslot button
- Attendance summary before submit

Example:

```text
Jayden Tan
Stage 2

[Present] [Absent] [Late]
[Add Note]
[Transfer Timeslot]
```

Attendance summary example:

```text
Attendance Summary

Present: 5
Absent: 1
Late: 0

[Submit Attendance]
```

---

## 8.6 Coach Attendance

Purpose:

Allow coach to check in and check out for assigned classes.

UI components:

- Today's assigned location
- Check-in button
- Check-out button
- Time stamp
- Status badge

Suggested coach attendance statuses:

```text
Not Checked In
Checked In
Checked Out
Late Check-In
Absent
On Leave
MC
```

Example:

```text
Coach Attendance

Bishan Swimming Complex
Status: Not checked in

[Check In]
```

---

## 8.7 Student Profile

Purpose:

Give coach quick access to student information before class.

UI components:

- Student name
- Age
- Current level
- Regular class
- Package
- Attendance history
- Progress summary
- Parent contact shortcut
- Safety notes
- Parent notes

Example:

```text
Jayden Tan
Age: 7
Current Level: Stage 2
Focus: Breathing control and stamina
Last attended: 18 May 2026
```

---

## 8.8 Student Safety Notes

Purpose:

Help coaches handle students safely and confidently.

Examples of mock safety notes:

```text
Fear of deep water
Needs goggles reminder
Sensitive to cold water
Parent requested gentle approach
Medical note available
Needs extra encouragement
```

These notes should be shown clearly but respectfully.

---

## 8.9 Child Progress

Purpose:

Allow coaches to view and update each child's progress.

UI components:

- Current level
- Skill checklist
- Coach notes
- Next milestone
- Progress confidence
- Ready for test indicator
- Submit progress update button

Suggested progress statuses:

```text
Not Started
Learning
Improving
Can Do With Help
Can Do Independently
Ready for Next Level
Ready for Test
```

Example:

```text
Stage 2 Progress

Breathing control: Improving
Floating: Good
Kicking: Needs practice
Water confidence: Strong

Coach note:
Jayden is improving in stamina but needs more practice with side breathing.
```

---

## 8.10 Test Readiness

Purpose:

Allow coaches to indicate whether a child may be ready for internal test or SwimSafer test.

UI components:

- Eligible student list
- Current level
- Recommended next test
- Coach readiness status
- Coach note
- Flag ready button
- Needs more practice button

Example:

```text
Jayden Tan
Current Level: Stage 2
Next Test: 200M

Coach Assessment:
Almost ready

[Flag Ready Soon]
[Needs More Practice]
```

---

## 8.11 Equipment Checklist

Purpose:

Help coaches prepare class equipment.

UI components:

- Class level
- Equipment checklist
- Quantity needed
- Pool-specific notes
- Report missing equipment button
- Report damaged equipment button

Example:

```text
Stage 2 Equipment

☐ Kickboards
☐ Noodles
☐ Sink toys
☐ Cones

[Report Missing Equipment]
```

---

## 8.12 Equipment Issue Report

Purpose:

Allow coach to report missing or damaged equipment to admin.

Example issue types:

```text
Missing equipment
Damaged equipment
Not enough equipment
Unsafe equipment
Storage issue
```

Example copy:

```text
Equipment Issue

2 kickboards are missing.
1 noodle is damaged.

[Submit to Admin]
```

---

## 8.13 Lightning / Weather / Pool Alert

Purpose:

Show safety alerts clearly and urgently.

Alert types:

```text
Lightning Alert
Heavy Rain
Pool Closure
Class Cancelled
Land Drills Required
Delayed Start
Resume Class
```

Example:

```text
Lightning Alert

Bishan Swimming Complex is currently affected.
Water activity should pause.

Suggested action:
Move students to sheltered area and wait for update.
```

---

## 8.14 Land Drill Mode

Purpose:

Guide coaches during lightning alert when water activity cannot continue.

Suggested land drill activities:

```text
Breathing exercise
Water safety briefing
Stroke movement practice
Dry kicking practice
Water safety quiz
```

Example:

```text
Land Drill Mode

Water activity is paused.
Please conduct dry activities under shelter until further update.
```

---

## 8.15 Coach Inbox / Notifications

Purpose:

Centralise alerts, updates, reminders, and admin replies.

Notification categories:

```text
All
Urgent
Schedule
Students
Attendance
Progress
Parent Messages
Admin Requests
Safety
Equipment
```

Notification examples:

```text
Lightning alert at Bishan
New student added to 10:00 AM class
Student transferred out
Parent messaged about absence
Progress update due
Equipment issue acknowledged
Admin replied to your request
```

Priority labels:

```text
Urgent
Action Required
No Action Needed
For Information
```

---

## 8.16 Coach-Parent Messaging / WATI Placeholder

Purpose:

Allow coach to communicate with parents through a WhatsApp / WATI-style placeholder.

This prototype should not integrate real WATI.

UI components:

- Parent contact card
- WhatsApp / WATI placeholder button
- Message templates
- Communication history mock
- Send update placeholder

Suggested message templates:

```text
Progress Update
Attendance Follow-Up
Class Reminder
Equipment Reminder
Test Readiness Update
Behaviour / Safety Note
```

Example:

```text
Message Parent

Jayden's Parent
WhatsApp: +65 XXXX XXXX

Templates:
[Progress Update]
[Attendance Follow-Up]
[Class Reminder]

[Open WhatsApp / WATI]
```

Important communication rule:

```text
Parent communication: Coach ↔ Parent
Operational instruction: Coach → Admin
```

There is no need for direct customer-to-admin communication inside the Coach Portal.

---

## 8.17 Coach to Admin Instructions

Purpose:

Allow coach to send internal instructions or requests to admin.

Request categories:

```text
Student Transfer
Class Issue
Parent Follow-Up Needed
Equipment Issue
Attendance Correction
Progress/Test Update
Coach Schedule Issue
Pool Issue
Safety Incident
```

Example:

```text
Admin Request

Type: Student Transfer
Student: Jayden Tan
Current Slot: Sat 9:00 AM
Requested Slot: Sat 10:00 AM
Reason: Parent requested change after class

[Submit Request]
```

---

## 8.18 Admin Request Tracking

Purpose:

Let coach know whether admin has acted on their request.

Request statuses:

```text
Pending
In Review
Done
Rejected
Need More Info
```

Example:

```text
Student Transfer Request
Status: In Review

Admin is checking available slots.
```

---

## 8.19 Student Transfer / Timeslot Change Request

Purpose:

Allow coach to request transfer of student to another timeslot from attendance or timetable view.

Suggested flow:

```text
Open Class
Select Student
Tap Transfer Timeslot
Choose reason
Select suggested/new timeslot placeholder
Review request
Submit to Admin
Success screen
```

Example success copy:

```text
Transfer request submitted to admin.

The student will remain in the current slot until admin confirms the change.
```

---

## 8.20 Trial Class Support

Purpose:

Help coaches manage trial students.

UI components:

- Trial student list
- Trial attendance
- Trial performance notes
- Recommended level
- Trial outcome
- Parent questions after trial
- Message parent shortcut

Example:

```text
Trial Student: Chloe Tan
Age: 6
Trial Level: Beginner
Outcome: Suitable for Stage 1
Coach Note: Comfortable in water but needs support with floating.

[Mark Trial Attended]
[Recommend Level]
[Message Parent]
```

---

## 8.21 New Student First-Class Notes

Purpose:

Help coaches prepare for new students.

UI components:

- New student badge
- First class today label
- Parent concern
- Water confidence level
- Suggested teaching approach

Example:

```text
New Student Today

Chloe is attending her first class.
Parent note: Afraid of deep water.
Suggested focus: Build comfort and confidence.
```

---

## 8.22 Behaviour / Incident Notes

Purpose:

Allow coach to record important safety, behaviour, or parent-related incidents.

Incident examples:

```text
Student refused to enter pool
Student cried during class
Minor injury
Parent complaint
Safety concern
Repeated disruption
```

UI components:

- Incident type
- Severity
- Notes
- Parent informed toggle
- Admin follow-up needed toggle
- Submit to admin button

Severity labels:

```text
Low
Medium
High
Urgent
```

---

## 8.23 Parent Concern / Special Instruction

Purpose:

Show important parent-shared notes to the coach.

Example notes:

```text
Afraid of water
Needs more encouragement
Parent wants update on stamina
Child has school test next week
Sensitive to loud instructions
```

This should appear in the student profile and class detail view.

---

## 8.24 Class Capacity View

Purpose:

Let coach understand class size and student mix.

UI components:

- Class capacity
- Regular students
- Replacement students
- Trial students
- Transferred students

Example:

```text
Stage 2 - Sat 9:00 AM

Capacity: 6 / 8 students
Regular: 5
Replacement: 1
Trial: 0
```

---

## 8.25 Student Type Badges

Purpose:

Help coach quickly identify the type of student attending.

Suggested badges:

```text
Regular Student
Replacement Student
Trial Student
Transferred In
New Student
Cover Class Student
```

Example:

```text
Aiden Lim
Replacement Student
Usual Pool: Sengkang
Today: Bishan
```

---

## 8.26 Coach Handover Notes

Purpose:

Support continuity when coaches are absent or covering for one another.

UI components:

- Class handover note
- Student-specific handover
- Covering coach note
- Last coach note

Example:

```text
Handover Note

Jayden needs more practice with side breathing.
Chloe is new and may need reassurance before entering the pool.
```

---

## 8.27 Coach Leave / MC / Availability

Purpose:

Allow coach to view or submit availability-related requests.

UI components:

- Apply leave placeholder
- Submit MC placeholder
- Mark unavailable placeholder
- Request schedule change placeholder
- View assigned classes

For this prototype, all actions are static UI flows only.

---

## 8.28 Coach Referrals

Purpose:

Allow coach to refer students, coaches, or partners.

Referral types:

```text
Refer a Student
Refer a Coach
Refer a Partner / Pool Contact
```

UI components:

- Referral type
- Name
- Phone
- Relationship
- Notes
- Submit button
- Referral status tracker

Referral statuses:

```text
Submitted
Contacted
Trial Arranged
Joined
Not Suitable
Reward Eligible
```

---

## 8.29 Coach Performance Snapshot

Purpose:

Give coach a simple summary of completed and pending tasks.

This should be supportive, not punitive.

Example:

```text
This Week

Classes completed: 12
Attendance completed: 11 / 12
Progress updates due: 3
Admin requests pending: 2
```

---

## 8.30 Offline / Poor Connection State

Purpose:

Prepare the UI for poolside usage where mobile signal may be weak.

Example copy:

```text
Connection unstable.

Please check your internet connection before submitting updates.
```

For prototype, this is a static visual state only.

---

## 8.31 Emergency / Safety Shortcut

Purpose:

Allow coach to quickly access safety-related actions.

UI components:

- Call admin placeholder
- View pool safety contact
- Report incident
- Lightning procedure
- First aid reminder

Example:

```text
Emergency / Safety

[Call Admin]
[Report Incident]
[View Lightning Procedure]
```

---

## 9. Relationship With Parent Portal and Admin Portal

The Coach Portal has important relationships with the Parent Portal and Admin Portal.

## 9.1 Coach Portal to Parent Portal

Coach actions that may later affect the Parent Portal:

```text
Coach marks attendance -> Parent sees attendance outcome
Coach updates progress -> Parent sees progress summary
Coach flags test readiness -> Parent sees test eligibility or registration update
Coach sends parent message -> Parent receives WhatsApp / WATI message
Coach notes class issue -> Parent may receive alert if relevant
```

## 9.2 Coach Portal to Admin Portal

Coach actions that may later affect the Admin Portal:

```text
Coach submits transfer request -> Admin reviews and confirms
Coach reports equipment issue -> Admin handles replacement
Coach reports incident -> Admin follows up
Coach flags attendance correction -> Admin verifies
Coach submits leave / MC -> Admin manages schedule
Coach requests parent follow-up -> Admin receives internal task
```

## 9.3 Admin Portal to Coach Portal

Admin actions that may later affect the Coach Portal:

```text
Admin updates timetable -> Coach sees new class schedule
Admin sends lightning alert -> Coach sees urgent safety alert
Admin assigns covering coach -> Coach sees handover note
Admin approves transfer -> Coach sees updated student list
Admin responds to request -> Coach sees inbox update
```

## 9.4 Parent Portal to Coach Portal

Parent actions that may later affect the Coach Portal:

```text
Parent reports absence -> Coach sees expected absence
Parent books replacement -> Coach sees replacement student badge
Parent submits class change request -> Coach sees transfer/update if approved
Parent asks progress question -> Coach may receive message or note
```

---

## 10. Recommended Information Architecture

```text
Coach Portal
├── Login / Welcome
├── Today Dashboard
│   ├── Today's Classes
│   ├── Coach Check-In
│   ├── Urgent Alerts
│   ├── Pending Attendance
│   └── Progress Updates Due
├── Classes
│   ├── Weekly Timetable
│   ├── Class Detail
│   ├── Student List
│   ├── Class Capacity
│   ├── Equipment Checklist
│   └── Handover Notes
├── Attendance
│   ├── Child Attendance
│   ├── Coach Attendance
│   ├── Trial Attendance
│   └── Attendance Summary
├── Students
│   ├── Student Profile
│   ├── Progress Update
│   ├── Test Readiness
│   ├── Parent Notes
│   └── Safety Notes
├── Messages
│   ├── Parent WhatsApp / WATI Placeholder
│   ├── Message Templates
│   └── Parent Communication History Mock
├── Admin Requests
│   ├── Student Transfer Request
│   ├── Equipment Issue
│   ├── Attendance Correction
│   ├── Incident Report
│   └── Request Status
├── Inbox
│   ├── Lightning Alerts
│   ├── Pool Closure
│   ├── Schedule Changes
│   ├── Admin Replies
│   └── Progress Reminders
└── More
    ├── Coach Profile
    ├── Referrals
    ├── Leave / MC
    ├── Help
    └── Settings
```

---

## 11. Recommended Bottom Navigation

Recommended bottom navigation:

```text
Today
Classes
Students
Inbox
More
```

Reason:

- `Today` focuses on what the coach needs to do now.
- `Classes` shows timetable and class details.
- `Students` shows child profiles and progress.
- `Inbox` centralises alerts and updates.
- `More` keeps less frequent actions away from the main tabs.

---

## 12. Minimum Screens to Design

The first UI/UX prototype should include:

1. Coach Login
2. Today Dashboard
3. Today's Class List
4. Class Detail
5. Child Attendance
6. Attendance Summary
7. Coach Attendance
8. Student Profile
9. Progress Update
10. Test Readiness
11. Equipment Checklist
12. Equipment Issue Report
13. Lightning Alert Detail
14. Land Drill Mode
15. Coach Inbox
16. Parent WhatsApp / WATI Placeholder
17. Admin Request Form
18. Admin Request Status
19. Student Transfer Request
20. Trial Student Notes
21. New Student First-Class Notes
22. Incident / Safety Note
23. Coach Handover Notes
24. Coach Referrals
25. Leave / MC / Availability
26. Emergency / Safety Shortcut
27. More / Settings

---

## 13. Suggested Mock User Scenarios

The prototype should include realistic coach scenarios.

## Scenario 1: Normal Class Day

Coach opens the portal before class.

Expected UI:

- Today Dashboard shows assigned classes
- Coach checks in
- Coach opens first class
- Coach sees student list and equipment checklist
- Coach marks attendance

## Scenario 2: Attendance Pending

Coach forgot to submit attendance.

Expected UI:

- Dashboard shows attendance pending
- Class card shows `Attendance Pending`
- Coach opens attendance screen
- Coach submits attendance summary

## Scenario 3: Lightning Alert

There is lightning risk at the pool.

Expected UI:

- Urgent alert banner appears
- Coach opens lightning alert detail
- Land Drill Mode is shown
- Coach sees suggested safe activities

## Scenario 4: Student Transfer Request

Parent asks coach about moving student to another timeslot.

Expected UI:

- Coach opens student profile
- Taps `Transfer Timeslot`
- Submits request to admin
- Sees success screen and request status

## Scenario 5: Trial Student Attends Class

Coach has a trial student.

Expected UI:

- Trial student badge appears in class list
- Coach marks trial attendance
- Coach adds trial outcome
- Coach recommends level

## Scenario 6: Progress Update Due

Coach needs to update student progress.

Expected UI:

- Dashboard shows progress update reminder
- Coach opens student profile
- Coach updates skill checklist
- Coach submits progress update

## Scenario 7: Equipment Missing

Coach notices missing equipment.

Expected UI:

- Coach opens equipment checklist
- Taps `Report Missing Equipment`
- Submits issue to admin
- Request appears as pending

## Scenario 8: Coach Covering Another Class

Coach is covering another coach's class.

Expected UI:

- Class card shows `Cover Class`
- Handover notes are visible
- Student safety notes are highlighted

---

## 14. UI Copywriting Rules

The language should be simple, direct, and coach-friendly.

Use:

```text
Mark Attendance
View Class
Message Parent
Inform Admin
Submit Request
View Alert
```

Avoid:

```text
Execute attendance workflow
Initiate communication
Process operational request
Update entity status
```

Every screen should answer:

```text
What is this?
What do I need to do?
What happens after I tap the button?
```

---

## 15. Alert and Status Design Rules

Important statuses should always explain meaning and next action.

Bad copy:

```text
Attendance pending.
```

Better copy:

```text
Attendance has not been submitted for this class.
Please mark attendance before ending the class.
```

Bad copy:

```text
Student transferred.
```

Better copy:

```text
Aiden is attending this class as a replacement student today.
His regular class is at Sengkang.
```

Bad copy:

```text
Lightning alert.
```

Better copy:

```text
Lightning alert is active at Bishan.
Please stop water activity and move students to a sheltered area.
```

---

## 16. UI States to Design

Each key module should include relevant states:

```text
Default state
Empty state
Loading placeholder state
Success state
Error / unable to proceed state
Urgent alert state
Action required state
No action needed state
Offline / poor connection state
```

For this prototype, these can be static visual examples.

---

## 17. Suggested Mock Data

Use realistic mock data such as:

```text
mockCoach
mockCoachSchedule
mockClasses
mockStudents
mockStudentProgress
mockStudentAttendance
mockCoachAttendance
mockEquipment
mockAlerts
mockNotifications
mockParentMessages
mockAdminRequests
mockTrialStudents
mockReferrals
mockIncidents
mockHandoverNotes
```

Mock data should show different scenarios, such as:

- Regular class
- Trial student
- Replacement student
- New student
- Student with safety note
- Lightning alert
- Coach covering class
- Pending attendance
- Progress update due
- Admin request pending

---

## 18. Out of Scope

Do not build or specify:

- Database schema
- API contracts
- Backend services
- Supabase table structure
- Real login
- Real coach authentication
- Real WATI / WhatsApp integration
- Real parent messaging backend
- Real admin approval backend
- Real timetable logic
- Real attendance logic
- Real payment logic
- Real class capacity calculation
- Real notification engine
- Real CRM sync
- Real Splash, Airtable, or Supabase integration

---

## 19. Future Phase Considerations

After the UI/UX prototype is approved, future phases may include:

1. Schema design
2. Authentication
3. Real coach profile data
4. Real timetable integration
5. Real student attendance update
6. Real progress tracking
7. Real WATI / WhatsApp integration
8. Real admin request workflow
9. Real notification broadcast workflow
10. Real parent portal integration
11. Real admin portal integration
12. Production deployment

These should not be started until the Coach Portal UI/UX direction is confirmed.

---

## 20. Success Criteria

The Coach Portal prototype is successful if:

- Coaches can understand the portal without technical training
- Coaches aged 50 and above can read and use the UI comfortably
- Coaches can find today's classes quickly
- Attendance marking is simple and fast
- Progress updates are clear and easy to submit
- Lightning, pool closure, and urgent alerts are obvious
- Coach-parent communication flow is clear
- Coach-to-admin instruction flow is clear
- Student transfer request flow is understandable
- Equipment needs are visible before class
- Trial student handling is clear
- The UI reduces repeated admin clarification
- The portal feels like a daily coaching assistant, not a database viewer

---

## 21. Summary

The Coach Portal should be built as a **simple, mobile-first UI/UX prototype** using static mock data only.

It should help coaches manage daily teaching operations, including classes, attendance, progress, equipment, safety alerts, parent communication, referrals, admin instructions, student transfers, and trial students.

The design must be suitable for older and less tech-savvy coaches, with bigger fonts, large buttons, clear labels, simple navigation, and minimal typing.

The key principle is:

```text
Coach Portal = what the coach needs to do today
Parent Portal = what the parent needs to know or do
Admin Portal = what the business needs to manage and approve
```
