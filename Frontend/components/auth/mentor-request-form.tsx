"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Briefcase, Link2, Mail, Upload, User } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  getAuthFormErrors,
  hasErrors,
} from "@/components/auth/auth-validation";
import { useFieldErrors } from "@/components/auth/use-field-errors";
import { simulatedActionDelayMs } from "@/lib/timing";

const mentorRequestLabels = {
  email: "Email",
  fullName: "Full Name",
  portfolio: "Portfolio Link",
  resume: "Resume",
  skill: "Skill",
};

export function MentorRequestForm() {
  const { clearError, errors, setErrors } = useFieldErrors();
  const [resumeName, setResumeName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setResumeName(file?.name ?? "");
    clearError("resume");
    setFeedback("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = getAuthFormErrors(event.currentTarget, mentorRequestLabels);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setFeedback("Check the highlighted fields and try again.");
      return;
    }

    setErrors({});
    setFeedback("Sending your mentor request...");
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setFeedback("Mentor request details look good.");
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
          icon={Briefcase}
          label="Skill"
          name="skill"
          placeholder="Skill: eg Product Designer"
          minLength={2}
          error={errors.skill}
          onInput={() => clearError("skill")}
          required
        />
        <AuthField
          icon={Link2}
          label="Portfolio Link"
          name="portfolio"
          type="url"
          placeholder="Portfolio Link"
          error={errors.portfolio}
          onInput={() => clearError("portfolio")}
          required
        />
      </div>

      <label className="mx-auto mt-6 flex h-[70px] w-full max-w-64 transform-gpu cursor-pointer items-center justify-center gap-3 rounded-md bg-[#f4f4f4] px-4 text-[13px] font-extrabold text-[#2f2f2f] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)] sm:max-w-[258px]">
        <Upload className="h-5 w-5" aria-hidden="true" />
        <span className="truncate">{resumeName || "Upload Resume"}</span>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          className="sr-only"
          required
        />
      </label>
      {errors.resume ? (
        <p className="mt-1.5 text-center text-[11px] font-semibold text-red-100">
          {errors.resume}
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

      {feedback ? (
        <p className="mt-2 text-center text-xs font-semibold text-white/78" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
