import type { Metadata } from "next";

import { AuthLogo } from "@/components/auth/auth-logo";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your reset code and create a new Talent Flow LMS password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell backHref="/forgot-password" backLabel="Back to forgot password">
      <section className="mx-auto flex min-h-screen w-full max-w-[448px] flex-col items-center justify-center px-5 py-10 text-center sm:px-6 lg:px-0">
        <AuthLogo priority />

        <div className="mt-12 w-full animate-fade-up sm:mt-20 lg:mt-24">
          <h1 className="text-[24px] font-extrabold leading-tight text-white sm:text-[30px] lg:text-[32px]">
            Reset Password
          </h1>
          <p className="mx-auto mt-5 text-[14px] font-bold leading-[1.45] text-white/92 sm:mt-7 sm:text-[18px] lg:text-[20px]">
            Enter the code sent to your email address
          </p>

          <ResetPasswordForm />
        </div>
      </section>
    </AuthShell>
  );
}
