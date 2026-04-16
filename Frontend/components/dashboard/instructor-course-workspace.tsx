"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  Loader2,
  Play,
  Plus,
  Rocket,
  Sparkles,
} from "lucide-react";

import {
  createInstructorCourseAction,
  publishInstructorCourseAction,
  type CreateInstructorCourseState,
  type PublishInstructorCourseState,
} from "@/lib/instructor-course-actions";
import { cn } from "@/lib/utils";

export type InstructorCourseView = {
  category?: string | null;
  description?: string | null;
  durationHours?: number | null;
  href?: string;
  id?: number;
  image: string;
  level?: string | null;
  priceLabel: string;
  status: "Draft" | "Published";
  students: number;
  title: string;
  updatedLabel: string;
};

type InstructorCourseWorkspaceProps = {
  courses: InstructorCourseView[];
  instructorName: string;
};

const createInitialState: CreateInstructorCourseState = {
  message: "",
  ok: false,
};

const publishInitialState: PublishInstructorCourseState = {
  message: "",
  ok: false,
};

const tabs = [
  "Basic Info",
  "Course Content",
  "Upload Material",
  "Assessment",
  "Publish",
] as const;

const assessmentModules = [
  {
    module: "Module one: Introduction",
    quizzes: [
      {
        assignment: true,
        questions: 5,
        title: "Quiz 1: Initial Checks",
      },
      {
        assignment: false,
        questions: 8,
        title: "Quiz 2: UX Basicx",
      },
    ],
  },
  {
    module: "Module two: Introduction",
    quizzes: [
      {
        assignment: true,
        questions: 5,
        title: "Quiz 1: Initial Checks",
      },
    ],
  },
] as const;

