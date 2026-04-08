import DashboardHeader from "@/components/shared/layout/header";
import Sidebar from "@/components/shared/layout/sidebar";
import { NAVIGATION_CONFIG } from "@/constants/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Learner Dashboard",
  description: "Learner workspace for tracking courses and learning progress.",
};

type LearnerLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function LearnerLayout({ children }: LearnerLayoutProps) {
  const navItems = NAVIGATION_CONFIG["learner"] 
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={navItems}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={{ id:"ZR-2435", name: "LEARNER User", role: "LEARNER", profileImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop",}} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
