import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Learner Dashboard",
  description: "Learner workspace for tracking courses and learning progress.",
};

type LearnerLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function LearnerLayout({ children }: LearnerLayoutProps) {
  return <DashboardShell role="learner">{children}</DashboardShell>;
}
