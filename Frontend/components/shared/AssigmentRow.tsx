import { cn } from "@/lib/utils";

const AssignmentRow = ({ label, value, icon: Icon, isLast }: { label: string, value: string, icon: any, isLast?: boolean }) => (
  <div className={cn(
    "flex items-center text-sm",
    !isLast && "border-b border-white/50"
  )}>
    <div className="w-32 md:w-40 flex items-center gap-3 p-4 bg-blue-50/50 text-slate-700 font-bold border-r border-white/50">
      <Icon size={18} className="text-slate-500" />
      <span>{label}:</span>
    </div>
    <div className="flex-1 p-4 font-bold text-slate-900 bg-blue-50/20">
      {value}
    </div>
  </div>
);

export default AssignmentRow;