import type { Metadata } from "next";

import {
  AdminMetrics,
  QuickActions,
  SectionHeader,
  StatCard,
} from "@/components/dashboard/dashboard-widgets";
import { adminMetrics, adminQuickActions, adminStats } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Monitor platform users, courses, activity metrics, and admin actions on Talent Flow LMS.",
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[1024px] animate-fade-up xl:max-w-[1080px]">
      <section>
        <h1 className="text-[26px] font-extrabold leading-tight text-black sm:text-[29px]">
          Welcome back, Admin
        </h1>
        <p className="mt-4 max-w-[600px] text-[13px] font-medium leading-[1.45] text-black">
          Everything is running smoothly and under your control. Lets get things
          moving and keep the system at its best today
        </p>
      </section>

      <section className="mt-10">
        <SectionHeader title="Platform Overview" />
        <div className="grid gap-5 sm:grid-cols-3">
          {adminStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title="System Metrics" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,1.27fr)]">
          <AdminMetrics metrics={adminMetrics} />
          <QuickActions
            actions={adminQuickActions}
            className="rounded-[4px] border-0 bg-[#f2f2f2]"
            title="Quick Action"
          />
        </div>
      </section>
    </div>
  );
}
