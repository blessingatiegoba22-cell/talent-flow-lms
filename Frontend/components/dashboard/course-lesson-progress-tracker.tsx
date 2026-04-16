"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CourseCompletionModal } from "@/components/dashboard/course-completion-modal";
import { advanceCourseProgressAction } from "@/lib/course-actions";

type CourseLessonProgressTrackerProps = {
  courseId: number;
  courseTitle: string;
  enabled?: boolean;
  lessonId: string;
};

export function CourseLessonProgressTracker({
  courseId,
  courseTitle,
  enabled = true,
  lessonId,
}: CourseLessonProgressTrackerProps) {
  const router = useRouter();
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    const storageKey = `talentflow_viewed_lesson:${courseId}:${lessonId}`;

    if (!enabled || window.localStorage.getItem(storageKey)) {
      return;
    }

    window.localStorage.setItem(storageKey, "true");

    let isMounted = true;

    async function advanceProgress() {
      const update = await advanceCourseProgressAction(courseId, 15);

      if (!isMounted) {
        return;
      }

      router.refresh();

      if (update.reachedCompletion) {
        setShowCompletion(true);
      }
    }

    void advanceProgress();

    return () => {
      isMounted = false;
    };
  }, [courseId, enabled, lessonId, router]);

  return (
    <CourseCompletionModal courseTitle={courseTitle} isOpen={showCompletion} />
  );
}
