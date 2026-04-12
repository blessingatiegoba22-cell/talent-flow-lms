import type { Metadata } from "next";
import Image from "next/image";
import { CreditCard, LogOut, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage learner profile information and account settings.",
};

const profileFields = [
  { label: "First Name", value: "Samuel" },
  { label: "Last Name", value: "Ogunleye" },
  { label: "Email Address", value: "ogunleyesamuelayomikun@gmail.com" },
  { label: "Mobile Number", value: "814647342", prefix: "+234" },
] as const;

const addressFields = [
  { label: "Address Line 1", value: "123 Moorim High" },
  { label: "Address Line 2", value: "Block 13, Yaba Lagos" },
] as const;

function ProfileInput({
  label,
  prefix,
  value,
}: {
  label: string;
  prefix?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-[15px] font-extrabold leading-tight text-black">
        {label}
      </span>
      <div className="mt-3 flex h-[42px] rounded-[5px] border border-[#c6c6c6] bg-white text-[14px] font-medium text-[#2b2b2b]">
        {prefix ? (
          <span className="flex items-center gap-2 border-r border-[#d2d2d2] px-3">
            {prefix}
            <span aria-hidden="true">⌄</span>
          </span>
        ) : null}
        <input
          defaultValue={value}
          className="min-w-0 flex-1 rounded-[5px] bg-transparent px-3 outline-none focus:ring-3 focus:ring-[rgba(37,99,235,0.16)]"
        />
      </div>
    </label>
  );
}

function SectionHeading({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div>
      <h2 className="text-[22px] font-extrabold leading-tight text-black">
        {title}
      </h2>
      <p className="mt-3 text-[14px] font-medium text-[#222]">{description}</p>
    </div>
  );
}

export default function LearnerProfilePage() {
  return (
    <div className="mx-auto -mt-[72px] max-w-[1120px] pb-8">
      <h1 className="text-[28px] font-extrabold leading-tight text-black">
        Profile
      </h1>

      <section className="mt-8 border-b border-[#bdbdbd] pb-8">
        <SectionHeading
          title="Your Profile Pic"
          description="This will be displayed on your profile"
        />

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-center">
          <div className="relative h-[63px] w-[63px] overflow-hidden rounded-full">
            <Image
              src="/user-icon-2.png"
              alt="Samuel O. profile picture"
              fill
              sizes="63px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="h-[34px] rounded-[5px] border border-[#bdbdbd] bg-white px-4 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-300 hover:border-[var(--brand-blue-400)] hover:text-[var(--brand-blue-600)]"
            >
              Upload new picture
            </button>
            <button
              type="button"
              className="h-[34px] rounded-[5px] border border-[#bdbdbd] bg-white px-3 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-300 hover:border-red-300 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 border-b border-[#bdbdbd] py-8 lg:grid-cols-[260px_1fr]">
        <SectionHeading
          title="Personal info."
          description="Add your personal information"
        />

        <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">
          {profileFields.map((field) => (
            <ProfileInput key={field.label} {...field} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-b border-[#bdbdbd] py-8 lg:grid-cols-[260px_1fr]">
        <SectionHeading
          title="Bio & Other info."
          description="Add your bio and other info"
        />

        <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">
          {addressFields.map((field) => (
            <ProfileInput key={field.label} {...field} />
          ))}

          <label className="block sm:col-span-2">
            <span className="text-[15px] font-extrabold leading-tight text-black">
              Bio
            </span>
            <textarea
              className="mt-3 min-h-[106px] w-full resize-none rounded-[5px] border border-[#a9a9a9] bg-white px-3 py-3 text-[14px] font-medium text-[#2b2b2b] outline-none focus:ring-3 focus:ring-[rgba(37,99,235,0.16)]"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-8 pt-10 lg:grid-cols-[260px_1fr]">
        <SectionHeading
          title="Account Security"
          description="Manage your account security"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            className="inline-flex h-[42px] items-center justify-center gap-3 rounded-[5px] border border-[#d1d1d1] bg-white px-5 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-300 hover:border-[var(--brand-blue-400)] hover:text-[var(--brand-blue-600)]"
          >
            <CreditCard className="h-4 w-4 text-[var(--brand-blue-500)]" aria-hidden="true" />
            View Certificate
          </button>
          <button
            type="button"
            className="inline-flex h-[42px] items-center justify-center gap-3 rounded-[5px] border border-[#d1d1d1] bg-white px-5 text-[14px] font-medium text-red-600 transition-colors duration-300 hover:border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete my account
          </button>
          <button
            type="button"
            className="inline-flex h-[42px] items-center justify-center gap-3 rounded-[5px] border border-[#d1d1d1] bg-white px-5 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-300 hover:border-[var(--brand-blue-400)] hover:text-[var(--brand-blue-600)]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}
