import type { Metadata } from "next";
import Link from "next/link";

import { AuthLogo } from "@/components/auth/auth-logo";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Talent Flow LMS account.",
};

export default function SignInPage() {
  return (
    <AuthShell>
      <section className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-5 py-10 text-center sm:px-8 lg:py-12">
        <AuthLogo priority />

        <div className="mt-8 animate-fade-up">
          <h1 className="text-[23px] font-extrabold leading-tight text-white sm:text-[24px]">
            Welcome Back!
          </h1>
          <p className="mt-5 text-[14px] font-bold leading-relaxed text-white/78">
            please sign in to your account.
          </p>
        </div>

        <SignInForm />

        <p className="mt-7 text-[11px] font-semibold text-white/78">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            className="ml-1 font-extrabold text-white transition hover:text-[var(--brand-blue-200)]"
          >
            Sign Up
          </Link>
        </p>
      </section>
    </AuthShell>
  );
}
