import DashboardHeader from "@/components/shared/layout/header";
import Sidebar from "@/components/shared/layout/sidebar";
import { NAVIGATION_CONFIG } from "@/constants/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Instructor Dashboard",
  description:
    "Instructor workspace for managing teaching and course delivery.",
};

type InstructorLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function InstructorLayout({ children }: InstructorLayoutProps) {
    const navItems = NAVIGATION_CONFIG["instructor"] 
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={navItems}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={{ id:"ZR-2435", name: "LEARNER User", role: "INSTRUCTOR", profileImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop",}}/>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
