import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  FileText,
  Play,
} from "lucide-react";

import { CourseLessonProgressTracker } from "@/components/dashboard/course-lesson-progress-tracker";
import { OptimizedImage as Image } from "@/components/shared/optimized-image";
import type { BackendCourse } from "@/lib/course-service";
import {
  buildCourseModules,
  getCourseHref,
  getCourseImage,
  getLessonHref,
  type CourseLesson,
  type CourseModule,
} from "@/lib/course-presenter";
import { cn } from "@/lib/utils";

type CourseLessonViewProps = {
  course: BackendCourse;
  isEnrolled: boolean;
  lesson: CourseLesson;
};

export function CourseLessonView({
  course,
  isEnrolled,
  lesson,
}: CourseLessonViewProps) {
  const modules = buildCourseModules(course);

  return (
    <div className="mx-auto max-w-6xl animate-fade-up">
      <CourseLessonProgressTracker
        courseId={course.id}
        courseTitle={course.title}
        enabled={isEnrolled}
        lessonId={lesson.id}
      />

      <Link
        href={getCourseHref(course.id)}
        className="mb-5 inline-flex h-10 items-center gap-2 rounded-md text-[14px] font-extrabold text-(--brand-blue-700) transition-colors duration-300 hover:text-(--brand-blue-500)"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Course overview
      </Link>

      <details className="group mb-5 rounded-lg bg-[#c9dcff] p-3 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md bg-white px-4 py-3 text-[15px] font-extrabold text-black [&::-webkit-details-marker]:hidden">
          <span>
            Course lessons
            <span className="mt-1 block text-[12px] font-semibold text-[#5d6472]">
              Current: {lesson.title}
            </span>
          </span>
          <ChevronDown
            className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="mt-3">
          <LessonModulesList course={course} lesson={lesson} modules={modules} />
        </div>
      </details>

      <div className="grid gap-5 lg:grid-cols-[286px_minmax(0,1fr)]">
        <aside className="hidden max-h-[calc(100vh-116px)] overflow-y-auto rounded-lg bg-[#c9dcff] p-3 lg:sticky lg:top-24 lg:block">
          <LessonModulesList course={course} lesson={lesson} modules={modules} />
        </aside>

        <main>
          <h1 className="text-center text-[24px] font-extrabold leading-tight text-black sm:text-[30px]">
            {course.title}
          </h1>

          <section className="mt-6">
            <p className="mb-3 text-[15px] font-extrabold text-black">
              {lesson.title}
            </p>
            <div className="relative h-[245px] overflow-hidden bg-[#dbe4f8] sm:h-[335px] lg:h-[365px]">
              <Image
                src={getCourseImage(course)}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 740px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[rgba(7,20,47,0.58)]" />
              <button
                type="button"
                className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/80 text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
                aria-label={`Play ${lesson.title}`}
              >
                <Play className="ml-1 h-8 w-8" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4 h-10 bg-(--brand-blue-700)" />
          </section>

          <section className="mt-6">
            <h2 className="text-[17px] font-extrabold text-black">
              Lesson overview
            </h2>
            <div className="mt-4 bg-[#d6d6d6] p-4 text-[13px] font-medium leading-[1.65] text-black sm:p-5 sm:text-[14px]">
              <p>{lesson.overview}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  "Understand the core idea",
                  "Apply it in a guided task",
                  "Review the lesson resource",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-blue-700)"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function LessonModulesList({
  course,
  lesson,
  modules,
}: {
  course: BackendCourse;
  lesson: CourseLesson;
  modules: CourseModule[];
}) {
  return (
    <>
      {modules.map((module) => (
        <details
          key={module.id}
          open={module.id === lesson.moduleId}
          className="group/module mb-3 rounded-md bg-white/38 last:mb-0 lg:bg-transparent"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-2 py-3 text-[16px] font-extrabold leading-[1.35] text-black [&::-webkit-details-marker]:hidden lg:cursor-default">
            {module.title}
            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-open/module:rotate-180 lg:hidden"
              aria-hidden="true"
            />
          </summary>
          <div className="space-y-2 px-1 pb-2 lg:px-0 lg:pb-0">
            {module.lessons.map((moduleLesson) => {
              const isActive = moduleLesson.id === lesson.id;

              return (
                <Link
                  key={moduleLesson.id}
                  href={getLessonHref(course.id, moduleLesson.id)}
                  className={cn(
                    "grid grid-cols-[42px_minmax(0,1fr)] gap-3 rounded-md p-2 transition-all duration-300",
                    isActive
                      ? "bg-(--brand-blue-700) text-white shadow-[0_12px_22px_rgba(25,66,157,0.24)]"
                      : "text-black hover:bg-white/70",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed",
                      isActive ? "border-white" : "border-[#222]",
                    )}
                  >
                    {moduleLesson.kind === "video" ? (
                      <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
                    ) : (
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold leading-[1.35]">
                      {moduleLesson.title}
                    </span>
                    <span className="mt-2 block text-[13px] font-medium">
                      {moduleLesson.kind === "video" ? "Video" : "Reading"}:{" "}
                      {moduleLesson.duration}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </details>
      ))}
    </>
  );
}
