"use client";

import { type ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Link2, Mail, Upload, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  mentorRequestSchema,
  type MentorRequestFormValues,
} from "@/components/auth/auth-schemas";
import { simulatedActionDelayMs } from "@/lib/timing";

export function MentorRequestForm() {
  const [resumeName, setResumeName] = useState("");
  const [feedback, setFeedback] = useState("");
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<MentorRequestFormValues>({
    defaultValues: {
      email: "",
      fullName: "",
      portfolio: "",
      skill: "",
    },
    resolver: zodResolver(mentorRequestSchema),
  });

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setResumeName(file?.name ?? "");
    clearErrors("resume");
    setFeedback("");
  }

  const resumeField = register("resume", {
    onChange: handleResumeChange,
  });

  const onSubmit = handleSubmit(async () => {
    setFeedback("");

    try {
      await new Promise((resolve) =>
        window.setTimeout(resolve, simulatedActionDelayMs),
      );
      setFeedback("Mentor request details look good.");
    } catch {
      setError("root", {
        message: "Unable to send your mentor request right now. Please try again.",
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
          icon={Briefcase}
          label="Skill"
          placeholder="Skill: eg Product Designer"
          minLength={2}
          error={errors.skill?.message}
          {...register("skill")}
        />
        <AuthField
          icon={Link2}
          label="Portfolio Link"
          type="url"
          placeholder="Portfolio Link"
          error={errors.portfolio?.message}
          {...register("portfolio")}
        />
      </div>

      <label className="mx-auto mt-6 flex h-[70px] w-full max-w-64 transform-gpu cursor-pointer items-center justify-center gap-3 rounded-md bg-[#f4f4f4] px-4 text-[13px] font-extrabold text-[#2f2f2f] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)] sm:max-w-[258px]">
        <Upload className="h-5 w-5" aria-hidden="true" />
        <span className="truncate">{resumeName || "Upload Resume"}</span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          {...resumeField}
        />
      </label>
      {errors.resume?.message ? (
        <p className="mt-1.5 text-center text-[11px] font-semibold text-red-100">
          {errors.resume.message}
        </p>
      ) : null}

      <AuthSubmitButton
        type="submit"
        isLoading={isSubmitting}
        loadingLabel="Sending request..."
        className="mt-6 rounded-sm"
      >
        Send Request
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
    </form>
  );
}
