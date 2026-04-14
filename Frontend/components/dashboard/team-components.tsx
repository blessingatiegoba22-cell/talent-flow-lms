import Image from "next/image";
import { UsersRound } from "lucide-react";

import { AnimatedSelect } from "@/components/dashboard/animated-select";
import { cn } from "@/lib/utils";

export type TeamSummary = {
  accent: string;
  avatars?: readonly string[];
  members: string;
  name: string;
  skills: readonly string[];
};

export type TeamAssignment = {
  assignedTeam: string;
  avatar: string;
  currentTeam: string;
  currentTeamTone?: "blue" | "green" | "neutral";
  id: string;
  name: string;
  role: string;
  teamOptions: readonly string[];
};

const defaultTeamAvatars = [
  "/user-icon-1.png",
  "/user-icon-2.png",
  "/user-icon-3.png",
  "/user-icon-1.png",
] as const;

export function TeamSummaryCard({
  className,
  team,
}: {
  className?: string;
  team: TeamSummary;
}) {
  const avatars = team.avatars?.length ? team.avatars : defaultTeamAvatars;

  return (
    <article
      className={cn(
        "relative min-h-[240px] overflow-hidden rounded-lg border border-[#bcbcbc] bg-white p-5 shadow-[0_4px_7px_rgba(0,0,0,0.14)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-(--brand-blue-300) hover:shadow-[0_16px_28px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <span
        className="absolute right-5 top-6 h-3.5 w-3.5 rounded-full sm:h-4 sm:w-4"
        style={{ backgroundColor: team.accent }}
      />
      <h2 className="pr-8 text-[22px] font-medium leading-tight text-black">
        {team.name}
      </h2>

      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
        <AvatarStack avatars={avatars} label={`${team.name} members`} />
        <div className="flex items-center gap-3 text-[17px] font-medium text-[#333]">
          <UsersRound className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{team.members}</span>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {team.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-[5px] bg-[#f7f7f7] px-4 py-3 text-[15px] font-extrabold leading-none text-black"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

export function TeamAllocationTable({
  assignments,
}: {
  assignments: readonly TeamAssignment[];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-[24px] font-medium leading-tight text-black">
        Intern Assignment
      </h2>
      <p className="mt-2 text-[16px] font-medium text-[#4f4f4f]">
        Assign interns to teams or manage their current allocations
      </p>

      <div className="mt-7 hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#9b9b9b] text-[18px] font-extrabold text-black">
              <th className="pb-5 pl-1">Intern</th>
              <th className="pb-5">Role</th>
              <th className="pb-5">Current Team</th>
              <th className="pb-5">Assign Team</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr
                key={assignment.id}
                className="border-b border-[#a7a7a7]"
              >
                <td className="py-5 pl-4 pr-5">
                  <InternIdentity
                    avatar={assignment.avatar}
                    name={assignment.name}
                  />
                </td>
                <td className="px-3 py-5 text-[16px] font-medium text-[#202020]">
                  {assignment.role}
                </td>
                <td className="px-3 py-5">
                  <TeamBadge
                    label={assignment.currentTeam}
                    tone={assignment.currentTeamTone}
                  />
                </td>
                <td className="py-5 pl-3 pr-5">
                  <TeamSelect
                    defaultValue={assignment.assignedTeam}
                    options={assignment.teamOptions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4 md:hidden">
        {assignments.map((assignment) => (
          <article
            key={assignment.id}
            className="rounded-lg border border-[#c9c9c9] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          >
            <InternIdentity avatar={assignment.avatar} name={assignment.name} />
            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-4 text-[14px] font-medium text-[#252525]">
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#777]">
                  Role
                </p>
                <p className="mt-1 break-words">{assignment.role}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#777]">
                  Current Team
                </p>
                <TeamBadge
                  className="mt-2"
                  label={assignment.currentTeam}
                  tone={assignment.currentTeamTone}
                />
              </div>
              <div className="min-w-0">
                <p className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#777]">
                  Assign Team
                </p>
                <TeamSelect
                  className="max-w-none"
                  defaultValue={assignment.assignedTeam}
                  options={assignment.teamOptions}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AvatarStack({
  avatars,
  label,
}: {
  avatars: readonly string[];
  label: string;
}) {
  return (
    <div className="flex -space-x-3" aria-label={label}>
      {avatars.map((avatar, index) => (
        <span
          key={`${avatar}-${index}`}
          className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-[#f1f1f1]"
        >
          <Image
            src={avatar}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </span>
      ))}
    </div>
  );
}

function InternIdentity({ avatar, name }: { avatar: string; name: string }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#f1f1f1]">
        <Image
          src={avatar}
          alt={name}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <p className="min-w-0 truncate text-[20px] font-medium text-black">
        {name}
      </p>
    </div>
  );
}

function TeamBadge({
  className,
  label,
  tone = "neutral",
}: {
  className?: string;
  label: string;
  tone?: TeamAssignment["currentTeamTone"];
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center rounded-lg px-4 text-[15px] font-medium",
        tone === "blue" && "bg-[#f2f2ff] text-(--brand-blue-500)",
        tone === "green" && "bg-[#eaf9e9] text-[#16d52d]",
        tone === "neutral" && "bg-[#f7f7f7] text-[#333]",
        className,
      )}
    >
      {label}
    </span>
  );
}

function TeamSelect({
  className,
  defaultValue,
  options,
}: {
  className?: string;
  defaultValue: string;
  options: readonly string[];
}) {
  return (
    <AnimatedSelect
      ariaLabel="Assign team"
      buttonClassName="h-11 border-0 px-4 text-[15px] font-medium text-[#171717] shadow-none hover:bg-white hover:text-(--brand-blue-600) sm:h-12 sm:text-[16px]"
      className={cn("w-full max-w-[156px]", className)}
      defaultValue={defaultValue}
      menuClassName="z-40 min-w-[180px]"
      optionClassName="text-[14px]"
      options={options}
      placeholder={defaultValue}
    />
  );
}
