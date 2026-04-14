import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Download,
  Lightbulb,
  Share2,
  UserCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const stats = [
  {
    icon: BookOpen,
    label: "Enrolled Courses",
    meta: "Active Learning",
    value: "12",
  },
  {
    icon: CheckCircle2,
    label: "Completed Courses",
    meta: "Great Progress!",
    value: "8",
  },
  {
    icon: Award,
    label: "Certificate Earned",
    meta: "Keep it up!",
    value: "8",
  },
  {
    icon: Clock3,
    label: "Hours Learned",
    meta: "This Internship",
    value: "150",
  },
] as const;

type CertificateCourse = {
  helper?: string;
  image: string;
  meta: string;
  progress: number;
  status: string;
  statusTone: "blue" | "green";
  title: string;
};

const courses: CertificateCourse[] = [
  {
    image: "/course-card-1.png",
    meta: "3 Modules . 10 Hours",
    progress: 70,
    status: "In Progress",
    statusTone: "blue",
    title: "Ui/Ux Design Fundamentals",
  },
  {
    helper: "Last accessed: Yesterday",
    image: "/course-card-2.png",
    meta: "2 Modules . 6 hours",
    progress: 50,
    status: "In Progress",
    statusTone: "blue",
    title: "Web Development Basics",
  },
  {
    image: "/course-card-3.png",
    meta: "8 Modules . 50 Hours",
    progress: 100,
    status: "Completed",
    statusTone: "green",
    title: "Adobe Photoshop Basics",
  },
];

const earnedCertificates = [
  {
    instructor: "Habee Muyiwa",
    issued: "Apr 13, 2025",
    title: "Ui/Ux Design Fundamentals",
  },
  {
    instructor: "Gbenga Ebun",
    issued: "May 28, 2025",
    title: "Adobe Photoshop Basics",
  },
] as const;

