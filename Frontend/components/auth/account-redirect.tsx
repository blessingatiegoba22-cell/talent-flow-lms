import Link from "next/link";

import { cn } from "@/lib/utils";

type AccountRedirectProps = {
  className?: string;
  label?: string;
  linkLabel?: string;
  href?: string;
};

export function AccountRedirect({
  className,
  label = "Already have an account",
  linkLabel = "login",
  href = "/sign-in",
}: AccountRedirectProps) {
  return (
    <div
      className={cn(
        "mx-auto flex h-10 w-full max-w-[300px] items-center justify-between rounded-[4px] bg-white px-4 text-[13px] font-bold text-[#2f2f2f] shadow-[0_14px_30px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <span>{label}</span>
      <Link
        href={href}
        className="cursor-pointer text-[var(--brand-blue-700)] transition-colors duration-300 ease-in-out hover:text-[var(--brand-blue-500)]"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
