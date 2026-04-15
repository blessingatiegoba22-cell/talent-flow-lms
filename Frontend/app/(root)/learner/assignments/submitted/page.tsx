import type { Metadata } from "next";

import { LearnerAssignmentSuccess } from "@/components/dashboard/learner-assignment-success";

export const metadata: Metadata = {
  title: "Assignment Submitted",
  description: "Assignment submission confirmation on Talent Flow LMS.",
};

export default function AssignmentSubmittedPage() {
  return <LearnerAssignmentSuccess />;
}
