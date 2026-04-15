import type { Metadata } from "next";

import { DashboardNotificationPage } from "@/components/dashboard/notification-page";
import { notificationSectionsByRole } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Learner Notifications",
  description: "View learner notifications and course activity updates.",
};

export default function LearnerNotificationsPage() {
  return (
    <DashboardNotificationPage
      sections={notificationSectionsByRole.learner}
    />
  );
}
