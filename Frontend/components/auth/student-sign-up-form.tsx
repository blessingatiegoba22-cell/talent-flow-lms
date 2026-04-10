"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail, User } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthField } from "@/components/auth/auth-field";
import { GoogleIcon } from "@/components/auth/google-icon";

export function StudentSignUpForm() {
  const [feedback, setFeedback] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmPassword = form.elements.namedItem(
      "confirmPassword",
    ) as HTMLInputElement;

    confirmPassword.setCustomValidity("");

    if (!form.reportValidity()) {
      setFeedback("");
      return;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Passwords do not match.");
      confirmPassword.reportValidity();
      setFeedback("Passwords do not match.");
      return;
    }

    setFeedback("Student account details look good.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-[7px] border border-[#8ca0c5] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.12)]"
    >
      <div className="space-y-3">
        <AuthField
          icon={User}
          label="Full Name"
          name="fullName"
          placeholder="Full Name"
          autoComplete="name"
          minLength={2}
          required
        />
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
          autoComplete="new-password"
          minLength={8}
          required
        />
        <AuthField
          icon={Lock}
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          minLength={8}
          required
          onInput={(event) => event.currentTarget.setCustomValidity("")}
        />
      </div>

      <label className="mt-3 flex w-fit items-center gap-3 text-[13px] font-bold text-white/82">
        <input
          type="checkbox"
          name="remember"
          className="h-5 w-5 cursor-pointer rounded-[4px] border-0 accent-[var(--brand-blue-500)]"
        />
        Remember Me
      </label>

      <button
        type="submit"
        className="mt-6 h-[42px] w-full transform-gpu cursor-pointer rounded-[4px] bg-[var(--brand-blue-500)] text-[13px] font-bold text-white shadow-[0_18px_34px_rgba(37,99,235,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)] hover:shadow-[0_22px_38px_rgba(37,99,235,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.25)]"
      >
        Sign Up
      </button>

      {feedback ? (
        <p className="mt-2 text-center text-xs font-semibold text-white/78" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <div className="py-6">
        <AuthDivider />
      </div>

      <button
        type="button"
        className="flex h-[42px] w-full transform-gpu cursor-pointer items-center justify-center gap-3 rounded-[4px] bg-[#f4f4f4] text-[13px] font-extrabold text-[#202020] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)]"
      >
        <GoogleIcon />
        Sign up with Google
      </button>
    </form>
  );
}
