"use client";

import CourseCard from "@/components/shared/cards/CourseCard";
import {
  COMPLETED_COURSES,
  ENROLLED_COURSES,
} from "@/constants/dashboard";
import React from "react";

export default function MyCoursesPage() {
  return (
    <div className="max-w-9xl space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          My Courses
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">
          All your enrolled courses and progress
        </p>
      </header>

      {/* Section Enrolled */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black text-foreground">
            Enrolled Courses
          </h2>
          <span className="text-muted-foreground font-bold">
            ({ENROLLED_COURSES.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ENROLLED_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Section Completed */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black text-foreground">
            Completed Courses
          </h2>
          <span className="text-muted-foreground font-bold">
            ({COMPLETED_COURSES.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80 hover:opacity-100 transition-opacity">
          {COMPLETED_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
