import type { ComponentPropsWithoutRef } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type RecoveryInputProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  icon?: LucideIcon;
  label: string;
};

export function RecoveryInput({
  className,
  error,
  icon: Icon,
  label,
  name,
  "aria-describedby": ariaDescribedBy,
  ...props
}: RecoveryInputProps) {
  const errorId = name ? `${name}-error` : undefined;

  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#1f1f1f] sm:left-5 sm:size-[22px]"
            aria-hidden="true"
          />
        ) : null}
        <input
          aria-describedby={error ? errorId : ariaDescribedBy}
          aria-invalid={error ? "true" : "false"}
          aria-label={label}
          name={name}
          className={cn(
            "h-12 w-full rounded-md border border-transparent bg-[#f4f4f4] px-4 text-[14px] font-bold text-[#202020] outline-none transition-all duration-300 ease-in-out placeholder:text-[#858585] focus:border-(--brand-blue-300) focus:ring-4 focus:ring-[rgba(37,99,235,0.18)] sm:h-14 sm:px-5 sm:text-[16px]",
            Icon ? "pl-11 sm:pl-12" : "",
            error &&
              "border-red-300 bg-white focus:border-red-300 focus:ring-red-200/45",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-left text-[12px] font-semibold text-red-100">
          {error}
        </p>
      ) : null}
    </label>
  );
}
