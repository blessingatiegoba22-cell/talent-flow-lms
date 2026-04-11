import type { Metadata } from "next";

import {
  ActivityItem,
  CourseCard,
  ProgressOverview,
  SectionHeader,
} from "@/components/dashboard/dashboard-widgets";
import {
  instructorCourses,
  instructorProgress,
  studentActivities,
} from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Tutor Dashboard",
  description:
    "Manage courses, review student activity, and track teaching progress on Talent Flow LMS.",
};

export default function InstructorDashboardPage() {
  return (
    <div className="mx-auto grid max-w-[1024px] items-start gap-5 animate-fade-up lg:grid-cols-[minmax(0,1fr)_318px] xl:max-w-[1040px]">
      <section>
        <div>
          <h1 className="text-[26px] font-extrabold leading-tight text-black sm:text-[29px]">
            Welcome back, Samuel
          </h1>
          <p className="mt-3 max-w-[480px] text-[13px] font-medium leading-[1.45] text-black">
            Keep your students on track and your lessons organized. Everything you
            need to teach, manage, and grow right here.
          </p>
        </div>

        <div className="mt-7">
          <SectionHeader title="Your Courses" action="View All My Courses" />
          <div className="grid gap-4 sm:grid-cols-2">
            {instructorCourses.map((course, index) => (
              <CourseCard key={course.title} {...course} primary={index === 0} />
            ))}
          </div>
        </div>

        <div className="mt-7">
          <SectionHeader title="Student activity" action="View All Activity" />
          <div className="space-y-3">
            {studentActivities.map((activity) => (
              <ActivityItem key={activity.title} {...activity} />
            ))}
          </div>
        </div>
      </section>

      <ProgressOverview
        className="self-start"
        role="instructor"
        completed={instructorProgress.completed}
        courses={instructorProgress.courses}
        learningTime={instructorProgress.learningTime}
        value={instructorProgress.value}
      />
    </div>
  );
}
