import type { Metadata } from "next";
import Link from "next/link";

import {
  CourseCard,
  CourseListItem,
  ProgressOverview,
  QuickActions,
  SectionHeader,
} from "@/components/dashboard/dashboard-widgets";
import { learnerProgress, learnerQuickActions } from "@/data/dashboard";
import { LearnerDashboardGreeting } from "@/components/dashboard/learner-user-copy";
import { getCourses } from "@/lib/course-service";
import { demoActiveCourses, demoCompletedCourses } from "@/lib/demo-courses";
import { toLearningCourseView } from "@/lib/course-presenter";
import { getStoredCourseProgressMap } from "@/lib/course-progress";
import { getStoredEnrolledCourseIds } from "@/lib/enrolled-courses";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description:
    "Continue learning, track progress, and access student quick actions on Talent Flow LMS.",
};

export default async function LearnerDashboardPage() {
  const [courses, enrolledCourseIds, courseProgress] = await Promise.all([
    getCourses({ limit: 100 }),
    getStoredEnrolledCourseIds(),
    getStoredCourseProgressMap(),
  ]);
  const enrolledCourseCards = courses
    .filter((course) => enrolledCourseIds.includes(course.id))
    .map((course) =>
      toLearningCourseView(course, enrolledCourseIds, courseProgress),
    );
  const demoCourseCards = [...demoActiveCourses, ...demoCompletedCourses.slice(0, 2)];
  const dashboardCourseCards = enrolledCourseCards.length
    ? enrolledCourseCards
    : demoCourseCards;
  const continueCourses = dashboardCourseCards
    .filter((course) => course.progress < 100)
    .slice(0, 2);
  const completedCount = enrolledCourseCards.filter(
    (course) => course.progress >= 100,
  ).length;
  const averageProgress = enrolledCourseCards.length
    ? Math.round(
        enrolledCourseCards.reduce((total, course) => total + course.progress, 0) /
          enrolledCourseCards.length,
      )
    : 0;
  const displayCompletedCount = enrolledCourseCards.length
    ? completedCount
    : demoCompletedCourses.length;
  const displayCoursesCount = enrolledCourseCards.length
    ? enrolledCourseCards.length
    : demoActiveCourses.length + demoCompletedCourses.length;
  const displayAverageProgress = enrolledCourseCards.length
    ? averageProgress
    : getAverageProgress([...demoActiveCourses, ...demoCompletedCourses]);

  return (
    <div className="mx-auto grid max-w-5xl gap-5 animate-fade-up lg:grid-cols-[minmax(0,1fr)_278px] xl:max-w-[1040px]">
      <section>
        <div>
          <LearnerDashboardGreeting />
          <p className="mt-3 max-w-160 text-[13px] font-medium leading-[1.5] text-black sm:mt-4">
            Ready to continue your learning journey? Let&apos;s keep the momentum going.
          </p>
        </div>

        <div className="mt-6 sm:mt-7">
          <SectionHeader
            title="Continue Learning"
            action="View All My Courses"
            actionHref="/learner/my-learning"
          />
          {continueCourses.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {continueCourses.map((course, index) => (
                <CourseCard
                  key={course.title}
                  {...course}
                  href={"lessonHref" in course ? course.lessonHref : course.href}
                  primary={index === 0}
                />
              ))}
            </div>
          ) : (
            <EmptyCourseState
              href="/learner/course-catalog"
              title="Start with a course from the catalog"
            />
          )}
        </div>

        <div className="mt-7 sm:mt-8">
          <SectionHeader
            title="Enrolled Courses"
            action="Browse Catalog"
            actionHref="/learner/my-learning"
          />
          {enrolledCourseCards.length ? (
            <div className="space-y-3">
              {enrolledCourseCards.map((course) => (
                <CourseListItem
                  key={course.id}
                  {...course}
                  href={course.lessonHref}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardCourseCards.slice(0, 4).map((course) => (
                <CourseListItem
                  key={course.title}
                  {...course}
                  href={course.href}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        <ProgressOverview
          role="learner"
          completed={String(displayCompletedCount)}
          courses={String(displayCoursesCount)}
          learningTime={learnerProgress.learningTime}
          value={displayAverageProgress}
        />
        <QuickActions actions={learnerQuickActions} />
      </section>
    </div>
  );
}

function getAverageProgress(courses: Array<{ progress: number }>) {
  if (!courses.length) {
    return 0;
  }

  return Math.round(
    courses.reduce((total, course) => total + course.progress, 0) /
      courses.length,
  );
}

function EmptyCourseState({ href, title }: { href: string; title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#b9c7e8] bg-[#f6f9ff] p-5">
      <p className="text-[14px] font-extrabold text-black">{title}</p>
      <p className="mt-2 text-[13px] font-medium leading-[1.5] text-[#5d6472]">
        Enroll in a published course to continue learning from this dashboard.
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-(--brand-blue-500) px-4 text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
      >
        Browse courses
      </Link>
    </div>
  );
}
