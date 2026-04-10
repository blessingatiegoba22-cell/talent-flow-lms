import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type RecoveryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function RecoveryButton({ className, ...props }: RecoveryButtonProps) {
  return (
    <button
      className={cn(
        "h-14 w-full transform-gpu cursor-pointer rounded-[6px] bg-[var(--brand-blue-500)] text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(37,99,235,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)] hover:shadow-[0_22px_38px_rgba(37,99,235,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.25)]",
        className,
      )}
      {...props}
    />
  );
}
