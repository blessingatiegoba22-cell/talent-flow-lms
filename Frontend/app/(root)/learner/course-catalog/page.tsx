import type { Metadata } from "next";

import { FilterBar } from "@/components/dashboard/learner-filter-bar";
import { CatalogCourseSection } from "@/components/dashboard/learner-course-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import {
  catalogFilterGroups,
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
    <div className="mx-auto max-w-280 animate-fade-up">
      <DashboardPageHeader title="Courses" />

      <FilterBar groups={catalogFilterGroups} />

      <CatalogCourseSection
        title="Recommended for you"
        courses={catalogRecommendedCourses}
      />
      <CatalogCourseSection
        title="Popular Courses"
        courses={catalogPopularCourses}
      />
    </div>
  );
}
