import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  UsersRound,
} from "lucide-react";

import type { Assignment } from "@/components/dashboard/learner-assignment-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import { assignments } from "@/data/dashboard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "View Assignment",
  description: "Review a learner assignment brief on Talent Flow LMS.",
};

type AssignmentKey = keyof typeof assignments;

type AssignmentViewPageProps = {
  searchParams?: Promise<{
    assignment?: string | string[];
  }>;
};

export default async function AssignmentViewPage({
  searchParams,
}: AssignmentViewPageProps) {
  const params = await searchParams;
  const assignmentKey = getAssignmentKey(params?.assignment);
  const assignment: Assignment = assignments[assignmentKey];
  const canSubmit = !assignment.status;

  const details = [
    {
      icon: BookOpen,
      label: "Course",
      value: assignment.course,
      valueClassName: "text-(--brand-blue-900)",
    },
    {
      icon: ClipboardList,
      label: "Timeline",
      value: assignment.timeline,
      valueClassName: "text-(--brand-blue-900)",
    },
    { icon: UsersRound, label: "Topic", value: assignment.topic },
    { icon: CalendarDays, label: "Posted", value: assignment.posted },
    { icon: CalendarDays, label: "Due", value: assignment.due },
    {
      icon: CheckCircle2,
      label: "Grade",
      value: assignment.grade ?? "Nil (x/100 points)",
    },
    {
      icon: CheckCircle2,
      label: "Status",
      value: assignment.status ?? "Nil",
    },
  ];

  return (
    <div className="mx-auto max-w-[1040px] animate-fade-up">
      <Link
        href="/learner/assignments"
        className="inline-flex h-10 items-center rounded-lg border border-[#c6d2e6] px-4 text-[14px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-500) hover:text-(--brand-blue-600)"
      >
        Back to Assignments
      </Link>

      <DashboardPageHeader
        className="mt-5"
        title="Assignment Details"
        description="Review the brief, deadlines, status, and instruction before submitting your work."
        descriptionClassName="max-w-[680px] text-black"
      />

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border border-[#d6dfef] bg-white p-5 shadow-[0_10px_28px_rgba(7,20,47,0.08)] sm:p-6">
          <h2 className="text-[20px] font-extrabold leading-tight text-black">
            Brief
          </h2>

          <dl className="mt-5 grid gap-3">
            {details.map(({ icon: Icon, label, value, valueClassName }) => (
              <div
                key={label}
                className="grid gap-2 rounded-lg bg-[#eef3fb] p-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center"
              >
                <dt className="flex items-center gap-3 text-[15px] font-extrabold text-black">
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {label}
                </dt>
                <dd
                  className={cn(
                    "break-words text-[15px] font-extrabold leading-[1.45] text-black sm:text-[16px]",
                    valueClassName,
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="rounded-lg bg-[#eef4ff] p-5">
          <p className="text-[13px] font-extrabold uppercase text-(--brand-blue-800)">
            {canSubmit ? "Pending Submission" : "Completed Assignment"}
          </p>
          <h3 className="mt-2 text-[21px] font-extrabold leading-tight text-black">
            {assignment.topic}
          </h3>
          <p className="mt-4 text-[14px] font-semibold leading-[1.55] text-[#333]">
            Due {assignment.due}
          </p>
          {canSubmit ? (
            <Link
              href="/learner/assignments/submit?assignment=recent"
              className="mt-6 flex h-12 items-center justify-center rounded-lg bg-(--brand-blue-700) px-5 text-[15px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-500)"
            >
              Submit Assignment
            </Link>
          ) : null}
        </aside>
      </div>

      <section className="mt-6 rounded-lg border border-[#d6dfef] bg-white p-5 shadow-[0_10px_28px_rgba(7,20,47,0.08)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f0ff] text-(--brand-blue-700)">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[20px] font-extrabold leading-tight text-black">
              Instruction
            </h2>
            <p className="mt-3 text-[16px] font-semibold leading-[1.7] text-black">
              {assignment.instruction}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function getAssignmentKey(
  assignmentParam: string | string[] | undefined,
): AssignmentKey {
  const value = Array.isArray(assignmentParam)
    ? assignmentParam[0]
    : assignmentParam;

  return value === "completed" ? "completed" : "recent";
}
