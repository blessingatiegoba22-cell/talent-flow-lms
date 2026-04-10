"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Briefcase, Link2, Mail, Upload, User } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";

export function MentorRequestForm() {
  const [resumeName, setResumeName] = useState("");
  const [feedback, setFeedback] = useState("");

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setResumeName(file?.name ?? "");
    setFeedback("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      setFeedback("");
      return;
    }

    setFeedback("Mentor request details look good.");
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
          icon={Briefcase}
          label="Skill"
          name="skill"
          placeholder="Skill: eg Product Designer"
          minLength={2}
          required
        />
        <AuthField
          icon={Link2}
          label="Portfolio Link"
          name="portfolio"
          type="url"
          placeholder="Portfolio Link"
          required
        />
      </div>

      <label className="mx-auto mt-6 flex h-[70px] w-full max-w-[256px] transform-gpu cursor-pointer items-center justify-center gap-3 rounded-[6px] bg-[#f4f4f4] px-4 text-[13px] font-extrabold text-[#2f2f2f] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(0,0,0,0.16)] sm:max-w-[258px]">
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

      <button
        type="submit"
        className="mt-6 h-[42px] w-full transform-gpu cursor-pointer rounded-[4px] bg-[var(--brand-blue-500)] text-[13px] font-bold text-white shadow-[0_18px_34px_rgba(37,99,235,0.22)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)] hover:shadow-[0_22px_38px_rgba(37,99,235,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.25)]"
      >
        Send Request
      </button>

      {feedback ? (
        <p className="mt-2 text-center text-xs font-semibold text-white/78" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
