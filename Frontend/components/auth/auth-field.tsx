import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthFieldProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  icon: LucideIcon;
  label: string;
  suffix?: ReactNode;
};

export function AuthField({
  className,
  error,
  icon: Icon,
  label,
  name,
  suffix,
  "aria-describedby": ariaDescribedBy,
  ...props
}: AuthFieldProps) {
  const errorId = name ? `${name}-error` : undefined;

  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6d6d6d]"
          aria-hidden="true"
        />
        <input
          aria-describedby={error ? errorId : ariaDescribedBy}
          aria-invalid={error ? "true" : "false"}
          aria-label={label}
          name={name}
          className={cn(
            "h-10 w-full rounded-sm border border-transparent bg-[#f4f4f4] py-2 pl-11 text-[13px] font-semibold text-[#2f2f2f] outline-none transition duration-300 placeholder:text-[#777] focus:border-(--brand-blue-300) focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]",
            suffix ? "pr-32" : "pr-4",
            error &&
              "border-red-300 bg-white focus:border-red-300 focus:ring-red-200/45",
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
      {error ? (
        <p id={errorId} className="mt-1.5 text-left text-[11px] font-semibold text-red-100">
          {error}
        </p>
      ) : null}
    </label>
  );
}
