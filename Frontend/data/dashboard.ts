import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpenCheck,
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

export const dashboardConfigs: Record<DashboardRole, DashboardConfig> = {
  admin: {
    avatar: "/user-icon-1.png",
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
        { href: "#", icon: Bell, label: "Notifications" },
        { href: "/admin/profile", icon: User, label: "Profile" },
      ],
    ],
    profileName: "Samuel O.",
    profileRole: "Admin",
    role: "admin",
  },
  learner: {
    avatar: "/user-icon-2.png",
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
        { href: "#", icon: Bell, label: "Notifications" },
        { href: "/learner/profile", icon: User, label: "Profile" },
      ],
    ],
    profileName: "Samuel O",
    profileRole: "Student",
    role: "learner",
  },
  instructor: {
    avatar: "/user-icon-3.png",
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
        { href: "#", icon: Bell, label: "Notifications" },
        { href: "/instructor/profile", icon: User, label: "Profile" },
      ],
    ],
    profileName: "Samuel O",
    profileRole: "Tutor",
    role: "instructor",
  },
};

export const learningCourses: Course[] = [
  {
    cta: "Continue",
    href: "#",
    image: "/course-1.png",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Fundamentals",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-2.png",
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
    image: "/course-1.png",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Fundamental",
  },
  {
    author: "By Sharon Abraham",
    cta: "Continue",
    href: "#",
    image: "/course-2.png",
    meta: "Lesson 8 • 1hr 55m left",
    progress: 50,
    title: "Web Development Basics",
  },
  {
    author: "By Praise Mba",
    cta: "Continue",
    href: "#",
    image: "/course-3.png",
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
    image: "/course-4.png",
    meta: "2 hrs",
    progress: 0,
    rating: "4.5",
    title: "Design System Mastery",
  },
  {
    author: "By Aisha Bello",
    cta: "Enroll",
    href: "#",
    image: "/course-5.png",
    meta: "1hr",
    progress: 0,
    rating: "4.0",
    title: "User Research & Testing",
  },
  {
    author: "By Emily Carter",
    cta: "Enroll",
    href: "#",
    image: "/course-6.png",
    meta: "30min",
    progress: 0,
    rating: "2.5",
    title: "Mobile App Design Essential",
  },
  {
    author: "By Grace Williams",
    cta: "Enroll",
    href: "#",
    image: "/course-7.png",
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
    image: "/course-8.png",
    meta: "30 min",
    progress: 0,
    rating: "4.5",
    title: "Critical Thinking",
  },
  {
    author: "By Rita Mulcahy",
    cta: "Enroll",
    href: "#",
    image: "/course-5.png",
    meta: "1hr 30min",
    progress: 0,
    rating: "3.8",
    title: "Project Management Basics",
  },
  {
    author: "By Austin Belcak",
    cta: "Enroll",
    href: "#",
    image: "/course-7.png",
    meta: "55min",
    progress: 0,
    rating: "4.0",
    title: "CV & Resume Mastery",
  },
  {
    author: "By Thomas Frank",
    cta: "Enroll",
    href: "#",
    image: "/course-6.png",
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
    image: "/course-2.png",
    meta: "Lesson 1 • 1hr 55m left",
    progress: 5,
    title: "Mobile App Development",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-1.png",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Fundamentals",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-2.png",
    meta: "Lesson 8 • 1hr 55m left",
    progress: 50,
    title: "Web Development Basics",
  },
  {
    cta: "Continue",
    href: "#",
    image: "/course-1.png",
    meta: "Lesson 14. 4m left",
    progress: 75,
    title: "UI/UX Design Advanced",
  },
];

export const myLearningCompletedCourses: Course[] = [
  {
    cta: "View",
    href: "#",
    image: "/course-2.png",
    meta: "All • Completed",
    progress: 100,
    title: "Workplace Skills",
  },
  {
    cta: "View",
    href: "#",
    image: "/course-2.png",
    meta: "All • Completed",
    progress: 100,
    title: "Microsoft AI Skills",
  },
  {
    cta: "View",
    href: "#",
    image: "/course-2.png",
    meta: "All • Completed",
    progress: 100,
    title: "Talentflow Introduction",
  },
  {
    cta: "View",
    href: "#",
    image: "/course-2.png",
    meta: "All • Completed",
    progress: 100,
    title: "Truemind Basics",
  },
];

