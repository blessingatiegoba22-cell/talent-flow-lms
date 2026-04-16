"use client";

import Link from "next/link";
import { LayoutDashboard, LoaderCircle, LogOut, User } from "lucide-react";

import type { DashboardRole } from "@/data/dashboard";
import { dashboardHrefByRole, profileHrefByRole } from "@/lib/routes";

type DashboardAccountMenuProps = {
  closeMenu: () => void;
  isSigningOut: boolean;
  onSignOut: () => void | Promise<void>;
  role: DashboardRole;
  signOutError?: string;
};

export function DashboardAccountMenu({
  closeMenu,
  isSigningOut,
  onSignOut,
  role,
  signOutError,
}: DashboardAccountMenuProps) {
  const menuItems = [
    {
      description: "Return to your workspace",
      href: dashboardHrefByRole[role],
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      description: "Manage your account",
      href: profileHrefByRole[role],
      icon: User,
      label: "Profile",
    },
  ];

  return (
    <div
      className="absolute right-0 top-full z-50 mt-3 w-60 rounded-lg border border-black/10 bg-white p-2 shadow-[0_22px_55px_rgba(8,21,48,0.18)]"
      role="menu"
      aria-label="Account actions"
    >
      <div className="space-y-1">
        {menuItems.map(({ description, href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            prefetch={false}
            onClick={closeMenu}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-300 hover:bg-[#f3f6ff]"
            role="menuitem"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-(--brand-blue-50) text-(--brand-blue-600)">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-extrabold leading-tight text-[#151515]">
                {label}
              </span>
              <span className="mt-1 block text-[11px] font-semibold leading-tight text-[#707070]">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="my-2 h-px bg-[#ececec]" />

      <button
        type="button"
        onClick={onSignOut}
        disabled={isSigningOut}
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
        role="menuitem"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
          {isSigningOut ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-extrabold leading-tight text-red-600">
            {isSigningOut ? "Signing out..." : "Logout"}
          </span>
          <span className="mt-1 block text-[11px] font-semibold leading-tight text-[#707070]">
            Go back to sign in
          </span>
        </span>
      </button>
      {signOutError ? (
        <p className="px-3 pb-2 text-[11px] font-semibold leading-snug text-red-600" aria-live="polite">
          {signOutError}
        </p>
      ) : null}
    </div>
  );
}
