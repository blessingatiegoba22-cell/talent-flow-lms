import { Users } from "lucide-react";

export const TeamCard = ({ team }: { team: any }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
      <div className={`w-2 h-2 rounded-full ${team.color}`} />
    </div>
    
    <div className="flex items-center gap-3 mb-6">
      <div className="flex -space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
             <img src={`https://i.pravatar.cc/150?u=${team.id + i}`} alt="member" />
          </div>
        ))}
      </div>
      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
        <Users size={14} /> {team.membersCount} members
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {team.tags.map((tag: string) => (
        <span key={tag} className="px-3 py-1.5 bg-gray-50 text-[11px] font-bold text-gray-700 rounded-md">
          {tag}
        </span>
      ))}
    </div>
  </div>
);