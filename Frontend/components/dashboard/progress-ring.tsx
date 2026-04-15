type ProgressRingProps = {
  label?: string;
  value: number;
};

export function ProgressRing({ label = "Overall progress", value }: ProgressRingProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative mx-auto h-[132px] w-[132px]">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 132 132">
        <circle
          cx="66"
          cy="66"
          fill="none"
          r={radius}
          stroke="#f4f2ff"
          strokeWidth="11"
        />
        <circle
          cx="66"
          cy="66"
          fill="none"
          r={radius}
          stroke="#4328b7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          strokeWidth="11"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[21px] font-extrabold leading-tight">{value}%</p>
        <p className="mt-1 text-[10px] font-medium text-[#2d2d2d]">{label}</p>
      </div>
    </div>
  );
}
