import { OptimizedImage as Image } from "@/components/shared/optimized-image";
import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  GraduationCap,
  Laptop,
  LayoutDashboard,
  LineChart,
  MessageSquareMore,
  MonitorSmartphone,
  ShieldCheck,
  Trophy,
  UsersRound,
  Zap,
} from "lucide-react";

const featureCards = [
  {
    title: "Interactive Learning Experience",
    kicker: "Learning that feels engaging",
    body: "Quizzes and interactive contents to make online learning dynamic and participatory",
    items: [
      { label: "Interactive sessions with student and tutor", icon: UsersRound },
      { label: "Interactive quizzes and assignments", icon: BookOpenCheck },
      { label: "Real time feedback to guide improvement", icon: MessageSquareMore },
    ],
  },
  {
    title: "Progress Tracking",
    kicker: "Track your progress with clarity not clutter",
    body: "Stay motivated with clear visual indicators of progress and performance",
    items: [
      { label: "Track course completion and progress", icon: ChartNoAxesColumnIncreasing },
      { label: "Get insights into performance and areas to improve", icon: LineChart },
      { label: "Visual data that's easy to understand", icon: MonitorSmartphone },
    ],
  },
  {
    title: "Tutor & Admin Management",
    kicker: "Tools to keep your platform running smoothly",
    body: "Manage users, oversee courses, and control platform operations with ease",
    items: [
      { label: "Oversee courses and content quality", icon: LayoutDashboard },
      { label: "Access detailed platform analytics", icon: BarChart3 },
      { label: "Centralized user management and permissions", icon: ShieldCheck },
    ],
  },
  {
    title: "Certificate & Achievements",
    kicker: "Rewards learners after completing courses",
    body: "Earn recognised certificates and track your accomplishment as you complete courses and reach learning milestones",
    items: [
      { label: "Shareable Certificates", icon: Trophy },
      { label: "Verified Skill Recognition", icon: CheckCircle2 },
      { label: "Motivation Through Milestones", icon: GraduationCap },
    ],
  },
] as const;

const featureHighlights = [
  { label: "Fast Navigation", icon: Zap },
  { label: "Personalized Learning", icon: GraduationCap },
  { label: "Cross Device Experience", icon: Laptop },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-32 bg-[#f4f5f7] py-10 text-[#101010] sm:py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="animate-fade-in overflow-hidden rounded-lg bg-white shadow-[0_3px_8px_rgba(16,24,40,0.18)] transition-[transform,box-shadow] duration-700 ease-out hover:-translate-y-px hover:shadow-[0_14px_30px_rgba(16,24,40,0.16)]">
          <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 xl:gap-14">
            <div className="max-w-[420px]">
              <h2 className="text-[length:var(--text-display-xs)] leading-(--text-display-xs--line-height) font-bold tracking-[0] text-[#060606] sm:text-[length:var(--text-display-sm)] sm:leading-(--text-display-sm--line-height)">
                Everything you need to learn, teach, and manage all in one place
              </h2>

              <p className="mt-4 text-[length:var(--text-sm)] leading-(--text-sm--line-height) text-[#2f3440]">
                <span className="font-semibold text-(--brand-blue-500)">
                  Talent Flow
                </span>{" "}
                is designed to remove friction, improve navigation and create a
                seamless experience for students, tutors, and administrators.
              </p>

              <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-(--brand-blue-500) px-8 text-[length:var(--text-sm)] font-semibold text-white shadow-[0_10px_18px_rgba(37,99,235,0.22)] transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-px hover:bg-(--brand-blue-600) hover:shadow-[0_15px_26px_rgba(37,99,235,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-blue-500)"
                >
                  Get Started
                </Link>

                <a
                  href="#about"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-[#8f949d] bg-white px-8 text-[length:var(--text-sm)] font-semibold text-[#252932] transition-[transform,color,border-color,box-shadow] duration-500 ease-out hover:-translate-y-px hover:border-(--brand-blue-500) hover:text-(--brand-blue-600) hover:shadow-[0_12px_24px_rgba(16,24,40,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-blue-500)"
                >
                  Learn More
                </a>
              </div>
            </div>

            <div className="relative min-h-[180px] overflow-hidden rounded-md bg-[#dfe5e8] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[280px]">
              <Image
                src="/working-imag.webp"
                alt="Students working on laptops in a classroom"
                fill
                sizes="(min-width: 1024px) 620px, (min-width: 640px) 90vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        <div className="mt-9 animate-fade-up text-center" style={{ animationDelay: "80ms" }}>
          <h3 className="text-[length:var(--text-display-xs)] leading-(--text-display-xs--line-height) font-bold tracking-[0] text-[#070707] sm:text-[length:var(--text-display-sm)] sm:leading-(--text-display-sm--line-height)">
            Our Features
          </h3>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {featureCards.map((feature, index) => (
            <article
              key={feature.title}
              className="animate-fade-in group rounded-lg bg-white p-5 shadow-[0_3px_7px_rgba(16,24,40,0.18)] transition-[transform,box-shadow] duration-700 ease-out hover:-translate-y-px hover:shadow-[0_16px_28px_rgba(16,24,40,0.16)] sm:p-6"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <h4 className="text-[length:var(--text-xl)] leading-(--text-xl--line-height) font-bold tracking-[0] text-[#111111]">
                {feature.title}
              </h4>
              <p className="mt-2 text-[length:var(--text-sm)] leading-(--text-sm--line-height) text-[#20242b]">
                {feature.kicker}
              </p>
              <p className="mt-6 max-w-[36rem] text-[length:var(--text-sm)] leading-(--text-md--line-height) text-[#20242b]">
                {feature.body}
              </p>

              <ul className="mt-7 space-y-3">
                {feature.items.map(({ icon: Icon, label }, itemIndex) => (
                  <li
                    key={label}
                    className="flex items-start gap-3 text-[length:var(--text-sm)] leading-(--text-sm--line-height) text-[#1e2430]"
                  >
                    <Icon
                      className={
                        itemIndex === 0
                          ? "mt-0.5 h-4 w-4 shrink-0 text-(--brand-blue-500) transition-transform duration-500 ease-out group-hover:scale-105"
                          : "mt-0.5 h-4 w-4 shrink-0 text-[#101010] transition-[transform,color] duration-500 ease-out group-hover:scale-105 group-hover:text-(--brand-blue-500)"
                      }
                      aria-hidden="true"
                      strokeWidth={1.8}
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-9 animate-fade-in rounded-lg bg-(--brand-blue-500) px-5 py-5 text-white shadow-[0_14px_30px_rgba(37,99,235,0.24)]">
          <div className="grid gap-4 text-[length:var(--text-sm)] font-semibold sm:grid-cols-3 sm:items-center sm:gap-6">
            {featureHighlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-colors duration-500 ease-out hover:bg-white/12"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
