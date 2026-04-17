"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { studentSignUpAction } from "@/lib/auth-actions";
import { dashboardHrefByRole } from "@/lib/routes";

const studentSignUpFields = [
  "confirmPassword",
  "email",
  "fullName",
  "password",
] as const satisfies ReadonlyArray<keyof StudentSignUpFormValues>;

export function StudentSignUpForm() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
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
    },
    resolver: zodResolver(studentSignUpSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    if (isRedirecting) {
      return;
    }

    const result = await studentSignUpAction(values);

    if (!result.ok) {
      setIsRedirecting(false);
      const fieldErrors = result.fieldErrors ?? {};

      for (const field of studentSignUpFields) {
        const message = fieldErrors[field];

        if (message) {
          setError(field, { message });
        }
      }

      setError("root", {
        message: result.message,
      });
      return;
    }

    setIsRedirecting(true);
    router.push(dashboardHrefByRole.learner);
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
          minLength={4}
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

      <AuthSubmitButton
        type="submit"
        isLoading={isSubmitting || isRedirecting}
        loadingLabel="Creating account..."
        className="mt-6 rounded-sm"
      >
        Sign Up
      </AuthSubmitButton>

      {errors.root?.message ? (
        <p className="mt-2 text-center text-xs font-semibold text-red-100" aria-live="polite">
          {errors.root.message}
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
