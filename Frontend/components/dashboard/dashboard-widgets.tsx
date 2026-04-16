import { OptimizedImage as Image } from "@/components/shared/optimized-image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
} from "lucide-react";

import { CourseProgressLink } from "@/components/dashboard/course-progress-link";
import type { DashboardRole } from "@/data/dashboard";
import { progressLabels } from "@/data/dashboard";
import { cn } from "@/lib/utils";

import { ProgressRing } from "./progress-ring";

type SectionHeaderProps = {
  action?: string;
  actionHref?: string;
  title: string;
};

export function SectionHeader({
  action,
  actionHref = "#",
  title,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <h2 className="text-[19px] font-extrabold leading-tight text-black sm:text-[21px]">
        {title}
      </h2>
      {action ? (
        <Link
          href={actionHref}
          className="cursor-pointer text-[12px] font-medium text-(--brand-blue-800) transition-colors duration-300 ease-in-out hover:text-(--brand-blue-500) sm:text-[13px]"
        >
          {action}
          <ArrowRight className="ml-2 inline h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

type CourseCardProps = {
  cta: string;
  href?: string;
  id?: number;
  image: string;
  meta: string;
  primary?: boolean;
  progress: number;
  title: string;
};

export function CourseCard({
  cta,
  href,
  id,
  image,
  meta,
  primary = false,
  progress,
  title,
}: CourseCardProps) {
  return (
    <article className="rounded-lg bg-[#f7f7f7] p-3 shadow-[0_3px_6px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
      <div className="relative h-23 w-full overflow-hidden rounded-md bg-[#e9e9e9] sm:h-18">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 640px) 260px, 100vw"
          className="object-cover"
        />
      </div>
      <ProgressBar className="mt-3" progress={progress} />
      <div className="mt-3">
        <h3 className="text-[15px] font-extrabold leading-tight text-black sm:text-[16px]">
          {title}
        </h3>
        <p className="mt-3 text-[13px] font-medium text-[#717171]">{meta}</p>
      </div>
      {href ? (
        <CourseProgressLink
          courseId={id}
          href={href}
          increment={1}
          className={getCourseButtonClassName(primary)}
          shouldAdvance={progress === 0}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          {cta}
        </CourseProgressLink>
      ) : (
        <button type="button" className={getCourseButtonClassName(primary)}>
          <Play className="h-4 w-4" aria-hidden="true" />
          {cta}
        </button>
      )}
    </article>
  );
}

function getCourseButtonClassName(primary: boolean) {
  return cn(
    "mx-auto mt-4 flex h-10 w-full max-w-[150px] cursor-pointer items-center justify-center gap-2 rounded-[5px] border text-[13px] font-bold transition-all duration-300 ease-in-out hover:-translate-y-0.5",
    primary
      ? "border-(--brand-blue-500) bg-(--brand-blue-500) text-white shadow-[0_14px_24px_rgba(37,99,235,0.25)] hover:bg-(--brand-blue-400)"
      : "border-[#888] bg-transparent text-[#333] hover:border-(--brand-blue-500) hover:text-(--brand-blue-500)",
  );
}

type CourseListItemProps = {
  author?: string;
  href?: string;
  image: string;
  progress: number;
  title: string;
};

export function CourseListItem({
  author,
  href,
  image,
  progress,
  title,
}: CourseListItemProps) {
  const content = (
    <article className="grid gap-3 rounded-lg border border-[#bcbcbc] bg-white p-3 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-(--brand-blue-300) sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center md:grid-cols-[128px_minmax(0,1fr)_154px]">
      <div className="relative h-19 overflow-hidden rounded-md bg-[#e9e9e9] sm:h-[58px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 128px, (min-width: 640px) 112px, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="text-[15px] font-extrabold leading-tight text-black sm:text-[16px]">
          {title}
        </h3>
        {author ? (
          <p className="mt-2 text-[12px] font-medium text-[#717171]">{author}</p>
        ) : null}
      </div>
      <ProgressBar className="sm:col-span-2 md:col-span-1" progress={progress} />
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

type ActivityItemProps = {
  image: string;
  progress: number;
  subtitle: string;
  title: string;
};

export function ActivityItem({
  image,
  progress,
  subtitle,
  title,
}: ActivityItemProps) {
  return (
    <article className="grid gap-3 rounded-lg border border-[#bcbcbc] bg-white p-3 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-(--brand-blue-300) sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center md:grid-cols-[120px_minmax(0,1fr)_144px]">
      <div className="relative h-19 overflow-hidden rounded-md bg-[#e9e9e9] sm:h-[58px]">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 120px, (min-width: 640px) 112px, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="max-w-[280px] text-[15px] font-extrabold leading-[1.28] text-black">
          {title}
        </h3>
        <p className="mt-2 text-[12px] font-medium text-[#717171]">{subtitle}</p>
      </div>
      <ProgressBar className="sm:col-span-2 md:col-span-1" progress={progress} />
    </article>
  );
}

type ProgressOverviewProps = {
  className?: string;
  completed: string;
  courses: string;
  labels?: {
    completed: string;
    courses: string;
    learningTime: string;
  };
  learningTime: string;
  role: Exclude<DashboardRole, "admin">;
  value: number;
};

export function ProgressOverview({
  className,
  completed,
  courses,
  labels,
  learningTime,
  role,
  value,
}: ProgressOverviewProps) {
  const resolvedLabels = labels ?? progressLabels[role];

  return (
    <aside
      className={cn("rounded-lg border border-[#c8c8c8] bg-white p-4", className)}
    >
      <h2 className="text-[17px] font-extrabold leading-tight text-black">
        Progress Overview
      </h2>
      <div className="mt-4">
        <ProgressRing value={value} />
      </div>
      <div className="mt-5 space-y-4">
        <ProgressInfo
          icon={BookOpen}
          label={resolvedLabels.courses}
          value={courses}
        />
        <ProgressInfo
          icon={CheckCircle2}
          label={resolvedLabels.completed}
          value={completed}
        />
        <ProgressInfo
          icon={Clock3}
          label={resolvedLabels.learningTime}
          value={learningTime}
        />
      </div>
    </aside>
  );
}

type QuickAction = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  primary?: boolean;
};

type QuickActionsProps = {
  actions: QuickAction[];
  className?: string;
  title?: string;
};

export function QuickActions({
  actions,
  className,
  title = "Quick Actions",
}: QuickActionsProps) {
  return (
    <aside
      className={cn("rounded-lg border border-[#c8c8c8] bg-white p-4", className)}
    >
      <h2 className="text-[17px] font-extrabold leading-tight text-black">
        {title}
      </h2>
      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3 sm:mt-7">
        {actions.map(({ icon: Icon, label, primary }) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] border px-3 text-[13px] font-extrabold transition-all duration-300 ease-in-out hover:-translate-y-0.5",
              primary
                ? "border-(--brand-blue-500) bg-(--brand-blue-500) text-white shadow-[0_12px_22px_rgba(37,99,235,0.25)] hover:bg-(--brand-blue-400)"
                : "border-[#b7b7b7] bg-white text-[#3b3b3b] hover:border-(--brand-blue-400) hover:text-(--brand-blue-500)",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}

type StatCardProps = {
  label: string;
  period: string;
  trend: string;
  value: string;
};

export function StatCard({ label, period, trend, value }: StatCardProps) {
  return (
    <article className="rounded-lg bg-white px-4 py-5 text-center shadow-[0_5px_8px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(0,0,0,0.13)]">
      <p className="text-[29px] font-extrabold leading-tight tracking-[0.02em] text-black">
        {value}
      </p>
      <h3 className="mt-3 text-[15px] font-extrabold text-[#1d1d1d]">{label}</h3>
      <p className="mt-3 text-[15px] font-extrabold text-black">{trend}</p>
      <p className="mt-3 text-[13px] font-medium text-[#333]">{period}</p>
    </article>
  );
}

type AdminMetric = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  meta: string;
  trend?: string;
};

type AdminMetricsProps = {
  metrics: readonly AdminMetric[];
};

export function AdminMetrics({ metrics }: AdminMetricsProps) {
  return (
    <section className="rounded-lg bg-[#f2f2f2] px-4 py-4">
      <div className="space-y-5">
        {metrics.map(({ icon: Icon, label, meta, trend }, index) => (
          <div key={label}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-2">
                <Icon className="mt-0.5 h-5 w-5 text-[#222]" />
                <div>
                  <h3 className="text-[17px] font-extrabold leading-tight text-[#171717]">
                    {label}
                  </h3>
                  <p className="mt-3 pl-1 text-[13px] font-medium text-[#5e5e5e]">
                    {meta}
                  </p>
                </div>
              </div>
              {trend ? (
                <span className="text-[13px] font-extrabold text-[#10d51e]">
                  {trend}
                </span>
              ) : null}
            </div>
            {index < metrics.length - 1 ? (
              <div className="mt-7 h-px bg-[#6f6f6f]" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgressBar({
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
      <span className="text-[12px] font-medium text-[#8a8a8a]">
        {progress}%
      </span>
    </div>
  );
}

function ProgressInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 h-4 w-4 text-[#121212]" />
      <div>
        <p className="text-[15px] font-extrabold leading-tight text-black">
          {value}
        </p>
        <p className="mt-2 text-[10px] font-medium text-[#2d2d2d]">{label}</p>
      </div>
    </div>
  );
}
