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
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
          {/* Learner topbar goes here */}
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
