import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthFieldProps = ComponentPropsWithoutRef<"input"> & {
  icon: LucideIcon;
  label: string;
  suffix?: ReactNode;
};

export function AuthField({
  className,
  icon: Icon,
  label,
  suffix,
  ...props
}: AuthFieldProps) {
  return (
    <div className="relative block">
      <span className="sr-only">{label}</span>
      <Icon
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6d6d6d]"
        aria-hidden="true"
      />
      <input
        aria-label={label}
        className={cn(
          "h-10 w-full rounded-[4px] border border-transparent bg-[#f4f4f4] py-2 pl-11 text-[13px] font-semibold text-[#2f2f2f] outline-none transition duration-300 placeholder:text-[#777] focus:border-[var(--brand-blue-300)] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]",
          suffix ? "pr-32" : "pr-4",
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
