import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { heroMetrics, trustedUserImages } from "@/data/landing-page";

export function HeroSection() {
  return (
    <section
      id="home"
      className="scroll-mt-32 bg-[var(--brand-blue-700)] text-[var(--neutral-50)]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.96fr)] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="max-w-[36rem] animate-fade-up">
          <h1 className="max-w-[12ch] text-[length:var(--text-display-sm)] leading-[var(--text-display-sm--line-height)] font-bold tracking-[-0.03em] sm:text-[length:var(--text-display-md)] sm:leading-[var(--text-display-md--line-height)] lg:text-[length:var(--text-display-lg)] lg:leading-[var(--text-display-lg--line-height)]">
            Unlock Your Potential, One Skill at a Time
          </h1>

          <p className="mt-6 max-w-xl text-[length:var(--text-md)] leading-[var(--text-lg--line-height)] text-white/80 sm:text-[length:var(--text-lg)]">
            Talent Flow helps you discover the right courses, master in-demand
            skills, and track your progress all in one seamless learning
            platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="h-12 min-w-[168px] translate-y-0 transform-gpu rounded-xl bg-[var(--brand-blue-500)] px-6 text-[length:var(--text-base)] font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)] hover:shadow-[0_24px_42px_rgba(37,99,235,0.34)]"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="h-12 min-w-[168px] translate-y-0 transform-gpu rounded-xl border border-[var(--neutral-50)] bg-transparent px-6 text-[length:var(--text-base)] font-semibold text-[var(--neutral-50)] transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-in-out hover:-translate-y-0.5 hover:border-[var(--neutral-50)] hover:bg-[var(--neutral-50)] hover:text-[var(--brand-blue-950)] hover:shadow-[0_20px_38px_rgba(7,20,47,0.2)]"
            >
              <a href="#about">Learn More</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-[length:var(--text-md)] leading-[var(--text-md--line-height)] font-semibold text-white/75">
            <div className="flex -space-x-3">
              {trustedUserImages.map((image, index) => (
                <span
                  key={image.src}
                  className="relative block h-12 w-12 overflow-hidden rounded-full border-2 border-[var(--brand-blue-700)] bg-white shadow-[0_10px_20px_rgba(7,20,47,0.2)]"
                  style={{ zIndex: trustedUserImages.length - index }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={59}
                    height={59}
                    className="h-full w-full object-cover"
                  />
                </span>
              ))}
            </div>
            <p>Trusted by 50,000+ learners worldwide</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
            {heroMetrics.map(({ icon: Icon, label, value }, index) => (
              <div
                key={label}
                className="min-w-[132px] animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2.5 text-[var(--neutral-50)]">
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="text-[length:var(--text-display-xs)] leading-none font-bold tracking-[-0.02em]">
                    {value}
                  </span>
                </div>
                <p className="mt-1.5 pl-[26px] text-[length:var(--text-sm)] leading-[var(--text-sm--line-height)] text-white/72">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up-delay">
          <div className="mx-auto max-w-[34rem] rounded-[30px] bg-white/10 p-3 shadow-[0_28px_60px_rgba(7,20,47,0.35)] backdrop-blur-sm lg:max-w-none">
            <div className="overflow-hidden rounded-[24px]">
              <Image
                src="/banner-img.png"
                alt="Learners collaborating around laptops"
                width={2424}
                height={2476}
                priority
                className="animate-float-soft aspect-[0.97] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
