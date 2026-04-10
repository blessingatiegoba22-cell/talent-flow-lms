import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  className?: string;
};

export function AuthShell({
  backHref,
  backLabel = "Go back",
  children,
  className,
}: AuthShellProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-hidden bg-[var(--brand-blue-950)] text-[var(--neutral-50)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_36%)]" />

      {backHref ? (
        <Link
          href={backHref}
          aria-label={backLabel}
          className="absolute left-5 top-6 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white/85 transition-all duration-300 ease-in-out hover:-translate-x-1 hover:bg-white/8 hover:text-white sm:left-10 lg:left-[72px]"
        >
          <ArrowLeft className="h-7 w-7" aria-hidden="true" />
        </Link>
      ) : null}

      <div className="relative z-10">{children}</div>
    </main>
  );
}
