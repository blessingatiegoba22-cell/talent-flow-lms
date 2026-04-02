import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TALENT | Home",
  description:
    "Explore the Talent Flow LMS experience and discover a smarter way to learn.",
};

type LayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Shared Dashboard nav / sidenav goes here */}
      {children}
      {/* Shared Dashboard footer goes here */}
    </div>
  );
}
