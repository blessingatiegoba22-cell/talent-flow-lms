import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Instructor Dashboard",
  description: "Instructor workspace for managing teaching and course delivery.",
};

type InstructorLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function InstructorLayout({
  children,
}: InstructorLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          {/* Instructor sidebar / navigation goes here */}
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
            {/* Instructor topbar goes here */}
          </header>
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
