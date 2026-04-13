import type { Metadata } from "next";

import {
  AssignmentCard,
  AssignmentProgressCard,
} from "@/components/dashboard/learner-assignment-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
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
        <DashboardPageHeader
          title="Assignments"
          description="Hi, Samuel Manage your assignments and projects here"
          descriptionClassName="text-black"
        />

        <div className="mt-7 sm:mt-9">
          <h2 className="mb-4 text-[22px] font-extrabold leading-tight text-black sm:mb-6 sm:text-[25px]">
            Recent
          </h2>
          <AssignmentCard assignment={assignments.recent} />
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="mb-4 text-[22px] font-extrabold leading-tight text-black sm:mb-5 sm:text-[25px]">
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
