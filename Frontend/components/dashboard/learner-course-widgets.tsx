import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type LearnerCourse = {
  author?: string;
  cta: string;
  image: string;
  meta: string;
  progress: number;
  rating?: string;
  title: string;
};

type CourseSectionProps = {
  courses: LearnerCourse[];
  title: string;
};

export function CatalogCourseSection({ courses, title }: CourseSectionProps) {
  return (
    <section className="mt-8 sm:mt-9">
      <div className="mb-4 flex flex-col items-start gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[22px] font-extrabold leading-tight text-black sm:text-[25px]">
          {title}
        </h2>
        <Link
          href="#"
          className="cursor-pointer text-[14px] font-extrabold text-brand-blue-700 transition-colors duration-300 ease-in-out hover:text-(--brand-blue-500) sm:text-[16px]"
        >
          See all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {courses.map((course) => (
          <CatalogCourseCard key={`${title}-${course.title}`} course={course} />
        ))}
      </div>
    </section>
  );
}

function CatalogCourseCard({ course }: { course: LearnerCourse }) {
  return (
    <article className="rounded-lg bg-[#f4f4f4] p-3 shadow-[0_4px_7px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.13)] sm:p-4">
      <div className="relative h-[126px] overflow-hidden rounded-md bg-[#e8e8e8] sm:h-[148px]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>
      <h3 className="mt-3 text-[16px] font-extrabold leading-tight text-black sm:text-[18px]">
        {course.title}
      </h3>
      <p className="mt-2 text-[13px] font-medium text-[#111] sm:mt-3 sm:text-[15px]">
        {course.author}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] font-medium text-black sm:mt-5 sm:text-[15px]">
        <Star
          className="h-4 w-4 fill-[#f7c42c] text-[#f7c42c] sm:h-5 sm:w-5"
          aria-hidden="true"
        />
        <span>{course.rating}</span>
        <span>.</span>
        <span>{course.meta}</span>
      </div>
      <button
        type="button"
        className="mx-auto mt-5 flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-(--brand-blue-500) text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-(--brand-blue-400) sm:mt-7 sm:h-[50px] sm:max-w-[188px] sm:text-[16px]"
      >
        {course.cta}
      </button>
    </article>
  );
}

export function LearningCourseSection({
  courses,
  title,
}: CourseSectionProps) {
  return (
    <section className="mt-9 sm:mt-10">
      <h2 className="mb-4 text-[22px] font-extrabold leading-tight text-black sm:mb-5 sm:text-[25px]">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {courses.map((course, index) => (
          <LearningCourseCard
            key={`${title}-${course.title}`}
            course={course}
            primary={index === 0 && course.cta === "Continue"}
          />
        ))}
      </div>
    </section>
  );
}

function LearningCourseCard({
  course,
  primary,
}: {
  course: LearnerCourse;
  primary?: boolean;
}) {
  return (
    <article className="rounded-lg bg-[#f4f4f4] p-3 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.12)] sm:p-4">
      <div className="relative h-28 overflow-hidden rounded-md bg-[#e8e8e8] sm:h-30 xl:h-[105px]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <ProgressLine className="mt-4" progress={course.progress} />
      <h3 className="mt-4 text-[16px] font-extrabold leading-tight text-black sm:mt-5 sm:text-[18px]">
        {course.title}
      </h3>
      <p className="mt-2 text-[13px] font-medium text-[#777] sm:mt-3 sm:text-[15px]">
        {course.meta}
      </p>
      <button
        type="button"
        className={cn(
          "mx-auto mt-5 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border text-[14px] font-extrabold transition-all duration-300 ease-in-out hover:-translate-y-0.5 sm:h-[50px] sm:max-w-[188px] sm:gap-3 sm:text-[16px]",
          primary
            ? "border-(--brand-blue-500) bg-(--brand-blue-500) text-white shadow-[0_14px_24px_rgba(37,99,235,0.25)] hover:bg-(--brand-blue-400)"
            : "border-[#757575] bg-transparent text-[#4c4c4c] hover:border-(--brand-blue-500) hover:text-(--brand-blue-500)",
        )}
      >
        <Play className="h-5 w-5" aria-hidden="true" />
        {course.cta}
      </button>
    </article>
  );
}

function ProgressLine({
  className,
  progress,
}: {
  className?: string;
  progress: number;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-[3px] flex-1 bg-[#d8d8d8]">
        <div
          className="h-full bg-(--brand-blue-500)"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[12px] font-medium text-[#9b9b9b] sm:text-[14px]">
        {progress.toString().padStart(2, "0")}%
      </span>
    </div>
  );
}
