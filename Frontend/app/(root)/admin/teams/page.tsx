import type { Metadata } from "next";

import {
  TeamAllocationTable,
  TeamSummaryCard,
} from "@/components/dashboard/team-components";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import { adminTeamAssignments, teamCards } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Team Allocation",
  description: "Assign interns to teams and manage admin team allocations.",
};

export default function AdminTeamsPage() {
  return (
    <div className="mx-auto max-w-280 animate-fade-up">
      <DashboardPageHeader
        title="Team Allocation"
        description="Manage team assignments and member allocation"
        titleClassName="text-[30px]"
        descriptionClassName="text-[15px] leading-normal text-[#999] sm:text-[16px]"
      />

      <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {teamCards.map((team) => (
          <TeamSummaryCard key={team.name} team={team} />
        ))}
      </section>

      <TeamAllocationTable assignments={adminTeamAssignments} />
    </div>
  );
}
