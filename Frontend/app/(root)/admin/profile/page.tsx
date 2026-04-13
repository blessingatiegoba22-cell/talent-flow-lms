import type { Metadata } from "next";

import { ProfileSettings } from "@/components/dashboard/profile-settings";

export const metadata: Metadata = {
  title: "Admin Profile",
  description: "Manage admin profile information and account settings.",
};

export default function AdminProfilePage() {
  return <ProfileSettings />;
}
