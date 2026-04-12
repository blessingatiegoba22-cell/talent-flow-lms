import { TeamCard } from "@/components/shared/cards/TeamCard";
import { TeamTable } from "@/components/shared/tables/TeamTable";
import { MY_TEAM_MEMBERS, TEAMS } from "@/constants/dashboard";

export default function TeamsPage() {
  return (
    <div className="max-w-9xl space-y-12">
      <header>
        <h1 className="text-3xl font-black text-gray-900">Teams</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Teams in the current cohort</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAMS.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      <section className="pt-10">
        <header className="mb-6">
          <h2 className="text-xl font-black text-gray-900">My Team - Team Lima</h2>
          <p className="text-sm text-gray-400 font-medium mt-0.5">Team members and roles</p>
        </header>

        <TeamTable members={MY_TEAM_MEMBERS} />
      </section>
    </div>
  );
}