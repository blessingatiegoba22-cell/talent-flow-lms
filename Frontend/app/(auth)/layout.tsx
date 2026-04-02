import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TALENT | Auth",
  description: "Sign in or create your Talent Flow LMS account.",
};

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Auth pages go here */}
      {children}
    </div>
  );
}
