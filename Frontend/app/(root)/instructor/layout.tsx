import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Instructor Dashboard",
  description:
    "Instructor workspace for managing teaching and course delivery.",
};

type InstructorLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  return <DashboardShell role="instructor">{children}</DashboardShell>;
}
