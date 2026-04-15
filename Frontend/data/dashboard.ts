import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpenCheck,
  CalendarCheck,
  Circle,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Megaphone,
  MessageSquare,
  Play,
  ScrollText,
  TrendingUp,
  User,
  UserPlus,
  UsersRound,
} from "lucide-react";

export type DashboardRole = "admin" | "learner" | "instructor";

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

type DashboardConfig = {
  avatar: string;
  navGroups: NavItem[][];
  profileName: string;
  profileRole: string;
  role: DashboardRole;
};

type Course = {
  author?: string;
  cta: string;
  href: string;
  image: string;
  meta: string;
  progress: number;
  rating?: string;
  title: string;
};

type Activity = {
  image: string;
  progress: number;
  subtitle: string;
  title: string;
};

type Action = {
  icon: LucideIcon;
  label: string;
  primary?: boolean;
};

export type NotificationTone = "blue" | "brown" | "softBlue";

export type DashboardNotification =
  | {
      id: string;
      media: {
        icon: LucideIcon;
        kind: "icon";
        tone: NotificationTone;
      };
      message: string;
      surface?: "muted";
      time: string;
      title: string;
      unread?: boolean;
    }
  | {
      id: string;
      media: {
        alt: string;
        kind: "image";
        src: string;
      };
      message: string;
      surface?: "muted";
      time: string;
      title: string;
      unread?: boolean;
    };

export type DashboardNotificationSection = {
  label: string;
  notifications: readonly DashboardNotification[];
};

export const dashboardConfigs: Record<DashboardRole, DashboardConfig> = {
  admin: {
    avatar: "/user-icon-1.webp",
    navGroups: [
      [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "#", icon: UsersRound, label: "Users" },
        { href: "#", icon: Circle, label: "Courses" },
        { href: "/admin/teams", icon: UsersRound, label: "Teams" },
        { href: "#", icon: ScrollText, label: "Analytics" },
        { href: "#", icon: MessageSquare, label: "Discussions" },
      ],
      [
        { href: "/admin/notifications", icon: Bell, label: "Notifications" },
        { href: "/admin/profile", icon: User, label: "Profile" },
      ],
    ],
    profileName: "Samuel O.",
    profileRole: "Admin",
    role: "admin",
  },
  learner: {
    avatar: "/user-icon-2.webp",
    navGroups: [
      [
        { href: "/learner/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/learner/course-catalog", icon: BookOpenCheck, label: "Course Catalog" },
        { href: "/learner/my-learning", icon: Circle, label: "My Learning" },
        { href: "/learner/teams", icon: UsersRound, label: "Teams" },
        { href: "/learner/assignments", icon: ClipboardList, label: "Assignments" },
        { href: "/learner/discussions", icon: MessageSquare, label: "Discussions" },
      ],
      [
        { href: "/learner/notifications", icon: Bell, label: "Notifications" },
        { href: "/learner/profile", icon: User, label: "Profile" },
      ],
    ],
    profileName: "Samuel O",
    profileRole: "Student",
    role: "learner",
  },
  instructor: {
    avatar: "/user-icon-3.webp",
    navGroups: [
      [
        { href: "/instructor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "#", icon: BookOpenCheck, label: "My Course" },
        { href: "#", icon: Circle, label: "Students" },
        { href: "#", icon: UsersRound, label: "Teams" },
        { href: "#", icon: ClipboardList, label: "Assignments" },
        { href: "#", icon: MessageSquare, label: "Discussions" },
      ],
      [
        { href: "/instructor/notifications", icon: Bell, label: "Notifications" },
        { href: "/instructor/profile", icon: User, label: "Profile" },
      ],
    ],
    profileName: "Samuel O",
    profileRole: "Tutor",
    role: "instructor",
  },
};

