"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type CatalogFilterGroup = {
  label: string;
  options: readonly string[];
};

type FilterBarProps = {
  filters?: readonly string[];
  groups?: readonly CatalogFilterGroup[];
};

const fallbackOptions: Record<string, readonly string[]> = {
  Categories: ["Design", "Development", "Writing", "Productivity"],
  Duration: ["Under 30 minutes", "30-60 minutes", "1-2 hours"],
  Level: ["Beginner", "Intermediate", "Advanced"],
  Price: ["Free", "Paid", "Scholarship eligible"],
  "Sort By": ["Most popular", "Highest rated", "Newest first", "Shortest first"],
};

export function FilterBar({ filters = [], groups }: FilterBarProps) {
  const filterGroups =
    groups ??
    filters.map((filter) => ({
      label: filter,
      options: fallbackOptions[filter] ?? ["All"],
    }));
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <section className="mt-7 sm:mt-8" aria-label="Course filters">
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#c7c7c7] bg-white px-4 text-[14px] font-extrabold text-black shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:border-(--brand-blue-300) hover:text-(--brand-blue-600)"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters and sort
        </button>
      </div>

      <div className="relative hidden rounded-lg border border-[#c7c7c7] bg-white p-3 md:grid md:grid-cols-3 md:gap-3 xl:grid-cols-5">
        {filterGroups.map((group) => {
          const isActive = activeFilter === group.label;

          return (
            <div key={group.label} className="relative">
              <button
                type="button"
                onClick={() => setActiveFilter(isActive ? null : group.label)}
                className={cn(
                  "flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-transparent bg-[#f7f7f7] px-4 text-left text-[14px] font-extrabold text-black transition-all duration-300 ease-in-out hover:border-(--brand-blue-300) hover:bg-white hover:text-(--brand-blue-600)",
                  isActive &&
                    "border-(--brand-blue-300) bg-white text-(--brand-blue-700) shadow-[0_10px_22px_rgba(37,99,235,0.12)]",
                )}
                aria-expanded={isActive}
              >
                <span className="min-w-0 truncate">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-300",
                    isActive && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {isActive ? (
                <div className="absolute left-0 top-full z-20 mt-2 w-full min-w-[190px] rounded-lg border border-[#d7d7d7] bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
                  {group.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="flex min-h-9 w-full cursor-pointer items-center rounded-md px-3 text-left text-[13px] font-semibold text-[#2b2b2b] transition-colors duration-200 hover:bg-[#eef3ff] hover:text-(--brand-blue-700)"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/42 backdrop-blur-[2px]"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-lg bg-white p-5 shadow-[0_-18px_50px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-extrabold leading-tight text-black">
                  Filter courses
                </h2>
                <p className="mt-1 text-[13px] font-medium text-[#626262]">
                  Choose what you want to see first.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#d7d7d7] text-black transition-colors duration-300 hover:border-(--brand-blue-300) hover:text-(--brand-blue-600)"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {filterGroups.map((group) => (
                <div key={group.label}>
                  <h3 className="text-[14px] font-extrabold text-black">
                    {group.label}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="min-h-9 rounded-md border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[13px] font-semibold text-[#252525] transition-colors duration-200 hover:border-(--brand-blue-300) hover:bg-[#eef3ff] hover:text-(--brand-blue-700)"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="h-11 rounded-lg border border-[#c7c7c7] bg-white text-[14px] font-extrabold text-[#2b2b2b]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="h-11 rounded-lg bg-(--brand-blue-500) text-[14px] font-extrabold text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)]"
              >
                Show courses
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
