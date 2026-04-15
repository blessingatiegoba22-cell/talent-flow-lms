import type { Metadata } from "next";

import { ProfileSettings } from "@/components/dashboard/profile-settings";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage learner profile information and account settings.",
};

export default function LearnerProfilePage() {
  return <ProfileSettings />;
}
