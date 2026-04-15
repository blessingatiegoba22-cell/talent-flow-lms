"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthConfirmationModal } from "@/components/auth/auth-confirmation-modal";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/components/auth/auth-schemas";
import { GoogleIcon } from "@/components/auth/google-icon";
import { RecoveryButton } from "@/components/auth/recovery-button";
import { RecoveryInput } from "@/components/auth/recovery-input";
import { simulatedActionDelayMs } from "@/lib/timing";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async () => {
    try {
      await new Promise((resolve) =>
        window.setTimeout(resolve, simulatedActionDelayMs),
      );
      setIsConfirmationOpen(true);
    } catch {
      setError("root", {
        message: "Unable to send a reset code right now. Please try again.",
      });
    }
  });

  return (
    <>
      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 w-full space-y-5 sm:mt-8 sm:space-y-8"
      >
        <RecoveryInput
          icon={Mail}
          label="Email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <RecoveryButton
          type="submit"
          isLoading={isSubmitting}
          loadingLabel="Sending code..."
        >
          Get Code
        </RecoveryButton>

        {errors.root?.message ? (
          <p className="text-center text-xs font-semibold text-red-100" aria-live="polite">
            {errors.root.message}
          </p>
        ) : null}

        <AuthDivider />

        <button
          type="button"
          className="flex h-12 w-full transform-gpu cursor-pointer items-center justify-center gap-3 rounded-md bg-[#f4f4f4] text-[14px] font-bold text-[#101010] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)] sm:h-14 sm:text-[16px]"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <p className="pt-1 text-center text-[12px] font-medium text-white/78 sm:text-[13px]">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            className="ml-2 cursor-pointer font-extrabold text-white transition-colors duration-300 ease-in-out hover:text-(--brand-blue-200) sm:ml-6"
          >
            Sign Up
          </Link>
        </p>
      </form>

      {isConfirmationOpen ? (
        <AuthConfirmationModal
          imageSrc="/code-mail.webp"
          imageAlt="Mail app with unread reset code notification"
          title="Reset code Request Successfully sent"
          description="Check your email for the code, ensure to check your spam folders too."
          buttonLabel="Continue"
          onContinue={() => router.push("/reset-password")}
        />
      ) : null}
    </>
  );
}
