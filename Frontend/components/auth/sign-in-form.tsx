"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthField } from "@/components/auth/auth-field";
import {
  signInSchema,
  type SignInFormValues,
} from "@/components/auth/auth-schemas";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { GoogleIcon } from "@/components/auth/google-icon";
import { useAuthSessionStore } from "@/lib/auth-store";
import { dashboardHrefByRole } from "@/lib/routes";
import { simulatedActionDelayMs } from "@/lib/timing";

export function SignInForm() {
  const router = useRouter();
  const signIn = useAuthSessionStore((state) => state.signIn);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await new Promise((resolve) =>
        window.setTimeout(resolve, simulatedActionDelayMs),
      );
      signIn({ remember: Boolean(values.remember), role: "learner" });
      router.push(dashboardHrefByRole.learner);
    } catch {
      setError("root", {
        message: "Unable to sign in right now. Please try again.",
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto mt-7 w-full max-w-80 space-y-3 sm:max-w-84"
    >
      <AuthField
        icon={Mail}
        label="Email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthField
        icon={Lock}
        label="Password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        minLength={8}
        error={errors.password?.message}
        {...register("password")}
        suffix={
          <Link
            href="/forgot-password"
            className="cursor-pointer text-(--brand-blue-500) transition-colors duration-300 ease-in-out hover:text-brand-blue-400"
          >
            Forgot password
          </Link>
        }
      />

      <label className="flex w-fit items-center gap-3 pt-1 text-[13px] font-bold text-white/82">
        <input
          type="checkbox"
          {...register("remember")}
          className="h-5 w-5 cursor-pointer rounded-sm border-0 accent-(--brand-blue-500)"
        />
        remember Me
      </label>

      <AuthSubmitButton
        type="submit"
        isLoading={isSubmitting}
        loadingLabel="Signing in..."
        className="mt-5 h-10 sm:h-10.5"
      >
        Sign In
      </AuthSubmitButton>

      {errors.root?.message ? (
        <p className="text-center text-xs font-semibold text-red-100" aria-live="polite">
          {errors.root.message}
        </p>
      ) : null}

      <div className="py-5">
        <AuthDivider />
      </div>

      <button
        type="button"
        className="flex h-10.5 w-full transform-gpu cursor-pointer items-center justify-center gap-3 rounded-[5px] bg-[#f4f4f4] text-[13px] font-extrabold text-[#202020] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)]"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </form>
  );
}
