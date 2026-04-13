import { BookOpen, CalendarDays, CheckCircle2, UsersRound } from "lucide-react";

import { ProgressOverview } from "@/components/dashboard/dashboard-widgets";
import { assignmentProgress } from "@/data/dashboard";
import { cn } from "@/lib/utils";

type Assignment = {
  course: string;
  due: string;
  grade?: string;
  posted: string;
  status?: string;
  timeline: string;
  topic: string;
};

export function AssignmentCard({
  assignment,
  completed = false,
}: {
  assignment: Assignment;
  completed?: boolean;
}) {
  const rows = [
    { icon: BookOpen, label: "Course:", value: assignment.course },
    { icon: BookOpen, label: "Timeline:", value: assignment.timeline },
    { icon: UsersRound, label: "Topic:", value: assignment.topic },
    { icon: CalendarDays, label: "Posted:", value: assignment.posted },
    { icon: CalendarDays, label: "Due:", value: assignment.due },
    ...(completed
      ? [
          {
            icon: CheckCircle2,
            label: "Status:",
            value: assignment.status ?? "",
          },
          {
            icon: CheckCircle2,
            label: "Grade:",
            value: assignment.grade ?? "",
          },
        ]
      : []),
  ];

  return (
    <article
      className={cn(
        "rounded-lg p-2.5 shadow-[0_5px_8px_rgba(0,0,0,0.16)] sm:p-3",
        completed ? "bg-[#f8f8f8]" : "bg-[#ecf2ff]",
      )}
    >
      <div className="grid gap-1">
        {rows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="grid gap-1 sm:grid-cols-[minmax(130px,170px)_1fr]"
          >
            <div className="flex items-center gap-2 bg-white/45 px-3 py-2.5 text-[14px] font-extrabold text-black sm:gap-3 sm:py-3 sm:text-[16px] lg:text-[18px]">
              <Icon
                className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
              {label}
            </div>
            <div
              className={cn(
                "break-words bg-white/38 px-3 py-2.5 text-[14px] font-extrabold text-black sm:py-3 sm:text-[16px] lg:text-[18px]",
                value === assignment.course || value === assignment.timeline
                  ? "text-(--brand-blue-950)"
                  : "",
              )}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="h-12 cursor-pointer rounded-lg bg-(--brand-blue-700) text-[14px] font-extrabold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-(--brand-blue-500) sm:h-14 sm:text-[16px]"
        >
          View
        </button>
        {!completed ? (
          <button
            type="button"
            className="h-12 cursor-pointer rounded-lg border border-black bg-transparent text-[14px] font-extrabold text-black transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-(--brand-blue-500) hover:text-(--brand-blue-500) sm:h-14 sm:text-[16px]"
          >
            Submit
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function AssignmentProgressCard() {
  return (
    <ProgressOverview
      role="learner"
      value={assignmentProgress.value}
      courses={assignmentProgress.total}
      completed={assignmentProgress.completed}
      learningTime={assignmentProgress.pending}
      labels={{
        completed: "Completed",
        courses: "Total Assignment",
        learningTime: "Pending",
      }}
    />
  );
}