export const notificationSectionsByRole = {
  learner: [
    {
      label: "Today",
      notifications: [
        {
          id: "learner-grade-uiux",
          media: { icon: GraduationCap, kind: "icon", tone: "blue" },
          message:
            'Your submission for "UIUX Design Fundamentals" has been graded. Your final score is 94/100.',
          time: "2 hours ago",
          title: "New Grade Posted: UIUX Design Fundamentals",
          unread: true,
        },
        {
          id: "learner-mention-samuel",
          media: {
            alt: "Samuel avatar",
            kind: "image",
            src: "/user-icon-3.webp",
          },
          message:
            '"I think @User really hit the nail on the head regarding the Bauhaus influence in modern UI."',
          time: "5 hours ago",
          title: "Samuel mentioned you",
          unread: true,
        },
      ],
    },
    {
      label: "Yesterday",
      notifications: [
        {
          id: "learner-deadline-uiux",
          media: { icon: CalendarCheck, kind: "icon", tone: "brown" },
          message:
            "Deadline for the submission of the assignment on UIUX Design Fundamentals is fast approaching",
          surface: "muted",
          time: "1 day ago",
          title: "Upcoming Deadline",
        },
      ],
    },
    {
      label: "Last Week",
      notifications: [
        {
          id: "learner-content-mobile",
          media: { icon: BookOpenCheck, kind: "icon", tone: "softBlue" },
          message: "A new video was uploaded on the mobile design course",
          surface: "muted",
          time: "5 days ago",
          title: "Course Content Updated",
        },
        {
          id: "learner-content-research",
          media: { icon: BookOpenCheck, kind: "icon", tone: "softBlue" },
          message: "New reading material was added to User Research & Testing",
          surface: "muted",
          time: "5 days ago",
          title: "Course Content Updated",
        },
      ],
    },
  ],
  instructor: [
    {
      label: "Today",
      notifications: [
        {
          id: "instructor-submission-uiux",
          media: { icon: ClipboardList, kind: "icon", tone: "blue" },
          message:
            "Samuel submitted the Week 4 assessment for UIUX Design Fundamentals and is ready for review.",
          time: "2 hours ago",
          title: "New Assignment Submitted",
          unread: true,
        },
        {
          id: "instructor-mention-discussion",
          media: {
            alt: "Student avatar",
            kind: "image",
            src: "/user-icon-2.webp",
          },
          message:
            '"Can you clarify how much detail we should include for the Bauhaus design reference?"',
          time: "5 hours ago",
          title: "Student mentioned you",
          unread: true,
        },
      ],
    },
    {
      label: "Yesterday",
      notifications: [
        {
          id: "instructor-deadline-grading",
          media: { icon: CalendarCheck, kind: "icon", tone: "brown" },
          message:
            "Deadline to publish grades for UIUX Design Fundamentals is fast approaching",
          surface: "muted",
          time: "1 day ago",
          title: "Upcoming Deadline",
        },
      ],
    },
    {
      label: "Last Week",
      notifications: [
        {
          id: "instructor-content-mobile",
          media: { icon: BookOpenCheck, kind: "icon", tone: "softBlue" },
          message: "A new lesson resource was added to the mobile design course",
          surface: "muted",
          time: "5 days ago",
          title: "Course Content Updated",
        },
      ],
    },
  ],
  admin: [
    {
      label: "Today",
      notifications: [
        {
          id: "admin-user-request",
          media: { icon: UserPlus, kind: "icon", tone: "blue" },
          message:
            "A new instructor request has been submitted and is waiting for account approval.",
          time: "2 hours ago",
          title: "New User Request",
          unread: true,
        },
        {
          id: "admin-mention-team",
          media: {
            alt: "Instructor avatar",
            kind: "image",
            src: "/user-icon-3.webp",
          },
          message:
            '"Please review the latest team allocation before the cohort update goes live."',
          time: "5 hours ago",
          title: "Samuel mentioned you",
          unread: true,
        },
      ],
    },
    {
      label: "Yesterday",
      notifications: [
        {
          id: "admin-deadline-cohort",
          media: { icon: CalendarCheck, kind: "icon", tone: "brown" },
          message:
            "Deadline for publishing the next cohort announcement is fast approaching",
          surface: "muted",
          time: "1 day ago",
          title: "Upcoming Deadline",
        },
      ],
    },
    {
      label: "Last Week",
      notifications: [
        {
          id: "admin-content-course",
          media: { icon: BookOpenCheck, kind: "icon", tone: "softBlue" },
          message: "A course content update was uploaded for review",
          surface: "muted",
          time: "5 days ago",
          title: "Course Content Updated",
        },
      ],
    },
  ],
} satisfies Record<DashboardRole, readonly DashboardNotificationSection[]>;

export const learningCourses: Course[] = [
  {
    cta: "Continue",
    href: "#",
    image: "/course-1.webp",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Fundamentals",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-2.webp",
    meta: "Lesson 8 • 1hr 55m left",
    progress: 50,
    title: "Web Development Basics",
  },
];

