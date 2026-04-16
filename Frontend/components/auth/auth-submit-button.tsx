import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  loadingLabel: string;
};

export function AuthSubmitButton({
  children,
  className,
  disabled,
  isLoading = false,
  loadingLabel,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-[42px] w-full transform-gpu cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-(--brand-blue-500) text-[13px] font-bold text-white shadow-[0_18px_34px_rgba(37,99,235,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-(--brand-blue-400) hover:shadow-[0_22px_38px_rgba(37,99,235,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.25)] disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0 disabled:hover:bg-(--brand-blue-500)",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
