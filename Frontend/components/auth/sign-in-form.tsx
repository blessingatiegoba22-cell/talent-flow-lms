"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthField } from "@/components/auth/auth-field";
import { GoogleIcon } from "@/components/auth/google-icon";

export function SignInForm() {
  const [status, setStatus] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      setStatus("");
      return;
    }

    setStatus("");
    router.push("/learner/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-7 w-full max-w-[320px] space-y-3 sm:max-w-[336px]"
    >
      <AuthField
        icon={Mail}
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        required
      />

      <AuthField
        icon={Lock}
        label="Password"
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        minLength={8}
        required
        suffix={
          <Link
            href="/forgot-password"
            className="cursor-pointer text-[var(--brand-blue-500)] transition-colors duration-300 ease-in-out hover:text-[var(--brand-blue-400)]"
          >
            Forgot password
          </Link>
        }
      />

      <label className="flex w-fit items-center gap-3 pt-1 text-[13px] font-bold text-white/82">
        <input
          type="checkbox"
          name="remember"
          className="h-5 w-5 cursor-pointer rounded-[4px] border-0 accent-[var(--brand-blue-500)]"
        />
        remember Me
      </label>

      <button
        type="submit"
        className="mt-5 h-10 w-full transform-gpu cursor-pointer rounded-[5px] bg-[var(--brand-blue-500)] text-[13px] font-bold text-white shadow-[0_18px_34px_rgba(37,99,235,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)] hover:shadow-[0_22px_38px_rgba(37,99,235,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.25)] sm:h-[42px]"
      >
        Sign In
      </button>

      {status ? (
        <p className="text-center text-xs font-semibold text-white/75" aria-live="polite">
          {status}
        </p>
      ) : null}

      <div className="py-5">
        <AuthDivider />
      </div>

      <button
        type="button"
        className="flex h-[42px] w-full transform-gpu cursor-pointer items-center justify-center gap-3 rounded-[5px] bg-[#f4f4f4] text-[13px] font-extrabold text-[#202020] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)]"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </form>
  );
}
