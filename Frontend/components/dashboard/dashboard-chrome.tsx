"use client";

import { OptimizedImage as Image } from "@/components/shared/optimized-image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";

import { dashboardConfigs, type DashboardRole } from "@/data/dashboard";
import { DashboardAccountMenu } from "@/components/dashboard/dashboard-account-menu";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import {
  dashboardHrefByRole,
  notificationsHrefByRole,
  signOutRedirectHref,
} from "@/lib/routes";
import { logoutAction } from "@/lib/auth-actions";
import { getDisplayRole, type CurrentUser } from "@/lib/current-user";
import { cn } from "@/lib/utils";

type DashboardChromeProps = {
  currentUser?: CurrentUser | null;
  role: DashboardRole;
};

export function DashboardChrome({ currentUser, role }: DashboardChromeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const config = dashboardConfigs[role];
  const profileName = currentUser?.name ?? config.profileName;
  const profileRole = currentUser
    ? getDisplayRole(currentUser.role)
    : config.profileRole;

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setSignOutError("");
    const result = await logoutAction();

    if (!result.ok) {
      setIsSigningOut(false);
      setSignOutError(result.message);
      return;
    }

    router.replace(signOutRedirectHref);
    router.refresh();
  }

  function handleTopSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (role !== "learner") {
      return;
    }

    const params = new URLSearchParams();
    const formData = new FormData(event.currentTarget);
    const trimmedSearch = String(formData.get("dashboardSearch") ?? "").trim();

    if (pathname.startsWith("/learner/course-catalog")) {
      const currentParams = new URLSearchParams(window.location.search);

      for (const key of ["category", "level", "limit"]) {
        const value = currentParams.get(key);

        if (value) {
          params.set(key, value);
        }
      }
    }

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    router.push(
      params.size
        ? `/learner/course-catalog?${params.toString()}`
        : "/learner/course-catalog",
    );
  }

  return (
    <>
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
          "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full bg-(--brand-blue-950) transition-transform duration-300 ease-in-out lg:w-55 lg:translate-x-0 xl:w-[274px]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <DashboardSidebar
          activePath={pathname}
          closeSidebar={() => setIsSidebarOpen(false)}
          role={role}
        />
      </aside>

      <header className="fixed left-0 right-0 top-0 z-30 h-[70px] border-b border-black/5 bg-[#f7f7f7] lg:left-55 xl:left-[274px]">
        <div className="flex h-full items-center gap-3 px-4 sm:px-5 lg:px-4 xl:px-5">
          <Link
            href={dashboardHrefByRole[role]}
            className="flex min-w-0 shrink-0 items-center gap-2 lg:hidden"
            aria-label="TalentFlow dashboard home"
          >
            <Image
              src="/logo.webp"
              alt=""
              width={50}
              height={48}
              priority
              className="h-8 w-auto shrink-0 sm:h-9"
            />
            <Image
              src="/logo-text.webp"
              alt="TalentFlow"
              width={177}
              height={48}
              priority
              className="h-6 w-auto max-w-[122px] sm:max-w-[142px]"
            />
          </Link>

          <form
            onSubmit={handleTopSearch}
            className="relative hidden w-full max-w-[486px] md:block"
          >
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#767676]"
              aria-hidden="true"
            />
            <input
              name="dashboardSearch"
              type="search"
              placeholder="Search lessons, courses and more..."
              className="h-11 w-full rounded-[2px] border border-[#cfcfcf] bg-[#f7f7f7] px-9 text-[13px] font-semibold outline-none transition-all duration-300 ease-in-out placeholder:text-[#8a8a8a] focus:border-(--brand-blue-400) focus:bg-white focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href={notificationsHrefByRole[role]}
              prefetch={false}
              className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-(--brand-blue-950) transition-all duration-300 ease-in-out hover:bg-white hover:text-(--brand-blue-500) sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </Link>

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 transition-all duration-300 ease-in-out hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(37,99,235,0.14)] sm:gap-3 sm:px-2"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white sm:h-11 sm:w-11">
                  <Image
                    src={config.avatar}
                    alt={`${profileName} avatar`}
                    fill
                    sizes="44px"
                    priority
                    className="object-cover"
                  />
                </span>
                <span className="hidden min-w-[74px] text-left sm:block">
                  <span className="block text-[15px] font-extrabold leading-tight text-black">
                    {profileName}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold leading-tight text-black">
                    {profileRole}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-black transition-transform duration-300",
                    isUserMenuOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {isUserMenuOpen ? (
                <DashboardAccountMenu
                  role={role}
                  isSigningOut={isSigningOut}
                  closeMenu={() => setIsUserMenuOpen(false)}
                  onSignOut={handleSignOut}
                  signOutError={signOutError}
                />
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-black/10 bg-white text-(--brand-blue-950) transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-(--brand-blue-300) hover:text-(--brand-blue-500) lg:hidden"
              aria-label="Open dashboard navigation"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
