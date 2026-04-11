"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";

type LearnerErrorStateProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function LearnerErrorState({ error, reset }: LearnerErrorStateProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-5 py-12">
      <section className="w-full max-w-[760px] animate-fade-up rounded-[22px] border border-[#d6d6d6] bg-white p-6 text-center shadow-[0_24px_60px_rgba(7,20,47,0.12)] sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff4e5] text-[#d97706]">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-[26px] font-extrabold leading-tight text-black sm:text-[32px]">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-[560px] text-[14px] font-medium leading-relaxed text-[#686868]">
          The learner page could not finish loading. The exact error is shown
          below so it is easy to debug.
        </p>

        <div className="mt-7 rounded-[14px] border border-[#d8d8d8] bg-[#f8f8f8] p-4 text-left">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#777]">
            Error
          </p>
          <pre className="mt-3 max-h-[220px] overflow-auto whitespace-pre-wrap break-words text-[13px] font-semibold leading-relaxed text-[#171717]">
            {error.message || String(error)}
          </pre>
          {error.digest ? (
            <p className="mt-4 text-[12px] font-semibold text-[#777]">
              Digest: {error.digest}
            </p>
          ) : null}
          {error.stack ? (
            <details className="mt-4">
              <summary className="cursor-pointer text-[12px] font-extrabold text-[var(--brand-blue-700)]">
                Show stack trace
              </summary>
              <pre className="mt-3 max-h-[220px] overflow-auto whitespace-pre-wrap break-words text-[12px] leading-relaxed text-[#404040]">
                {error.stack}
              </pre>
            </details>
          ) : null}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[#b8b8b8] bg-white text-[14px] font-extrabold text-[#262626] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-[var(--brand-blue-500)] hover:text-[var(--brand-blue-500)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go back
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[var(--brand-blue-500)] text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/learner/dashboard"
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-[#b8b8b8] bg-white text-[14px] font-extrabold text-[#262626] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-[var(--brand-blue-500)] hover:text-[var(--brand-blue-500)]"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
