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
    <div className="">
      <aside className="">{/* learner sidebar / navigation goes here */}</aside>
      <div className="">
        <header className="">{/* learner topbar goes here */}</header>
        <main className="">{children}</main>
      </div>
    </div>
  );
}
