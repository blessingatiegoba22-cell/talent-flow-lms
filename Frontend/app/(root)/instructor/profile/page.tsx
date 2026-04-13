import type { Metadata } from "next";

import { ProfileSettings } from "@/components/dashboard/profile-settings";

export const metadata: Metadata = {
  title: "Instructor Profile",
  description: "Manage instructor profile information and account settings.",
};

export default function InstructorProfilePage() {
  return <ProfileSettings />;
}
