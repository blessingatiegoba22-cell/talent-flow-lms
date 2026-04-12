"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { GraduationCap, Bell, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  icon: string;
  href: string;
};

// Narrows dynamic Lucide icon lookups from the navigation config to renderable icon components.
type SidebarIcon = React.ComponentType<{
  size?: number;
  className?: string;
}>;

interface SidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ navItems, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed md:static z-50 top-0 left-0 h-screen w-70",
        "bg-brand-blue-950 text-neutral-50 flex flex-col shrink-0",
        "transform transition-transform duration-300 ease-in-out",
        "border-r border-white/5",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
      )}
    >
      <div className="md:hidden flex justify-end p-4 absolute right-0 top-0">
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="text-neutral-50 hover:bg-white/10"
        >
          <X size={24} />
        </Button>
      </div>

      {/* Logo Section */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="relative w-52 h-14 flex shrink-0 items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={210}
              sizes="150px"
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto py-4">
        {navItems.map((item) => {
          // Resolve string icon names from the nav config while keeping a fallback icon.
          const IconComponent =
            (LucideIcons[item.icon as keyof typeof LucideIcons] as
              | SidebarIcon
              | undefined) || LucideIcons.HelpCircle;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.name} href={item.href} onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-brand-blue-600 text-neutral-50 shadow-lg shadow-black/20"
                    : "text-neutral-400 hover:text-neutral-50 hover:bg-white/5",
                )}
              >
                <IconComponent
                  size={20}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-neutral-50"
                      : "text-neutral-400 group-hover:text-neutral-50",
                  )}
                />
                <span className="text-sm font-bold tracking-tight">
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neutral-50" />
                )}
              </div>
            </Link>
          );
        })}

        {/* Notifications and profile sit with the nav links, before the bottom learning card. */}
        <div className="pt-8 mt-8 border-t border-white/10 space-y-1.5">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-neutral-400 hover:text-neutral-50 transition-colors">
            <Bell size={20} />
            <span className="text-sm font-bold">Notifications</span>
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 text-neutral-400 hover:text-neutral-50 transition-colors">
            <User size={20} />
            <span className="text-sm font-bold">Profile</span>
          </button>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-6 mt-auto space-y-4">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
          <div className="w-8 h-8 rounded-lg bg-brand-blue-600 flex items-center justify-center mb-3">
            <GraduationCap size={18} className="text-white" />
          </div>
          <p className="text-[13px] font-bold text-neutral-50 mb-1">
            Keep Learning
          </p>
          <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">
            Boost your career with new courses.
          </p>
          <Button className="bg-brand-blue-600 text-white hover:bg-brand-blue-500 text-[11px] font-black h-9 w-full uppercase tracking-wider">
            Explore Now
          </Button>
        </div>
      </div>
    </aside>
  );
}
