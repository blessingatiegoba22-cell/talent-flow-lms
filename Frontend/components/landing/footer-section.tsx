import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { footerColumns, socialLinks } from "@/data/landing-page";

import { BrandLogo } from "./brand-logo";

export function FooterSection() {
  return (
    <footer
      id="contact"
      className="scroll-mt-32 relative overflow-hidden bg-[var(--brand-blue-950)] text-white"
    >
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <a
          href="#home"
          aria-label="Scroll to the top of the page"
          className="absolute right-4 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_14px_30px_rgba(7,20,47,0.32)] transition duration-300 hover:-translate-y-1 hover:bg-[var(--brand-blue-500)] sm:right-6 sm:top-8 lg:right-8"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </a>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="max-w-[18rem] lg:shrink-0">
            <BrandLogo href="#home" />
            <p className="mt-5 text-[length:var(--text-display-xs)] leading-[var(--text-display-xs--line-height)] text-white/92">
              Unlock Your Potential, One Skill at a Time
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:flex-1 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[length:var(--text-xl)] leading-[var(--text-xl--line-height)] font-semibold text-white">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3 text-[length:var(--text-lg)] leading-[var(--text-lg--line-height)] text-white/80">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer transition-[color,transform] duration-300 ease-in-out hover:translate-x-1 hover:text-[var(--neutral-50)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10 bg-white/12" />

        <div className="max-w-3xl">
          <h3 className="text-[length:var(--text-display-xs)] leading-[var(--text-display-xs--line-height)] font-semibold">
            Newsletter
          </h3>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="rounded-xl bg-[var(--neutral-50)] p-[1px] sm:flex-1">
              <Input
                type="email"
                placeholder="Enter Your Email"
                className="h-14 w-full appearance-none rounded-[11px] border-0 bg-[var(--neutral-50)] px-4 text-[length:var(--text-lg)] text-[var(--ink-500)] shadow-none [color-scheme:light] placeholder:text-[var(--neutral-800)] focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-transparent"
              />
            </div>

            <Button
              type="button"
              className="h-14 translate-y-0 transform-gpu rounded-xl bg-[var(--neutral-50)] px-8 text-[length:var(--text-lg)] font-semibold text-[var(--ink-500)] transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-50)] hover:shadow-[0_20px_38px_rgba(7,20,47,0.16)] sm:min-w-[226px]"
            >
              Subscribe
            </Button>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/12 pt-8 text-[length:var(--text-lg)] leading-[var(--text-lg--line-height)] text-white/85 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 TalentFlow. All rights reserved.</p>

          <div className="flex flex-wrap gap-6 sm:gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition-[color,transform] duration-300 ease-in-out hover:-translate-y-0.5 hover:text-[var(--brand-blue-100)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
