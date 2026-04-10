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
          className="pointer-events-none absolute left-5 top-1/2 h-[22px] w-[22px] -translate-y-1/2 text-[#1f1f1f]"
          aria-hidden="true"
        />
      ) : null}
      <input
        aria-label={label}
        className={cn(
          "h-14 w-full rounded-[6px] border border-transparent bg-[#f4f4f4] px-5 text-[16px] font-bold text-[#202020] outline-none transition-all duration-300 ease-in-out placeholder:text-[#858585] focus:border-[var(--brand-blue-300)] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]",
          Icon ? "pl-12" : "",
          className,
        )}
        {...props}
      />
    </div>
  );
}
