import { OptimizedImage as Image } from "@/components/shared/optimized-image";

import { Card, CardContent } from "@/components/ui/card";
import { aboutHighlights, whoWeServe } from "@/data/landing-page";
import { cn } from "@/lib/utils";

function BlueDivider() {
  return <div className="my-8 h-3 w-full bg-(--brand-blue-500) sm:my-10 sm:h-4" />;
}

type AboutHighlightCardProps = (typeof aboutHighlights)[number];

function AboutHighlightCard({
  description,
  imageAlt,
  imagePosition,
  imageSrc,
  title,
}: AboutHighlightCardProps) {
  const isImageLeft = imagePosition === "left";

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
      <Card className="animate-fade-in overflow-hidden rounded-lg border border-(--brand-blue-100) bg-white py-0 shadow-[0_16px_35px_rgba(7,20,47,0.08)]">
        <div className="grid lg:grid-cols-2">
          <div
            className={cn(
              "flex px-5 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-12",
              isImageLeft ? "lg:order-2" : "lg:order-1",
            )}
          >
            <div className="my-auto mx-auto max-w-[32rem]">
              <h3 className="text-center text-[length:var(--text-display-xs)] leading-(--text-display-xs--line-height) font-bold tracking-[0] text-(--ink-500) sm:text-[length:var(--text-display-sm)] sm:leading-(--text-display-sm--line-height)">
                {title}
              </h3>
              <p className="mt-4 text-[length:var(--text-base)] leading-(--text-lg--line-height) text-(--neutral-900)">
                {description}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "relative min-h-44 border-t border-(--brand-blue-100) sm:min-h-[210px] md:min-h-[230px] lg:min-h-80 lg:border-t-0",
              isImageLeft ? "lg:order-1" : "lg:order-2",
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 92vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export function AboutSection() {
  const [aboutUs, mission, whyChooseUs, vision] = aboutHighlights;

  return (
    <section id="about" className="scroll-mt-32 bg-(--neutral-50) py-4">
      <BlueDivider />
      <AboutHighlightCard {...aboutUs} />

      <BlueDivider />
      <AboutHighlightCard {...mission} />

      <BlueDivider />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="rounded-lg bg-white p-6 shadow-[0_14px_28px_rgba(7,20,47,0.04)] sm:p-8 lg:p-10">
          <h3 className="text-center text-[length:var(--text-display-xs)] leading-(--text-display-xs--line-height) font-bold tracking-[0] text-(--ink-500) sm:text-[length:var(--text-display-sm)] sm:leading-(--text-display-sm--line-height)">
            Who We Serve
          </h3>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {whoWeServe.map((item, index) => (
              <Card
                key={item.title}
                className="animate-fade-in rounded-lg border border-(--brand-blue-100) bg-white py-0 text-center shadow-[0_16px_30px_rgba(7,20,47,0.08)] transition-shadow duration-700 ease-out hover:shadow-[0_18px_34px_rgba(7,20,47,0.12)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="flex min-h-[220px] flex-col justify-center px-6 py-8 sm:px-8">
                  <h4 className="text-[length:var(--text-xl)] leading-(--text-xl--line-height) font-semibold text-(--ink-500)">
                    {item.title}
                  </h4>
                  <p className="mt-4 text-[length:var(--text-base)] leading-(--text-lg--line-height) text-(--neutral-900)">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BlueDivider />
      <AboutHighlightCard {...whyChooseUs} />

      <BlueDivider />
      <AboutHighlightCard {...vision} />
    </section>
  );
}
