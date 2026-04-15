"use client";

import { LearnerErrorState } from "@/components/dashboard/learner-error-state";

type LearnerErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LearnerError({ error, reset }: LearnerErrorProps) {
  return <LearnerErrorState error={error} reset={reset} />;
}
