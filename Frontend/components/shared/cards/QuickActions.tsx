import React from 'react';
import { PlayCircle, ClipboardList, MessageSquare, TrendingUp } from 'lucide-react';
import ActionButton from '../buttons/ActionButton';

const QuickActions = () => {
  return (
    <section className="bg-card p-8 rounded-[4px] border border-border shadow-sm">
      <h2 className="text-lg font-bold text-foreground mb-6">Quick Actions</h2>
      <div className="space-y-3">
        <ActionButton icon={PlayCircle} label="Browse Courses" variant="primary" />
        <ActionButton icon={ClipboardList} label="View Assignment" />
        <ActionButton icon={MessageSquare} label="Join Discussion" />
        <ActionButton icon={TrendingUp} label="Track Progress" />
      </div>
    </section>
  );
};

export default QuickActions;