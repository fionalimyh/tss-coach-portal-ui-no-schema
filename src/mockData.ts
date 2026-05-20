export type ScreenKey = "today" | "classes" | "students" | "inbox" | "more";
export type OverlayKind =
  | { type: "class"; id: string }
  | { type: "student"; id: string }
  | { type: "alert" }
  | { type: "admin" }
  | { type: "parent" }
  | { type: "emergency" }
  | null;

export type ClassItem = {
  id: string;
  time: string;
  pool: string;
  level: string;
  students: number;
  attendance: string;
  badges: string[];
  focus: string;
  equipment: string[];
  safety: string[];
  handover: string;
};

export type StudentItem = {
  id: string;
  name: string;
  age: number;
  level: string;
  type: string;
  focus: string;
  lastAttended: string;
  parent: string;
  parentPhone: string;
  safety: string;
  progress: Array<[string, string]>;
  readiness: string;
  note: string;
};

export type NotificationItem = {
  title: string;
  meta: string;
  body: string;
  variant: "" | "yellow" | "alert" | "success";
};

export const coach = {
  name: "Coach Ryan",
  classesToday: 4,
  firstClass: "9:00 AM",
  location: "Bishan Swimming Complex",
};

export const classes: ClassItem[] = [
  {
    id: "class-stage-2",
    time: "9:00 AM - 9:45 AM",
    pool: "Bishan Swimming Complex",
    level: "Stage 2",
    students: 6,
    attendance: "Not marked",
    badges: ["Starting Soon", "Cover Class", "Affected by Alert"],
    focus: "Breathing control, stamina, and floating confidence",
    equipment: ["Kickboards x6", "Noodles x6", "Sink toys x4", "Cones x2"],
    safety: [
      "Jayden needs extra encouragement with side breathing.",
      "Chloe is new and may be afraid of deeper water.",
    ],
    handover:
      "Coach Aisyah is on leave. Please reassure Chloe before entry and watch Aiden's pacing.",
  },
  {
    id: "class-stage-1",
    time: "10:00 AM - 10:45 AM",
    pool: "Bishan Swimming Complex",
    level: "Stage 1",
    students: 5,
    attendance: "Pending submission",
    badges: ["Attendance Pending", "Progress Pending"],
    focus: "Water confidence, floating, and safe entry",
    equipment: ["Kickboards x5", "Toy cups x5", "Noodles x5"],
    safety: ["One trial student needs gentle introduction to the pool."],
    handover:
      "Parent asked for stamina update after class. Trial student Chloe to be assessed for Stage 1 fit.",
  },
  {
    id: "class-land-drill",
    time: "11:00 AM - 11:30 AM",
    pool: "Sheltered Waiting Area",
    level: "Mixed Stage 2",
    students: 8,
    attendance: "Ready",
    badges: ["Land Drill Required"],
    focus: "Dry kicking, breathing rhythm, and safety quiz",
    equipment: ["Cones x4", "Visual cards x8"],
    safety: ["Keep students seated under shelter until pool is cleared."],
    handover: "Use land drill set A until admin sends resume notice.",
  },
];

export const students: StudentItem[] = [
  {
    id: "jayden",
    name: "Jayden Tan",
    age: 7,
    level: "Stage 2",
    type: "Regular Student",
    focus: "Breathing control and stamina",
    lastAttended: "18 May 2026",
    parent: "Jayden's Parent",
    parentPhone: "+65 8123 4551",
    safety: "Sensitive to cold water. Parent requested gentle approach.",
    progress: [
      ["Breathing control", "Improving"],
      ["Floating", "Can Do Independently"],
      ["Kicking", "Needs More Practice"],
    ],
    readiness: "Flag Ready Soon",
    note:
      "Jayden is improving in stamina but still needs more side breathing repetition.",
  },
  {
    id: "aiden",
    name: "Aiden Lim",
    age: 8,
    level: "Stage 2",
    type: "Replacement Student",
    focus: "Water confidence and pacing",
    lastAttended: "19 May 2026",
    parent: "Aiden's Parent",
    parentPhone: "+65 9876 4452",
    safety: "Today at Bishan. Usual pool is Sengkang.",
    progress: [
      ["Kick timing", "Improving"],
      ["Floating", "Ready for Next Level"],
      ["Confidence", "Strong"],
    ],
    readiness: "Needs More Practice",
    note: "Replacement student today. Needs a quick orientation before class starts.",
  },
  {
    id: "chloe",
    name: "Chloe Tan",
    age: 6,
    level: "Trial Beginner",
    type: "Trial Student",
    focus: "Build comfort and confidence",
    lastAttended: "First class today",
    parent: "Chloe's Parent",
    parentPhone: "+65 9333 1200",
    safety: "Afraid of deep water. Needs reassurance before entering the pool.",
    progress: [
      ["Water confidence", "Learning"],
      ["Floating", "Not Started"],
      ["Listening", "Strong"],
    ],
    readiness: "Suitable for Stage 1",
    note: "Comfortable under guidance. Recommend Stage 1 after trial if confidence improves.",
  },
];

export const notifications: NotificationItem[] = [
  {
    title: "Lightning alert at Bishan",
    meta: "Urgent • Safety",
    body: "Water activity should pause now. Move students to sheltered area and wait for update.",
    variant: "alert",
  },
  {
    title: "New student added to 10:00 AM class",
    meta: "Action Required • Students",
    body: "Chloe Tan is attending her first class today. Review the parent concern before class.",
    variant: "yellow",
  },
  {
    title: "Equipment issue acknowledged",
    meta: "For Information • Admin",
    body: "Admin received the missing kickboards report and is checking storage.",
    variant: "success",
  },
  {
    title: "Attendance has not been submitted",
    meta: "Action Required • Attendance",
    body: "Please mark attendance before ending the 10:00 AM Stage 1 class.",
    variant: "",
  },
];
