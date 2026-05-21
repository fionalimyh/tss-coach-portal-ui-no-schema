import React, { useEffect, useMemo, useState } from "react";
import {
  classes,
  coach,
  notifications,
  students,
  type ClassItem,
  type ScreenKey,
  type StudentItem,
} from "./mockData";
import tssLogo from "./tss-logo.png";

type FontScale = "normal" | "large" | "xlarge";
type TransferStatus = "Pending Parent Approval";
type TransferRequest = { fromClassId: string; toClassId: string; status: TransferStatus };
type PageState =
  | { key: "classDetail"; classId: string }
  | { key: "attendance"; classId: string }
  | { key: "leaveApplication" }
  | { key: "leaveHistory" }
  | { key: "studentProfile"; studentId: string; classId: string }
  | { key: "transferStudent"; studentId: string; classId: string }
  | { key: "messageParent"; studentId?: string }
  | { key: "adminRequest"; studentId?: string; classId?: string }
  | { key: "lightningAlert" }
  | { key: "emergency" }
  | { key: "settings" }
  | { key: "coachAttendance" }
  | { key: "attendanceHistory" }
  | { key: "equipmentIssue"; classId?: string };

type IconName =
  | "menu" | "close" | "bell" | "today" | "classes" | "students" | "coach"
  | "inbox" | "more" | "location" | "clock" | "message" | "shield"
  | "chevron" | "logout" | "back" | "check" | "help" | "lightning";

type FilterValue = "All" | string;
type ClassFilters = {
  pool: FilterValue;
  day: FilterValue;
  time: FilterValue;
};
type LeaveApplication = {
  id: string;
  date: string;
  startDate: string;
  endDate: string;
  type: "Annual Leave" | "Medical Leave" | "Unavailable";
  status: "Pending" | "Approved";
  note: string;
};
type CoachSessionRecord = {
  id: string;
  date: string;
  classId: string;
};

const navItems: Array<{ key: ScreenKey; label: string; icon: IconName }> = [
  { key: "today", label: "Today", icon: "today" },
  { key: "classes", label: "Classes", icon: "classes" },
  { key: "coach", label: "Coach", icon: "coach" },
  { key: "inbox", label: "Inbox", icon: "inbox" },
  { key: "more", label: "More", icon: "more" },
];

