"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  GraduationCap,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { dashboardConfigs, type DashboardRole } from "@/data/dashboard";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: ReactNode;
  role: DashboardRole;
};

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const config = dashboardConfigs[role];

  const sidebar = (
    <DashboardSidebar
      activePath={pathname}
      closeSidebar={() => setIsSidebarOpen(false)}
      role={role}
    />
  );

  return (
    <div className="min-h-screen bg-white text-[#050505] lg:pl-[220px] xl:pl-[274px]">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/35 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[256px] -translate-x-full bg-[var(--brand-blue-950)] transition-transform duration-300 ease-in-out lg:w-[220px] lg:translate-x-0 xl:w-[274px]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebar}
      </aside>

      <header className="fixed left-0 right-0 top-0 z-30 h-[70px] border-b border-black/5 bg-[#f7f7f7] lg:left-[220px] xl:left-[274px]">
        <div className="flex h-full items-center gap-3 px-4 sm:px-5 lg:px-4 xl:px-5">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white text-[var(--brand-blue-950)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-[var(--brand-blue-300)] hover:text-[var(--brand-blue-500)] lg:hidden"
            aria-label="Open dashboard navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="relative hidden w-full max-w-[486px] sm:block">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-transparent"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search lessons, courses and more..."
              className="h-[44px] w-full rounded-[2px] border border-[#cfcfcf] bg-[#f7f7f7] px-9 text-[13px] font-semibold outline-none transition-all duration-300 ease-in-out placeholder:text-[#8a8a8a] focus:border-[var(--brand-blue-400)] focus:bg-white focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
            />
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--brand-blue-950)] transition-all duration-300 ease-in-out hover:bg-white hover:text-[var(--brand-blue-500)] sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white">
                <Image
                  src={config.avatar}
                  alt={`${config.profileName} avatar`}
                  fill
                  sizes="44px"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="hidden min-w-[74px] sm:block">
                <p className="text-[15px] font-extrabold leading-tight text-black">
                  {config.profileName}
                </p>
                <p className="mt-0.5 text-[11px] font-bold leading-tight text-black">
                  {config.profileRole}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-black" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen px-4 pb-10 pt-[96px] sm:px-5 lg:px-4 xl:px-5">
        {children}
      </main>
    </div>
  );
}

type DashboardSidebarProps = {
  activePath: string;
  closeSidebar: () => void;
  role: DashboardRole;
};

function DashboardSidebar({
  activePath,
  closeSidebar,
  role,
}: DashboardSidebarProps) {
  const config = dashboardConfigs[role];
  const browseHref = role === "learner" ? "/learner/course-catalog" : "#";
  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href === activePath) {
      event.preventDefault();
    }

    closeSidebar();
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-7 text-white lg:px-4 xl:px-[18px]">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2" onClick={closeSidebar}>
          <Image
            src="/logo.png"
            alt="Talent Flow icon"
            width={50}
            height={48}
            priority
            className="h-10 w-auto shrink-0 xl:h-12"
          />
          <Image
            src="/logo-text.png"
            alt="TalentFlow"
            width={177}
            height={48}
            priority
            className="h-7 w-auto min-w-0 xl:h-8"
          />
        </Link>

        <button
          type="button"
          onClick={closeSidebar}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Close dashboard navigation"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="mt-10 flex flex-col gap-7">
        {config.navGroups.map((group, groupIndex) => (
          <div
            key={group.map((item) => item.label).join("-")}
            className={cn(
              "flex flex-col gap-4",
              groupIndex > 0 && "border-t border-white/85 pt-7",
            )}
          >
            {group.map(({ href, icon: Icon, label }) => {
              const isActive = href !== "#" && activePath.startsWith(href);

              return (
                <Link
                  key={label}
                  href={href}
                  prefetch={false}
                  onClick={(event) => handleNavClick(event, href)}
                  className={cn(
                    "group flex h-10 cursor-pointer items-center gap-3 rounded-[5px] px-3 text-[14px] font-medium text-white/82 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white/9 hover:text-white",
                    isActive &&
                      "bg-[var(--brand-blue-500)] text-white shadow-[0_16px_28px_rgba(37,99,235,0.25)]",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <div className="rounded-[2px] bg-[var(--brand-blue-500)] p-4 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-white/12">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-5 text-[15px] font-medium leading-[1.35]">
            Keep Learning,
            <br />
            Keep growing
          </p>
          <p className="mt-2 text-[11px] font-medium leading-[1.45] text-white/82">
            Browse new courses and continue your learning journey
          </p>
          <Link
            href={browseHref}
            prefetch={false}
            className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[5px] bg-white px-4 text-[13px] font-extrabold text-[#3f3f3f] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#f3f6ff]"
          >
            Browse Courses
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
