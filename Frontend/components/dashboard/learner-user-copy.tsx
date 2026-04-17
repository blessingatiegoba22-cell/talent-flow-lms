"use client";

import { useCurrentUser } from "@/components/dashboard/current-user-context";
import { getFirstName } from "@/lib/current-user";

export function LearnerDashboardGreeting({
  hasStartedLearning,
}: {
  hasStartedLearning: boolean;
}) {
  const user = useCurrentUser();
  const firstName = getFirstName(user?.name);

  return (
    <h1 className="text-[24px] font-extrabold leading-tight text-black sm:text-[29px]">
      {hasStartedLearning ? "Welcome back" : "Welcome"}, {firstName}!
    </h1>
  );
}

export function LearnerAssignmentDescription() {
  const user = useCurrentUser();
  const firstName = getFirstName(user?.name);

  return <>Hi, {firstName}. Manage your assignments and projects here.</>;
}

export function LearnerCertificateGreeting() {
  const user = useCurrentUser();
  const firstName = getFirstName(user?.name);

  return (
    <h1 className="text-[27px] font-extrabold leading-tight text-black sm:text-[32px]">
      Welcome, {firstName}!
    </h1>
  );
}
