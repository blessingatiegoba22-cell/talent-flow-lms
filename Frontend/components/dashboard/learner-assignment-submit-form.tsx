"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Upload } from "lucide-react";
import { type ChangeEvent, type FormEvent, useId, useState } from "react";

import type { Assignment } from "@/components/dashboard/learner-assignment-widgets";

const assignmentSubmittedHref = "/learner/assignments/submitted";

export function LearnerAssignmentSubmitForm({
  assignment,
}: {
  assignment: Assignment;
}) {
  const router = useRouter();
  const fileInputId = useId();
  const [details, setDetails] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.files?.[0]?.name ?? "");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(assignmentSubmittedHref);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <section className="rounded-lg border border-[#d6dfef] bg-white p-5 shadow-[0_10px_28px_rgba(7,20,47,0.08)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f0ff] text-(--brand-blue-700)">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[20px] font-extrabold leading-tight text-black">
              Submit Assignment
            </h2>
            <p className="mt-2 text-[14px] font-medium leading-[1.5] text-[#525252] sm:text-[15px]">
              Make sure you understand the instruction before submitting.
            </p>
          </div>
        </div>

        <label
          htmlFor="submission-details"
          className="mt-7 block text-[15px] font-extrabold text-black"
        >
          Submission details
        </label>
        <textarea
          id="submission-details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Paste your assignment link or add submission details."
          className="mt-3 block min-h-[220px] w-full resize-y rounded-lg border border-[#b9c4d7] bg-[#fbfcff] px-4 py-4 text-[15px] font-medium leading-[1.5] text-black outline-none transition-shadow duration-300 placeholder:text-[#777] focus:border-(--brand-blue-600) focus:shadow-[0_0_0_3px_rgba(37,99,235,0.16)]"
        />

        <div className="mt-6">
          <p className="text-[15px] font-extrabold text-black">Attachment</p>
          <p className="mt-1 text-[13px] font-medium text-[#606060]">
            Upload an image, PDF, DOC, or DOCX file.
          </p>
        </div>

        <input
          id={fileInputId}
          type="file"
          accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={handleFileChange}
        />
        <label
          htmlFor={fileInputId}
          className="mt-4 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#8fa2c2] bg-[#f4f7fd] px-5 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-600) hover:bg-[#eef4ff]"
        >
          <Upload
            className="h-6 w-6 text-(--brand-blue-700)"
            aria-hidden="true"
          />
          <span className="mt-2 text-[15px] font-extrabold text-black">
            Upload File
          </span>
          {fileName ? (
            <span className="mt-2 max-w-full truncate text-[13px] font-semibold text-(--brand-blue-800)">
              {fileName}
            </span>
          ) : null}
        </label>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg bg-(--brand-blue-700) px-6 text-[15px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-500)"
          >
            Submit Assignment
          </button>
          <Link
            href="/learner/assignments"
            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#aebbd1] px-6 text-[15px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-500) hover:text-(--brand-blue-600)"
          >
            Back to Assignments
          </Link>
        </div>
      </section>

      <aside className="rounded-lg bg-[#eef4ff] p-5">
        <p className="text-[13px] font-extrabold uppercase text-(--brand-blue-800)">
          Assignment
        </p>
        <h3 className="mt-2 text-[19px] font-extrabold leading-tight text-black">
          {assignment.topic}
        </h3>
        <dl className="mt-5 grid gap-4 text-[14px]">
          <div>
            <dt className="font-bold text-[#555]">Course</dt>
            <dd className="mt-1 font-extrabold text-(--brand-blue-900)">
              {assignment.course}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-[#555]">Timeline</dt>
            <dd className="mt-1 font-extrabold text-black">
              {assignment.timeline}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-[#555]">Due</dt>
            <dd className="mt-1 font-extrabold text-black">
              {assignment.due}
            </dd>
          </div>
        </dl>
      </aside>
    </form>
  );
}
