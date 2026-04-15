import type { Metadata } from "next";

import { DashboardNotificationPage } from "@/components/dashboard/notification-page";
import { notificationSectionsByRole } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Admin Notifications",
  description: "View admin notifications and platform activity updates.",
};

export default function AdminNotificationsPage() {
  return (
    <DashboardNotificationPage sections={notificationSectionsByRole.admin} />
  );
}
