import type { Metadata } from "next";
import Image from "next/image";

import { AccountRedirect } from "@/components/auth/account-redirect";
import { AuthLogo } from "@/components/auth/auth-logo";
import { AuthShell } from "@/components/auth/auth-shell";
import { StudentSignUpForm } from "@/components/auth/student-sign-up-form";

export const metadata: Metadata = {
  title: "Student Sign Up",
  description: "Create a Talent Flow LMS student or intern account.",
};

export default function StudentSignUpPage() {
  return (
    <AuthShell backHref="/sign-up" backLabel="Back to account type selection">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-9">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <AuthLogo priority className="mt-1" />

          <div className="mt-7 animate-fade-up sm:mt-8">
            <h1 className="mx-auto inline-flex min-w-[168px] justify-center rounded-[7px] bg-[var(--brand-blue-500)] px-6 py-2 text-[18px] font-extrabold leading-tight text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)]">
              Student/Interns
            </h1>
            <p className="mt-5 text-[14px] font-bold leading-relaxed text-white/78">
              Please enter your details to create an account
            </p>
          </div>
        </div>

        <div className="mt-6 grid items-center gap-7 sm:mt-7 lg:grid-cols-[386px_minmax(320px,400px)] lg:justify-between lg:gap-20">
          <div className="mx-auto hidden w-full max-w-[386px] overflow-hidden rounded-[7px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.16)] lg:block">
            <Image
              src="/student-img.png"
              alt="Student learning with a laptop"
              width={386}
              height={325}
              priority
              className="h-[330px] w-full object-cover sm:h-[360px] lg:h-[400px]"
            />
          </div>

          <div className="mx-auto w-full max-w-[340px] animate-fade-up-delay lg:max-w-[340px]">
            <StudentSignUpForm />
          </div>
        </div>

        <AccountRedirect className="mt-7" />
      </section>
    </AuthShell>
  );
}
