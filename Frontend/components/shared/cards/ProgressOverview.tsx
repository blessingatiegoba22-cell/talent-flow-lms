import React from 'react';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
}

const StatItem = ({ icon: Icon, value, label }: StatItemProps) => (
  <div className="flex items-center gap-4">
    <div className="p-2 bg-neutral-200 rounded-lg">
      <Icon className="w-5 h-5 text-ink-300" />
    </div>
    <div>
      <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
      <p className="text-xs text-ink-200">{label}</p>
    </div>
  </div>
);

const ProgressOverview = () => {
  const percentage = 68;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <section className="bg-card p-8 rounded-[4px] border border-border shadow-sm">
      <h2 className="text-lg font-bold text-foreground mb-8">Progress Overview</h2>
      
      <div className="relative w-32 h-32 mx-auto mb-10 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-neutral-300" />
          <circle 
            cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" 
            strokeDasharray={circumference} 
            style={{ strokeDashoffset: offset }}
            className="text-primary transition-all duration-1000 ease-out" 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-foreground">{percentage}%</span>
          <span className="text-[10px] text-ink-200 uppercase tracking-wider text-center font-medium leading-tight">
            Overall<br/>progress
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <StatItem icon={BookOpen} value={12} label="Courses Enrolled" />
        <StatItem icon={CheckCircle2} value={8} label="Completed" />
        <StatItem icon={Clock} value="24h 30m" label="Total Learning Time" />
      </div>
    </section>
  );
};

export default ProgressOverview;