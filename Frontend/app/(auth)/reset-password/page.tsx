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
      <section className="mx-auto flex min-h-screen w-full max-w-[448px] flex-col items-center justify-center px-5 py-10 text-center sm:px-0">
        <AuthLogo priority />

        <div className="mt-20 w-full animate-fade-up sm:mt-24">
          <h1 className="text-[30px] font-extrabold leading-tight text-white sm:text-[32px]">
            Reset Password
          </h1>
          <p className="mx-auto mt-7 text-[18px] font-bold leading-[1.45] text-white/92 sm:text-[20px]">
            Enter the code sent to your email address
          </p>

          <ResetPasswordForm />
        </div>
      </section>
    </AuthShell>
  );
}
