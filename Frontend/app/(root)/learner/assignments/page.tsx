import type { Metadata } from "next";

import {
  AssignmentCard,
  AssignmentProgressCard,
} from "@/components/dashboard/learner-widgets";
import { assignments } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Assignments",
  description:
    "Manage recent and completed learner assignments on Talent Flow LMS.",
};

export default function LearnerAssignmentsPage() {
  return (
    <div className="mx-auto grid max-w-[1040px] items-start gap-6 animate-fade-up lg:grid-cols-[minmax(0,1fr)_390px]">
      <section>
        <h1 className="text-[32px] font-extrabold leading-tight text-black sm:text-[36px]">
          Assignments
        </h1>
        <p className="mt-4 text-[15px] font-medium text-black">
          Hi, Samuel Manage your assignments and projects here
        </p>

        <div className="mt-9">
          <h2 className="mb-6 text-[25px] font-extrabold leading-tight text-black">
            Recent
          </h2>
          <AssignmentCard assignment={assignments.recent} />
        </div>

        <div className="mt-10">
          <h2 className="mb-5 text-[25px] font-extrabold leading-tight text-black">
            Completed
          </h2>
          <AssignmentCard assignment={assignments.completed} completed />
        </div>
      </section>

      <div className="lg:pt-[122px]">
        <AssignmentProgressCard />
      </div>
    </div>
  );
}
