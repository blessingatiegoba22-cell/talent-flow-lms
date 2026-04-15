import type { Metadata } from "next";
import Link from "next/link";

import { LearnerAssignmentSubmitForm } from "@/components/dashboard/learner-assignment-submit-form";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import { assignments } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Submit Assignment",
  description: "Submit a learner assignment on Talent Flow LMS.",
};

type AssignmentSubmitPageProps = {
  searchParams?: Promise<{
    assignment?: string | string[];
  }>;
};

export default async function AssignmentSubmitPage({
  searchParams,
}: AssignmentSubmitPageProps) {
  const params = await searchParams;
  const assignment =
    getAssignmentKey(params?.assignment) === "completed"
      ? assignments.completed
      : assignments.recent;

  return (
    <div className="mx-auto max-w-[1040px] animate-fade-up">
      <Link
        href="/learner/assignments/view?assignment=recent"
        className="inline-flex h-10 items-center rounded-lg border border-[#c6d2e6] px-4 text-[14px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-500) hover:text-(--brand-blue-600)"
      >
        Back to Details
      </Link>

      <DashboardPageHeader
        className="mt-5"
        title="Submit Assignment"
        description="Paste your submission details, attach your file, and send your work to the instructor."
        descriptionClassName="max-w-[680px] text-black"
      />

      <LearnerAssignmentSubmitForm assignment={assignment} />
    </div>
  );
}

function getAssignmentKey(assignmentParam: string | string[] | undefined) {
  const value = Array.isArray(assignmentParam)
    ? assignmentParam[0]
    : assignmentParam;

  return value === "completed" ? "completed" : "recent";
}
