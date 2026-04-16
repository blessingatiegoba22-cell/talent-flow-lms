"use client";

import { OptimizedImage as Image } from "@/components/shared/optimized-image";

import { AccountSecurityActions } from "@/components/dashboard/account-security-actions";
import { useCurrentUser } from "@/components/dashboard/current-user-context";
import { splitFullName } from "@/lib/current-user";

const addressFields = [
  { label: "Address Line 1", value: "123 Moorim High" },
  { label: "Address Line 2", value: "Block 13, Yaba Lagos" },
] as const;

export function ProfileSettings() {
  const currentUser = useCurrentUser();
  const { firstName, lastName } = splitFullName(currentUser?.name);
  const profileFields = [
    { label: "First Name", value: firstName },
    { label: "Last Name", value: lastName },
    { label: "Email Address", value: currentUser?.email ?? "" },
    { label: "Mobile Number", value: "", prefix: "+234" },
  ];
  const profileImageAlt = currentUser?.name
    ? `${currentUser.name} profile picture`
    : "Learner profile picture";

  return (
    <div className="mx-auto max-w-280 animate-fade-up pb-8">
      <h1 className="text-[28px] font-extrabold leading-tight text-black sm:text-[36px]">
        Profile
      </h1>

      <section className="mt-6 border-b border-[#bdbdbd] pb-7 sm:mt-8 sm:pb-8">
        <SectionHeading
          title="Your Profile Pic"
          description="This will be displayed on your profile"
        />

        <div className="mt-6 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
          <div className="relative h-[63px] w-[63px] overflow-hidden rounded-full">
            <Image
              src="/user-icon-2.webp"
              alt={profileImageAlt}
              fill
              sizes="63px"
              className="object-cover"
              priority
            />
          </div>
          <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <button
              type="button"
              className="min-h-[34px] rounded-[5px] border border-[#bdbdbd] bg-white px-4 py-2 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-300 hover:border-(--brand-blue-400) hover:text-(--brand-blue-600)"
            >
              Upload new picture
            </button>
            <button
              type="button"
              className="min-h-[34px] rounded-[5px] border border-[#bdbdbd] bg-white px-3 py-2 text-[14px] font-medium text-[#1f1f1f] transition-colors duration-300 hover:border-red-300 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 border-b border-[#bdbdbd] py-7 lg:grid-cols-[260px_1fr] lg:gap-8 lg:py-8">
        <SectionHeading
          title="Personal info."
          description="Add your personal information"
        />

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-y-7">
          {profileFields.map((field) => (
            <ProfileInput key={field.label} {...field} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 border-b border-[#bdbdbd] py-7 lg:grid-cols-[260px_1fr] lg:gap-8 lg:py-8">
        <SectionHeading
          title="Bio & Other info."
          description="Add your bio and other info"
        />

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-y-7">
          {addressFields.map((field) => (
            <ProfileInput key={field.label} {...field} />
          ))}

          <label className="block sm:col-span-2">
            <span className="text-[15px] font-extrabold leading-tight text-black">
              Bio
            </span>
            <textarea className="mt-3 min-h-[106px] w-full resize-none rounded-[5px] border border-[#a9a9a9] bg-white px-3 py-3 text-[14px] font-medium text-[#2b2b2b] outline-none focus:ring-3 focus:ring-[rgba(37,99,235,0.16)]" />
          </label>
        </div>
      </section>

      <section className="grid gap-6 pt-8 lg:grid-cols-[260px_1fr] lg:gap-8 lg:pt-10">
        <SectionHeading
          title="Account Security"
          description="Manage your account security"
        />

        <AccountSecurityActions />
      </section>
    </div>
  );
}

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
