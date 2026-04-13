"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const assignmentsHref = "/learner/assignments";

export function LearnerAssignmentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      router.replace(assignmentsHref);
    }, 2000);

    return () => window.clearTimeout(redirectTimer);
  }, [router]);

  return (
    <section className="mx-auto max-w-[980px] animate-fade-up">
      <div className="grid overflow-hidden rounded-lg border border-(--brand-blue-950) bg-white shadow-[0_14px_36px_rgba(7,20,47,0.1)] lg:grid-cols-[minmax(320px,460px)_minmax(0,1fr)]">
        <div className="bg-[#f4f7fd] p-4 sm:p-5">
          <Image
            src="/submit-img.png"
            alt="Study desk with reminder board"
            width={424}
            height={589}
            sizes="(min-width: 1024px) 424px, 100vw"
            className="h-auto w-full rounded-lg object-cover shadow-[0_4px_10px_rgba(7,20,47,0.16)]"
            priority
          />
        </div>

        <div className="flex flex-col justify-center px-5 py-8 text-center sm:px-8 lg:text-left">
          <p className="text-[13px] font-extrabold uppercase text-(--brand-blue-700)">
            Submission Received
          </p>
          <h1 className="mt-3 text-[27px] font-extrabold leading-[1.25] tracking-[0] text-(--brand-blue-900) sm:text-[34px]">
            You have successfully submitted your assignment
          </h1>
          <p className="mt-6 max-w-[420px] text-[16px] font-medium leading-[1.6] text-[#242424] sm:text-[18px] lg:max-w-none">
            Continue to explore the Talentflow platforms. Seek assistance when
            in doubt.
          </p>
          <p className="mt-6 text-[14px] font-semibold text-[#555]">
            Returning to assignments in 2 seconds.
          </p>
          <Link
            href={assignmentsHref}
            className="mx-auto mt-6 flex h-12 w-full max-w-[280px] items-center justify-center rounded-lg bg-(--brand-blue-700) px-6 text-[15px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-500) lg:mx-0"
          >
            Back to Assignments
          </Link>
        </div>
      </div>
    </section>
  );
}
