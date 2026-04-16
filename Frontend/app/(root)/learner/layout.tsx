import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/auth-service";
import { BackendApiError } from "@/lib/backend";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learner Dashboard",
  description: "Learner workspace for tracking courses and learning progress.",
};

type LearnerLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function LearnerLayout({ children }: LearnerLayoutProps) {
  const currentUser = await getLearnerUser();

  return (
    <DashboardShell currentUser={currentUser} role="learner">
      {children}
    </DashboardShell>
  );
}

async function getLearnerUser() {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (
      error instanceof BackendApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/sign-in");
    }

    throw error;
  }
}
