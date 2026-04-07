import StatCard from "@/components/shared/cards/StatCard";
import { ADMIN_STATS } from "@/constants/dashboard";

const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 bg-background min-h-screen">
      <header className="mb-10">
        <h1 className="text-display-xs font-bold text-foreground">
          Welcome back, Admin
        </h1>
        <p className="text-ink-300 mt-2 max-w-2xl">
          Everything is running smoothly and under your control. Let's get
          things moving and keep the system at its best today.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ADMIN_STATS.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-6">
          System Metrics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-neutral-300 min-h-[300px] rounded-2xl border border-border animate-pulse" />

          <div className="bg-neutral-100 min-h-[300px] rounded-2xl border border-border p-8">
            <h3 className="text-ink-300 font-medium">Quick Action</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
