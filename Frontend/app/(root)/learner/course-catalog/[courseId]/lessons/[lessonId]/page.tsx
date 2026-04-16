import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseLessonView } from "@/components/dashboard/course-lesson-view";
import { BackendApiError } from "@/lib/backend";
import { getCourse } from "@/lib/course-service";
import { findCourseLesson } from "@/lib/course-presenter";
import { getStoredEnrolledCourseIds } from "@/lib/enrolled-courses";

type CourseLessonPageProps = {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
};

export async function generateMetadata({
  params,
}: CourseLessonPageProps): Promise<Metadata> {
  const { courseId: rawCourseId, lessonId } = await params;
  const courseId = getCourseId(rawCourseId);

  if (!courseId) {
    return {
      title: "Lesson",
    };
  }

  try {
    const course = await getCourse(courseId);
    const lesson = findCourseLesson(course, lessonId);

    return {
      description: lesson?.overview ?? course.description ?? "Course lesson",
      title: lesson ? `${lesson.title} | ${course.title}` : course.title,
    };
  } catch {
    return {
      title: "Lesson",
    };
  }
}

export default async function CourseLessonPage({
  params,
}: CourseLessonPageProps) {
  const { courseId: rawCourseId, lessonId } = await params;
  const courseId = getCourseId(rawCourseId);

  if (!courseId) {
    notFound();
  }

  const [course, enrolledCourseIds] = await Promise.all([
    getCourseOrNotFound(courseId),
    getStoredEnrolledCourseIds(),
  ]);
  const lesson = findCourseLesson(course, lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <CourseLessonView
      course={course}
      isEnrolled={enrolledCourseIds.includes(course.id)}
      lesson={lesson}
    />
  );
}

async function getCourseOrNotFound(courseId: number) {
  try {
    return await getCourse(courseId);
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}

function getCourseId(value: string) {
  const courseId = Number(value);

  return Number.isInteger(courseId) && courseId > 0 ? courseId : null;
}