export const enrolledCourses: Course[] = [
  {
    author: "By Oliver Gasner",
    cta: "Continue",
    href: "#",
    image: "/course-1.webp",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Fundamental",
  },
  {
    author: "By Sharon Abraham",
    cta: "Continue",
    href: "#",
    image: "/course-2.webp",
    meta: "Lesson 8 • 1hr 55m left",
    progress: 50,
    title: "Web Development Basics",
  },
  {
    author: "By Praise Mba",
    cta: "Continue",
    href: "#",
    image: "/course-3.webp",
    meta: "Module 3 • 24m left",
    progress: 80,
    title: "Time Management",
  },
];

export const catalogRecommendedCourses: Course[] = [
  {
    author: "By Michael Chen",
    cta: "Enroll",
    href: "#",
    image: "/course-4.webp",
    meta: "2 hrs",
    progress: 0,
    rating: "4.5",
    title: "Design System Mastery",
  },
  {
    author: "By Aisha Bello",
    cta: "Enroll",
    href: "#",
    image: "/course-5.webp",
    meta: "1hr",
    progress: 0,
    rating: "4.0",
    title: "User Research & Testing",
  },
  {
    author: "By Emily Carter",
    cta: "Enroll",
    href: "#",
    image: "/course-6.webp",
    meta: "30min",
    progress: 0,
    rating: "2.5",
    title: "Mobile App Design Essential",
  },
  {
    author: "By Grace Williams",
    cta: "Enroll",
    href: "#",
    image: "/course-7.webp",
    meta: "30min",
    progress: 0,
    rating: "2.5",
    title: "Creative Writing Essential",
  },
];

export const catalogPopularCourses: Course[] = [
  {
    author: "By Nina Patel",
    cta: "Enroll",
    href: "#",
    image: "/course-8.webp",
    meta: "30 min",
    progress: 0,
    rating: "4.5",
    title: "Critical Thinking",
  },
  {
    author: "By Rita Mulcahy",
    cta: "Enroll",
    href: "#",
    image: "/course-5.webp",
    meta: "1hr 30min",
    progress: 0,
    rating: "3.8",
    title: "Project Management Basics",
  },
  {
    author: "By Austin Belcak",
    cta: "Enroll",
    href: "#",
    image: "/course-7.webp",
    meta: "55min",
    progress: 0,
    rating: "4.0",
    title: "CV & Resume Mastery",
  },
  {
    author: "By Thomas Frank",
    cta: "Enroll",
    href: "#",
    image: "/course-6.webp",
    meta: "45min",
    progress: 0,
    rating: "4.5",
    title: "Exam Success Strategy",
  },
];

export const catalogFilterGroups = [
  {
    label: "Categories",
    options: ["Design", "Development", "Writing", "Productivity"],
  },
  {
    label: "Level",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    label: "Duration",
    options: ["Under 30 minutes", "30-60 minutes", "1-2 hours"],
  },
  {
    label: "Price",
    options: ["Free", "Paid", "Scholarship eligible"],
  },
  {
    label: "Sort By",
    options: ["Most popular", "Highest rated", "Newest first", "Shortest first"],
  },
] as const;

export const myLearningActiveCourses: Course[] = [
  {
    cta: "Continue",
    href: "#",
    image: "/course-2.webp",
    meta: "Lesson 1 • 1hr 55m left",
    progress: 5,
    title: "Mobile App Development",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-1.webp",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Fundamentals",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-2.webp",
    meta: "Lesson 8 • 1hr 55m left",
    progress: 50,
    title: "Web Development Basics",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-1.webp",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Advanced",
  },
];

export const myLearningCompletedCourses: Course[] = [
  {
    cta: "View",
    href: "#",
    image: "/course-2.webp",
    meta: "All • Completed",
    progress: 100,
    title: "Workplace Skills",
  },
  {
    cta: "View",
    href: "#",
    image: "/course-2.webp",
    meta: "All • Completed",
    progress: 100,
    title: "Microsoft AI Skills",
  },
  {
    cta: "View",
    href: "#",
    image: "/course-2.webp",
    meta: "All • Completed",
    progress: 100,
    title: "Talentflow Introduction",
  },
  {
    cta: "View",
    href: "#",
    image: "/course-2.webp",
    meta: "All • Completed",
    progress: 100,
    title: "Truemind Basics",
  },
];

