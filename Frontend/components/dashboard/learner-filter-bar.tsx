"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X } from "lucide-react";

import { AnimatedSelect } from "@/components/dashboard/animated-select";
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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {},
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen]);

  const updateFilter = (label: string, option: string) => {
    setSelectedOptions((current) => ({
      ...current,
      [label]: option,
    }));
  };

  const mobileDialog =
    isMobileOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[80] md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/42 backdrop-blur-[2px]"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close filters"
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto rounded-t-lg bg-white p-5 shadow-[0_-18px_50px_rgba(0,0,0,0.24)]">
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
                          onClick={() => updateFilter(group.label, option)}
                          className={cn(
                            "min-h-9 rounded-md border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[13px] font-semibold text-[#252525] transition-colors duration-200 hover:border-(--brand-blue-300) hover:bg-[#eef3ff] hover:text-(--brand-blue-700)",
                            selectedOptions[group.label] === option &&
                              "border-(--brand-blue-300) bg-[#eef3ff] text-(--brand-blue-700)",
                          )}
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
                  onClick={() => setSelectedOptions({})}
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
          </div>,
          document.body,
        )
      : null;

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
        {filterGroups.map((group) => (
          <AnimatedSelect
            key={group.label}
            ariaLabel={`${group.label} filter`}
            buttonClassName="border border-transparent hover:border-(--brand-blue-300)"
            onChange={(option) => updateFilter(group.label, option)}
            options={group.options}
            placeholder={group.label}
            value={selectedOptions[group.label] ?? ""}
          />
        ))}
      </div>

      {mobileDialog}
    </section>
  );
}
