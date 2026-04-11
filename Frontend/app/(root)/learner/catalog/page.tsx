"use client";

import { useState } from "react";
import FiltersBar from "@/components/shared/FiltersBar";
import CourseSection from "@/components/shared/sections/CourseSection";
import { COURSES_CATALOG } from "@/constants/dashboard";

type Filters = {
  category?: string;
  level?: string;
  duration?: string;
  price?: string;
  sort?: string;
};

export default function CoursesPage() {
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredCourses = COURSES_CATALOG.filter((course) => {
    return (
      (!filters.category || course.category === filters.category) &&
      (!filters.level || course.level === filters.level) &&
      (!filters.price || course.price === filters.price)
    );
  });

  const recommendedCourses = filteredCourses.filter(
    (course) => course.isRecommended
  );

  const popularCourses = filteredCourses.filter(
    (course) => course.isPopular
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Courses</h1>

      <FiltersBar onChange={handleFilterChange} />

      {recommendedCourses.length > 0 && (
        <CourseSection 
          title="Recommended for you" 
          courses={recommendedCourses} 
        />
      )}

      {popularCourses.length > 0 && (<CourseSection 
        title="Popular Courses" 
        courses={popularCourses} 
      />)}
    </div>
  );
}