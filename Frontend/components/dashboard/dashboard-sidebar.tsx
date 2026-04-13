"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { ArrowRight, GraduationCap, X } from "lucide-react";

import { dashboardConfigs, type DashboardRole } from "@/data/dashboard";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  activePath: string;
  closeSidebar: () => void;
  role: DashboardRole;
};

export function DashboardSidebar({
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
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={closeSidebar}
        >
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
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
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
                      "bg-(--brand-blue-500) text-white shadow-[0_16px_28px_rgba(37,99,235,0.25)]",
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
        <div className="rounded-[2px] bg-(--brand-blue-500) p-4 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/12">
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
