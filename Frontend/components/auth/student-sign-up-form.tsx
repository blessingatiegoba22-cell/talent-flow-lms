"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail, User } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthField } from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  getAuthFormErrors,
  hasPasswordMismatch,
  hasErrors,
} from "@/components/auth/auth-validation";
import { GoogleIcon } from "@/components/auth/google-icon";
import { useFieldErrors } from "@/components/auth/use-field-errors";
import { simulatedActionDelayMs } from "@/lib/timing";

const studentSignUpLabels = {
  confirmPassword: "Confirm Password",
  email: "Email",
  fullName: "Full Name",
  password: "Password",
};

export function StudentSignUpForm() {
  const { clearError, errors, setErrors } = useFieldErrors();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const nextErrors = getAuthFormErrors(form, studentSignUpLabels);

    if (hasPasswordMismatch(form)) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setFeedback("Check the highlighted fields and try again.");
      return;
    }

    setErrors({});
    setFeedback("Creating your student account...");
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setFeedback("Student account details look good.");
    }, simulatedActionDelayMs);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
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
          error={errors.fullName}
          onInput={() => clearError("fullName")}
          required
        />
        <AuthField
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={errors.email}
          onInput={() => clearError("email")}
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
          error={errors.password}
          onInput={() => clearError("password")}
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
          error={errors.confirmPassword}
          required
          onInput={() => clearError("confirmPassword")}
        />
      </div>

      <label className="mt-3 flex w-fit items-center gap-3 text-[13px] font-bold text-white/82">
        <input
          type="checkbox"
          name="remember"
          className="h-5 w-5 cursor-pointer rounded-sm border-0 accent-(--brand-blue-500)"
        />
        Remember Me
      </label>

      <AuthSubmitButton
        type="submit"
        isLoading={isSubmitting}
        loadingLabel="Creating account..."
        className="mt-6 rounded-sm"
      >
        Sign Up
      </AuthSubmitButton>

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
        className="flex h-[42px] w-full transform-gpu cursor-pointer items-center justify-center gap-3 rounded-sm bg-[#f4f4f4] text-[13px] font-extrabold text-[#202020] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)]"
      >
        <GoogleIcon />
        Sign up with Google
      </button>
    </form>
  );
}