export const teamCards = [
  {
    accent: "#2f6df2",
    avatars: ["/user-icon-1.webp", "/user-icon-2.webp", "/user-icon-3.webp", "/user-icon-1.webp"],
    members: "23 members",
    name: "Team Lima",
    skills: ["UI/UX", "Frontend", "Backend", "Product Management"],
  },
  {
    accent: "#4338ca",
    avatars: ["/user-icon-3.webp", "/user-icon-2.webp", "/user-icon-1.webp", "/user-icon-3.webp"],
    members: "21 members",
    name: "Team Raya",
    skills: ["UI/UX", "Frontend", "Backend", "Product Management"],
  },
  {
    accent: "#2f6df2",
    avatars: ["/user-icon-1.webp", "/user-icon-2.webp", "/user-icon-3.webp", "/user-icon-2.webp"],
    members: "20 members",
    name: "Team Mira",
    skills: ["UI/UX", "Frontend", "Product Management"],
  },
] as const;

const teamAssignmentOptions = [
  "Unassigned",
  "Team Lima",
  "Team Raya",
  "Team Mira",
] as const;

export const adminTeamAssignments = [
  {
    assignedTeam: "Unassigned",
    avatar: "/user-icon-1.webp",
    currentTeam: "Unassigned",
    currentTeamTone: "neutral",
    id: "intern-ayankola-precious-frontend-unassigned",
    name: "Ayankola Precious",
    role: "Frontend Developer",
    teamOptions: teamAssignmentOptions,
  },
  {
    assignedTeam: "Unassigned",
    avatar: "/user-icon-1.webp",
    currentTeam: "Team Lima",
    currentTeamTone: "blue",
    id: "intern-eze-emmanuella-uiux-lima",
    name: "Eze Emmanuella",
    role: "UI/UX Developer",
    teamOptions: teamAssignmentOptions,
  },
  {
    assignedTeam: "Team Raya",
    avatar: "/user-icon-1.webp",
    currentTeam: "Team Raya",
    currentTeamTone: "blue",
    id: "intern-lawal-ridwanulla-backend-raya",
    name: "Lawal Ridwanulla",
    role: "Backend Developer",
    teamOptions: teamAssignmentOptions,
  },
  {
    assignedTeam: "Team Mira",
    avatar: "/user-icon-1.webp",
    currentTeam: "Team Mira",
    currentTeamTone: "green",
    id: "intern-ayankola-precious-frontend-mira",
    name: "Ayankola Precious",
    role: "Frontend Developer",
    teamOptions: teamAssignmentOptions,
  },
] as const;

export const teamMembers = [
  {
    avatar: "/user-icon-1.webp",
    name: "Ayankola Precious",
    role: "Team Lead",
    skill: "Project Manager",
  },
  {
    avatar: "/user-icon-1.webp",
    name: "Ayankola Precious",
    role: "Assistant",
    skill: "Project Manager",
  },
  {
    avatar: "/user-icon-1.webp",
    name: "Ayankola Precious",
    role: "Assistant 2",
    skill: "Project Manager",
  },
  {
    avatar: "/user-icon-1.webp",
    name: "Ayankola Precious",
    role: "Member",
    skill: "Graphics Design",
  },
] as const;

export const assignments = {
  completed: {
    course: "Time Management",
    due: "11:59pm, Monday 31st December, 2025",
    grade: "86%",
    instruction:
      "Share a completed time management plan with practical examples from your weekly workflow.",
    posted: "01:16pm, Tuesday 4th December, 2025",
    status: "Graded",
    timeline: "Week 1 Assessment",
    topic: "19 Practical steps in time management",
  },
  recent: {
    course: "UI/UX Design Fundamentals",
    due: "10:12am, Monday 31st March, 2026",
    instruction:
      "Write exhaustively on the laws of UX, stating at least 10 UX laws and their examples. The assignment is done in a word document with a cover page, stating the student's name and course, instructor's name.",
    posted: "10:12am, Monday 24th March, 2026",
    timeline: "Week 4 Assessment",
    topic: "Laws of UX",
  },
} as const;

export const assignmentProgress = {
  completed: "8",
  pending: "4",
  total: "12",
  value: 68,
};

