import Link from "next/link";
import { ArrowLeft, Download, FileText, Play, Video } from "lucide-react";

import { CourseActionButton } from "@/components/dashboard/course-action-button";
import { OptimizedImage as Image } from "@/components/shared/optimized-image";
import type { BackendCourse } from "@/lib/course-service";
import {
  buildCourseModules,
  getCourseImage,
  getLessonHref,
  getLevelLabel,
  type CourseModule,
} from "@/lib/course-presenter";

type CourseDetailViewProps = {
  course: BackendCourse;
  isEnrolled: boolean;
  progress: number;
};

const detailTabs = [
  { href: "#course-overview", label: "Overview" },
  { href: "/learner/assignments", label: "Assignments" },
  { href: "/learner/discussions", label: "Discussion" },
  { href: "#course-materials", label: "Materials" },
];

export function CourseDetailView({
  course,
  isEnrolled,
  progress,
}: CourseDetailViewProps) {
  const modules = buildCourseModules(course);
  const lessonCount = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
  const courseProgress = isEnrolled ? progress : 0;
  const completedLessons = Math.min(
    lessonCount,
    Math.round((courseProgress / 100) * lessonCount),
  );

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <Link
        href="/learner/course-catalog"
        className="mb-5 inline-flex h-10 items-center gap-2 rounded-md text-[14px] font-extrabold text-(--brand-blue-700) transition-colors duration-300 hover:text-(--brand-blue-500)"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to courses
      </Link>

      <section
        id="course-overview"
        className="bg-[#edf3ff] px-4 py-8 sm:px-8 sm:py-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-extrabold uppercase text-(--brand-blue-700)">
            {course.category ?? "Course"}
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-black sm:text-[36px]">
            {course.title}
          </h1>
          <p className="mt-4 text-[14px] font-medium leading-[1.7] text-[#333] sm:text-[15px]">
            {course.description ??
              "Learn with focused lessons, guided practice, and materials built for steady progress."}
          </p>
        </div>

        <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-3">
          {detailTabs.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                index === 0
                  ? "inline-flex h-10 min-w-28 items-center justify-center rounded-md border border-(--brand-blue-500) bg-(--brand-blue-300) px-4 text-[13px] font-extrabold text-(--brand-blue-950)"
                  : "inline-flex h-10 min-w-28 items-center justify-center rounded-md border border-(--brand-blue-700) bg-transparent px-4 text-[13px] font-extrabold text-(--brand-blue-950) transition-colors duration-300 hover:bg-white"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <div className="mb-2 flex items-center justify-between gap-3 text-[14px] font-semibold text-black">
            <span>
              {isEnrolled
                ? `${completedLessons}/${lessonCount} completed`
                : "Not enrolled"}
            </span>
            <span>
              {getLevelLabel(course.level)} . {course.duration_hours ?? 1} hrs
            </span>
          </div>
          <div className="h-8 bg-[#bcd2fa]">
            <div
              className="h-full bg-(--brand-blue-500)"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>
      </section>

      <section
        id="course-materials"
        className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div>
          {modules.map((module) => (
            <CourseModuleBlock
              key={module.id}
              courseId={course.id}
              module={module}
            />
          ))}
        </div>

        <aside className="h-max rounded-lg border border-[#c7c7c7] bg-white p-4">
          <div className="relative h-40 overflow-hidden rounded-md bg-[#e8e8e8]">
            <Image
              src={getCourseImage(course)}
              alt=""
              fill
              sizes="300px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/42">
              <span className="inline-flex h-13 w-13 items-center justify-center rounded-full border border-white/80 text-white">
                <Play className="ml-0.5 h-6 w-6" aria-hidden="true" />
              </span>
            </div>
          </div>
          <h2 className="mt-4 text-[19px] font-extrabold leading-tight text-black">
            Ready when you are
          </h2>
          <p className="mt-2 text-[13px] font-medium leading-[1.6] text-[#5d6472]">
            Enroll to add this course to your dashboard and My Learning.
          </p>
          <CourseActionButton
            className="mt-5 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-(--brand-blue-500) px-4 text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400) disabled:cursor-not-allowed disabled:opacity-70"
            courseId={course.id}
            enrolledLabel="Resume course"
            href={getLessonHref(course.id, modules[0]?.lessons[0]?.id ?? "m1-l1")}
            isEnrolled={isEnrolled}
            label="Enroll course"
            showMessage
          />
        </aside>
      </section>
    </div>
  );
}

function CourseModuleBlock({
  courseId,
  module,
}: {
  courseId: number;
  module: CourseModule;
}) {
  return (
    <section className="mb-6 last:mb-0">
      <h2 className="text-[20px] font-extrabold leading-tight text-black">
        {module.title}
      </h2>
      <div className="mt-4 space-y-3">
        {module.lessons.map((lesson, index) => (
          <article
            key={lesson.id}
            className="grid gap-3 rounded-lg border border-[#d4d4d4] bg-white p-4 sm:grid-cols-[44px_minmax(0,1fr)_auto_auto] sm:items-center"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-[#222] text-black">
              {lesson.kind === "video" ? (
                <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
              ) : (
                <FileText className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div>
              <h3 className="text-[15px] font-semibold leading-tight text-black sm:text-[16px]">
                {lesson.title}
              </h3>
              <p className="mt-2 flex items-center gap-2 text-[13px] font-medium text-black">
                <Video className="h-4 w-4" aria-hidden="true" />
                {lesson.kind === "video" ? "Video" : "Reading"}: {lesson.duration}
              </p>
            </div>
            <Link
              href={getLessonHref(courseId, lesson.id)}
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#a9c4fb] px-4 text-[13px] font-extrabold text-(--brand-blue-950) transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-300)"
            >
              {index === 0 ? "Resume" : "Start"}
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-10 items-center justify-center rounded-md border border-[#c3d1ee] text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-400) hover:text-(--brand-blue-600)"
              aria-label={`Download ${lesson.resourceLabel}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
