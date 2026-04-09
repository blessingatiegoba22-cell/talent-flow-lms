import DashboardHeader from "@/components/shared/layout/header";
import Sidebar from "@/components/shared/layout/sidebar";
import { NAVIGATION_CONFIG } from "@/constants/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administrative workspace for managing Talent Flow LMS.",
};

type AdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navItems = NAVIGATION_CONFIG["admin"] 
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={navItems}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={{ id:"ZR-2435", name: "Admin User", role: "ADMIN", profileImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop",}}/>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