const FILTER_POOL_OPTIONS = ["All", "Bishan", "Bukit Canberra", "Sengkang", "Pasir Ris", "Clementi", "Jurong West"];
const FILTER_DAY_OPTIONS = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SEQUENCE = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WEEKDAY_LABELS = new Set(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
const WEEKEND_LABELS = new Set(["Saturday", "Sunday"]);

function toMinutes(value: string) {
  const [time, meridiem] = value.split(" ");
  const [hourText, minuteText] = time.split(":");
  let hour = Number(hourText);
  const minute = Number(minuteText);
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function toTimeLabel(totalMinutes: number) {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${meridiem}`;
}

function buildTimeSlots(start: string, end: string, intervalMinutes = 45) {
  const slots: string[] = [];
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  for (let current = startMinutes; current + intervalMinutes <= endMinutes; current += intervalMinutes) {
    slots.push(toTimeLabel(current));
  }
  return slots;
}

const WEEKDAY_TIME_OPTIONS = buildTimeSlots("4:30 PM", "9:00 PM");
const WEEKEND_TIME_OPTIONS = [
  ...buildTimeSlots("8:15 AM", "12:45 PM"),
  ...buildTimeSlots("2:45 PM", "6:45 PM"),
];
const ALL_TIME_OPTIONS = ["All", ...Array.from(new Set([...WEEKDAY_TIME_OPTIONS, ...WEEKEND_TIME_OPTIONS]))];
const COACH_RATE_PER_STUDENT = 90;
const INITIAL_LEAVE_APPLICATIONS: LeaveApplication[] = [
  { id: "leave-1", date: "2026-05-10", startDate: "2026-05-10", endDate: "2026-05-10", type: "Annual Leave", status: "Approved", note: "Family commitment" },
  { id: "leave-2", date: "2026-05-24", startDate: "2026-05-24", endDate: "2026-05-24", type: "Unavailable", status: "Pending", note: "Personal errand" },
  { id: "leave-3", date: "2026-05-28 to 2026-05-29", startDate: "2026-05-28", endDate: "2026-05-29", type: "Annual Leave", status: "Approved", note: "Short trip" },
];
const COACH_SESSION_HISTORY: CoachSessionRecord[] = [
  { id: "session-1", date: "2026-05-03", classId: "class-stage-2-sat-9" },
  { id: "session-2", date: "2026-05-03", classId: "class-stage-1-sat-10" },
  { id: "session-3", date: "2026-05-10", classId: "class-stage-2-sat-9" },
  { id: "session-4", date: "2026-05-17", classId: "class-stage-1-sat-10" },
  { id: "session-5", date: "2026-05-18", classId: "class-stage-3-sun-9" },
  { id: "session-6", date: "2026-05-18", classId: "class-stage-2-sun-11" },
  { id: "session-7", date: "2026-04-26", classId: "class-stage-2-sat-9" },
  { id: "session-8", date: "2026-04-27", classId: "class-stage-3-sun-9" },
];
const TODAY_DATE = "2026-05-21";

function getTimeFilterOptions(day: string) {
  if (WEEKDAY_LABELS.has(day)) return ["All", ...WEEKDAY_TIME_OPTIONS];
  if (WEEKEND_LABELS.has(day)) return ["All", ...WEEKEND_TIME_OPTIONS];
  return ALL_TIME_OPTIONS;
}

function getClassStartTime(timeRange: string) {
  return timeRange.split(" - ")[0];
}


function getDisplayTimeFromStart(start: string) {
  const startMinutes = toMinutes(start);
  return `${start} - ${toTimeLabel(startMinutes + 45)}`;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

function formatMonthBadge(date: string) {
  const [year, month] = date.split("-").map(Number);
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
  return `${monthLabel}-${String(year).slice(-2)}`;
}

function formatMonthLabel(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  const label = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long" });
  return `${label} ${year}`;
}

type MonthRecord = { month: string; sessions: number; attended: number; onLeave: number; revenue: number };

function buildMonthlyHistory(
  history: Array<{ date: string; status: string; revenue: number }>,
): MonthRecord[] {
  const byMonth: Record<string, MonthRecord> = {};
  for (const s of history) {
    const month = s.date.slice(0, 7);
    if (!byMonth[month]) byMonth[month] = { month, sessions: 0, attended: 0, onLeave: 0, revenue: 0 };
    byMonth[month].sessions++;
    if (s.status === "On Leave") byMonth[month].onLeave++;
    else byMonth[month].attended++;
    byMonth[month].revenue += s.revenue;
  }
  return Object.values(byMonth).sort((a, b) => b.month.localeCompare(a.month));
}

function compareByDayAndTime(a: ClassItem, b: ClassItem) {
  const dayDelta = DAY_SEQUENCE.indexOf(a.dayLabel) - DAY_SEQUENCE.indexOf(b.dayLabel);
  if (dayDelta !== 0) return dayDelta;
  return toMinutes(getClassStartTime(a.time)) - toMinutes(getClassStartTime(b.time));
}

function Icon({ name, className = "icon", style }: { name: IconName; className?: string; style?: React.CSSProperties }) {
  const p = { className, style, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "menu": return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "close": return <svg {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>;
    case "bell": return <svg {...p}><path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" /><path d="M10 17a2 2 0 0 0 4 0" /></svg>;
    case "today": return <svg {...p}><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
    case "classes": return <svg {...p}><rect x="4" y="5" width="7" height="6" rx="1.5" /><rect x="13" y="5" width="7" height="6" rx="1.5" /><rect x="4" y="13" width="7" height="6" rx="1.5" /><rect x="13" y="13" width="7" height="6" rx="1.5" /></svg>;
    case "students": return <svg {...p}><circle cx="9" cy="8.5" r="2.5" /><circle cx="15.5" cy="9.5" r="2" /><path d="M5.5 18a3.8 3.8 0 0 1 7 0" /><path d="M13.5 18c.3-1.4 1.5-2.5 3-2.8" /></svg>;
    case "inbox": return <svg {...p}><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15.5Z" /><path d="M4 10h4l1.5 2h5L16 10h4" /></svg>;
    case "more": return <svg {...p}><circle cx="6" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.6" fill="currentColor" stroke="none" /></svg>;
    case "location": return <svg {...p}><path d="M12 20s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
    case "message": return <svg {...p}><path d="M5 18.5V7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6A2.5 2.5 0 0 1 16.5 16H9l-4 2.5Z" /></svg>;
    case "shield": return <svg {...p}><path d="M12 3 5.5 5.5v5.8c0 4.2 2.7 8 6.5 9.7 3.8-1.7 6.5-5.5 6.5-9.7V5.5L12 3Z" /><path d="m9.3 12 1.7 1.7 3.7-4" /></svg>;
    case "chevron": return <svg {...p}><path d="m9 6 6 6-6 6" /></svg>;
    case "logout": return <svg {...p}><path d="M10 17H6.5A2.5 2.5 0 0 1 4 14.5v-5A2.5 2.5 0 0 1 6.5 7H10" /><path d="M13 16l4-4-4-4" /><path d="M8 12h9" /></svg>;
    case "back": return <svg {...p}><path d="m15 6-6 6 6 6" /><path d="M9 12h10" /></svg>;
    case "check": return <svg {...p}><path d="m5 13 4 4L19 7" /></svg>;
    case "help": return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M10.5 9a2 2 0 0 1 3.8.9c0 1.3-1.8 1.9-1.8 3.1" /><circle cx="12" cy="16.5" r=".7" fill="currentColor" stroke="none" /></svg>;
    case "coach": return <svg {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" /></svg>;
    case "lightning": return <svg {...p}><path d="M13 2 6 13h5l-1 9 8-12h-5l1-8Z" /></svg>;
  }
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <img alt="The Swim Starter Logo" className="brand-mark-image" src={tssLogo} />
    </div>
  );
}

function Badge({ label, tone = "" }: { label: string; tone?: string }) {
  return <span className={`badge ${tone}`}>{label}</span>;
}

function HelpTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="help-wrap">
      <button aria-expanded={open} aria-label="What is this?" className="help-btn" onClick={() => setOpen((v) => !v)} type="button">
        ?
      </button>
      {open && <span className="help-tip" role="tooltip">{text}</span>}
    </span>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-brand">
          <BrandMark />
          <div>
            <p className="eyebrow">Coach Portal</p>
            <h2>Welcome back</h2>
          </div>
        </div>
        <label className="field">
          <span>Email address</span>
          <input autoComplete="email" defaultValue="coach.ryan@swimstarter.sg" type="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input autoComplete="current-password" defaultValue="password123" type="password" />
        </label>
        <button className="primary-button full-width" onClick={onLogin} type="button">
          Sign in
        </button>
        <button className="text-link align-center" type="button">
          Forgot your password?
        </button>
        <p className="login-disclaimer">Prototype only — any email and password will sign you in.</p>
      </div>
    </div>
  );
}

function Drawer({
  open, screen, onClose, onSelect, onLogout, onOpenSettings,
}: {
  open: boolean;
  screen: ScreenKey;
  onClose: () => void;
  onSelect: (s: ScreenKey) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}) {
  if (!open) return null;
  return (
    <section className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <BrandMark />
            <div>
              <p className="eyebrow">Swim Starter</p>
              <strong style={{ fontSize: "var(--fs-small)" }}>{coach.name}</strong>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} type="button"><Icon name="close" /></button>
        </div>

        <div className="drawer-section">
          {navItems.map((item) => (
            <button
              className={`drawer-item ${screen === item.key ? "active" : ""}`}
              key={item.key}
              onClick={() => { onSelect(item.key); onClose(); }}
              type="button"
            >
              <span className="drawer-item-left"><Icon name={item.icon} /><span>{item.label}</span></span>
              <Icon name="chevron" className="chevron-icon" />
            </button>
          ))}
          <button className="drawer-item" onClick={() => { onOpenSettings(); onClose(); }} type="button">
            <span className="drawer-item-left"><Icon name="more" /><span>Settings</span></span>
            <Icon name="chevron" className="chevron-icon" />
          </button>
        </div>

        <div className="drawer-footer">
          <button className="drawer-item" onClick={onLogout} type="button">
            <span className="drawer-item-left"><Icon name="logout" /><span>Sign out</span></span>
          </button>
        </div>
      </aside>
    </section>
  );
}

function StudentActivityCard({
  student, onOpenStudent, onOpenMessage,
}: {
  student: StudentItem;
  onOpenStudent: (id: string) => void;
  onOpenMessage: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasEquipment = student.equipmentStatus !== "Not Required";
  const hasPayIssue = student.paymentStatus !== "Paid" && student.paymentStatus !== "Trial";
  const hasPauseIssue = student.pauseQuitStatus !== "None";
  const flagCount = [hasEquipment, hasPayIssue, hasPauseIssue].filter(Boolean).length;

  return (
    <article className="activity-student-card">
      <button aria-expanded={expanded} className="student-card-toggle" onClick={() => setExpanded((v) => !v)} type="button">
        <div>
          <p className="eyebrow">{student.type}</p>
          <h3>{student.name}</h3>
        </div>
        <div className="student-card-toggle-right">
          {flagCount > 0 && <Badge label={`${flagCount} flag${flagCount > 1 ? "s" : ""}`} tone="alert" />}
          <Badge label={student.studentStatus} tone="blue" />
          <Icon name="chevron" className={`chevron-icon${expanded ? " expanded" : ""}`} />
        </div>
      </button>

      <div className="attendance-chip-row">
        <button className="attendance-action active" type="button">Present</button>
        <button className="attendance-action" type="button">Absent</button>
      </div>

      {expanded && (
        <>
          <div className={hasEquipment ? "activity-grid" : ""}>
            <div className="mini-info-card">
              <div className="section-title-row" style={{ marginBottom: 4 }}>
                <p className="eyebrow" style={{ margin: 0 }}>Test level</p>
                <HelpTip text="The current SwimSafer or internal test level this student is working towards." />
              </div>
              <p style={{ fontSize: "var(--fs-small)" }}>{student.currentTestLevel}</p>
              <button className="secondary-button full-width" onClick={() => onOpenStudent(student.id)} type="button">View</button>
            </div>
            {hasEquipment && (
              <div className="mini-info-card">
                <p className="eyebrow">Equipment</p>
                <p style={{ fontSize: "var(--fs-small)" }}>{student.equipmentStatus}</p>
                <button className="secondary-button full-width" type="button">Give Equipment</button>
              </div>
            )}
          </div>

          <div className="mini-info-card">
            <div className="section-title-row" style={{ marginBottom: 6 }}>
              <p className="eyebrow" style={{ margin: 0 }}>Needs attention</p>
              <HelpTip text="Items flagged by admin or parent that the coach should be aware of before or after class." />
            </div>
            <p style={{ fontSize: "var(--fs-small)" }}>Payment: {student.paymentStatus}</p>
            <p style={{ fontSize: "var(--fs-small)" }}>Pause/Quit: {student.pauseQuitStatus}</p>
            <p style={{ fontSize: "var(--fs-small)" }}>Readiness: {student.readiness}</p>
            <div className="button-row" style={{ marginTop: 8 }}>
              <button className="secondary-button" onClick={() => onOpenMessage(student.id)} type="button">Message Parent</button>
              <button className="secondary-button" onClick={() => onOpenStudent(student.id)} type="button">Update Readiness</button>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

function CompactRosterRow({
  student,
  transferStatus,
  onOpenStudent,
  onCancelTransfer,
}: {
  student: StudentItem;
  transferStatus?: TransferStatus;
  onOpenStudent: () => void;
  onCancelTransfer?: () => void;
}) {
  const expanded = true;
  const [assessmentMarkedReady, setAssessmentMarkedReady] = useState(false);
  const [equipmentIssued, setEquipmentIssued] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState<"absent" | "present" | null>(null);
  const [parentCommentSubmitted, setParentCommentSubmitted] = useState(false);
  const enrolmentStatus = formatEnrolmentStatus(student);
  const paymentStatus = formatPaymentStatus(student.paymentStatus);
  const showAssessmentCard = isAssessmentDue(student);
  const showParentFollowUpCard = needsParentFollowUp(student);
  const showEquipmentCard = needsEquipmentDistribution(student) && !equipmentIssued;
  return (
    <div className={`student-compact-row ${expanded ? "expanded" : ""}`}>
      <div className="student-compact-toggle">
        <div>
          <h3 className="student-row-name">{student.name}</h3>
          <p className="student-row-meta">{formatTestLevelLabel(student.currentTestLevel)}</p>
          <div className="student-name-status-group">
            <span className={`student-name-status ${enrolmentStatusTone(enrolmentStatus)}`}>{enrolmentStatus}</span>
            {paymentStatus && <><span className="student-name-status" style={{ color: "var(--text-muted)" }}>·</span><span className={`student-name-status ${paymentStatusTone(paymentStatus)}`}>{paymentStatus}</span></>}
          </div>
        </div>
        <div className="student-row-actions">
          {transferStatus && <Badge label={transferStatus} tone="success" />}
          <button aria-label="Open student detail" className="student-detail-arrow" onClick={onOpenStudent} type="button">
            <Icon name="chevron" />
          </button>
        </div>
      </div>

      {!attendanceMarked && (
        <div className="student-attendance-row">
          <button className="student-attendance-button absent" onClick={() => setAttendanceMarked("absent")} type="button">Absent</button>
          <button className="student-attendance-button present" onClick={() => setAttendanceMarked("present")} type="button">Present</button>
        </div>
      )}

      {expanded && (
        <div className="student-compact-detail">
          {showParentFollowUpCard && (
            <div className="student-action-card">
              <p className="eyebrow">Speak to parent</p>
              <p className="student-action-copy">
                Speak to parent about {student.pauseQuitStatus === "Pending Pause" ? "the pending pause request" : "the pending quit request"}.
              </p>
              <label className="student-comment-field">
                <span className="student-comment-label">Coach comment</span>
                <textarea
                  className="student-comment-input"
                  placeholder="Add notes for coach records. This will also be sent to the admin portal."
                  rows={3}
                />
              </label>
              {!parentCommentSubmitted ? (
                <button className="success-button" onClick={() => setParentCommentSubmitted(true)} type="button">
                  Spoken
                </button>
              ) : (
                <p className="student-action-copy success-copy">
                  Comment saved for coach records and sent to the admin portal.
                </p>
              )}
            </div>
          )}
          {showAssessmentCard && (
            <div className="student-action-card">
              <p className="eyebrow">Assessment due</p>
              <p className="student-action-copy">
                {student.name} is due for assessment. Review readiness and update the parent after class.
              </p>
              {!assessmentMarkedReady && (
                <div className="button-row">
                  <button className="danger-button" type="button">Not ready</button>
                  <button className="success-button" onClick={() => setAssessmentMarkedReady(true)} type="button">Ready</button>
                </div>
              )}
            </div>
          )}
          {showEquipmentCard && (
            <div className="student-action-card">
              <p className="eyebrow">Distribute equipment</p>
              <p className="student-action-copy">
                Prepare and distribute: {student.equipmentStatus}.
              </p>
              <div className="button-row">
                <button className="danger-button" type="button">Not issued</button>
                <button className="success-button" onClick={() => setEquipmentIssued(true)} type="button">Issued</button>
              </div>
            </div>
          )}
          {transferStatus && onCancelTransfer && (
            <button className="danger-button full-width" onClick={onCancelTransfer} type="button">
              Cancel Transfer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSelectGroup({
  label, options, selected, onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <label className="filter-group">
      <span className="eyebrow filter-label">{label}</span>
      <select className="select-input" onChange={(event) => onSelect(event.target.value)} value={selected}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function formatClassRoute(item: ClassItem) {
  return `${item.dayLabel} • ${item.time} • ${item.pool}`;
}

function formatTestLevelLabel(currentTestLevel: string) {
  const match = currentTestLevel.match(/stage\s*\d+/i);
  return match ? match[0].replace(/\s+/g, " ") : currentTestLevel.replace(/^Trial\s+/i, "");
}

function formatEnrolmentStatus(student: StudentItem) {
  if (student.type === "Trial Student" || student.studentStatus === "Trial") return "Trial";
  if (student.pauseQuitStatus === "Pending Pause") return "Pending Pause";
  if (student.pauseQuitStatus === "Pending Quit") return "Pending Quit";
  return "Enrolled";
}

function enrolmentStatusTone(status: string) {
  return status === "Pending Pause" || status === "Pending Quit" ? "alert" : "success";
}

function isAssessmentDue(student: StudentItem) {
  return student.readiness === "Ready for Assessment";
}

function needsParentFollowUp(student: StudentItem) {
  return student.pauseQuitStatus === "Pending Pause" || student.pauseQuitStatus === "Pending Quit";
}

function needsEquipmentDistribution(student: StudentItem) {
  return student.equipmentStatus !== "Not Required";
}

function formatPaymentStatus(paymentStatus: string) {
  if (paymentStatus === "Trial") return null;
  if (paymentStatus === "Paid") return "Paid";
  if (paymentStatus === "Payment Not Sent") return "Pending Payment";
  return "Overdue Payment";
}

function paymentStatusTone(status: string | null) {
  return status === "Overdue Payment" ? "alert" : "success";
}

function RootScreen({
  screen, fontScale, setFontScale, openPage, transferRequests, classFilters, setClassFilters, lightningAlertActive, onTurnOffLightningAlert, onLogout, leaveApplications,
}: {
  screen: ScreenKey;
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
  openPage: (p: PageState) => void;
  transferRequests: Record<string, TransferRequest>;
  classFilters: ClassFilters;
  setClassFilters: React.Dispatch<React.SetStateAction<ClassFilters>>;
  lightningAlertActive: boolean;
  onTurnOffLightningAlert: () => void;
  onLogout: () => void;
  leaveApplications: LeaveApplication[];
}) {
  const nextClass = useMemo(() => {
    const days = FILTER_DAY_OPTIONS.filter((d) => d !== "All");
    const todayIdx = days.indexOf("Saturday");
    return [...classes].sort((a, b) => {
      const ai = days.indexOf(a.dayLabel);
      const bi = days.indexOf(b.dayLabel);
      const aOrd = ai >= todayIdx ? ai - todayIdx : ai + days.length - todayIdx;
      const bOrd = bi >= todayIdx ? bi - todayIdx : bi + days.length - todayIdx;
      if (aOrd !== bOrd) return aOrd - bOrd;
      return toMinutes(getClassStartTime(a.time)) - toMinutes(getClassStartTime(b.time));
    })[0] ?? classes[0];
  }, []);
  const { pool: poolFilter, day: dayFilter, time: timeFilter } = classFilters;
  const [readNotificationTitles, setReadNotificationTitles] = useState<string[]>([]);

  const poolOptions = FILTER_POOL_OPTIONS;
  const dayOptions = FILTER_DAY_OPTIONS;
  const timeOptions = useMemo(() => getTimeFilterOptions(dayFilter), [dayFilter]);
  const allFiltersSelected = poolFilter === "All" && dayFilter === "All" && timeFilter === "All";

  const filteredClasses = useMemo(
    () =>
      classes.filter((item) =>
        (poolFilter === "All" || item.pool === poolFilter)
        && (dayFilter === "All" || item.dayLabel === dayFilter)
        && (timeFilter === "All" || getClassStartTime(item.time) === timeFilter))
        .sort(compareByDayAndTime),
    [dayFilter, poolFilter, timeFilter],
  );
  const displayedClasses = useMemo(
    () => (allFiltersSelected ? [...classes].sort(compareByDayAndTime) : filteredClasses),
    [allFiltersSelected, filteredClasses],
  );

  const groupedClasses = useMemo(() => {
    const visibleDays = allFiltersSelected ? DAY_SEQUENCE : DAY_SEQUENCE.filter((dayLabel) => displayedClasses.some((item) => item.dayLabel === dayLabel));
    return visibleDays
      .map((dayLabel) => ({
        dayLabel,
        items: displayedClasses.filter((item) => item.dayLabel === dayLabel),
      }))
      .filter((section) => section.items.length > 0);
  }, [allFiltersSelected, displayedClasses]);

  if (screen === "today") {
    return (
      <div className="screen-scroll">
        <article className="hero-card clean">
          <p className="eyebrow">Good morning</p>
          <h3 style={{ color: "#fff", fontSize: "var(--fs-h2)" }}>{coach.name}</h3>
          <p style={{ fontSize: "var(--fs-small)", color: "rgba(255,255,255,0.82)" }}>{nextClass.dayLabel} · {getClassStartTime(nextClass.time)}</p>
          <p style={{ fontSize: "var(--fs-small)", color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{nextClass.pool} Pool</p>
          <div className="hero-metrics">
            <div className="metric-card">
              <span className="metric-number">{coach.classesToday}</span>
              <span style={{ fontSize: "var(--fs-small)", color: "rgba(255,255,255,0.8)" }}>Classes today</span>
            </div>
            <div className="metric-card">
              <span className="metric-number">{coach.firstClass}</span>
              <span style={{ fontSize: "var(--fs-small)", color: "rgba(255,255,255,0.8)" }}>First class</span>
            </div>
          </div>
          <button className="primary-button full-width" onClick={() => openPage({ key: "classDetail", classId: nextClass.id })} type="button">
            Upcoming class
          </button>
        </article>

        {lightningAlertActive && (
          <article className="alert-card">
            <p className="eyebrow">Urgent alert</p>
            <h3>Lightning alert is active.</h3>
            <p style={{ fontSize: "var(--fs-small)" }}>Stop water activity and move students to a sheltered area.</p>
            <div className="button-row">
              <button className="danger-button" onClick={onTurnOffLightningAlert} type="button">Turn off</button>
              <button className="success-button" onClick={() => openPage({ key: "lightningAlert" })} type="button">View procedure</button>
            </div>
          </article>
        )}

        <div className="quick-grid">
          <button className="quick-tile" onClick={() => openPage({ key: "messageParent" })} type="button">
            <Icon name="message" />
            <span>Message Parent</span>
          </button>
          <button className="quick-tile" onClick={() => openPage({ key: "adminRequest" })} type="button">
            <Icon name="more" />
            <span>Inform Admin</span>
          </button>
          <button className="quick-tile" onClick={() => openPage({ key: "emergency" })} type="button">
            <Icon name="shield" />
            <span>Safety</span>
          </button>
        </div>
      </div>
    );
  }

  if (screen === "classes") {
    return (
      <div className="screen-scroll">
        <article className="section-card schedule-overview-card">
          <div className="section-header">
            <div>
              <div className="section-title-row">
                <h3>Filter</h3>
                <HelpTip text="Filter by pool, day, and timeslot, then tap any class card to drill into the student flow." />
              </div>
            </div>
            <Badge label={`${displayedClasses.length} classes`} tone="blue" />
          </div>
          <FilterSelectGroup label="Pool" onSelect={(value) => setClassFilters((current) => ({ ...current, pool: value }))} options={poolOptions} selected={poolFilter} />
          <FilterSelectGroup label="Day" onSelect={(value) => setClassFilters((current) => ({ ...current, day: value }))} options={dayOptions} selected={dayFilter} />
          <FilterSelectGroup label="Timeslot" onSelect={(value) => setClassFilters((current) => ({ ...current, time: value }))} options={timeOptions} selected={timeFilter} />
        </article>

        {groupedClasses.map((section) => (
          <section className="schedule-day-group" key={section.dayLabel}>
            <div className="schedule-day-header">
              <div>
                <p className="eyebrow">Schedule</p>
                <h3>{section.dayLabel}</h3>
              </div>
              <Badge label={`${section.items.length} class${section.items.length > 1 ? "es" : ""}`} tone="blue" />
            </div>

            {section.items.map((item) => {
              const classStudents = students.filter((student) => item.studentIds.includes(student.id));
              const pendingTransfers = classStudents.filter((student) => transferRequests[student.id]).length;
              return (
                <div className="schedule-class-card" key={item.id} onClick={() => openPage({ key: "classDetail", classId: item.id })} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openPage({ key: "classDetail", classId: item.id })}>
                  <div className="schedule-class-top">
                    <div>
                      <h3>{timeFilter !== "All" ? getDisplayTimeFromStart(timeFilter) : getDisplayTimeFromStart(getClassStartTime(item.time))}</h3>
                    </div>
                    <Badge label={`${classStudents.length} students`} tone="blue" />
                  </div>
                  <p className="schedule-class-copy">{item.pool}</p>
                  <button
                    className="secondary-button"
                    style={{ marginTop: 10 }}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openPage({ key: "attendance", classId: item.id }); }}
                  >
                    View students
                  </button>
                  {pendingTransfers > 0 && <Badge label={`${pendingTransfers} pending transfer`} tone="success" />}
                </div>
              );
            })}
          </section>
        ))}

        {displayedClasses.length === 0 && (
          <article className="list-card">
            <p className="eyebrow">No classes found</p>
            <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>
              No classes match the selected filter combination for this coach.
            </p>
          </article>
        )}
      </div>
    );
  }

  if (screen === "coach") {
    const approvedLeaveDates = new Set(
      leaveApplications.filter((application) => application.status === "Approved").map((application) => application.date),
    );
    const attendanceHistory = COACH_SESSION_HISTORY.map((session) => {
      const classItem = classes.find((item) => item.id === session.classId)!;
      const onLeave = approvedLeaveDates.has(session.date);
      return {
        ...session,
        classItem,
        status: onLeave ? "On Leave" : "Attended",
        revenue: onLeave ? 0 : classItem.students * COACH_RATE_PER_STUDENT,
      };
    });
    const monthlyRevenue = attendanceHistory
      .filter((session) => session.date.startsWith("2026-05"))
      .reduce((sum, session) => sum + session.revenue, 0);
    const lifetimeRevenue = attendanceHistory.reduce((sum, session) => sum + session.revenue, 0);
    const monthlyHistory = buildMonthlyHistory(attendanceHistory);

    return (
      <div className="screen-scroll">
        <article className="section-card hero">
          <div className="section-title-row" style={{ marginBottom: 8 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Leave application</p>
            <HelpTip text="Apply leave or submit unavailability here. Approved leave automatically marks the matching coach attendance history as on leave." />
          </div>
          <div className="button-stack">
            <button className="primary-button full-width" onClick={() => openPage({ key: "leaveApplication" })} type="button">Apply here</button>
            <button className="primary-button full-width" onClick={() => openPage({ key: "leaveHistory" })} type="button">View applied leave</button>
          </div>
        </article>

        <article className="section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Revenue</p>
              <h3>{formatCurrency(monthlyRevenue)}</h3>
            </div>
            <Badge label={formatMonthBadge(TODAY_DATE)} tone="success" />
          </div>
          <div className="detail-grid">
            <div className="detail-stat">
              <span>Monthly revenue</span>
              <strong>{formatCurrency(monthlyRevenue)}</strong>
            </div>
            <div className="detail-stat">
              <span>Lifetime revenue</span>
              <strong>{formatCurrency(lifetimeRevenue)}</strong>
            </div>
          </div>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>
            Revenue is auto-calculated at ${COACH_RATE_PER_STUDENT} per student.
          </p>
        </article>

        <article className="section-card">
          <div className="section-header">
            <div className="section-title-row">
              <p className="eyebrow" style={{ margin: 0 }}>Coach attendance history</p>
              <HelpTip text="Monthly summary. Approved leave dates are automatically reflected in each month's totals." />
            </div>
            <button
              aria-label="View all attendance history"
              className="student-detail-arrow"
              onClick={() => openPage({ key: "attendanceHistory" })}
              type="button"
            >
              <Icon name="chevron" />
            </button>
          </div>
          <div className="button-stack">
            {monthlyHistory.slice(0, 5).map((record) => (
              <div className="mini-info-card" key={record.month}>
                <div className="section-header">
                  <div>
                    <p className="eyebrow">{formatMonthLabel(record.month)}</p>
                    <p style={{ fontSize: "var(--fs-small)" }}>{record.attended} attended · {record.onLeave} on leave</p>
                  </div>
                  <Badge label={formatCurrency(record.revenue)} tone="success" />
                </div>
              </div>
            ))}
          </div>
          {monthlyHistory.length > 5 && (
            <button className="secondary-button full-width" onClick={() => openPage({ key: "attendanceHistory" })} type="button">
              View all records
            </button>
          )}
        </article>

      </div>
    );
  }

  if (screen === "inbox") {
    const unreadNotifications = notifications.filter((item) => !readNotificationTitles.includes(item.title));
    const readNotifications = notifications.filter((item) => readNotificationTitles.includes(item.title));

    return (
      <div className="screen-scroll">
        <section className="schedule-day-group">
          <div className="schedule-day-header">
            <div>
              <p className="eyebrow">Inbox</p>
              <h3>Unread</h3>
            </div>
            <Badge label={`${unreadNotifications.length} unread`} tone="blue" />
          </div>

          {unreadNotifications.map((item) => (
            <article className="list-card" key={item.title}>
              <div className="section-header">
                <Badge
                  label={item.meta}
                  tone={item.variant === "success" ? "success" : item.variant === "alert" ? "alert" : "blue"}
                />
                <button
                  aria-label="Mark as read"
                  className="mark-read-button"
                  onClick={() => setReadNotificationTitles((current) => [...current, item.title])}
                  type="button"
                >
                  <Icon name="check" />
                </button>
              </div>
              <h3>{item.title}</h3>
              <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>{item.body}</p>
              <button
                className="secondary-button full-width"
                onClick={() => openPage(item.variant === "alert" ? { key: "lightningAlert" } : { key: "adminRequest" })}
                type="button"
              >
                Open detail
              </button>
            </article>
          ))}
        </section>

        <section className="schedule-day-group">
          <div className="schedule-day-header">
            <div>
              <p className="eyebrow">Inbox</p>
              <h3>Read</h3>
            </div>
            <Badge label={`${readNotifications.length} read`} tone="success" />
          </div>

          {readNotifications.map((item) => (
            <article className="list-card" key={item.title}>
              <Badge
                label={item.meta}
                tone={item.variant === "success" ? "success" : item.variant === "alert" ? "alert" : "blue"}
              />
              <h3>{item.title}</h3>
              <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>{item.body}</p>
              <button
                className="secondary-button full-width"
                onClick={() => openPage(item.variant === "alert" ? { key: "lightningAlert" } : { key: "adminRequest" })}
                type="button"
              >
                Open detail
              </button>
            </article>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="screen-scroll">
      <article className="section-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Emergency / Safety</p>
            <h3>Poolside quick actions</h3>
          </div>
          <Icon name="shield" className="icon" />
        </div>
        <button className="secondary-button full-width" onClick={() => openPage({ key: "emergency" })} type="button">Open safety tools</button>
      </article>

      <article className="section-card">
        <p className="eyebrow">Admin requests</p>
        <h3>Transfer, equipment, corrections</h3>
        <button className="secondary-button full-width" onClick={() => openPage({ key: "adminRequest" })} type="button">Submit request</button>
      </article>

      <article className="section-card">
        <div className="section-title-row" style={{ marginBottom: 8 }}>
          <p className="eyebrow" style={{ margin: 0 }}>Text size</p>
          <HelpTip text="Increase text size so the portal is easier to read poolside or in bright sunlight." />
          <Badge label={fontScale === "normal" ? "Normal" : fontScale === "large" ? "Large" : "Extra Large"} tone="blue" />
        </div>
        <div className="font-switch">
          {(["normal", "large", "xlarge"] as FontScale[]).map((size) => (
            <button className={`font-chip ${fontScale === size ? "active" : ""}`} key={size} onClick={() => setFontScale(size)} type="button">
              {size === "normal" ? "Aa  Normal" : size === "large" ? "Aa  Large" : "Aa  Extra Large"}
            </button>
          ))}
        </div>
      </article>

      <article className="section-card">
        <p className="eyebrow">Account</p>
        <h3>Sign out</h3>
        <button className="danger-button full-width" onClick={onLogout} type="button">Logout</button>
      </article>
    </div>
  );
}

function selectTransferClass(
  availableClasses: ClassItem[],
  current: ClassItem,
  change: Partial<Pick<ClassItem, "pool" | "dayLabel" | "time">>,
) {
  const preferred = availableClasses.find(
    (item) =>
      item.pool === (change.pool ?? current.pool)
      && item.dayLabel === (change.dayLabel ?? current.dayLabel)
      && item.time === (change.time ?? current.time),
  );
  if (preferred) return preferred;

  if (change.pool) {
    const byPool = availableClasses.find((item) => item.pool === change.pool);
    if (byPool) return byPool;
  }
  if (change.dayLabel) {
    const byDay = availableClasses.find((item) => item.dayLabel === change.dayLabel);
    if (byDay) return byDay;
  }
  if (change.time) {
    const byTime = availableClasses.find((item) => item.time === change.time);
    if (byTime) return byTime;
  }
  return current;
}

function TransferScreen({
  fromClass,
  student,
  transferRequests,
  onBack,
  onSubmitTransfer,
  onCancelTransfer,
}: {
  fromClass: ClassItem;
  student: StudentItem;
  transferRequests: Record<string, TransferRequest>;
  onBack: () => void;
  onSubmitTransfer: (studentId: string, fromClassId: string, toClassId: string) => void;
  onCancelTransfer: (studentId: string) => void;
}) {
  const transferOptions = classes.filter((entry) => entry.id !== fromClass.id && entry.pool !== "Sheltered Waiting Area");
  const existingTarget = transferRequests[student.id]?.toClassId;
  const [selectedClassId, setSelectedClassId] = useState(existingTarget ?? transferOptions[0]?.id ?? fromClass.id);
  const selectedClass = classes.find((entry) => entry.id === selectedClassId) ?? transferOptions[0] ?? fromClass;
  const poolOptions = Array.from(new Set(transferOptions.map((entry) => entry.pool)));
  const dayOptions = Array.from(new Set(transferOptions.map((entry) => entry.dayLabel)));
  const timeOptions = Array.from(new Set(transferOptions.map((entry) => entry.time)));

  useEffect(() => {
    if (existingTarget) {
      setSelectedClassId(existingTarget);
    }
  }, [existingTarget]);

  return (
    <>
      {transferRequests[student.id] && (
        <article className="success-banner">
          <div className="success-banner-icon"><Icon name="check" /></div>
          <div>
            <strong>Transfer request sent.</strong>
            <p style={{ fontSize: "var(--fs-small)", color: "var(--success-text)" }}>
              Parent portal status is now Pending Parent Approval.
            </p>
          </div>
        </article>
      )}

      <article className="section-card">
        <p className="eyebrow">Current student</p>
        <h3>{student.name}</h3>
        <div className="detail-grid">
          <div className="detail-stat">
            <span>Current day</span>
            <strong>{fromClass.dayLabel}</strong>
          </div>
          <div className="detail-stat">
            <span>Current timeslot</span>
            <strong>{fromClass.time}</strong>
          </div>
          <div className="detail-stat">
            <span>Current pool</span>
            <strong>{fromClass.pool}</strong>
          </div>
          <div className="detail-stat">
            <span>Current test level</span>
            <strong>{student.currentTestLevel}</strong>
          </div>
        </div>
      </article>

      <article className="section-card">
        <div className="section-title-row">
          <p className="eyebrow" style={{ margin: 0 }}>Choose destination</p>
          <HelpTip text="Choose the new pool, day, and timeslot from the dropdowns. The app will match the closest available class." />
        </div>

        <label className="field">
          <span>Pool</span>
          <select
            className="select-input"
            onChange={(event) => setSelectedClassId(selectTransferClass(transferOptions, selectedClass, { pool: event.target.value }).id)}
            value={selectedClass.pool}
          >
            {poolOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Day</span>
          <select
            className="select-input"
            onChange={(event) => setSelectedClassId(selectTransferClass(transferOptions, selectedClass, { dayLabel: event.target.value }).id)}
            value={selectedClass.dayLabel}
          >
            {dayOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Timeslot</span>
          <select
            className="select-input"
            onChange={(event) => setSelectedClassId(selectTransferClass(transferOptions, selectedClass, { time: event.target.value }).id)}
            value={selectedClass.time}
          >
            {timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </article>

      <div className="transfer-action-row">
        <button
          className="danger-button"
          onClick={() => {
            if (transferRequests[student.id]) {
              onCancelTransfer(student.id);
            }
            onBack();
          }}
          type="button"
        >
          Cancel
        </button>
        <button className="success-button" onClick={() => onSubmitTransfer(student.id, fromClass.id, selectedClass.id)} type="button">
          Transfer
        </button>
      </div>
    </>
  );
}

function WatiMessageScreen({ student }: { student: StudentItem | null }) {
  return (
    <>
      <article className="section-card">
        <p className="eyebrow">WATI contact</p>
        <h3>{student ? student.parent : "Parent contact"}</h3>
        <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>
          {student ? `${student.parentPhone} · ${student.name}` : "+65 XXXX XXXX"}
        </p>
      </article>
      <article className="list-card">
        <div className="section-title-row">
          <p className="eyebrow" style={{ margin: 0 }}>Message for parent</p>
          <HelpTip text="This screen represents the handoff into WATI messaging for the selected parent conversation." />
        </div>
        <label className="student-comment-field">
          <span className="student-comment-label">Draft message</span>
          <textarea
            className="student-comment-input"
            defaultValue={student ? `Hi ${student.parent}, quick update about ${student.name}'s class today.` : "Hi parent, quick update about today's class."}
            rows={4}
          />
        </label>
        <button className="success-button full-width" type="button">Open WATI Message</button>
      </article>
    </>
  );
}

function LeaveApplicationFormScreen({
  onApply,
}: {
  onApply: (application: LeaveApplication) => void;
}) {
  const [startDate, setStartDate] = useState("2026-05-31");
  const [endDate, setEndDate] = useState("2026-05-31");
  const [applicationType, setApplicationType] = useState<"Annual Leave" | "Medical Leave">("Annual Leave");
  const [mcAttached, setMcAttached] = useState(false);
  const [comment, setComment] = useState("");
  const canSubmit = Boolean(startDate && endDate && (applicationType !== "Medical Leave" || mcAttached));

  return (
    <>
      <article className="section-card">
        <div className="section-title-row">
          <p className="eyebrow" style={{ margin: 0 }}>Apply leave / submit MC</p>
          <HelpTip text="Date range is required. MC attachment is required only when the application type is Submit MC." />
        </div>
        <div className="detail-grid">
          <label className="field" style={{ margin: 0 }}>
            <span>Date from</span>
            <input onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} />
          </label>
          <label className="field" style={{ margin: 0 }}>
            <span>Date to</span>
            <input onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} />
          </label>
        </div>
        <label className="field" style={{ margin: 0 }}>
          <span>Type of application</span>
          <select className="select-input" onChange={(event) => setApplicationType(event.target.value as "Annual Leave" | "Medical Leave")} value={applicationType}>
            <option value="Annual Leave">Apply Leave</option>
            <option value="Medical Leave">Submit MC</option>
          </select>
        </label>
        {applicationType === "Medical Leave" && (
          <div className="button-stack">
            <button className="secondary-button full-width" onClick={() => setMcAttached(true)} type="button">
              {mcAttached ? "MC attached" : "Attach MC"}
            </button>
            <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>Attachment is required for MC submission.</p>
          </div>
        )}
        <label className="student-comment-field">
          <span className="student-comment-label">Comment</span>
          <textarea
            className="student-comment-input"
            onChange={(event) => setComment(event.target.value)}
            placeholder="Optional note for admin."
            rows={4}
            value={comment}
          />
        </label>
        <button
          className="success-button full-width"
          disabled={!canSubmit}
          onClick={() =>
            onApply({
              id: `leave-${Date.now()}`,
              date: startDate === endDate ? startDate : `${startDate} to ${endDate}`,
              startDate,
              endDate,
              type: applicationType,
              status: applicationType === "Medical Leave" ? "Approved" : "Pending",
              note: comment || (applicationType === "Medical Leave" ? "MC submitted from coach tab" : "Leave application submitted from coach tab"),
            })
          }
          type="button"
        >
          Apply now
        </button>
      </article>
    </>
  );
}

