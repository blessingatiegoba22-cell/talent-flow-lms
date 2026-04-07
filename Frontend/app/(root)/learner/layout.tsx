import Sidebar from "@/components/shared/dashboard/sidebar";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LayoutDashboard, GraduationCap, FileText } from 'lucide-react';
import Nav from "@/components/shared/dashboard/nav";

const learningNav = [
  { name: 'Dashboard', icon: 'LayoutDashboard', href: '/learner/dashboard' },
  { name: 'My Learning', icon: 'GraduationCap', href: '/learner/learning' },
  { name: 'Assignments', icon: 'FileText', href: '/learner/assignments' },
];

export const metadata: Metadata = {
  title: "Learner Dashboard",
  description: "Learner workspace for tracking courses and learning progress.",
};

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={learningNav} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Nav/>
        {/* Top Nav can go here later */}
        <main className="flex-1 overflow-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}