"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, Sparkles, X } from "lucide-react";

type CourseCompletionModalProps = {
  courseTitle: string;
  isOpen: boolean;
};

export function CourseCompletionModal({
  courseTitle,
  isOpen,
}: CourseCompletionModalProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isOpen || isDismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-(--brand-blue-950)/72 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-completion-title"
    >
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-lg border border-white/30 bg-white p-6 text-center shadow-[0_28px_70px_rgba(7,20,47,0.34)] sm:p-8">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#d7d7d7] text-black transition-colors duration-300 hover:border-(--brand-blue-300) hover:text-(--brand-blue-600)"
          aria-label="Close completion message"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#edf3ff] text-(--brand-blue-700) shadow-[0_18px_36px_rgba(37,99,235,0.18)]">
          <div className="relative">
            <Award className="h-12 w-12" aria-hidden="true" />
            <Sparkles
              className="absolute -right-4 -top-3 h-6 w-6 text-[#f7c42c]"
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="mt-6 text-[13px] font-extrabold uppercase text-(--brand-blue-700)">
          Course completed
        </p>
        <h2
          id="course-completion-title"
          className="mt-3 text-[26px] font-extrabold leading-tight text-black sm:text-[32px]"
        >
          Congratulations on completing {courseTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-[390px] text-[14px] font-medium leading-[1.7] text-[#4f4f4f]">
          Your progress is saved at 100%. A certificate will be issued soon, and
          this course now lives in your completed courses.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/learner/certificate"
            className="inline-flex h-11 items-center justify-center rounded-md bg-(--brand-blue-500) px-5 text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
          >
            View certificates
          </Link>
          <Link
            href="/learner/my-learning"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#b7b7b7] bg-white px-5 text-[14px] font-extrabold text-[#333] transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-500) hover:text-(--brand-blue-500)"
          >
            My Learning
          </Link>
        </div>
      </div>
    </div>
  );
}
