import { cn } from "@/lib/utils";

const ParticipantItem = ({ user }: any) => (
  <div className="flex items-center gap-3 py-3 group cursor-pointer">
    <div className="relative">
      <div className="w-11 h-11 rounded-full overflow-hidden">
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      </div>
      <div className={cn(
        "absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full",
        user.status === 'online' ? "bg-green-500" : user.status === 'away' ? "bg-orange-500" : "bg-slate-300"
      )} />
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</h4>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{user.role}</p>
    </div>
  </div>
);

export default ParticipantItem;