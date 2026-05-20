import { useState, type ReactNode } from "react";
import {
  classes,
  coach,
  notifications,
  students,
  type OverlayKind,
  type ScreenKey,
} from "./mockData";

type FontScale = "normal" | "large" | "xlarge";
type IconName =
  | "menu"
  | "close"
  | "bell"
  | "today"
  | "classes"
  | "students"
  | "inbox"
  | "more"
  | "location"
  | "clock"
  | "users"
  | "message"
  | "shield"
  | "chevron"
  | "logout";

const navItems: Array<{ key: ScreenKey; label: string; icon: IconName }> = [
  { key: "today", label: "Today", icon: "today" },
  { key: "classes", label: "Classes", icon: "classes" },
  { key: "students", label: "Students", icon: "students" },
  { key: "inbox", label: "Inbox", icon: "inbox" },
  { key: "more", label: "More", icon: "more" },
];

function Icon({ name, className = "icon" }: { name: IconName; className?: string }) {
  const shared = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9 };

  switch (name) {
    case "menu":
      return (
        <svg {...shared}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...shared}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );
    case "bell":
      return (
        <svg {...shared}>
          <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
          <path d="M10 17a2 2 0 0 0 4 0" />
        </svg>
      );
    case "today":
      return (
        <svg {...shared}>
          <rect x="4" y="5" width="16" height="15" rx="3" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      );
    case "classes":
      return (
        <svg {...shared}>
          <rect x="4" y="5" width="7" height="6" rx="1.5" />
          <rect x="13" y="5" width="7" height="6" rx="1.5" />
          <rect x="4" y="13" width="7" height="6" rx="1.5" />
          <rect x="13" y="13" width="7" height="6" rx="1.5" />
        </svg>
      );
    case "students":
      return (
        <svg {...shared}>
          <circle cx="9" cy="8.5" r="2.5" />
          <circle cx="15.5" cy="9.5" r="2" />
          <path d="M5.5 18a3.8 3.8 0 0 1 7 0" />
          <path d="M13.5 18c.3-1.4 1.5-2.5 3-2.8" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...shared}>
          <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15.5Z" />
          <path d="M4 10h4l1.5 2h5L16 10h4" />
        </svg>
      );
    case "more":
      return (
        <svg {...shared}>
          <circle cx="6" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "location":
      return (
        <svg {...shared}>
          <path d="M12 20s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "users":
      return (
        <svg {...shared}>
          <path d="M16.5 19v-1.2A3.8 3.8 0 0 0 12.7 14H8.8A3.8 3.8 0 0 0 5 17.8V19" />
          <circle cx="10.7" cy="8.3" r="3.3" />
          <path d="M19 19v-1a3.2 3.2 0 0 0-2.5-3.1" />
        </svg>
      );
    case "message":
      return (
        <svg {...shared}>
          <path d="M5 18.5V7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6A2.5 2.5 0 0 1 16.5 16H9l-4 2.5Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...shared}>
          <path d="M12 3 5.5 5.5v5.8c0 4.2 2.7 8 6.5 9.7 3.8-1.7 6.5-5.5 6.5-9.7V5.5L12 3Z" />
          <path d="m9.3 12 1.7 1.7 3.7-4" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...shared}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "logout":
      return (
        <svg {...shared}>
          <path d="M10 17H6.5A2.5 2.5 0 0 1 4 14.5v-5A2.5 2.5 0 0 1 6.5 7H10" />
          <path d="M13 16l4-4-4-4" />
          <path d="M8 12h9" />
        </svg>
      );
  }
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 200 200" role="img">
        <path d="M49 58c13-14 34-22 59-22 16 0 32 4 46 12l-10 17c-11-6-23-9-35-9-18 0-31 5-39 13-9 9-8 23 2 29 5 3 11 5 20 6l24 3c16 2 27 6 35 13 17 14 14 43-6 58-13 10-31 15-51 15-22 0-42-6-57-16l10-17c13 8 29 13 45 13 13 0 24-3 31-8 10-7 11-20 2-27-5-4-12-6-24-7l-24-3c-14-2-24-5-32-10-23-15-24-45-1-70Z" />
        <path d="M25 157c25 7 52 11 81 11 32 0 62-5 90-14v12c-28 9-58 13-90 13-29 0-56-4-81-11v-11Z" />
        <path d="M25 177c25 7 52 11 81 11 32 0 62-5 90-14v12c-28 9-58 13-90 13-29 0-56-4-81-11v-12Z" />
      </svg>
    </div>
  );
}

