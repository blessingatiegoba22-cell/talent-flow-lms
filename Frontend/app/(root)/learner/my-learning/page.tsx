import type { Metadata } from "next";

import { LearningCourseSection } from "@/components/dashboard/learner-course-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import {
  myLearningActiveCourses,
  myLearningCompletedCourses,
} from "@/data/dashboard";

export const metadata: Metadata = {
  title: "My Learning",
  description:
    "View enrolled courses, active progress, and completed courses on Talent Flow LMS.",
};

export default function MyLearningPage() {
  return (
    <div className="mx-auto max-w-280 animate-fade-up">
      <DashboardPageHeader
        title="My Courses"
        description="All your enrolled courses and progress"
        descriptionClassName="text-black sm:mt-5"
      />

      <LearningCourseSection
        title="Enrolled Courses  (12)"
        courses={myLearningActiveCourses}
      />
      <LearningCourseSection
        title="Completed Courses  (8)"
        courses={myLearningCompletedCourses}
      />
    </div>
  );
}
