import type { ReactNode } from "react";

import { CurrentUserProvider } from "@/components/dashboard/current-user-context";
import { DashboardChrome } from "@/components/dashboard/dashboard-chrome";
import type { DashboardRole } from "@/data/dashboard";
import type { CurrentUser } from "@/lib/current-user";

type DashboardShellProps = {
  children: ReactNode;
  currentUser?: CurrentUser | null;
  role: DashboardRole;
};

export function DashboardShell({
  children,
  currentUser = null,
  role,
}: DashboardShellProps) {
  return (
    <CurrentUserProvider user={currentUser}>
      <div className="min-h-screen bg-white text-[#050505] lg:pl-[220px] xl:pl-[274px]">
        <DashboardChrome currentUser={currentUser} role={role} />
        <main className="min-h-screen px-4 pb-8 pt-23 sm:px-5 sm:pb-10 sm:pt-24 lg:px-4 xl:px-5">
          {children}
        </main>
      </div>
    </CurrentUserProvider>
  );
}
