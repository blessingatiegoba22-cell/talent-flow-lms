"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatedSelect } from "@/components/dashboard/animated-select";
import { getLevelLabel } from "@/lib/course-presenter";
import { cn } from "@/lib/utils";

export type CourseCatalogFilters = {
  category: string;
  duration: string;
  level: string;
  limit: number;
  price: string;
  search: string;
  sort: string;
};

type CourseCatalogToolbarProps = {
  categories: string[];
  filters: CourseCatalogFilters;
  levels: string[];
};

type FilterOption = {
  label: string;
  value: string;
};

type ToolbarFilterKey = "category" | "duration" | "level" | "price" | "sort";

const durationOptions: FilterOption[] = [
  { label: "Under 30 minutes", value: "under-30-minutes" },
  { label: "30-60 minutes", value: "30-60-minutes" },
  { label: "1-2 hours", value: "1-2-hours" },
];

const priceOptions: FilterOption[] = [
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
  { label: "Scholarship eligible", value: "scholarship-eligible" },
];

const sortOptions: FilterOption[] = [
  { label: "Most popular", value: "popular" },
  { label: "Highest rated", value: "highest-rated" },
  { label: "Newest first", value: "newest" },
  { label: "Shortest first", value: "shortest" },
];

export function CourseCatalogToolbar({
  categories,
  filters,
  levels,
}: CourseCatalogToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileFilters, setMobileFilters] = useState<
    Record<ToolbarFilterKey, string>
  >(() => getToolbarFilterValues(filters));

  const categoryOptions: FilterOption[] = [
    ...categories.map((category) => ({
      label: category,
      value: category,
    })),
  ];
  const levelOptions: FilterOption[] = [
    ...levels.map((level) => ({
      label: getLevelLabel(level),
      value: level,
    })),
  ];
  const filterGroups: Array<{
    key: ToolbarFilterKey;
    label: string;
    options: FilterOption[];
  }> = [
    {
      key: "category",
      label: "Categories",
      options: categoryOptions,
    },
    {
      key: "level",
      label: "Level",
      options: levelOptions,
    },
    {
      key: "duration",
      label: "Duration",
      options: durationOptions,
    },
    {
      key: "price",
      label: "Price",
      options: priceOptions,
    },
    {
      key: "sort",
      label: "Sort By",
      options: sortOptions,
    },
  ];

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

  function updateQuery(updates: Partial<Record<ToolbarFilterKey, string>>) {
    const nextFilters = {
      ...filters,
      ...updates,
    };
    const params = new URLSearchParams();

    setQueryParam(params, "category", nextFilters.category);
    setQueryParam(params, "duration", nextFilters.duration);
    setQueryParam(params, "level", nextFilters.level);
    setQueryParam(params, "price", nextFilters.price);
    setQueryParam(params, "search", nextFilters.search);
    setQueryParam(params, "sort", nextFilters.sort);

    if (nextFilters.limit !== 8) {
      params.set("limit", String(nextFilters.limit));
    }

    router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
  }

  function openMobileFilters() {
    setMobileFilters(getToolbarFilterValues(filters));
    setIsMobileOpen(true);
  }

  function updateMobileFilter(key: ToolbarFilterKey, value: string) {
    setMobileFilters((current) => ({
      ...current,
      [key]: current[key] === value ? "" : value,
    }));
  }

  function resetMobileFilters() {
    setMobileFilters({
      category: "",
      duration: "",
      level: "",
      price: "",
      sort: "",
    });
  }

  function applyMobileFilters() {
    updateQuery(mobileFilters);
    setIsMobileOpen(false);
  }

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
                  <div key={group.key}>
                    <h3 className="text-[14px] font-extrabold text-black">
                      {group.label}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            updateMobileFilter(group.key, option.value)
                          }
                          className={cn(
                            "min-h-9 rounded-md border border-[#d7d7d7] bg-[#f8f8f8] px-3 text-[13px] font-semibold text-[#252525] transition-colors duration-200 hover:border-(--brand-blue-300) hover:bg-[#eef3ff] hover:text-(--brand-blue-700)",
                            mobileFilters[group.key] === option.value &&
                              "border-(--brand-blue-300) bg-[#eef3ff] text-(--brand-blue-700)",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={resetMobileFilters}
                  className="h-11 rounded-lg border border-[#c7c7c7] bg-white text-[14px] font-extrabold text-[#2b2b2b]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={applyMobileFilters}
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
          onClick={openMobileFilters}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#c7c7c7] bg-white px-4 text-[14px] font-extrabold text-black shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:border-(--brand-blue-300) hover:text-(--brand-blue-600)"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters and sort
        </button>
      </div>

      <div className="relative hidden rounded-lg border border-[#c7c7c7] bg-white p-3 md:grid md:grid-cols-3 md:gap-3 xl:grid-cols-5">
        {filterGroups.map((group) => (
          <CatalogToolbarSelect
            key={group.key}
            ariaLabel={`${group.label} filter`}
            onChange={(value) => updateQuery({ [group.key]: value })}
            options={group.options}
            placeholder={group.label}
            value={filters[group.key]}
          />
        ))}
      </div>

      {mobileDialog}
    </section>
  );
}

function CatalogToolbarSelect({
  ariaLabel,
  onChange,
  options,
  placeholder,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  value: string;
}) {
  return (
    <AnimatedSelect
      ariaLabel={ariaLabel}
      buttonClassName="border border-transparent hover:border-(--brand-blue-300)"
      onChange={(label) => {
        const nextValue = getOptionValue(options, label);

        onChange(nextValue === value ? "" : nextValue);
      }}
      options={options.map((option) => option.label)}
      placeholder={placeholder}
      value={getOptionLabel(options, value)}
    />
  );
}

function getOptionLabel(options: FilterOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "";
}

function getOptionValue(options: FilterOption[], label: string) {
  return options.find((option) => option.label === label)?.value ?? "";
}

function setQueryParam(
  params: URLSearchParams,
  key: string,
  value: string,
) {
  const trimmedValue = value.trim();

  if (trimmedValue) {
    params.set(key, trimmedValue);
  }
}

function getToolbarFilterValues(filters: CourseCatalogFilters) {
  return {
    category: filters.category,
    duration: filters.duration,
    level: filters.level,
    price: filters.price,
    sort: filters.sort,
  };
}

export function CourseCatalogMobileSearch({
  search,
}: {
  search: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(search);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set("search", trimmedValue);
    }

    router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
  }

  return (
    <form onSubmit={submitSearch} className="mt-5 flex gap-2 md:hidden">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search courses</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#767676]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search courses"
          className="h-11 w-full rounded-md border border-[#cfcfcf] bg-white pl-10 pr-3 text-[14px] font-semibold text-black outline-none transition-all duration-300 placeholder:text-[#777] focus:border-(--brand-blue-400) focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
        />
      </label>
      <button
        type="submit"
        className="h-11 rounded-md bg-(--brand-blue-500) px-4 text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
      >
        Search
      </button>
    </form>
  );
}
