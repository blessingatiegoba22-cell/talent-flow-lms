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
  return (
    <div className="">
      <aside className="">
        {/* Instructor sidebar / navigation goes here */}
      </aside>
      <div className="">
        <header className="">{/* instrustor topbar goes here */}</header>
        <main className="">{children}</main>
      </div>
    </div>
  );
}