function AppliedLeaveHistoryScreen({
  leaveApplications,
  onCancelLeave,
}: {
  leaveApplications: LeaveApplication[];
  onCancelLeave: (id: string) => void;
}) {
  const pendingLeaves = leaveApplications.filter((application) => application.status === "Pending");
  const upcomingApprovedLeaves = leaveApplications.filter(
    (application) => application.status === "Approved" && application.endDate >= TODAY_DATE,
  );
  const pastLeaves = leaveApplications.filter(
    (application) => application.status === "Approved" && application.endDate < TODAY_DATE,
  );

  const renderLeaveCard = (application: LeaveApplication, showCancel = false) => (
    <div className="mini-info-card" key={application.id}>
      <div className="section-header">
        <div>
          <p className="eyebrow">{application.type}</p>
          <p style={{ fontSize: "var(--fs-small)" }}>{application.date}</p>
        </div>
        <Badge label={application.status} tone={application.status === "Approved" ? "success" : "blue"} />
      </div>
      <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>{application.note}</p>
      {showCancel && (
        <button className="danger-button full-width" onClick={() => onCancelLeave(application.id)} type="button">
          Cancel leave
        </button>
      )}
    </div>
  );

  return (
    <>
      <article className="section-card">
        <p className="eyebrow">Pending leave</p>
        <div className="button-stack">
          {pendingLeaves.length > 0 ? pendingLeaves.map((application) => renderLeaveCard(application, true)) : (
            <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>No pending leave applications.</p>
          )}
        </div>
      </article>

      <article className="section-card">
        <p className="eyebrow">Approved leave</p>
        <div className="button-stack">
          {upcomingApprovedLeaves.length > 0 ? upcomingApprovedLeaves.map((application) => renderLeaveCard(application, true)) : (
            <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>No upcoming approved leave.</p>
          )}
        </div>
      </article>

      <article className="section-card">
        <p className="eyebrow">Past leaves taken</p>
        <div className="button-stack">
          {pastLeaves.length > 0 ? pastLeaves.map((application) => renderLeaveCard(application)) : (
            <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>No past leave records.</p>
          )}
        </div>
      </article>
    </>
  );
}

