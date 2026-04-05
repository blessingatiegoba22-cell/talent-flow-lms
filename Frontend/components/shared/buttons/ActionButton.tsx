interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  variant?: 'primary' | 'outline';
}

const ActionButton = ({ icon: Icon, label, variant = 'outline' }: ActionButtonProps) => {
  const isPrimary = variant === 'primary';
  
  return (
    <button className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition-all hover:cursor-pointer ${
      isPrimary 
      ? "bg-primary text-primary-foreground hover:bg-brand-blue-600" 
      : "bg-card text-ink-400 border border-border hover:bg-neutral-100"
    }`}>
      <Icon className={`w-5 h-5 ${isPrimary ? "text-primary-foreground" : "text-ink-100"}`} />
      {label}
    </button>
  );
};

export default ActionButton;