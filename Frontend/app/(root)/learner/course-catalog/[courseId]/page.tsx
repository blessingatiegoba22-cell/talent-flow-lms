import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetailView } from "@/components/dashboard/course-detail-view";
import { BackendApiError } from "@/lib/backend";
import { getCourse } from "@/lib/course-service";
import { getStoredCourseProgressMap } from "@/lib/course-progress";
import { getStoredEnrolledCourseIds } from "@/lib/enrolled-courses";

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const courseId = getCourseId((await params).courseId);

  if (!courseId) {
    return {
      title: "Course",
    };
  }

  try {
    const course = await getCourse(courseId);

    return {
      description:
        course.description ??
        "View course modules, lessons, materials, and progress.",
      title: course.title,
    };
  } catch {
    return {
      title: "Course",
    };
  }
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const courseId = getCourseId((await params).courseId);

  if (!courseId) {
    notFound();
  }

  const [course, enrolledCourseIds, courseProgress] = await Promise.all([
    getCourseOrNotFound(courseId),
    getStoredEnrolledCourseIds(),
    getStoredCourseProgressMap(),
  ]);

  return (
    <CourseDetailView
      course={course}
      isEnrolled={enrolledCourseIds.includes(course.id)}
      progress={courseProgress[String(course.id)] ?? 0}
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
