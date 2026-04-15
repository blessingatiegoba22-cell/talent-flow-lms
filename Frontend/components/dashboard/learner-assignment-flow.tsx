"use client";

import { useRouter } from "next/navigation";

import { AssignmentCard } from "@/components/dashboard/learner-assignment-widgets";
import { assignments } from "@/data/dashboard";

const recentAssignmentDetailsHref = "/learner/assignments/view?assignment=recent";
const recentAssignmentSubmissionHref =
  "/learner/assignments/submit?assignment=recent";
const completedAssignmentDetailsHref =
  "/learner/assignments/view?assignment=completed";

export function LearnerAssignmentFlow() {
  const router = useRouter();

  return (
    <>
      <div className="mt-7 sm:mt-9">
        <h2 className="mb-4 text-[22px] font-extrabold leading-tight text-black sm:mb-6 sm:text-[25px]">
          Recent
        </h2>
        <AssignmentCard
          assignment={assignments.recent}
          onSubmit={() => router.push(recentAssignmentSubmissionHref)}
          onView={() => router.push(recentAssignmentDetailsHref)}
        />
      </div>

      <div className="mt-8 sm:mt-10">
        <h2 className="mb-4 text-[22px] font-extrabold leading-tight text-black sm:mb-5 sm:text-[25px]">
          Completed
        </h2>
        <AssignmentCard
          assignment={assignments.completed}
          completed
          onView={() => router.push(completedAssignmentDetailsHref)}
        />
      </div>
    </>
  );
}
