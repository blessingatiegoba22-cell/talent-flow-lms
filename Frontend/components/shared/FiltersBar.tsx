"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

type Filters = {
  category?: string;
  level?: string;
  duration?: string;
  price?: string;
  sort?: string;
};

type Props = {
  onChange: (key: keyof Filters, value: string) => void;
  currentFilters?: Filters;
};

const FILTERS_OPTIONS = {
  category: ["Design", "Development", "Business"],
  level: ["Beginner", "Intermediate", "Expert"],
  duration: ["Short", "Medium", "Long"],
  price: ["Free", "Paid"],
  sort: ["Rating", "Newest", "Price"],
};

const FILTER_KEYS = Object.keys(FILTERS_OPTIONS) as Array<keyof Filters>;

const getFilterLabel = (key: keyof Filters) =>
  key.charAt(0).toUpperCase() + key.slice(1);

//  Please note the changes i made Dier.
// Fixed responsive filters bar with select dropdowns for desktop and a modal for mobile.
// FiltersBar now uses a responsive grid: 3 columns on compact desktop/tablet widths and 5 columns on wide screens, so it becomes 3 + 2 instead of 4 + 1.
// FiltersBar adds a mobile/compact filter button that opens a bottom popup instead of showing all filter selects in stacked rows.
// page now passes currentFilters into FiltersBar, so selections stay synced between the popup and the desktop controls.
export default function FiltersBar({ onChange, currentFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const activeFiltersCount = FILTER_KEYS.filter(
    (key) => currentFilters?.[key],
  ).length;

  // Extracted the select rendering into a separate function to avoid repetition between desktop and mobile views
  const renderSelect = (key: keyof Filters) => (
    <div key={key} className="relative group min-w-0">
      <select
        value={currentFilters?.[key] ?? ""}
        onChange={(e) => onChange(key, e.target.value)}
        className="w-full appearance-none bg-transparent flex items-center gap-2 text-sm font-bold text-foreground pl-3 pr-8 py-1.5 rounded-md border border-transparent hover:border-border hover:bg-muted transition cursor-pointer outline-none"
      >
        <option value="">{getFilterLabel(key)}</option>
        {FILTERS_OPTIONS[key].map((opt) => (
          <option key={opt} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
      />
    </div>
  );

  return (
    <>
      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-5 gap-4 border border-border bg-card px-4 py-3 rounded-md">
        {FILTER_KEYS.map(renderSelect)}
      </div>

      {/* this controls the mobile filter button */}
      <div className="lg:hidden border border-border bg-card px-4 py-3 rounded-md">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-bold text-foreground transition hover:bg-muted"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} />
            Filters
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            {activeFiltersCount > 0 && (
              <span className="text-xs font-bold text-foreground">
                {activeFiltersCount} selected
              </span>
            )}
            <ChevronDown size={16} />
          </span>
        </button>
      </div>

      {/* this is the mobile filter modal */}
      {isOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filters-title"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-md border-t border-border bg-card p-4 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id="filters-title" className="text-base font-bold">
                Filters
              </h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">{FILTER_KEYS.map(renderSelect)}</div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
// Cehck my changes and see for your own  corrections if need be
