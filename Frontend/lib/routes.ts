import type { DashboardRole } from "@/data/dashboard";

export const signOutRedirectHref = "/sign-in";

export const dashboardHrefByRole: Record<DashboardRole, string> = {
  admin: "/admin/dashboard",
  instructor: "/instructor/dashboard",
  learner: "/learner/dashboard",
};

export const profileHrefByRole: Record<DashboardRole, string> = {
  admin: "/admin/profile",
  instructor: "/instructor/profile",
  learner: "/learner/profile",
};
