import type { Metadata } from "next";

import { LearningCourseSection } from "@/components/dashboard/learner-widgets";
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
    <div className="mx-auto max-w-[1120px] animate-fade-up">
      <h1 className="text-[32px] font-extrabold leading-tight text-black sm:text-[36px]">
        My Courses
      </h1>
      <p className="mt-5 text-[15px] font-medium text-black">
        All your enrolled courses and progress
      </p>

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