export const teamCards = [
  {
    accent: "#2f6df2",
    avatars: ["/user-icon-1.png", "/user-icon-2.png", "/user-icon-3.png", "/user-icon-1.png"],
    members: "23 members",
    name: "Team Lima",
    skills: ["UI/UX", "Frontend", "Backend", "Product Management"],
  },
  {
    accent: "#4338ca",
    avatars: ["/user-icon-3.png", "/user-icon-2.png", "/user-icon-1.png", "/user-icon-3.png"],
    members: "21 members",
    name: "Team Raya",
    skills: ["UI/UX", "Frontend", "Backend", "Product Management"],
  },
  {
    accent: "#2f6df2",
    avatars: ["/user-icon-1.png", "/user-icon-2.png", "/user-icon-3.png", "/user-icon-2.png"],
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
    avatar: "/user-icon-1.png",
    currentTeam: "Unassigned",
    currentTeamTone: "neutral",
    id: "intern-ayankola-precious-frontend-unassigned",
    name: "Ayankola Precious",
    role: "Frontend Developer",
    teamOptions: teamAssignmentOptions,
  },
  {
    assignedTeam: "Unassigned",
    avatar: "/user-icon-1.png",
    currentTeam: "Team Lima",
    currentTeamTone: "blue",
    id: "intern-eze-emmanuella-uiux-lima",
    name: "Eze Emmanuella",
    role: "UI/UX Developer",
    teamOptions: teamAssignmentOptions,
  },
  {
    assignedTeam: "Team Raya",
    avatar: "/user-icon-1.png",
    currentTeam: "Team Raya",
    currentTeamTone: "blue",
    id: "intern-lawal-ridwanulla-backend-raya",
    name: "Lawal Ridwanulla",
    role: "Backend Developer",
    teamOptions: teamAssignmentOptions,
  },
  {
    assignedTeam: "Team Mira",
    avatar: "/user-icon-1.png",
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
    avatar: "/user-icon-1.png",
    name: "Ayankola Precious",
    role: "Team Lead",
    skill: "Project Manager",
  },
  {
    avatar: "/user-icon-1.png",
    name: "Ayankola Precious",
    role: "Assistant",
    skill: "Project Manager",
  },
  {
    avatar: "/user-icon-1.png",
    name: "Ayankola Precious",
    role: "Assistant 2",
    skill: "Project Manager",
  },
  {
    avatar: "/user-icon-1.png",
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
    avatar: "/user-icon-3.png",
    badge: "Instructor",
    likes: "8",
    name: "Jessica Obasi",
    replies: "3 replies",
    role: "Instructor",
    text: "Welcome everyone to the TalentFlow discussion board! Feel free to ask questions, share insights, and collaborate with your peers. Let's make this a productive learning experience.",
    time: "10:30 AM",
  },
  {
    avatar: "/user-icon-1.png",
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
    avatar: "/user-icon-3.png",
    name: "Jessica Obasi",
    role: "Instructor",
    status: "online",
  },
  {
    avatar: "/user-icon-1.png",
    name: "Ayankola Pr...",
    role: "Student",
    status: "online",
  },
  {
    avatar: "/user-icon-2.png",
    name: "Eze Emman...",
    role: "Student",
    status: "away",
  },
  {
    avatar: "/user-icon-1.png",
    name: "Lawal Praise",
    role: "Student",
    status: "online",
  },
  {
    avatar: "/user-icon-3.png",
    name: "Daud Rofiat",
    role: "Student",
    status: "online",
  },
  {
    avatar: "/user-icon-2.png",
    name: "Layo Ridwan",
    role: "Student",
    status: "away",
  },
  {
    avatar: "/user-icon-3.png",
    name: "David Philips",
    role: "Instructor",
    status: "offline",
  },
  {
    avatar: "/user-icon-3.png",
    name: "David Philips",
    role: "Instructor",
    status: "offline",
  },
] as const;

export const instructorCourses: Course[] = [
  {
    cta: "Manage Course",
    href: "#",
    image: "/course-1.png",
    meta: "120 Students",
    progress: 75,
    title: "UI/UX Design Fundamentals",
  },
  {
    cta: "Manage Courses",
    href: "#",
    image: "/course-2.png",
    meta: "105 Students",
    progress: 50,
    title: "Web Development Basics",
  },
];

export const studentActivities: Activity[] = [
  {
    image: "/course-1.png",
    progress: 75,
    subtitle: "2h ago",
    title: "Sharon Lee submitted an assignment 3",
  },
  {
    image: "/course-2.png",
    progress: 50,
    subtitle: "3h ago",
    title: "Olajuwon Aina completed Lesson 8",
  },
  {
    image: "/course-3.png",
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