function Badge({ label, tone = "" }: { label: string; tone?: string }) {
  return <span className={`badge ${tone}`}>{label}</span>;
}

function getScreenTitle(screen: ScreenKey) {
  if (screen === "today") return "Today";
  if (screen === "classes") return "Classes";
  if (screen === "students") return "Students";
  if (screen === "inbox") return "Inbox";
  return "More";
}

function Overlay({
  overlay,
  onClose,
}: {
  overlay: OverlayKind;
  onClose: () => void;
}) {
  if (!overlay) return null;

  let title = "Details";
  let subtitle = "Prototype";
  let content: ReactNode = null;

  if (overlay.type === "class") {
    const item = classes.find((entry) => entry.id === overlay.id);
    if (!item) return null;
    title = `${item.level} Class`;
    subtitle = item.time;
    content = (
      <>
        <article className="sheet-card">
          <p className="eyebrow">Class detail</p>
          <h3>{item.pool}</h3>
          <p>{item.focus}</p>
          <div className="badge-row">
            {item.badges.map((badge) => (
              <Badge key={badge} label={badge} />
            ))}
          </div>
        </article>
        <article className="sheet-card">
          <p className="eyebrow">Equipment</p>
          {item.equipment.map((gear) => (
            <p key={gear}>• {gear}</p>
          ))}
        </article>
        <article className="sheet-card">
          <p className="eyebrow">Safety notes</p>
          {item.safety.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </article>
        <article className="sheet-card">
          <button className="primary-button full-width" type="button">
            Mark Attendance
          </button>
        </article>
      </>
    );
  }

  if (overlay.type === "student") {
    const student = students.find((entry) => entry.id === overlay.id);
    if (!student) return null;
    title = student.name;
    subtitle = `${student.level} • Age ${student.age}`;
    content = (
      <>
        <article className="sheet-card">
          <p className="eyebrow">{student.type}</p>
          <h3>{student.focus}</h3>
          <p>{student.safety}</p>
        </article>
        <article className="sheet-card">
          <p className="eyebrow">Progress</p>
          {student.progress.map(([skill, status]) => (
            <div className="sheet-row" key={`${student.id}-${skill}`}>
              <span>{skill}</span>
              <Badge label={status} tone="blue" />
            </div>
          ))}
        </article>
        <article className="sheet-card">
          <button className="primary-button full-width" type="button">
            Update Progress
          </button>
        </article>
      </>
    );
  }

  if (overlay.type === "alert") {
    title = "Lightning Alert";
    subtitle = coach.location;
    content = (
      <>
        <article className="sheet-card">
          <p className="eyebrow">Action required</p>
          <h3>Move students to sheltered area.</h3>
          <p>Please stop water activity and wait for the next admin update.</p>
        </article>
        <article className="sheet-card">
          <p className="eyebrow">Land drill mode</p>
          <p>Breathing exercise</p>
          <p>Water safety briefing</p>
          <p>Dry kicking practice</p>
        </article>
      </>
    );
  }

  if (overlay.type === "admin") {
    title = "Admin Request";
    subtitle = "Static flow";
    content = (
      <article className="sheet-card">
        <p className="eyebrow">Student transfer</p>
        <p>Student: Jayden Tan</p>
        <p>Current slot: Sat 9:00 AM</p>
        <p>Requested slot: Sat 10:00 AM</p>
        <button className="primary-button full-width" type="button">
          Submit Request
        </button>
      </article>
    );
  }

  if (overlay.type === "parent") {
    title = "Message Parent";
    subtitle = "WhatsApp / WATI";
    content = (
      <>
        <article className="sheet-card">
          <p className="eyebrow">Templates</p>
          <button className="secondary-button full-width" type="button">
            Progress Update
          </button>
          <button className="secondary-button full-width" type="button">
            Attendance Follow-Up
          </button>
          <button className="secondary-button full-width" type="button">
            Class Reminder
          </button>
        </article>
        <article className="sheet-card">
          <button className="primary-button full-width" type="button">
            Open WhatsApp / WATI
          </button>
        </article>
      </>
    );
  }

  if (overlay.type === "emergency") {
    title = "Emergency / Safety";
    subtitle = "Quick access";
    content = (
      <article className="sheet-card">
        <button className="primary-button full-width" type="button">
          Call Admin
        </button>
        <button className="secondary-button full-width" type="button">
          Report Incident
        </button>
        <button className="secondary-button full-width" type="button">
          View Lightning Procedure
        </button>
      </article>
    );
  }

  return (
    <section className="overlay" onClick={onClose}>
      <div className="overlay-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="overlay-header">
          <div>
            <p className="eyebrow">{subtitle}</p>
            <h3>{title}</h3>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>
        <div className="overlay-content">{content}</div>
      </div>
    </section>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="login-screen">
      <div className="login-topbar">
        <BrandMark />
        <button className="text-link" type="button">
          Get started
        </button>
      </div>
      <div className="login-panel">
        <p className="eyebrow">Coach portal</p>
        <h1>Welcome back</h1>
        <p className="login-copy">
          Sign in to see your classes, attendance tasks, and urgent alerts for today.
        </p>
        <button className="social-button" type="button">
          Continue with Apple
        </button>
        <button className="social-button" type="button">
          Continue with Google
        </button>
        <div className="divider">
          <span>or</span>
        </div>
        <label className="field">
          <span>Email address</span>
          <input defaultValue="coach.ryan@swimstarter.sg" type="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input defaultValue="password123" type="password" />
        </label>
        <button className="primary-button full-width" onClick={onLogin} type="button">
          Log in
        </button>
        <button className="text-link align-left" type="button">
          Forgot your password?
        </button>
      </div>
      <div className="login-footer-card">
        <p className="eyebrow">New to Swim Starter?</p>
        <p>Prototype only. Any email and password can enter the coach portal.</p>
      </div>
    </div>
  );
}

function Drawer({
  open,
  screen,
  onClose,
  onSelect,
  fontScale,
  onFontScaleChange,
  onLogout,
}: {
  open: boolean;
  screen: ScreenKey;
  onClose: () => void;
  onSelect: (screen: ScreenKey) => void;
  fontScale: FontScale;
  onFontScaleChange: (scale: FontScale) => void;
  onLogout: () => void;
}) {
  if (!open) return null;

  return (
    <section className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <BrandMark />
            <div>
              <p className="eyebrow">Swim Starter</p>
              <h3>{coach.name}</h3>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-section">
          {navItems.map((item) => (
            <button
              className={`drawer-item ${screen === item.key ? "active" : ""}`}
              key={item.key}
              onClick={() => {
                onSelect(item.key);
                onClose();
              }}
              type="button"
            >
              <span className="drawer-item-left">
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </span>
              <Icon name="chevron" className="chevron-icon" />
            </button>
          ))}
        </div>

        <div className="drawer-section">
          <p className="eyebrow">Text size</p>
          <div className="font-switch">
            {(["normal", "large", "xlarge"] as FontScale[]).map((size) => (
              <button
                className={`font-chip ${fontScale === size ? "active" : ""}`}
                key={size}
                onClick={() => onFontScaleChange(size)}
                type="button"
              >
                {size === "normal" ? "Normal" : size === "large" ? "Large" : "Extra Large"}
              </button>
            ))}
          </div>
        </div>

        <div className="drawer-footer">
          <button className="drawer-item" onClick={onLogout} type="button">
            <span className="drawer-item-left">
              <Icon name="logout" />
              <span>Log out</span>
            </span>
          </button>
        </div>
      </aside>
    </section>
  );
}

function AppShell({
  screen,
  setScreen,
  setOverlay,
  fontScale,
  setMenuOpen,
}: {
  screen: ScreenKey;
  setScreen: (screen: ScreenKey) => void;
  setOverlay: (overlay: OverlayKind) => void;
  fontScale: FontScale;
  setMenuOpen: (open: boolean) => void;
}) {
  const nextClass = classes[0];
  const pendingClass = classes[1];

  return (
    <div className={`app-shell font-${fontScale}`}>
      <main className="phone-frame">
        <div className="phone-screen">
          <header className="topbar">
            <div className="topbar-left">
              <button className="icon-button" onClick={() => setMenuOpen(true)} type="button">
                <Icon name="menu" />
              </button>
              <div>
                <p className="eyebrow">Swim Starter coach portal</p>
                <h2>{getScreenTitle(screen)}</h2>
              </div>
            </div>
            <button className="icon-button" onClick={() => setOverlay({ type: "alert" })} type="button">
              <Icon name="bell" />
            </button>
          </header>

          <div className="header-strip">
            <span className="info-pill">
              <Icon name="location" />
              {coach.location}
            </span>
            <span className="info-pill">
              <Icon name="clock" />
              First class {coach.firstClass}
            </span>
          </div>

          <div className="screen-scroll">
            {screen === "today" && (
              <section className="screen active">
                <article className="hero-card clean">
                  <p className="eyebrow">Good morning</p>
                  <h3>{coach.name}</h3>
                  <p className="hero-copy">
                    You have {coach.classesToday} classes today. Start with the next class and keep attendance visible.
                  </p>
                  <div className="hero-metrics">
                    <div className="metric-card">
                      <span className="metric-number">4</span>
                      <span>Classes today</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-number">2</span>
                      <span>Actions pending</span>
                    </div>
                  </div>
                  <button className="primary-button full-width" onClick={() => setScreen("classes")} type="button">
                    View today's classes
                  </button>
                </article>

                <article className="alert-card">
                  <div className="alert-copy">
                    <p className="eyebrow">Urgent alert</p>
                    <h3>Lightning alert is active.</h3>
                    <p>Please stop water activity and move students to a sheltered area.</p>
                  </div>
                  <button className="secondary-button" onClick={() => setOverlay({ type: "alert" })} type="button">
                    View alert
                  </button>
                </article>

                <article className="section-card">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">Next class</p>
                      <h3>{nextClass.level}</h3>
                    </div>
                    <Badge label={nextClass.time} tone="blue" />
                  </div>
                  <p>{nextClass.pool}</p>
                  <div className="badge-row">
                    {nextClass.badges.map((badge) => (
                      <Badge key={badge} label={badge} />
                    ))}
                  </div>
                  <div className="button-row">
                    <button className="primary-button" onClick={() => setOverlay({ type: "class", id: nextClass.id })} type="button">
                      Open class
                    </button>
                    <button className="secondary-button" onClick={() => setOverlay({ type: "student", id: students[0].id })} type="button">
                      View student
                    </button>
                  </div>
                </article>

                <div className="quick-grid">
                  <button className="quick-tile" onClick={() => setOverlay({ type: "class", id: pendingClass.id })} type="button">
                    <Icon name="classes" />
                    <span>Mark Attendance</span>
                  </button>
                  <button className="quick-tile" onClick={() => setOverlay({ type: "parent" })} type="button">
                    <Icon name="message" />
                    <span>Message Parent</span>
                  </button>
                  <button className="quick-tile" onClick={() => setOverlay({ type: "admin" })} type="button">
                    <Icon name="more" />
                    <span>Inform Admin</span>
                  </button>
                  <button className="quick-tile" onClick={() => setOverlay({ type: "emergency" })} type="button">
                    <Icon name="shield" />
                    <span>Safety Shortcut</span>
                  </button>
                </div>
              </section>
            )}

            {screen === "classes" && (
              <section className="screen active">
                {classes.map((item) => (
                  <article className="list-card" key={item.id}>
                    <div className="section-header">
                      <div>
                        <p className="eyebrow">{item.time}</p>
                        <h3>{item.level}</h3>
                      </div>
                      <Badge label={item.attendance} tone="blue" />
                    </div>
                    <p>{item.pool}</p>
                    <p>{item.students} students</p>
                    <div className="badge-row">
                      {item.badges.map((badge) => (
                        <Badge key={badge} label={badge} />
                      ))}
                    </div>
                    <button className="primary-button full-width" onClick={() => setOverlay({ type: "class", id: item.id })} type="button">
                      Open class
                    </button>
                  </article>
                ))}
              </section>
            )}

            {screen === "students" && (
              <section className="screen active">
                {students.map((student) => (
                  <article className="list-card" key={student.id}>
                    <div className="section-header">
                      <div>
                        <p className="eyebrow">{student.type}</p>
                        <h3>{student.name}</h3>
                      </div>
                      <Badge label={`Age ${student.age}`} tone="blue" />
                    </div>
                    <p>{student.level}</p>
                    <p>{student.safety}</p>
                    <div className="button-row">
                      <button className="primary-button" onClick={() => setOverlay({ type: "student", id: student.id })} type="button">
                        Open profile
                      </button>
                      <button className="secondary-button" onClick={() => setOverlay({ type: "parent" })} type="button">
                        Message parent
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            )}

            {screen === "inbox" && (
              <section className="screen active">
                {notifications.map((item) => (
                  <article className="list-card" key={item.title}>
                    <div className="section-header">
                      <Badge label={item.meta} tone={item.variant === "success" ? "success" : item.variant === "alert" ? "alert" : "blue"} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </section>
            )}

            {screen === "more" && (
              <section className="screen active">
                <article className="section-card">
                  <p className="eyebrow">Coach attendance</p>
                  <h3>Checked In at 8:42 AM</h3>
                  <p>{coach.location}</p>
                </article>
                <article className="list-card">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">Emergency / Safety</p>
                      <h3>Poolside quick actions</h3>
                    </div>
                    <Icon name="shield" />
                  </div>
                  <button className="secondary-button full-width" onClick={() => setOverlay({ type: "emergency" })} type="button">
                    Open safety tools
                  </button>
                </article>
                <article className="list-card">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">Admin requests</p>
                      <h3>Transfer, equipment, corrections</h3>
                    </div>
                  </div>
                  <button className="secondary-button full-width" onClick={() => setOverlay({ type: "admin" })} type="button">
                    Submit request
                  </button>
                </article>
              </section>
            )}
          </div>

          <nav className="bottom-nav" aria-label="Primary">
            {navItems.map((item) => (
              <button
                className={`nav-item ${screen === item.key ? "active" : ""}`}
                key={item.key}
                onClick={() => setScreen(item.key)}
                type="button"
              >
                <Icon name={item.icon} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<ScreenKey>("today");
  const [overlay, setOverlay] = useState<OverlayKind>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>("normal");

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <>
      <AppShell
        fontScale={fontScale}
        screen={screen}
        setMenuOpen={setMenuOpen}
        setOverlay={setOverlay}
        setScreen={setScreen}
      />
      <Drawer
        fontScale={fontScale}
        onClose={() => setMenuOpen(false)}
        onFontScaleChange={setFontScale}
        onLogout={() => {
          setLoggedIn(false);
          setMenuOpen(false);
          setScreen("today");
        }}
        onSelect={setScreen}
        open={menuOpen}
        screen={screen}
      />
      <Overlay overlay={overlay} onClose={() => setOverlay(null)} />
    </>
  );
}

export default App;
