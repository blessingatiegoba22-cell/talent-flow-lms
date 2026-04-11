import { cn } from "@/lib/utils";

export const TeamTable = ({ members }: { members: any[] }) => (
  <div className="mt-10 overflow-hidden">
    <table className="w-full text-left">
      <thead>
        <tr className="text-sm font-bold text-gray-900 border-b border-gray-100">
          <th className="pb-4">Intern</th>
          <th className="pb-4">Skill</th>
          <th className="pb-4">Role</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {members.map((member) => (
          <tr key={member.id} className="group hover:bg-gray-50/50 transition-colors">
            <td className="py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=precious" alt={member.name} />
              </div>
              <span className="font-bold text-gray-900">{member.name}</span>
            </td>
            <td className="py-4 text-sm text-gray-600 font-medium">
              {member.skill}
            </td>
            <td className="py-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                member.role === "Team Lead" ? "bg-gray-100 text-gray-900" : "bg-gray-50 text-gray-500"
              )}>
                {member.role}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);