"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthField } from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  getAuthFormErrors,
  hasErrors,
} from "@/components/auth/auth-validation";
import { GoogleIcon } from "@/components/auth/google-icon";
import { useFieldErrors } from "@/components/auth/use-field-errors";
import { dashboardHrefByRole } from "@/lib/routes";
import { simulatedActionDelayMs } from "@/lib/timing";

const signInLabels = {
  email: "Email",
  password: "Password",
};

export function SignInForm() {
  const { clearError, errors, setErrors } = useFieldErrors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = getAuthFormErrors(event.currentTarget, signInLabels);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setStatus("Check the highlighted fields and try again.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setStatus("Signing you in...");

    window.setTimeout(() => {
      router.push(dashboardHrefByRole.learner);
    }, simulatedActionDelayMs);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto mt-7 w-full max-w-80 space-y-3 sm:max-w-84"
    >
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
        autoComplete="current-password"
        minLength={8}
        error={errors.password}
        onInput={() => clearError("password")}
        required
        suffix={
          <Link
            href="/forgot-password"
            className="cursor-pointer text-(--brand-blue-500) transition-colors duration-300 ease-in-out hover:text-(--brand-blue-400)"
          >
            Forgot password
          </Link>
        }
      />

      <label className="flex w-fit items-center gap-3 pt-1 text-[13px] font-bold text-white/82">
        <input
          type="checkbox"
          name="remember"
          className="h-5 w-5 cursor-pointer rounded-sm border-0 accent-(--brand-blue-500)"
        />
        remember Me
      </label>

      <AuthSubmitButton
        type="submit"
        isLoading={isSubmitting}
        loadingLabel="Signing in..."
        className="mt-5 h-10 sm:h-[42px]"
      >
        Sign In
      </AuthSubmitButton>

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
