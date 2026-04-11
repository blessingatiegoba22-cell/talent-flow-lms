import type { Metadata } from "next";

import { TeamCard, TeamMembersTable } from "@/components/dashboard/learner-widgets";
import { teamCards, teamMembers } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Teams",
  description:
    "View cohort teams, team members, and assigned learner roles on Talent Flow LMS.",
};

export default function LearnerTeamsPage() {
  return (
    <div className="mx-auto max-w-[1120px] animate-fade-up">
      <h1 className="text-[32px] font-extrabold leading-tight text-black sm:text-[36px]">
        Teams
      </h1>
      <p className="mt-4 text-[15px] font-medium text-[#8a8a8a]">
        Teams in the current cohort
      </p>

      <div className="mt-6 flex gap-7 overflow-x-auto pb-3">
        {teamCards.map((team) => (
          <TeamCard key={team.name} team={team} />
        ))}
      </div>

      <TeamMembersTable members={teamMembers} />
    </div>
  );
}
