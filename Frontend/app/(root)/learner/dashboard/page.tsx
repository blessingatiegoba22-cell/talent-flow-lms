import type { Metadata } from "next";

import {
  CourseCard,
  CourseListItem,
  ProgressOverview,
  QuickActions,
  SectionHeader,
} from "@/components/dashboard/dashboard-widgets";
import {
  enrolledCourses,
  learnerProgress,
  learnerQuickActions,
  learningCourses,
} from "@/data/dashboard";
import { LearnerDashboardGreeting } from "@/components/dashboard/learner-user-copy";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description:
    "Continue learning, track progress, and access student quick actions on Talent Flow LMS.",
};

export default function LearnerDashboardPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 animate-fade-up lg:grid-cols-[minmax(0,1fr)_278px] xl:max-w-[1040px]">
      <section>
        <div>
          <LearnerDashboardGreeting />
          <p className="mt-3 max-w-160 text-[13px] font-medium leading-[1.5] text-black sm:mt-4">
            Ready to continue your learning journey? Lets keep the momentum going.
          </p>
        </div>

        <div className="mt-6 sm:mt-7">
          <SectionHeader
            title="Continue Learning"
            action="View All My Courses"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {learningCourses.map((course, index) => (
              <CourseCard
                key={course.title}
                {...course}
                primary={index === 0}
              />
            ))}
          </div>
        </div>

        <div className="mt-7 sm:mt-8">
          <SectionHeader title="Enrolled Courses" action="Browse Catalog" />
          <div className="space-y-3">
            {enrolledCourses.map((course) => (
              <CourseListItem key={course.title} {...course} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        <ProgressOverview
          role="learner"
          completed={learnerProgress.completed}
          courses={learnerProgress.courses}
          learningTime={learnerProgress.learningTime}
          value={learnerProgress.value}
        />
        <QuickActions actions={learnerQuickActions} />
      </section>
    </div>
  );
}
