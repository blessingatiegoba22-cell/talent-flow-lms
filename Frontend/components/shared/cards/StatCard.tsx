import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  period: string;
}

const StatCard = ({ label, value, change, period }: StatCardProps) => {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
      <span className="text-display-md font-bold text-foreground">{value}</span>
      <span className="text-ink-300 font-medium mt-1">{label}</span>
      <div className="mt-4 flex flex-col items-center">
        <span className="text-primary font-bold">{change}</span>
        <span className="text-xs text-ink-100">{period}</span>
      </div>
    </div>
  );
};

export default StatCard;