export const discussionPosts = [
  {
    avatar: "/user-icon-3.webp",
    badge: "Instructor",
    likes: "8",
    name: "Jessica Obasi",
    replies: "3 replies",
    role: "Instructor",
    text: "Welcome everyone to the TalentFlow discussion board! Feel free to ask questions, share insights, and collaborate with your peers. Let's make this a productive learning experience.",
    time: "10:30 AM",
  },
  {
    avatar: "/user-icon-1.webp",
    badge: "Student",
    likes: "8",
    name: "Lawal Praise",
    replies: "2 replies",
    role: "Student",
    text: "Quick question about the UI/UX assignment: Are we expected to submit both wireframes and high-fidelity mockups, or can we choose one approach?",
    time: "11:40 AM",
  },
] as const;

export const discussionParticipants = [
  {
    avatar: "/user-icon-3.webp",
    name: "Jessica Obasi",
    role: "Instructor",
    status: "online",
  },
  {
    avatar: "/user-icon-1.webp",
    name: "Ayankola Pr...",
    role: "Student",
    status: "online",
  },
  {
    avatar: "/user-icon-2.webp",
    name: "Eze Emman...",
    role: "Student",
    status: "away",
  },
  {
    avatar: "/user-icon-1.webp",
    name: "Lawal Praise",
    role: "Student",
    status: "online",
  },
  {
    avatar: "/user-icon-3.webp",
    name: "Daud Rofiat",
    role: "Student",
    status: "online",
  },
  {
    avatar: "/user-icon-2.webp",
    name: "Layo Ridwan",
    role: "Student",
    status: "away",
  },
  {
    avatar: "/user-icon-3.webp",
    name: "David Philips",
    role: "Instructor",
    status: "offline",
  },
  {
    avatar: "/user-icon-3.webp",
    name: "David Philips",
    role: "Instructor",
    status: "offline",
  },
] as const;

export const instructorCourses: Course[] = [
  {
    cta: "Manage Course",
    href: "#",
    image: "/course-1.webp",
    meta: "120 Students",
    progress: 75,
    title: "UI/UX Design Fundamentals",
  },
  {
    cta: "Manage Courses",
    href: "#",
    image: "/course-2.webp",
    meta: "105 Students",
    progress: 50,
    title: "Web Development Basics",
  },
];

export const studentActivities: Activity[] = [
  {
    image: "/course-1.webp",
    progress: 75,
    subtitle: "2h ago",
    title: "Sharon Lee submitted an assignment 3",
  },
  {
    image: "/course-2.webp",
    progress: 50,
    subtitle: "3h ago",
    title: "Olajuwon Aina completed Lesson 8",
  },
  {
    image: "/course-3.webp",
    progress: 80,
    subtitle: "a day ago",
    title: "Adebisi Oni submitted an Assignment 4",
  },
];

export const learnerQuickActions: Action[] = [
  { icon: Play, label: "Browse Courses", primary: true },
  { icon: ClipboardList, label: "View Assignment" },
  { icon: MessageSquare, label: "Join Discussion" },
  { icon: TrendingUp, label: "Track Progress" },
];

export const adminQuickActions: Action[] = [
  { icon: UserPlus, label: "Add User", primary: true },
  { icon: Megaphone, label: "Announcement" },
  { icon: BookOpenCheck, label: "Create Courses" },
  { icon: LineChart, label: "View Reports" },
];

export const adminStats = [
  { label: "Total users", period: "This month", trend: "+120", value: "2,340" },
  { label: "Total Courses", period: "This week", trend: "+8", value: "120" },
  { label: "Active users", period: "Right now", trend: "+95", value: "1,120" },
] as const;

export const adminMetrics = [
  {
    icon: TrendingUp,
    label: "User Growth",
    meta: "This month . avrage",
    trend: "+12%",
  },
  {
    icon: GraduationCap,
    label: "Course Completion Rate",
    meta: "This month . 2% manage",
  },
  {
    icon: User,
    label: "Daily Active Users",
    meta: "This month . 3% manage",
  },
] as const;

export const learnerProgress = {
  completed: "8",
  courses: "12",
  learningTime: "24h 30m",
  value: 68,
};

export const instructorProgress = {
  completed: "20",
  courses: "305",
  learningTime: "12",
  value: 68,
};

export const progressLabels = {
  learner: {
    completed: "Completed",
    courses: "Courses Enrolled",
    learningTime: "Total Learning Time",
  },
  instructor: {
    completed: "Completed Assignment",
    courses: "Total Students",
    learningTime: "Pending Assignment",
  },
} as const;
