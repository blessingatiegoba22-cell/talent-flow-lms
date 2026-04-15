import { BookOpen, CheckCircle2, Clock } from "lucide-react";

const ProgressOverview = () => (
  <div className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 self-start mb-8">Progress Overview</h3>
    
    <div className="relative w-40 h-40 mb-8">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#312e81" strokeWidth="10" 
                strokeDasharray="282.7" strokeDashoffset="90" strokeLinecap="round" className="rotate-[-90deg] origin-center" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black">68%</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Overall progress</span>
      </div>
    </div>

    <div className="w-full space-y-4">
      {[
        { icon: BookOpen, label: "Total Assignment", count: 12 },
        { icon: CheckCircle2, label: "Completed", count: 8 },
        { icon: Clock, label: "Pending", count: 4 },
      ].map((stat, i) => (
        <div key={i} className="flex items-center gap-4">
          <stat.icon size={20} className="text-slate-400" />
          <div>
            <p className="text-sm font-black leading-none">{stat.count}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProgressOverview;