import type { Metadata } from "next";

import {
  CatalogCourseSection,
  FilterBar,
} from "@/components/dashboard/learner-widgets";
import {
  catalogPopularCourses,
  catalogRecommendedCourses,
} from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Course Catalog",
  description:
    "Browse recommended and popular courses available to Talent Flow LMS learners.",
};

export default function CourseCatalogPage() {
  return (
    <div className="mx-auto max-w-[1120px] animate-fade-up">
      <h1 className="text-[32px] font-extrabold leading-tight text-black sm:text-[36px]">
        Courses
      </h1>

      <FilterBar filters={["Categories", "Level", "Duration", "Price", "Sort By"]} />

      <CatalogCourseSection
        title="Recommended for you"
        courses={catalogRecommendedCourses}
      />
      <CatalogCourseSection title="Popular Courses" courses={catalogPopularCourses} />
    </div>
  );
}
