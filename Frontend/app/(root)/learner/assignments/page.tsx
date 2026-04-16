import type { Metadata } from "next";

import { AssignmentProgressCard } from "@/components/dashboard/learner-assignment-widgets";
import { LearnerAssignmentFlow } from "@/components/dashboard/learner-assignment-flow";
import { LearnerAssignmentDescription } from "@/components/dashboard/learner-user-copy";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";

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
          description={<LearnerAssignmentDescription />}
          descriptionClassName="text-black"
        />

        <LearnerAssignmentFlow />
      </section>

      <div className="lg:pt-[122px]">
        <AssignmentProgressCard />
      </div>
    </div>
  );
}
