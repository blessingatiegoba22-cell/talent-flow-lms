"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { landingNavLinks } from "@/data/landing-page";
import { cn } from "@/lib/utils";

import { BrandLogo } from "./brand-logo";

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");

  const closeMenu = () => setIsMenuOpen(false);

  const scrollToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const target = document.getElementById(href.slice(1));

    if (!target) {
      return;
    }

    event.preventDefault();
    setActiveHref(href);
    closeMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }
  };

  useEffect(() => {
    const sectionLinks = landingNavLinks.map((link) => ({
      href: link.href,
      element: document.getElementById(link.href.replace("#", "")),
    }));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const matchedLink = sectionLinks.find(
          (link) => link.element?.id === visibleEntry.target.id,
        );

        if (matchedLink) {
          setActiveHref(matchedLink.href);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sectionLinks.forEach((link) => {
      if (link.element) {
        observer.observe(link.element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-(--brand-blue-950) backdrop-blur-lg">
      <div className="relative mx-auto max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between gap-4 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-6">
          <BrandLogo priority className="shrink-0" />

          <nav className="hidden flex-1 items-center justify-center gap-5 justify-self-center text-[length:var(--text-sm)] leading-(--text-sm--line-height) font-medium text-white/70 lg:flex">
            {landingNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href)}
                className={cn(
                  "relative cursor-pointer px-1 py-1 transition-colors duration-500 ease-out hover:text-(--neutral-50)",
                  "after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-(--brand-blue-400) after:transition-[width] after:duration-500 after:ease-out hover:after:w-full",
                  activeHref === link.href
                    ? "text-(--neutral-50) after:w-full"
                    : "text-white/70",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 justify-self-end lg:flex">
            <Button
              asChild
              className="h-10 min-w-28 translate-y-0 transform-gpu cursor-pointer rounded-lg bg-(--brand-blue-500) px-5 text-[length:var(--text-sm)] font-semibold text-(--neutral-50) shadow-[0_16px_32px_rgba(37,99,235,0.25)] transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-px hover:bg-(--brand-blue-400) hover:shadow-[0_20px_36px_rgba(37,99,235,0.32)] sm:min-w-34"
            >
              <Link href="/sign-in">Login</Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="h-10 min-w-28 translate-y-0 transform-gpu cursor-pointer rounded-lg border border-(--neutral-50) bg-transparent px-5 text-[length:var(--text-sm)] font-semibold text-(--neutral-50) transition-[transform,background-color,color,border-color,box-shadow] duration-500 ease-out hover:-translate-y-px hover:border-(--neutral-50) hover:bg-(--neutral-50) hover:text-(--brand-blue-950) hover:shadow-[0_18px_34px_rgba(7,20,47,0.2)] sm:min-w-34"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="h-11 w-11 rounded-lg border border-white/15 bg-white/5 p-0 text-(--neutral-50) transition-colors duration-300 hover:bg-white/10 hover:text-(--neutral-50) lg:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        <div
          id="mobile-nav-menu"
          className={cn(
            "pointer-events-none absolute left-4 right-4 top-[calc(100%+0.25rem)] z-50 origin-top transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:left-6 sm:right-6 lg:hidden",
            isMenuOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-[0.98] opacity-0",
          )}
        >
          <div className="rounded-lg border border-white/12 bg-(--brand-blue-800) p-4 shadow-[0_22px_48px_rgba(7,20,47,0.38)]">
            <nav className="flex flex-col gap-2">
              {landingNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => scrollToSection(event, link.href)}
                  className={cn(
                    "cursor-pointer rounded-lg px-4 py-3 text-[length:var(--text-base)] leading-(--text-base--line-height) font-medium transition-colors duration-500 ease-out",
                    activeHref === link.href
                      ? "bg-white/12 text-(--neutral-50)"
                      : "text-white/80 hover:bg-white/8 hover:text-(--neutral-50)",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                asChild
                onClick={closeMenu}
                className="h-11 translate-y-0 transform-gpu cursor-pointer rounded-lg bg-(--brand-blue-500) px-5 text-[length:var(--text-sm)] font-semibold text-(--neutral-50) shadow-[0_16px_32px_rgba(37,99,235,0.25)] transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-px hover:bg-(--brand-blue-400) hover:shadow-[0_20px_36px_rgba(37,99,235,0.32)]"
              >
                <Link href="/sign-in">Login</Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                onClick={closeMenu}
                className="h-11 translate-y-0 transform-gpu cursor-pointer rounded-lg border border-(--neutral-50) bg-transparent px-5 text-[length:var(--text-sm)] font-semibold text-(--neutral-50) transition-[transform,background-color,color,border-color,box-shadow] duration-500 ease-out hover:-translate-y-px hover:border-(--neutral-50) hover:bg-(--neutral-50) hover:text-(--brand-blue-950) hover:shadow-[0_18px_34px_rgba(7,20,47,0.2)]"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
