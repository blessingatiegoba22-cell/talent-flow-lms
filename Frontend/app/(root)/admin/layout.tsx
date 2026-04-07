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
  return (
    <div className="">
      <aside className="">{/* Admin sidebar / navigation goes here */}</aside>
      <div className="">
        <header className="">{/* Admin topbar goes here */}</header>
        <main className="">{children}</main>
      </div>
    </div>
  );
}
