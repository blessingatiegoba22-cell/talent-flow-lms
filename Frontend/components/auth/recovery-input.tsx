import type { ComponentPropsWithoutRef } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type RecoveryInputProps = ComponentPropsWithoutRef<"input"> & {
  icon?: LucideIcon;
  label: string;
};

export function RecoveryInput({
  className,
  icon: Icon,
  label,
  ...props
}: RecoveryInputProps) {
  return (
    <div className="relative">
      <span className="sr-only">{label}</span>
      {Icon ? (
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1f1f1f] sm:left-5 sm:h-[22px] sm:w-[22px]"
          aria-hidden="true"
        />
      ) : null}
      <input
        aria-label={label}
        className={cn(
          "h-12 w-full rounded-[6px] border border-transparent bg-[#f4f4f4] px-4 text-[14px] font-bold text-[#202020] outline-none transition-all duration-300 ease-in-out placeholder:text-[#858585] focus:border-[var(--brand-blue-300)] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)] sm:h-14 sm:px-5 sm:text-[16px]",
          Icon ? "pl-11 sm:pl-12" : "",
          className,
        )}
        {...props}
      />
    </div>
  );
}