function AdminCommentScreen() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <article className="section-card">
        <p className="eyebrow">Internal communication</p>
        <h3>Coach to admin</h3>
        <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>
          Use this comment box for internal updates, schedule concerns, transfer notes, or safety follow-ups.
        </p>
      </article>
      <article className="list-card">
        <label className="student-comment-field">
          <span className="student-comment-label">Comment for admin</span>
          <textarea
            className="student-comment-input"
            placeholder="Type internal notes for the admin portal."
            rows={5}
          />
        </label>
        {!submitted ? (
          <button className="success-button full-width" onClick={() => setSubmitted(true)} type="button">
            Submit to Admin
          </button>
        ) : (
          <p className="student-action-copy success-copy">
            Comment sent to the admin portal.
          </p>
        )}
      </article>
    </>
  );
}

function PageView({
  page, onBack, openPage, fontScale, setFontScale, transferRequests, onSubmitTransfer, onCancelTransfer, onOpenNextClass, lightningAlertActive, onTurnOnLightningAlert, onTurnOffLightningAlert, onApplyLeave, leaveApplications, onCancelLeave,
}: {
  page: PageState;
  onBack: () => void;
  openPage: (p: PageState) => void;
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
  transferRequests: Record<string, TransferRequest>;
  onSubmitTransfer: (studentId: string, fromClassId: string, toClassId: string) => void;
  onCancelTransfer: (studentId: string) => void;
  onOpenNextClass: (classId: string) => void;
  lightningAlertActive: boolean;
  onTurnOnLightningAlert: () => void;
  onTurnOffLightningAlert: () => void;
  onApplyLeave: (application: LeaveApplication) => void;
  leaveApplications: LeaveApplication[];
  onCancelLeave: (id: string) => void;
}) {
  let title = "";
  let subtitle = "";
  let content: React.ReactNode = null;

  if (page.key === "classDetail") {
    const item = classes.find((entry) => entry.id === page.classId)!;
    const classStudents = students.filter((student) => item.studentIds.includes(student.id));
    const nextClassIndex = classes.findIndex((entry) => entry.id === item.id);
    const nextClass = classes[nextClassIndex + 1];
    title = "Upcoming Class";
    subtitle = "";
    content = (
      <>
        <article className="section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Selected class</p>
            </div>
            <Badge label={`${classStudents.length} students`} tone="blue" />
          </div>
          <div className="selected-class-meta">
            <span><strong>Day</strong> {item.dayLabel}</span>
            <span><strong>Timeslot</strong> {item.time}</span>
            <span className="selected-class-meta-pool"><strong>Pool</strong> {item.pool}</span>
          </div>
        </article>

        <article className="list-card">
          <div className="section-title-row">
            <p className="eyebrow" style={{ margin: 0 }}>Class Roster</p>
            <HelpTip text="Tap More on any row to open the student detail screen and continue into transfer." />
            <button className="roster-lightning-button" onClick={() => openPage({ key: "lightningAlert" })} type="button">
              Lightning
            </button>
          </div>
          <div className="student-compact-list">
            {classStudents.map((student) => (
              <CompactRosterRow
                key={student.id}
                onCancelTransfer={transferRequests[student.id] ? () => onCancelTransfer(student.id) : undefined}
                onOpenStudent={() => openPage({ key: "studentProfile", studentId: student.id, classId: item.id })}
                student={student}
                transferStatus={transferRequests[student.id]?.status}
              />
            ))}
          </div>
        </article>

        {nextClass && (
          <button className="secondary-button full-width" onClick={() => onOpenNextClass(nextClass.id)} type="button">
            Next class
          </button>
        )}
      </>
    );
  }

  if (page.key === "attendance") {
    const item = classes.find((entry) => entry.id === page.classId)!;
    title = "Attendance";
    subtitle = `${item.dayLabel} · ${item.time}`;
    content = (
      <>
        <article className="section-card">
          <div className="section-title-row" style={{ marginBottom: 8 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Attendance workspace</p>
            <HelpTip text="This workspace covers everything you need to do during the class: attendance, equipment, test level, student flags, and readiness." />
          </div>
          <h3>{item.pool}</h3>
          <div className="activity-summary-grid">
            <div className="summary-chip"><strong>{item.students}</strong><span>Students</span></div>
            <div className="summary-chip"><strong>2</strong><span>Follow-up</span></div>
            <div className="summary-chip"><strong>1</strong><span>Test soon</span></div>
          </div>
        </article>

        {students.filter((student) => item.studentIds.includes(student.id)).map((student) => (
          <StudentActivityCard
            key={student.id}
            onOpenMessage={(id) => openPage({ key: "messageParent", studentId: id })}
            onOpenStudent={(id) => openPage({ key: "studentProfile", studentId: id, classId: item.id })}
            student={student}
          />
        ))}

        <article className="section-card">
          <div className="section-title-row" style={{ marginBottom: 8 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Attendance summary</p>
            <HelpTip text="Review the counts before submitting. You cannot change attendance once it is submitted." />
          </div>
          <p style={{ fontSize: "var(--fs-small)" }}>Present: 5 · Absent: 1</p>
          <button className="primary-button full-width" type="button">Submit attendance</button>
        </article>
      </>
    );
  }

  if (page.key === "leaveApplication") {
    title = "Leave Application";
    subtitle = "Coach to admin";
    content = <LeaveApplicationFormScreen onApply={(application) => { onApplyLeave(application); onBack(); }} />;
  }

  if (page.key === "leaveHistory") {
    title = "Applied Leave";
    subtitle = "Coach records";
    content = <AppliedLeaveHistoryScreen leaveApplications={leaveApplications} onCancelLeave={onCancelLeave} />;
  }

  if (page.key === "studentProfile") {
    const student = students.find((entry) => entry.id === page.studentId)!;
    const currentClass = classes.find((entry) => entry.id === page.classId)!;
    const transfer = transferRequests[student.id];
    const destinationClass = transfer ? classes.find((entry) => entry.id === transfer.toClassId) : null;
    title = student.name;
    subtitle = `Age ${student.age}`;
    content = (
      <>
        <article className="section-card">
          <p className="eyebrow">{student.type}</p>
          <h3>{student.focus}</h3>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--alert-text)" }}>⚠ {student.safety}</p>
          <div className="badge-row">
            <Badge label={student.studentStatus} tone="blue" />
            <Badge label={student.readiness} tone="blue" />
            {transfer && <Badge label={transfer.status} tone="success" />}
          </div>
        </article>

        <article className="list-card detail-grid-card">
          <div className="section-title-row">
            <p className="eyebrow" style={{ margin: 0 }}>Key info</p>
            <HelpTip text="This screen keeps the coach-facing summary short: test level, payment, pause status, readiness, and transfer state." />
          </div>
          <div className="detail-grid">
            <div className="detail-stat"><span>Test level</span><strong>{student.currentTestLevel}</strong></div>
            <div className="detail-stat"><span>Payment</span><strong>{student.paymentStatus}</strong></div>
            <div className="detail-stat"><span>Pause status</span><strong>{student.pauseQuitStatus}</strong></div>
            <div className="detail-stat"><span>Readiness</span><strong>{student.readiness}</strong></div>
          </div>
          <div className="mini-info-card">
            <p className="eyebrow">Current class</p>
            <p style={{ fontSize: "var(--fs-small)" }}>{formatClassRoute(currentClass)}</p>
            {destinationClass && (
              <p style={{ fontSize: "var(--fs-small)", color: "var(--success-text)" }}>
                Parent portal: {transfer?.status} for {destinationClass.dayLabel} • {destinationClass.time} • {destinationClass.pool}
              </p>
            )}
          </div>
        </article>

        <article className="list-card">
          <div className="section-title-row">
            <p className="eyebrow" style={{ margin: 0 }}>Progress</p>
            <HelpTip text="Recent coaching notes and skill status for context before making a transfer decision." />
          </div>
          {student.progress.map(([skill, status]) => (
            <div className="sheet-row" key={`${student.id}-${skill}`}>
              <span style={{ fontSize: "var(--fs-small)" }}>{skill}</span>
              <Badge label={status} tone="blue" />
            </div>
          ))}
          <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>{student.note}</p>
        </article>

        <div className="sticky-action">
          <button className="transfer-launch-button" onClick={() => openPage({ key: "transferStudent", classId: currentClass.id, studentId: student.id })} type="button">
            Transfer →
          </button>
        </div>
      </>
    );
  }

  if (page.key === "transferStudent") {
    const student = students.find((entry) => entry.id === page.studentId)!;
    const fromClass = classes.find((entry) => entry.id === page.classId)!;
    title = "Transfer";
    subtitle = `${student.name} · transfer`;
    content = <TransferScreen fromClass={fromClass} onBack={onBack} onCancelTransfer={onCancelTransfer} onSubmitTransfer={onSubmitTransfer} student={student} transferRequests={transferRequests} />;
  }

  if (page.key === "messageParent") {
    const student = page.studentId ? students.find((entry) => entry.id === page.studentId) ?? null : null;
    title = "WATI Message";
    subtitle = student ? `${student.name} · ${student.parent}` : "Parent chat";
    content = <WatiMessageScreen student={student} />;
  }

  if (page.key === "adminRequest") {
    title = "Inform Admin";
    subtitle = "Internal comment";
    content = <AdminCommentScreen />;
  }

  if (page.key === "lightningAlert") {
    title = "Lightning Alert";
    subtitle = coach.location;
    content = (
      <>
        <article className={lightningAlertActive ? "alert-card" : "section-card"}>
          <p className="eyebrow">{lightningAlertActive ? "Urgent — water activity paused" : "Lightning alert is off"}</p>
          <h3>{lightningAlertActive ? "Move students to a sheltered area now." : "Turn on lightning alert when pool activity must stop."}</h3>
          <p style={{ fontSize: "var(--fs-small)" }}>
            {lightningAlertActive
              ? "Wait for admin to send an all-clear notice before resuming."
              : "Use this when weather conditions require coaches and students to leave the water immediately."}
          </p>
          {lightningAlertActive ? (
            <button className="danger-button full-width" onClick={onTurnOffLightningAlert} type="button">Turn off lightning alert</button>
          ) : (
            <button className="success-button full-width" onClick={onTurnOnLightningAlert} type="button">Turn on lightning alert</button>
          )}
        </article>
        <article className="section-card">
          <div className="section-title-row">
            <p className="eyebrow" style={{ margin: 0 }}>Land drill mode</p>
            <HelpTip text="Activities you can do on dry land while waiting for the pool to reopen." />
          </div>
          <div className="button-stack">
            {["Breathing exercise", "Water safety briefing", "Stroke movement practice", "Dry kicking practice"].map((activity) => (
              <div key={activity} className="mini-info-card"><p style={{ fontSize: "var(--fs-small)" }}>• {activity}</p></div>
            ))}
          </div>
          <button className="secondary-button full-width" onClick={() => openPage({ key: "emergency" })} type="button">Open safety shortcut</button>
        </article>
      </>
    );
  }

  if (page.key === "emergency") {
    title = "Emergency / Safety";
    subtitle = "Quick access";
    content = (
      <article className="list-card">
        <p className="eyebrow">Immediate actions</p>
        <div className="button-stack">
          <button className="primary-button full-width" type="button">Call Admin</button>
          <button className="secondary-button full-width" type="button">Report Incident</button>
          <button className="secondary-button full-width" onClick={() => openPage({ key: "lightningAlert" })} type="button">View Lightning Procedure</button>
        </div>
      </article>
    );
  }

  if (page.key === "settings") {
    title = "Settings";
    subtitle = "Accessibility";
    content = (
      <article className="list-card">
        <div className="section-title-row" style={{ marginBottom: 8 }}>
          <p className="eyebrow" style={{ margin: 0 }}>Text size</p>
          <HelpTip text="Choose a larger size to make the app easier to read while poolside or in bright sunlight." />
        </div>
        <div className="font-switch">
          {(["normal", "large", "xlarge"] as FontScale[]).map((size) => (
            <button className={`font-chip ${fontScale === size ? "active" : ""}`} key={size} onClick={() => setFontScale(size)} type="button">
              {size === "normal" ? "Aa  Normal" : size === "large" ? "Aa  Large" : "Aa  Extra Large"}
            </button>
          ))}
        </div>
      </article>
    );
  }

  if (page.key === "attendanceHistory") {
    title = "Attendance History";
    subtitle = "All months";
    const approvedLeaveDates = new Set(
      leaveApplications.filter((a) => a.status === "Approved").map((a) => a.date),
    );
    const allHistory = COACH_SESSION_HISTORY.map((session) => {
      const classItem = classes.find((item) => item.id === session.classId)!;
      const onLeave = approvedLeaveDates.has(session.date);
      return { ...session, status: onLeave ? "On Leave" : "Attended", revenue: onLeave ? 0 : classItem.students * COACH_RATE_PER_STUDENT };
    });
    const allMonthly = buildMonthlyHistory(allHistory);
    content = (
      <article className="section-card">
        <div className="button-stack">
          {allMonthly.map((record) => (
            <div className="mini-info-card" key={record.month}>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{formatMonthLabel(record.month)}</p>
                  <p style={{ fontSize: "var(--fs-small)" }}>{record.attended} attended · {record.onLeave} on leave</p>
                </div>
                <Badge label={formatCurrency(record.revenue)} tone="success" />
              </div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (page.key === "coachAttendance") {
    title = "Coach Attendance";
    subtitle = coach.location;
    content = (
      <article className="list-card">
        <p className="eyebrow">Today's status</p>
        <h3>Checked in at 8:42 AM</h3>
        <p style={{ fontSize: "var(--fs-small)", color: "var(--text-soft)" }}>{coach.location}</p>
        <button className="secondary-button full-width" type="button">Check Out</button>
      </article>
    );
  }

  if (page.key === "equipmentIssue") {
    title = "Equipment Issue";
    subtitle = "Report to admin";
    content = (
      <article className="list-card">
        <div className="section-title-row">
          <p className="eyebrow" style={{ margin: 0 }}>Issue summary</p>
          <HelpTip text="Describe what is missing or damaged. Admin will follow up before the next class." />
        </div>
        <p style={{ fontSize: "var(--fs-small)" }}>2 kickboards are missing.</p>
        <p style={{ fontSize: "var(--fs-small)" }}>1 noodle is damaged.</p>
        <button className="primary-button full-width" onClick={() => openPage({ key: "adminRequest", classId: page.classId })} type="button">
          Submit to admin
        </button>
      </article>
    );
  }

  return (
    <>
      <header className="topbar page-topbar">
        <div className="topbar-left">
          <button className="icon-button" onClick={onBack} type="button"><Icon name="back" /></button>
          <div>
            <p className="eyebrow">{subtitle}</p>
            <h2>{title}</h2>
          </div>
        </div>
      </header>
      <div className="screen-scroll page-scroll">{content}</div>
    </>
  );
}

function AppShell({
  screen, setScreen, currentPage, openPage, goBack, fontScale, setFontScale, menuOpen, setMenuOpen, transferRequests, onSubmitTransfer, onCancelTransfer, classFilters, setClassFilters, lightningAlertActive, onTurnOffLightningAlert, onTurnOnLightningAlert, onOpenNextClass, onLogout, leaveApplications, onApplyLeave, onCancelLeave,
}: {
  screen: ScreenKey;
  setScreen: (s: ScreenKey) => void;
  currentPage: PageState | null;
  openPage: (p: PageState) => void;
  goBack: () => void;
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
  menuOpen: boolean;
  setMenuOpen: (o: boolean) => void;
  transferRequests: Record<string, TransferRequest>;
  onSubmitTransfer: (studentId: string, fromClassId: string, toClassId: string) => void;
  onCancelTransfer: (studentId: string) => void;
  classFilters: ClassFilters;
  setClassFilters: React.Dispatch<React.SetStateAction<ClassFilters>>;
  lightningAlertActive: boolean;
  onTurnOffLightningAlert: () => void;
  onTurnOnLightningAlert: () => void;
  onOpenNextClass: (classId: string) => void;
  onLogout: () => void;
  leaveApplications: LeaveApplication[];
  onApplyLeave: (application: LeaveApplication) => void;
  onCancelLeave: (id: string) => void;
}) {
  return (
    <div className="app-shell">
      <main className="phone-frame">
        <div className="phone-screen">
          {currentPage ? (
            <PageView
              fontScale={fontScale}
              onBack={goBack}
              onCancelTransfer={onCancelTransfer}
              lightningAlertActive={lightningAlertActive}
              onOpenNextClass={onOpenNextClass}
              onApplyLeave={onApplyLeave}
              onCancelLeave={onCancelLeave}
              onSubmitTransfer={onSubmitTransfer}
              onTurnOffLightningAlert={onTurnOffLightningAlert}
              onTurnOnLightningAlert={onTurnOnLightningAlert}
              openPage={openPage}
              page={currentPage}
              setFontScale={setFontScale}
              transferRequests={transferRequests}
              leaveApplications={leaveApplications}
            />
          ) : (
            <>
              <header className="topbar">
                <div className="topbar-left">
                  <button className="icon-button" onClick={() => setMenuOpen(true)} type="button"><Icon name="menu" /></button>
                  <div>
                    <p className="eyebrow">The Swim Starter</p>
                    <h2 style={{ fontSize: "var(--fs-h3)" }}>
                      {screen === "today" ? "Today" : screen === "classes" ? "Classes" : screen === "coach" ? "Coach" : screen === "inbox" ? "Inbox" : "More"}
                    </h2>
                  </div>
                </div>
                <div className="topbar-actions">
                  <button className="icon-button" onClick={() => setScreen("inbox")} type="button">
                    <Icon name="bell" />
                  </button>
                  <button className="icon-button" onClick={() => openPage({ key: "lightningAlert" })} type="button">
                    <Icon name="lightning" />
                  </button>
                </div>
              </header>

              <RootScreen
                classFilters={classFilters}
                fontScale={fontScale}
                lightningAlertActive={lightningAlertActive}
                leaveApplications={leaveApplications}
                onLogout={onLogout}
                onTurnOffLightningAlert={onTurnOffLightningAlert}
                openPage={openPage}
                screen={screen}
                setClassFilters={setClassFilters}
                setFontScale={setFontScale}
                transferRequests={transferRequests}
              />

              <nav className="bottom-nav" aria-label="Primary navigation">
                {navItems.map((item) => (
                  <button className={`nav-item ${screen === item.key ? "active" : ""}`} key={item.key} onClick={() => setScreen(item.key)} type="button">
                    <Icon className="nav-icon" name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
          <Drawer
            onClose={() => setMenuOpen(false)}
            onLogout={onLogout}
            onOpenSettings={() => openPage({ key: "settings" })}
            onSelect={(nextScreen) => { setScreen(nextScreen); }}
            open={menuOpen}
            screen={screen}
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<ScreenKey>("today");
  const [pageStack, setPageStack] = useState<PageState[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>("normal");
  const [transferRequests, setTransferRequests] = useState<Record<string, TransferRequest>>({});
  const [classFilters, setClassFilters] = useState<ClassFilters>({ pool: "All", day: "Saturday", time: "All" });
  const [lightningAlertActive, setLightningAlertActive] = useState(true);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(INITIAL_LEAVE_APPLICATIONS);

  useEffect(() => {
    document.documentElement.dataset.fontScale = fontScale;
  }, [fontScale]);

  const currentPage = useMemo(() => pageStack[pageStack.length - 1] ?? null, [pageStack]);
  const openPage = (page: PageState) => setPageStack((stack) => [...stack, page]);
  const goBack = () => setPageStack((stack) => stack.slice(0, -1));
  const logout = () => {
    setLoggedIn(false);
    setMenuOpen(false);
    setScreen("today");
    setPageStack([]);
  };
  const submitTransfer = (studentId: string, fromClassId: string, toClassId: string) => {
    setTransferRequests((current) => ({
      ...current,
      [studentId]: { fromClassId, toClassId, status: "Pending Parent Approval" },
    }));
  };
  const cancelTransfer = (studentId: string) => {
    setTransferRequests((current) => {
      const next = { ...current };
      delete next[studentId];
      return next;
    });
  };
  const applyLeave = (application: LeaveApplication) => {
    setLeaveApplications((current) => [application, ...current]);
  };
  const cancelLeave = (id: string) => {
    setLeaveApplications((current) => current.filter((application) => application.id !== id));
  };
  const openNextClass = (classId: string) => {
    const targetClass = classes.find((entry) => entry.id === classId);
    if (!targetClass) return;
    setClassFilters({
      pool: "All",
      day: "All",
      time: getClassStartTime(targetClass.time),
    });
    setScreen("classes");
    setPageStack([]);
  };

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <AppShell
      currentPage={currentPage}
      fontScale={fontScale}
      goBack={goBack}
      classFilters={classFilters}
      lightningAlertActive={lightningAlertActive}
      leaveApplications={leaveApplications}
      menuOpen={menuOpen}
      onCancelTransfer={cancelTransfer}
      onApplyLeave={applyLeave}
      onCancelLeave={cancelLeave}
      onOpenNextClass={openNextClass}
      onLogout={logout}
      onSubmitTransfer={submitTransfer}
      onTurnOffLightningAlert={() => setLightningAlertActive(false)}
      onTurnOnLightningAlert={() => setLightningAlertActive(true)}
      openPage={openPage}
      screen={screen}
      setClassFilters={setClassFilters}
      setFontScale={setFontScale}
      setMenuOpen={setMenuOpen}
      setScreen={(nextScreen) => { setScreen(nextScreen); setPageStack([]); }}
      transferRequests={transferRequests}
    />
  );
}

export default App;
