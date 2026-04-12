"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthConfirmationModal } from "@/components/auth/auth-confirmation-modal";
import { RecoveryButton } from "@/components/auth/recovery-button";
import { RecoveryInput } from "@/components/auth/recovery-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

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

    setFeedback("");
    setIsConfirmationOpen(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 w-full space-y-3 sm:mt-8 sm:space-y-4">
        <RecoveryInput
          label="Code"
          name="code"
          inputMode="numeric"
          pattern="[0-9]{4,8}"
          placeholder="Code"
          required
        />
        <RecoveryInput
          label="New Password"
          name="password"
          type="password"
          placeholder="New Password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <RecoveryInput
          label="Confirm new Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new Password"
          autoComplete="new-password"
          minLength={8}
          required
          onInput={(event) => event.currentTarget.setCustomValidity("")}
        />

        <RecoveryButton type="submit" className="mt-5 sm:mt-7">
          Reset Password
        </RecoveryButton>

        {feedback ? (
          <p className="text-center text-xs font-semibold text-white/78" aria-live="polite">
            {feedback}
          </p>
        ) : null}

        <p className="pt-4 text-center text-[12px] font-medium text-white/78 sm:pt-5 sm:text-[13px]">
          Didn&apos;t get a code
          <Link
            href="/forgot-password"
            className="ml-4 cursor-pointer font-extrabold text-white transition-colors duration-300 ease-in-out hover:text-[var(--brand-blue-200)] sm:ml-16"
          >
            Resend code
          </Link>
        </p>
      </form>

      {isConfirmationOpen ? (
        <AuthConfirmationModal
          imageSrc="/reset-done.png"
          imageAlt="Learner celebrating a successful password reset"
          title="Password successfully reset"
          description="Keep your password safe, store it in a private folder."
          buttonLabel="Continue to login"
          onContinue={() => router.push("/sign-in")}
        />
      ) : null}
    </>
  );
}
