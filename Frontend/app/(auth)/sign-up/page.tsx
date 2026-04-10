import type { Metadata } from "next";

import { AccountRedirect } from "@/components/auth/account-redirect";
import { AuthLogo } from "@/components/auth/auth-logo";
import { AuthShell } from "@/components/auth/auth-shell";
import { RoleSelectionCard } from "@/components/auth/role-selection-card";

export const metadata: Metadata = {
  title: "Choose Account Type",
  description: "Choose whether to join Talent Flow LMS as a student or mentor.",
};

export default function SignUpPage() {
  return (
    <AuthShell backHref="/" backLabel="Back to landing page">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-9">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <AuthLogo priority className="mt-1 sm:mt-2" />

          <div className="mt-7 animate-fade-up sm:mt-8">
            <h1 className="text-[20px] font-extrabold leading-tight text-white sm:text-[22px]">
              Welcome to TalentFlow LMS
            </h1>
            <p className="mt-4 text-[14px] font-bold leading-relaxed text-white/78 sm:text-[15px]">
              Students, Interns, and Mentors all in one powerful learning platform.
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-7 md:grid-cols-2 md:gap-10 lg:mt-9 lg:gap-24">
          <RoleSelectionCard
            title="Student /Intern"
            description="Start Your learning journey, get industry sought-out skills."
            imageSrc="/student-img.png"
            imageAlt="Student learning with a laptop"
            href="/sign-up/student"
            actionLabel="Join"
          />

          <RoleSelectionCard
            title="Mentor/Teacher"
            description="Share your unique knowledge and skills with others."
            imageSrc="/instructor-img.png"
            imageAlt="Mentor teaching students"
            href="/sign-up/mentor"
            actionLabel="Get Invite"
          />
        </div>

        <AccountRedirect className="mt-7 md:mt-8" />
      </section>
    </AuthShell>
  );
}