export function LearnerCertificatePage() {
  return (
    <div className="mx-auto max-w-[1090px] animate-fade-up pb-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <UserCircle2
            className="mt-1 h-9 w-9 shrink-0 fill-(--brand-blue-500) text-white"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-[27px] font-extrabold leading-tight text-black sm:text-[32px]">
              Welcome, Samuel!
            </h1>
            <p className="mt-2 max-w-[620px] text-[13px] font-semibold leading-[1.45] text-[#303030] sm:text-[14px]">
              Keep up the great work! Complete your courses to earn certificates
              and showcase your skills.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-5">
        {stats.map(({ icon: Icon, label, meta, value }) => (
          <article
            key={label}
            className="flex min-h-[78px] items-center gap-4 rounded-lg border border-[#dedede] bg-white px-4 py-3 shadow-[0_13px_28px_rgba(0,0,0,0.08)]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#93dce9] text-(--brand-blue-500)">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[15px] font-extrabold leading-tight text-[#232323]">
                {label}
              </h2>
              <p className="mt-1 text-[15px] font-semibold leading-none text-[#232323]">
                {value}
              </p>
              <p className="mt-2 text-[11px] font-semibold leading-none text-[#b2b2b2]">
                {meta}
              </p>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-9 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(390px,1fr)]">
        <div className="grid gap-8">
          <section>
            <SectionTitle actionLabel="View All Courses" title="My Courses" />
            <div className="mt-3 grid gap-4">
              {courses.map((course) => (
                <CourseProgressCard key={course.title} course={course} />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              actionLabel="View All Certificates"
              title="Certificates Earned"
            />
            <div className="mt-3 grid gap-4">
              {earnedCertificates.map((certificate) => (
                <EarnedCertificateCard
                  certificate={certificate}
                  key={certificate.title}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="grid content-start gap-6">
          <section>
            <SectionTitle actionLabel="View All" title="Recent Completion" />
            <article className="mt-3 rounded-lg bg-[#dce6fb] p-4 shadow-[0_14px_30px_rgba(7,20,47,0.16)]">
              <p className="text-[14px] font-medium leading-tight text-[#303030]">
                You&apos;ve completed a course!
              </p>
              <h2 className="mt-2 text-[19px] font-extrabold leading-tight text-[#1d1d1d]">
                Ui/Ux Design Fundamentals
              </h2>
              <p className="mt-2 text-[12px] font-semibold text-[#383838]">
                Completed on: April 13, 2025
              </p>

              <div className="relative mt-4 aspect-[538/351] overflow-hidden rounded-sm bg-white">
                <Image
                  src="/certiicate.png"
                  alt="Ui/Ux Design Fundamentals certificate preview"
                  fill
                  sizes="(min-width: 1280px) 520px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px]">
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-3 rounded-md bg-(--brand-blue-500) px-4 text-[13px] font-extrabold text-white shadow-[0_12px_22px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Certificates
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-(--brand-blue-500) bg-white px-4 text-[13px] font-semibold text-(--brand-blue-500) transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4f7ff]"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Share
                </button>
              </div>
            </article>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-[16px] font-extrabold leading-tight text-black">
              <Lightbulb
                className="h-4 w-4 fill-[#f7c42c] text-[#f7c42c]"
                aria-hidden="true"
              />
              Next Steps
            </h2>
            <article className="mt-3 rounded-lg bg-[#dce6fb] p-4 shadow-[0_14px_30px_rgba(7,20,47,0.16)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[14px] font-semibold leading-[1.45] text-[#303030]">
                  Complete{" "}
                  <span className="font-extrabold">
                    &quot;Web Development Basics&quot;
                  </span>{" "}
                  to earn your next certificate!
                </p>
                <p className="shrink-0 text-[14px] font-extrabold text-[#333]">
                  50% Completed
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#b9c7e5]">
                <div className="h-full w-1/2 rounded-full bg-(--brand-blue-500)" />
              </div>
              <Link
                href="/learner/my-learning"
                className="mt-4 flex h-10 items-center justify-center rounded-md bg-(--brand-blue-500) px-5 text-[14px] font-extrabold text-white shadow-[0_12px_22px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
              >
                Continue Learning
              </Link>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  actionLabel,
  title,
}: {
  actionLabel: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-[15px] font-extrabold leading-tight text-[#151515]">
        {title}
      </h2>
      <Link
        href="#"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-(--brand-blue-500) transition-colors duration-300 hover:text-(--brand-blue-700)"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

function CourseProgressCard({
  course,
}: {
  course: (typeof courses)[number];
}) {
  return (
    <article className="grid gap-4 rounded-lg border border-[#dedede] bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center">
      <div className="relative h-[76px] w-[92px] overflow-hidden rounded-md bg-[#ecf0f6]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="92px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-[17px] font-extrabold leading-tight text-[#232323]">
          {course.title}
        </h3>
        <p className="mt-3 text-[13px] font-semibold text-[#303030]">
          {course.meta}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#d6d6d6]">
            <div
              className="h-full rounded-full bg-(--brand-blue-500)"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="shrink-0 text-[13px] font-extrabold text-[#333]">
            {course.progress}%
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
        <span
          className={cn(
            "inline-flex h-10 items-center rounded-full px-5 text-[14px] font-semibold",
            course.statusTone === "green"
              ? "bg-[#cbf4d7] text-[#16a249]"
              : "bg-[#cfdcff] text-(--brand-blue-500)",
          )}
        >
          {course.status}
        </span>
        {course.helper ? (
          <span className="text-[11px] font-semibold text-[#444]">
            {course.helper}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function EarnedCertificateCard({
  certificate,
}: {
  certificate: (typeof earnedCertificates)[number];
}) {
  return (
    <article className="grid gap-4 rounded-lg border border-[#dedede] bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center">
      <div className="relative h-[76px] w-[92px] overflow-hidden rounded-sm bg-[#f4efe5]">
        <Image
          src="/certiicate.png"
          alt={`${certificate.title} certificate`}
          fill
          sizes="92px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-[16px] font-extrabold leading-tight text-[#232323]">
          {certificate.title}
        </h3>
        <p className="mt-2 text-[13px] font-semibold text-[#303030]">
          Issued on {certificate.issued}
        </p>
        <p className="mt-2 text-[13px] font-semibold text-[#303030]">
          Instructor: {certificate.instructor}
        </p>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2 sm:w-[142px]">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-(--brand-blue-500) bg-white px-3 text-[13px] font-semibold text-(--brand-blue-500) transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4f7ff]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download
        </button>
        <button
          type="button"
          aria-label={`Share ${certificate.title} certificate`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-(--brand-blue-500) bg-white text-(--brand-blue-500) transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4f7ff]"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
