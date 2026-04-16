"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useTransition } from "react";

import { advanceCourseProgressAction } from "@/lib/course-actions";

type CourseProgressLinkProps = {
  children: ReactNode;
  className?: string;
  courseId?: number;
  href: string;
  increment?: number;
  shouldAdvance?: boolean;
};

export function CourseProgressLink({
  children,
  className,
  courseId,
  href,
  increment = 15,
  shouldAdvance = true,
}: CourseProgressLinkProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      !courseId ||
      !shouldAdvance ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    startTransition(async () => {
      await advanceCourseProgressAction(courseId, increment);
      router.push(href);
      router.refresh();
    });
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
