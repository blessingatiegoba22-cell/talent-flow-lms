import { Card, CardContent } from "@/components/ui/card";
import { landingFeatures } from "@/data/landing-page";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-32 bg-[linear-gradient(180deg,var(--neutral-50)_0%,#f5f8ff_100%)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[length:var(--text-sm)] leading-[var(--text-sm--line-height)] font-semibold uppercase tracking-[0.24em] text-[var(--brand-blue-500)]">
            Features
          </p>
          <h2 className="mt-4 text-[length:var(--text-display-xs)] leading-[var(--text-display-xs--line-height)] font-bold tracking-[-0.02em] text-[var(--ink-500)] sm:text-[length:var(--text-display-sm)] sm:leading-[var(--text-display-sm--line-height)]">
            Everything your learning flow needs in one place
          </h2>
          <p className="mt-4 text-[length:var(--text-md)] leading-[var(--text-lg--line-height)] text-[var(--neutral-900)] sm:text-[length:var(--text-lg)]">
            From guided learning to simple administration, Talent Flow keeps
            every part of the experience connected without making the interface
            feel heavy.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {landingFeatures.map(({ description, eyebrow, icon: Icon, title }, index) => (
            <Card
              key={title}
              className="animate-fade-up overflow-hidden rounded-[28px] border border-[var(--brand-blue-100)] bg-white py-0 shadow-[0_18px_38px_rgba(7,20,47,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(7,20,47,0.14)]"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <CardContent className="relative flex h-full flex-col px-6 py-7 sm:px-8 sm:py-8">
                <div className="absolute inset-x-0 top-0 h-1 bg-[var(--brand-blue-500)]" />
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-blue-50)] text-[var(--brand-blue-600)] shadow-inner shadow-white">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>

                <p className="mt-6 text-[length:var(--text-xs)] leading-[var(--text-xs--line-height)] font-semibold uppercase tracking-[0.22em] text-[var(--brand-blue-500)]">
                  {eyebrow}
                </p>

                <h3 className="mt-3 text-[length:var(--text-xl)] leading-[var(--text-xl--line-height)] font-semibold text-[var(--ink-500)]">
                  {title}
                </h3>

                <p className="mt-3 text-[length:var(--text-base)] leading-[var(--text-lg--line-height)] text-[var(--neutral-900)]">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
