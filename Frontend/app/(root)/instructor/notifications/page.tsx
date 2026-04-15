import type { Metadata } from "next";

import { DashboardNotificationPage } from "@/components/dashboard/notification-page";
import { notificationSectionsByRole } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Instructor Notifications",
  description: "View instructor notifications and teaching activity updates.",
};

export default function InstructorNotificationsPage() {
  return (
    <DashboardNotificationPage
      sections={notificationSectionsByRole.instructor}
    />
  );
}
