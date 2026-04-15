import type { Metadata } from "next";

import { TeamMembersTable } from "@/components/dashboard/learner-team-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import { TeamSummaryCard } from "@/components/dashboard/team-components";
import { teamCards, teamMembers } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Teams",
  description:
    "View cohort teams, team members, and assigned learner roles on Talent Flow LMS.",
};

export default function LearnerTeamsPage() {
  return (
    <div className="mx-auto max-w-280 animate-fade-up">
      <DashboardPageHeader
        title="Teams"
        description="Teams in the current cohort"
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {teamCards.map((team) => (
          <TeamSummaryCard key={team.name} team={team} />
        ))}
      </div>

      <TeamMembersTable members={teamMembers} />
    </div>
  );
}