export function InstructorCourseWorkspace({
  courses,
  instructorName,
}: InstructorCourseWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(
    "Course Content",
  );
  const [createState, createAction] = useActionState(
    createInstructorCourseAction,
    createInitialState,
  );
  const [publishState, publishAction] = useActionState(
    publishInstructorCourseAction,
    publishInitialState,
  );
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    courses.find((course) => course.status === "Draft")?.id ?? courses[0]?.id,
  );

  const visibleCourses = useMemo(() => {
    if (!createState.course) {
      return courses;
    }

    const createdCourse: InstructorCourseView = {
      category: createState.course.category,
      description: createState.course.description,
      durationHours: createState.course.duration_hours,
      href: `/learner/course-catalog/${createState.course.id}`,
      id: createState.course.id,
      image: "/course-5.webp",
      level: createState.course.level,
      priceLabel: createState.course.price ? String(createState.course.price) : "Free",
      status: publishState.courseId === createState.course.id && publishState.ok
        ? "Published"
        : "Draft",
      students: 0,
      title: createState.course.title,
      updatedLabel: "Just now",
    };

    return [
      createdCourse,
      ...courses.filter((course) => course.id !== createState.course?.id),
    ];
  }, [courses, createState.course, publishState.courseId, publishState.ok]);

  const preferredCourseId =
    createState.ok && createState.course?.id
      ? createState.course.id
      : selectedCourseId;
  const selectedCourse =
    visibleCourses.find((course) => course.id === preferredCourseId) ??
    visibleCourses.find((course) => course.id) ??
    visibleCourses[0];
  const draftCount = visibleCourses.filter(
    (course) => course.status === "Draft",
  ).length;
  const publishedCount = visibleCourses.filter(
    (course) => course.status === "Published",
  ).length;
  const statusMessage = publishState.message || createState.message;
  const isStatusOk = publishState.message ? publishState.ok : createState.ok;

  return (
    <div className="mx-auto max-w-280 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[13px] font-extrabold uppercase text-(--brand-blue-700)">
            Instructor workspace
          </p>
          <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-black sm:text-[36px]">
            My Course
          </h1>
          <p className="mt-3 max-w-[620px] text-[14px] font-medium leading-[1.6] text-[#505050]">
            Create a clean course draft, prepare content and assessments, then
            publish when the learning path is ready.
          </p>
        </div>

        <Link
          href="#course-builder"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-(--brand-blue-500) px-5 text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400) sm:w-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create course
        </Link>
      </div>

      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Published" value={String(publishedCount)} />
        <MetricCard label="Drafts" value={String(draftCount)} />
        <MetricCard
          label="Students reached"
          value={String(
            visibleCourses.reduce((total, course) => total + course.students, 0),
          )}
        />
      </section>

      <section
        id="course-builder"
        className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[23px] font-extrabold leading-tight text-black">
              Create New Course
            </h2>
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#d4d4d4] bg-white px-4 text-[13px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-300) hover:text-(--brand-blue-600) sm:w-auto"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview
            </button>
          </div>

          <div className="rounded-lg border border-[#cfcfcf] bg-white">
            <div className="grid grid-cols-2 border-b border-[#d8d8d8] sm:grid-cols-5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "min-h-12 cursor-pointer px-3 text-[12px] font-extrabold text-black transition-colors duration-300 hover:bg-[#f4f7ff]",
                    activeTab === tab &&
                      "bg-(--brand-blue-500) text-white hover:bg-(--brand-blue-500)",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form action={createAction} className="p-4 sm:p-5">
              <div className="grid gap-3 rounded-md bg-(--brand-blue-500) p-4 text-white md:grid-cols-[minmax(0,1fr)_180px_160px] md:items-center">
                <label className="block">
                  <span className="sr-only">Course title</span>
                  <input
                    name="title"
                    defaultValue="UI/UX Design Fundamentals"
                    required
                    className="h-11 w-full rounded-md border border-white/20 bg-white/10 px-4 text-[16px] font-extrabold text-white outline-none placeholder:text-white/75 focus:border-white focus:ring-4 focus:ring-white/16"
                    placeholder="Course title"
                  />
                </label>
                <label>
                  <span className="sr-only">Category</span>
                  <select
                    name="category"
                    defaultValue="Design"
                    className="h-11 w-full rounded-md border border-white/20 bg-white/10 px-3 text-[14px] font-extrabold text-white outline-none focus:border-white focus:ring-4 focus:ring-white/16 [&_option]:text-black"
                  >
                    <option>Design</option>
                    <option>Development</option>
                    <option>Productivity</option>
                    <option>Writing</option>
                    <option>Business</option>
                  </select>
                </label>
                <label>
                  <span className="sr-only">Level</span>
                  <select
                    name="level"
                    defaultValue="beginner"
                    className="h-11 w-full rounded-md border border-white/20 bg-white/10 px-3 text-[14px] font-extrabold text-white outline-none focus:border-white focus:ring-4 focus:ring-white/16 [&_option]:text-black"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </label>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_170px_150px]">
                <label className="block md:col-span-1">
                  <span className="text-[13px] font-extrabold text-black">
                    Course Description
                  </span>
                  <textarea
                    name="description"
                    defaultValue="In this course you will learn the core principles of creating intuitive user-centered digital experiences. This course introduces you to the world of User Interface and User Experience design, helping you understand how to design products that are not only visually appealing but also easy to use."
                    className="mt-2 min-h-36 w-full resize-y rounded-md border border-[#d5d5d5] bg-[#f5f5f5] px-4 py-4 text-[13px] font-medium leading-[1.65] text-black outline-none transition-all duration-300 focus:border-(--brand-blue-400) focus:bg-white focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
                  />
                </label>
                <label>
                  <span className="text-[13px] font-extrabold text-black">
                    Duration
                  </span>
                  <input
                    name="duration_hours"
                    type="number"
                    min="1"
                    defaultValue="12"
                    className="mt-2 h-11 w-full rounded-md border border-[#d5d5d5] bg-white px-3 text-[14px] font-semibold text-black outline-none focus:border-(--brand-blue-400) focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
                  />
                </label>
                <label>
                  <span className="text-[13px] font-extrabold text-black">
                    Price
                  </span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue="0"
                    className="mt-2 h-11 w-full rounded-md border border-[#d5d5d5] bg-white px-3 text-[14px] font-semibold text-black outline-none focus:border-(--brand-blue-400) focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
                  />
                </label>
              </div>

              <div className="mt-5">
                <label>
                  <span className="text-[13px] font-extrabold text-black">
                    What You Will Learn
                  </span>
                  <input
                    defaultValue="Principles of UI and UX design"
                    className="mt-2 h-11 w-full rounded-md border border-[#bfc7ed] bg-white px-3 text-[13px] font-semibold text-black outline-none focus:border-(--brand-blue-400) focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
                  />
                </label>
              </div>

              <div className="mt-5">
                <p className="text-[13px] font-extrabold text-black">Benefits</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Professional Certificate", "All Figma Source File"].map(
                    (benefit) => (
                      <span
                        key={benefit}
                        className="rounded-md bg-[#efefef] px-4 py-2 text-[12px] font-semibold text-[#424242]"
                      >
                        {benefit}
                      </span>
                    ),
                  )}
                  <button
                    type="button"
                    className="inline-flex min-h-9 items-center gap-2 rounded-md border border-[#c7c7c7] bg-white px-4 text-[12px] font-semibold text-black transition-all duration-300 hover:border-(--brand-blue-300) hover:text-(--brand-blue-600)"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Add New
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <MediaPreview
                  image="/course-5.webp"
                  label="Cover Image"
                />
                <MediaPreview
                  image="/Frame 143 (3).webp"
                  label="Promotional Video"
                  video
                />
              </div>

              {statusMessage ? (
                <p
                  className={cn(
                    "mt-5 rounded-md px-4 py-3 text-[13px] font-extrabold",
                    isStatusOk
                      ? "bg-[#edf7ee] text-[#166534]"
                      : "bg-[#fff2f2] text-[#b42318]",
                  )}
                  aria-live="polite"
                >
                  {statusMessage}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="h-10 rounded-md border border-transparent bg-[#f3f3f3] px-5 text-[13px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c7c7c7]"
                >
                  Cancel
                </button>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SaveDraftButton />
                  <button
                    type="button"
                    onClick={() => setActiveTab("Upload Material")}
                    className="h-10 rounded-md bg-(--brand-blue-700) px-5 text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-500)"
                  >
                    Upload Material
                  </button>
                </div>
              </div>
            </form>
          </div>

          <AssessmentPreview />
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-lg border border-[#cfcfcf] bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#eef3ff] text-(--brand-blue-700)">
                <Rocket className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[18px] font-extrabold leading-tight text-black">
                  Publish readiness
                </h2>
                <p className="mt-1 text-[12px] font-medium leading-[1.5] text-[#626262]">
                  Save a draft first, then publish it to the learner catalog.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-md bg-[#f7f7f7] p-4">
              <p className="text-[12px] font-extrabold uppercase text-[#606060]">
                Selected course
              </p>
              <h3 className="mt-2 text-[17px] font-extrabold leading-tight text-black">
                {selectedCourse?.title ?? "No draft selected"}
              </h3>
              <p className="mt-2 text-[13px] font-semibold text-[#626262]">
                {selectedCourse?.status ?? "Draft"} .{" "}
                {selectedCourse?.priceLabel ?? "Free"}
              </p>
            </div>

            <form action={publishAction} className="mt-5">
              <input
                type="hidden"
                name="courseId"
                value={selectedCourse?.id ?? ""}
              />
              <PublishButton disabled={!selectedCourse?.id} />
            </form>
          </div>

          <div className="rounded-lg border border-[#cfcfcf] bg-white p-4">
            <h2 className="text-[18px] font-extrabold leading-tight text-black">
              Instructor notes
            </h2>
            <div className="mt-4 space-y-3">
              {[
                "Drafts use POST /courses/ and remain unpublished.",
                "Publishing uses PATCH /courses/{course_id}/publish.",
                `${instructorName} can preview structure before publishing.`,
              ].map((note) => (
                <p
                  key={note}
                  className="flex gap-2 text-[13px] font-medium leading-[1.5] text-[#454545]"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-blue-600)"
                    aria-hidden="true"
                  />
                  <span>{note}</span>
                </p>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-9">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[24px] font-extrabold leading-tight text-black">
              Course library
            </h2>
            <p className="mt-2 text-[13px] font-medium text-[#606060]">
              Drafts and published courses stay visible for your presentation
              flow.
            </p>
          </div>
          <p className="text-[13px] font-extrabold text-(--brand-blue-700)">
            {visibleCourses.length} courses
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <CourseLibraryCard
              key={`${course.id ?? course.title}-${course.status}`}
              course={course}
              isSelected={course.id === selectedCourse?.id}
              onSelect={() => setSelectedCourseId(course.id)}
              publishAction={publishAction}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-[#cfcfcf] bg-white p-4 shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
      <p className="text-[29px] font-extrabold leading-tight text-black">
        {value}
      </p>
      <p className="mt-2 text-[13px] font-semibold text-[#606060]">{label}</p>
    </article>
  );
}

function MediaPreview({
  image,
  label,
  video,
}: {
  image: string;
  label: string;
  video?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-extrabold text-black">{label}</p>
      <div
        className="relative flex min-h-[156px] items-center justify-center overflow-hidden rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
      >
        <div
          className={cn(
            "absolute inset-0",
            video ? "bg-(--brand-blue-500)/72" : "bg-black/10",
          )}
        />
        {video ? (
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/85 text-white">
            <Play className="ml-1 h-7 w-7" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </div>
  );
}

function AssessmentPreview() {
  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-extrabold leading-tight text-black">
          Assessment/Quizzes
        </h2>
        <span className="inline-flex h-9 items-center gap-2 rounded-md bg-[#eef3ff] px-3 text-[12px] font-extrabold text-(--brand-blue-700)">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Demo structure
        </span>
      </div>

      <div className="space-y-6">
        {assessmentModules.map((module) => (
          <div key={module.module}>
            <h3 className="text-[18px] font-extrabold text-black">
              {module.module}
            </h3>
            <div className="mt-3 space-y-4">
              {module.quizzes.map((quiz) => (
                <article
                  key={`${module.module}-${quiz.title}`}
                  className="rounded-lg border border-[#c9c9c9] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex flex-col gap-3 border-b border-[#e1e1e1] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#dce8ff] text-(--brand-blue-700)">
                        <ClipboardList className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h4 className="text-[15px] font-extrabold text-black">
                          {quiz.title}
                        </h4>
                        <p className="mt-1 text-[12px] font-semibold text-[#606060]">
                          {quiz.questions} questions . 10 mins
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="h-8 rounded-md border border-[#d1d1d1] px-3 text-[12px] font-semibold text-black"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="h-8 rounded-md border border-[#d1d1d1] px-3 text-[12px] font-semibold text-black"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    {quiz.assignment ? (
                      <div className="mb-3 rounded-md bg-(--brand-blue-500) px-4 py-3 text-white">
                        <p className="flex items-center gap-2 text-[13px] font-extrabold">
                          <FileText className="h-4 w-4" aria-hidden="true" />
                          Assignment: First Design Task
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-white/82">
                          Manual grading
                        </p>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#b9c7e8] text-[12px] font-extrabold text-black transition-all duration-300 hover:border-(--brand-blue-400) hover:text-(--brand-blue-600)"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      Add Assessment
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CourseLibraryCard({
  course,
  isSelected,
  onSelect,
  publishAction,
}: {
  course: InstructorCourseView;
  isSelected: boolean;
  onSelect: () => void;
  publishAction: (formData: FormData) => void;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1",
        isSelected ? "border-(--brand-blue-400)" : "border-[#d4d4d4]",
      )}
    >
      <div
        className="min-h-[150px] bg-cover bg-center"
        style={{ backgroundImage: `url("${course.image}")` }}
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-extrabold leading-tight text-black">
            {course.title}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-extrabold",
              course.status === "Published"
                ? "bg-[#eaf7ee] text-[#166534]"
                : "bg-[#fff7df] text-[#8a5b00]",
            )}
          >
            {course.status}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-[13px] font-medium leading-[1.55] text-[#606060]">
          {course.description ??
            "A structured course experience with prepared content and assessments."}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] font-semibold text-[#505050]">
          <span>{course.category ?? "Course"}</span>
          <span>{course.level ?? "beginner"}</span>
          <span>{course.durationHours ?? 1} hrs</span>
          <span>{course.students} students</span>
        </div>
        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onSelect}
            className="h-10 rounded-md border border-[#c7c7c7] text-[13px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-300) hover:text-(--brand-blue-600)"
          >
            Select
          </button>
          {course.status === "Draft" && course.id ? (
            <form action={publishAction}>
              <input type="hidden" name="courseId" value={course.id} />
              <PublishSmallButton />
            </form>
          ) : (
            <Link
              href={course.href ?? "/instructor/my-course"}
              className="inline-flex h-10 items-center justify-center rounded-md bg-(--brand-blue-500) text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function SaveDraftButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#f3f3f3] px-5 text-[13px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e9e9e9] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Saving..." : "Save As Draft"}
    </button>
  );
}

function PublishButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-(--brand-blue-500) px-5 text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400) disabled:cursor-not-allowed disabled:opacity-65"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Publishing..." : "Publish Course"}
    </button>
  );
}

function PublishSmallButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-(--brand-blue-500) text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400) disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Publishing" : "Publish"}
    </button>
  );
}
