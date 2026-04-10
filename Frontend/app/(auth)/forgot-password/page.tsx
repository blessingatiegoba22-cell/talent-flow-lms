import type { Metadata } from "next";

import { AuthLogo } from "@/components/auth/auth-logo";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a reset code for your Talent Flow LMS account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell backHref="/sign-in" backLabel="Back to sign in">
      <section className="mx-auto flex min-h-screen w-full max-w-[448px] flex-col items-center justify-center px-5 py-10 text-center sm:px-0">
        <AuthLogo priority />

        <div className="mt-20 w-full animate-fade-up sm:mt-24">
          <h1 className="text-[30px] font-extrabold leading-tight text-white sm:text-[32px]">
            Forgot Password
          </h1>
          <p className="mx-auto mt-7 max-w-[434px] text-left text-[18px] font-bold leading-[1.55] text-white/92 sm:text-[20px]">
            Please enter your email address to reset your password. You will
            receive a reset code
          </p>

          <ForgotPasswordForm />
        </div>
      </section>
    </AuthShell>
  );
}
