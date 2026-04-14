"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, LoaderCircle, LogOut, Trash2 } from "lucide-react";

import { useAuthSessionStore } from "@/lib/auth-store";
import { signOutRedirectHref } from "@/lib/routes";
import { simulatedActionDelayMs } from "@/lib/timing";
import { cn } from "@/lib/utils";

const actionButtonClass =
  "inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-[#d1d1d1] bg-white px-4 py-2 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-300 hover:border-(--brand-blue-400) hover:text-(--brand-blue-600) disabled:cursor-not-allowed disabled:opacity-70";

export function AccountSecurityActions() {
  const router = useRouter();
  const signOut = useAuthSessionStore((state) => state.signOut);
  const [isSigningOut, setIsSigningOut] = useState(false);

  function handleSignOut() {
    setIsSigningOut(true);

    window.setTimeout(() => {
      signOut();
      router.push(signOutRedirectHref);
    }, simulatedActionDelayMs);
  }

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Link href="/learner/certificate" className={actionButtonClass}>
          <CreditCard
            className="h-4 w-4 text-(--brand-blue-500)"
            aria-hidden="true"
          />
          View Certificate
        </Link>
        <button
          type="button"
          className={cn(
            actionButtonClass,
            "text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600",
          )}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete my account
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={actionButtonClass}
        >
          {isSigningOut ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="h-4 w-4" aria-hidden="true" />
          )}
          {isSigningOut ? "Signing out..." : "Logout"}
        </button>
      </div>
      {isSigningOut ? (
        <p className="mt-3 text-[13px] font-semibold text-[#5f5f5f]" aria-live="polite">
          Closing this session and taking you back to sign in.
        </p>
      ) : null}
    </div>
  );
}
