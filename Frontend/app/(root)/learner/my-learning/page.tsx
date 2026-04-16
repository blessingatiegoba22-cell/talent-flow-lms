import type { Metadata } from "next";

import { LearningCourseSection } from "@/components/dashboard/learner-course-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import { getCourses } from "@/lib/course-service";
import { demoActiveCourses, demoCompletedCourses } from "@/lib/demo-courses";
import { toLearningCourseView } from "@/lib/course-presenter";
import { getStoredCourseProgressMap } from "@/lib/course-progress";
import { getStoredEnrolledCourseIds } from "@/lib/enrolled-courses";

export const metadata: Metadata = {
  title: "My Learning",
  description:
    "View enrolled courses, active progress, and completed courses on Talent Flow LMS.",
};

export default async function MyLearningPage() {
  const [courses, enrolledCourseIds, courseProgress] = await Promise.all([
    getCourses({ limit: 100 }),
    getStoredEnrolledCourseIds(),
    getStoredCourseProgressMap(),
  ]);
  const enrolledCourses = courses
    .filter((course) => enrolledCourseIds.includes(course.id))
    .map((course) =>
      toLearningCourseView(course, enrolledCourseIds, courseProgress),
    );
  const activeCourses = enrolledCourses.filter((course) => course.progress < 100);
  const completedCourses = enrolledCourses.filter(
    (course) => course.progress >= 100,
  );
  const displayActiveCourses = activeCourses.length
    ? activeCourses
    : demoActiveCourses;
  const displayCompletedCourses = completedCourses.length
    ? completedCourses
    : demoCompletedCourses;
  const enrolledCourseCount = enrolledCourses.length;
  const completedCourseCount = displayCompletedCourses.length;

  return (
    <div className="mx-auto max-w-280 animate-fade-up">
      <DashboardPageHeader
        title="My Courses"
        description="All your enrolled courses and progress"
        descriptionClassName="text-black sm:mt-5"
      />

      <LearningCourseSection
        title={`Enrolled Courses (${enrolledCourseCount})`}
        courses={[...displayActiveCourses]}
      />

      <LearningCourseSection
        title={`Completed Courses (${completedCourseCount})`}
        courses={[...displayCompletedCourses]}
      />
    </div>
  );
}
