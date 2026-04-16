"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";

import {
  enrollCourseAction,
  type EnrollCourseState,
} from "@/lib/course-actions";
import { cn } from "@/lib/utils";

type CourseActionButtonProps = {
  className?: string;
  courseId: number;
  enrolledLabel?: string;
  href: string;
  isEnrolled?: boolean;
  label?: string;
  showMessage?: boolean;
};

const initialEnrollCourseState: EnrollCourseState = {
  message: "",
  ok: false,
};

export function CourseActionButton({
  className,
  courseId,
  enrolledLabel = "Continue",
  href,
  isEnrolled = false,
  label = "Enroll",
  showMessage = false,
}: CourseActionButtonProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    enrollCourseAction,
    initialEnrollCourseState,
  );
  const hasEnrolled = isEnrolled || (state.ok && state.courseId === courseId);

  useEffect(() => {
    if (state.ok && state.courseId === courseId) {
      router.refresh();
    }
  }, [courseId, router, state.courseId, state.ok]);

  if (hasEnrolled) {
    return (
      <div>
        <Link href={href} className={className}>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {enrolledLabel}
        </Link>
        {showMessage && state.message ? (
          <p className="mt-2 min-h-4 text-[12px] font-semibold text-(--brand-blue-700)">
            {state.message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="courseId" value={courseId} />
      <SubmitButton className={className}>{label}</SubmitButton>
      {showMessage ? (
        <p
          className={cn(
            "mt-2 min-h-4 text-[12px] font-semibold",
            state.message
              ? state.ok
                ? "text-(--brand-blue-700)"
                : "text-red-600"
              : "text-transparent",
          )}
          aria-live="polite"
        >
          {state.message || "."}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : null}
      {pending ? "Enrolling..." : children}
    </button>
  );
}
