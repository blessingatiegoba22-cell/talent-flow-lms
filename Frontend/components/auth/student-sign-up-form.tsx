"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthField } from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  studentSignUpSchema,
  type StudentSignUpFormValues,
} from "@/components/auth/auth-schemas";
import { GoogleIcon } from "@/components/auth/google-icon";
import { simulatedActionDelayMs } from "@/lib/timing";

export function StudentSignUpForm() {
  const [feedback, setFeedback] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<StudentSignUpFormValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      fullName: "",
      password: "",
      remember: false,
    },
    resolver: zodResolver(studentSignUpSchema),
  });

  const onSubmit = handleSubmit(async () => {
    setFeedback("");

    try {
      await new Promise((resolve) =>
        window.setTimeout(resolve, simulatedActionDelayMs),
      );
      setFeedback("Student account details look good.");
    } catch {
      setError("root", {
        message: "Unable to create your account right now. Please try again.",
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="w-full rounded-[7px] border border-[#8ca0c5] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.12)]"
    >
      <div className="space-y-3">
        <AuthField
          icon={User}
          label="Full Name"
          placeholder="Full Name"
          autoComplete="name"
          minLength={2}
          error={errors.fullName?.message}
          {...register("fullName")}
        />
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
          autoComplete="new-password"
          minLength={8}
          error={errors.password?.message}
          {...register("password")}
        />
        <AuthField
          icon={Lock}
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          minLength={8}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <label className="mt-3 flex w-fit items-center gap-3 text-[13px] font-bold text-white/82">
        <input
          type="checkbox"
          {...register("remember")}
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

      {errors.root?.message ? (
        <p className="mt-2 text-center text-xs font-semibold text-red-100" aria-live="polite">
          {errors.root.message}
        </p>
      ) : feedback ? (
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
