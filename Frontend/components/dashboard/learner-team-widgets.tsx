import { OptimizedImage as Image } from "@/components/shared/optimized-image";

type TeamMember = {
  avatar: string;
  name: string;
  role: string;
  skill: string;
};

export function TeamMembersTable({
  members,
}: {
  members: readonly TeamMember[];
}) {
  return (
    <section className="mt-8 max-w-[940px]">
      <h2 className="text-[20px] font-medium text-black sm:text-[22px]">
        My Team - Team Lima
      </h2>
      <p className="mt-3 text-[15px] font-medium text-[#8a8a8a]">
        Team members and roles
      </p>
      <div className="mt-6 grid gap-3 md:hidden">
        {members.map((member, index) => (
          <TeamMemberCard key={`${member.name}-${index}`} member={member} />
        ))}
      </div>
      <div className="mt-7 hidden overflow-x-auto md:block">
        <table className="w-full min-w-160 border-collapse text-left">
          <thead>
            <tr className="border-b border-[#9f9f9f] text-[16px] font-extrabold text-black">
              <th className="pb-5">Intern</th>
              <th className="pb-5">Skill</th>
              <th className="pb-5">Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={`${member.name}-${index}`}
                className="border-b border-[#9f9f9f] text-[15px] text-black"
              >
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[16px] font-medium">
                      {member.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 font-medium">{member.skill}</td>
                <td className="py-4">
                  <span className="rounded-lg bg-[#f6f6f6] px-3 py-2 font-medium">
                    {member.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="rounded-lg border border-[#d8d8d8] bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-extrabold text-black">
            {member.name}
          </h3>
          <p className="mt-1 text-[13px] font-medium text-[#666]">
            {member.skill}
          </p>
        </div>
      </div>
      <span className="mt-3 inline-flex rounded-md bg-[#f6f6f6] px-3 py-2 text-[13px] font-medium text-black">
        {member.role}
      </span>
    </article>
  );
}
