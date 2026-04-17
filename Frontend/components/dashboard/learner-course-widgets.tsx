import { OptimizedImage as Image } from "@/components/shared/optimized-image";
import Link from "next/link";
import { Play, Star } from "lucide-react";

import { CourseActionButton } from "@/components/dashboard/course-action-button";
import { CourseProgressLink } from "@/components/dashboard/course-progress-link";
import { cn } from "@/lib/utils";

type LearnerCourse = {
  author?: string;
  cta: string;
  href?: string;
  id?: number;
  image: string;
  isEnrolled?: boolean;
  lessonHref?: string;
  meta: string;
  progress: number;
  rating?: string;
  title: string;
};

type CourseSectionProps = {
  actionHref?: string;
  courses: LearnerCourse[];
  emptyActionHref?: string;
  emptyActionLabel?: string;
  emptyDescription?: string;
  emptyTitle?: string;
  title: string;
};

export function CatalogCourseSection({
  actionHref = "/learner/course-catalog",
  courses,
  title,
}: CourseSectionProps) {
  return (
    <section className="mt-8 sm:mt-9">
      <div className="mb-4 flex flex-col items-start gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[22px] font-extrabold leading-tight text-black sm:text-[25px]">
          {title}
        </h2>
        <Link
          href={actionHref}
          className="cursor-pointer text-[14px] font-extrabold text-brand-blue-700 transition-colors duration-300 ease-in-out hover:text-(--brand-blue-500) sm:text-[16px]"
        >
          See all
        </Link>
      </div>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {courses.map((course) => (
          <CatalogCourseCard
            key={`${title}-${course.id ?? course.title}`}
            course={course}
          />
        ))}
      </div>
    </section>
  );
}

function CatalogCourseCard({ course }: { course: LearnerCourse }) {
  const courseHref = course.href ?? "#";

  return (
    <article className="flex h-full flex-col rounded-lg bg-[#f4f4f4] p-3 shadow-[0_4px_7px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.13)] sm:p-4">
      <Link
        href={courseHref}
        className="relative block h-[126px] overflow-hidden rounded-md bg-[#e8e8e8] sm:h-[148px]"
      >
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </Link>
      <Link href={courseHref} className="mt-3 block">
        <h3 className="min-h-[40px] overflow-hidden text-[16px] font-extrabold leading-tight text-black transition-colors duration-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] hover:text-(--brand-blue-700) sm:min-h-[46px] sm:text-[18px]">
          {course.title}
        </h3>
      </Link>
      <p className="mt-2 min-h-5 truncate text-[13px] font-medium text-[#111] sm:mt-3 sm:text-[15px]">
        {course.author}
      </p>
      <div className="mt-4 flex min-h-6 flex-wrap items-center gap-2 text-[13px] font-medium text-black sm:mt-5 sm:text-[15px]">
        <Star
          className="h-4 w-4 fill-[#f7c42c] text-[#f7c42c] sm:h-5 sm:w-5"
          aria-hidden="true"
        />
        <span>{course.rating}</span>
        <span>.</span>
        <span>{course.meta}</span>
      </div>
      <div className="mt-auto pt-5 sm:pt-7">
        {course.id ? (
          <CourseActionButton
            className="mx-auto flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-(--brand-blue-500) text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-(--brand-blue-400) disabled:cursor-not-allowed disabled:opacity-70 sm:h-[50px] sm:max-w-[188px] sm:text-[16px]"
            courseId={course.id}
            enrolledLabel="Continue"
            href={course.lessonHref ?? courseHref}
            isEnrolled={course.isEnrolled}
            label={course.cta}
          />
        ) : (
          <Link
            href={courseHref}
            className="mx-auto flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-(--brand-blue-500) text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-(--brand-blue-400) sm:h-[50px] sm:max-w-[188px] sm:text-[16px]"
          >
            {course.cta}
          </Link>
        )}
      </div>
    </article>
  );
}

export function LearningCourseSection({
  courses,
  emptyActionHref = "/learner/course-catalog",
  emptyActionLabel = "Browse courses",
  emptyDescription = "Enroll in a course to begin your learning journey.",
  emptyTitle = "No courses yet",
  title,
}: CourseSectionProps) {
  return (
    <section className="mt-9 sm:mt-10">
      <h2 className="mb-4 text-[22px] font-extrabold leading-tight text-black sm:mb-5 sm:text-[25px]">
        {title}
      </h2>
      {courses.length ? (
        <div className="grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {courses.map((course, index) => (
            <LearningCourseCard
              key={`${title}-${course.title}`}
              course={course}
              primary={index === 0 && course.cta === "Continue"}
            />
          ))}
        </div>
      ) : (
        <EmptyLearningState
          actionHref={emptyActionHref}
          actionLabel={emptyActionLabel}
          description={emptyDescription}
          title={emptyTitle}
        />
      )}
    </section>
  );
}

function EmptyLearningState({
  actionHref,
  actionLabel,
  description,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#b9c7e8] bg-[#f6f9ff] px-5 py-8 text-center">
      <h3 className="text-[18px] font-extrabold leading-tight text-black">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-120 text-[13px] font-medium leading-[1.5] text-[#5d6472]">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-(--brand-blue-500) px-4 text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function LearningCourseCard({
  course,
  primary,
}: {
  course: LearnerCourse;
  primary?: boolean;
}) {
  const courseHref = course.lessonHref ?? course.href ?? "#";

  return (
    <article className="flex h-full flex-col rounded-lg bg-[#f4f4f4] p-3 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.12)] sm:p-4">
      <Link
        href={courseHref}
        className="relative block h-28 overflow-hidden rounded-md bg-[#e8e8e8] sm:h-30 xl:h-[105px]"
      >
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
      </Link>
      <ProgressLine className="mt-4" progress={course.progress} />
      <Link href={courseHref} className="mt-4 block sm:mt-5">
        <h3 className="min-h-[40px] overflow-hidden text-[16px] font-extrabold leading-tight text-black transition-colors duration-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] hover:text-(--brand-blue-700) sm:min-h-[46px] sm:text-[18px]">
          {course.title}
        </h3>
      </Link>
      <p className="mt-2 text-[13px] font-medium text-[#777] sm:mt-3 sm:text-[15px]">
        {course.meta}
      </p>
      <CourseProgressLink
        courseId={course.id}
        href={courseHref}
        increment={1}
        className={cn(
          "mx-auto mt-auto flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border text-[14px] font-extrabold transition-all duration-300 ease-in-out hover:-translate-y-0.5 sm:h-[50px] sm:max-w-[188px] sm:gap-3 sm:text-[16px]",
          primary
            ? "border-(--brand-blue-500) bg-(--brand-blue-500) text-white shadow-[0_14px_24px_rgba(37,99,235,0.25)] hover:bg-(--brand-blue-400)"
            : "border-[#757575] bg-transparent text-[#4c4c4c] hover:border-(--brand-blue-500) hover:text-(--brand-blue-500)",
        )}
        shouldAdvance={course.progress === 0}
      >
        <Play className="h-5 w-5" aria-hidden="true" />
        {course.cta}
      </CourseProgressLink>
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
