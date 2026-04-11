"use client";

import { useState } from "react";
import DashboardHeader from "@/components/shared/layout/header";
import Sidebar from "@/components/shared/layout/sidebar";
import { NAVIGATION_CONFIG } from "@/constants/navigation";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navItems = NAVIGATION_CONFIG["learner"];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-card border-r border-border
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar 
          navItems={navItems} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader 
          onOpenSidebar={() => setIsSidebarOpen(true)}
          user={{ 
            id: "ZR-2435", 
            name: "LEARNER User", 
            role: "LEARNER", 
            profileImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop"
          }} 
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-8xl pl-3">
            {children}
          </div>
        </main> 
      </div>
    </div>
  );
}