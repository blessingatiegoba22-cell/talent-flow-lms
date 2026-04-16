import type { Metadata } from "next";

import {
  InstructorCourseWorkspace,
  type InstructorCourseView,
} from "@/components/dashboard/instructor-course-workspace";
import { instructorCourses } from "@/data/dashboard";
import { getCurrentUser } from "@/lib/auth-service";
import { getCourses, type BackendCourse } from "@/lib/course-service";
import { getStoredInstructorCourses } from "@/lib/instructor-course-store";

export const metadata: Metadata = {
  title: "My Course",
  description:
    "Create drafts, manage assessments, and publish instructor courses on Talent Flow LMS.",
};

const courseImages = [
  "/course-5.webp",
  "/course-6.webp",
  "/course-4.webp",
  "/course-card-3.webp",
  "/Frame 143 (3).webp",
];

export default async function InstructorMyCoursePage() {
  const [publishedCourses, storedCourses, currentUser] = await Promise.all([
    getCourses({ limit: 100 }).catch(() => []),
    getStoredInstructorCourses(),
    getCurrentUser().catch(() => null),
  ]);
  const instructorPublishedCourses = currentUser
    ? publishedCourses.filter(
        (course) => String(course.instructor_id) === String(currentUser.id),
      )
    : publishedCourses.slice(0, 2);
  const courseViews = mergeCourseViews([
    ...storedCourses.map((course, index) =>
      toInstructorCourseView(course, index),
    ),
    ...instructorPublishedCourses.map((course, index) =>
      toInstructorCourseView(course, index + storedCourses.length),
    ),
  ]);
  const displayCourses = courseViews.length
    ? courseViews
    : instructorCourses.map((course, index) => ({
        category: "Design",
        description:
          "A polished demo course ready for content updates, assessment setup, and publishing.",
        durationHours: index === 0 ? 12 : 8,
        href: course.href,
        image: course.image,
        level: index === 0 ? "beginner" : "intermediate",
        priceLabel: "Free",
        status: "Published" as const,
        students: Number.parseInt(course.meta, 10) || 0,
        title: course.title,
        updatedLabel: "Demo",
      }));

  return (
    <InstructorCourseWorkspace
      courses={displayCourses}
      instructorName={currentUser?.name ?? "Samuel"}
    />
  );
}

function toInstructorCourseView(
  course: BackendCourse,
  index: number,
): InstructorCourseView {
  return {
    category: course.category,
    description: course.description,
    durationHours: course.duration_hours,
    href: `/learner/course-catalog/${course.id}`,
    id: course.id,
    image: courseImages[index % courseImages.length],
    level: course.level,
    priceLabel: formatPriceLabel(course.price),
    status: course.is_published ? "Published" : "Draft",
    students: course.enrollment_count ?? getDemoStudentCount(course.id),
    title: course.title,
    updatedLabel: formatUpdatedLabel(course.updated_at ?? course.created_at),
  };
}

function mergeCourseViews(courses: InstructorCourseView[]) {
  const seenCourseIds = new Set<number>();
  const uniqueCourses: InstructorCourseView[] = [];

  for (const course of courses) {
    if (course.id && seenCourseIds.has(course.id)) {
      continue;
    }

    if (course.id) {
      seenCourseIds.add(course.id);
    }

    uniqueCourses.push(course);
  }

  return uniqueCourses;
}

function formatPriceLabel(price: BackendCourse["price"]) {
  if (!price || price === "Free") {
    return "Free";
  }

  if (typeof price === "number") {
    return price === 0 ? "Free" : `$${(price / 100).toFixed(2)}`;
  }

  return price;
}

function formatUpdatedLabel(value: string | null | undefined) {
  if (!value) {
    return "Recently updated";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  return date.toLocaleDateString("en", {
    day: "numeric",
    month: "short",
  });
}

function getDemoStudentCount(courseId: number) {
  return 42 + ((courseId * 17) % 96);
}
