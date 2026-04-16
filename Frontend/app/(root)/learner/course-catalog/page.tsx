import type { Metadata } from "next";
import Link from "next/link";

import {
  CourseCatalogMobileSearch,
  CourseCatalogToolbar,
} from "@/components/dashboard/course-catalog-toolbar";
import { CatalogCourseSection } from "@/components/dashboard/learner-course-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import { type BackendCourse, getCourses } from "@/lib/course-service";
import { toCourseCardView } from "@/lib/course-presenter";
import { getStoredCourseProgressMap } from "@/lib/course-progress";
import { getStoredEnrolledCourseIds } from "@/lib/enrolled-courses";

export const metadata: Metadata = {
  title: "Course Catalog",
  description:
    "Browse recommended and popular courses available to Talent Flow LMS learners.",
};

type CourseCatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CourseCatalogPage({
  searchParams,
}: CourseCatalogPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = getCatalogFilters(resolvedSearchParams);
  const [allCourses, enrolledCourseIds, courseProgress] = await Promise.all([
    getCourses({ limit: 100 }),
    getStoredEnrolledCourseIds(),
    getStoredCourseProgressMap(),
  ]);
  const filteredCourses = getSortedCatalogCourses(
    getFilteredCatalogCourses(allCourses, filters),
    filters.sort,
  );
  const skip = filters.skip ?? 0;
  const limit = filters.limit ?? 8;
  const courseCards = filteredCourses.slice(skip, skip + limit).map((course) =>
    toCourseCardView(course, enrolledCourseIds, courseProgress),
  );
  const popularCourseCards = getPopularCourses(allCourses)
    .slice(0, 3)
    .map((course) =>
      toCourseCardView(course, enrolledCourseIds, courseProgress),
    );
  const categories = getUniqueOptions(
    allCourses.map((course) => course.category),
  );
  const levels = getUniqueOptions(allCourses.map((course) => course.level));

  return (
    <div className="mx-auto max-w-280 animate-fade-up">
      <DashboardPageHeader title="Courses" />
      <CourseCatalogMobileSearch search={filters.search ?? ""} />
      {filters.search ? <SearchSummary search={filters.search} /> : null}

      <CourseCatalogToolbar
        categories={categories}
        filters={{
          category: filters.category ?? "",
          duration: filters.duration ?? "",
          level: filters.level ?? "",
          limit: filters.limit ?? 8,
          price: filters.price ?? "",
          search: filters.search ?? "",
          sort: filters.sort ?? "",
        }}
        levels={levels}
      />

      {courseCards.length ? (
        <>
          <CatalogCourseSection
            title="Recommended for you"
            courses={courseCards}
          />
          <CatalogPagination
            count={courseCards.length}
            filters={filters}
            totalCount={filteredCourses.length}
          />
        </>
      ) : (
        <EmptyCatalogState />
      )}

      {popularCourseCards.length ? (
        <CatalogCourseSection
          actionHref="/learner/course-catalog?sort=popular"
          title="Popular Courses"
          courses={popularCourseCards}
        />
      ) : null}
    </div>
  );
}

function SearchSummary({ search }: { search: string }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <span className="rounded-md bg-[#eef3ff] px-3 py-2 text-[13px] font-extrabold text-(--brand-blue-800)">
        Search: {search}
      </span>
      <Link
        href="/learner/course-catalog"
        className="text-[13px] font-extrabold text-[#5f5f5f] transition-colors duration-300 hover:text-(--brand-blue-600)"
      >
        Clear search
      </Link>
    </div>
  );
}

function CatalogPagination({
  count,
  filters,
  totalCount,
}: {
  count: number;
  filters: ReturnType<typeof getCatalogFilters>;
  totalCount: number;
}) {
  const skip = filters.skip ?? 0;
  const limit = filters.limit ?? 8;
  const previousSkip = Math.max(0, skip - limit);
  const hasPrevious = skip > 0;
  const hasNext = skip + count < totalCount;

  if (!hasPrevious && !hasNext) {
    return null;
  }

  return (
    <nav
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Course pagination"
    >
      <p className="text-[13px] font-semibold text-[#606060]">
        Showing {skip + 1}-{skip + count} of {totalCount}
      </p>
      <div className="flex gap-3">
        {hasPrevious ? (
          <Link
            href={getCatalogHref({ ...filters, skip: previousSkip })}
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#c7c7c7] px-4 text-[13px] font-extrabold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-(--brand-blue-300) hover:text-(--brand-blue-600)"
          >
            Previous
          </Link>
        ) : null}
        {hasNext ? (
          <Link
            href={getCatalogHref({ ...filters, skip: skip + limit })}
            className="inline-flex h-10 items-center justify-center rounded-md bg-(--brand-blue-500) px-4 text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

function getCatalogFilters(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return {
    category: getStringSearchParam(searchParams.category),
    duration: getStringSearchParam(searchParams.duration),
    level: getStringSearchParam(searchParams.level),
    limit: getNumberSearchParam(searchParams.limit, 8, 1, 100),
    price: getStringSearchParam(searchParams.price),
    search: getStringSearchParam(searchParams.search),
    skip: getNumberSearchParam(searchParams.skip, 0, 0, 10000),
    sort: getStringSearchParam(searchParams.sort),
  };
}

function getCatalogHref(filters: ReturnType<typeof getCatalogFilters>) {
  const params = new URLSearchParams();

  setParam(params, "category", filters.category);
  setParam(params, "duration", filters.duration);
  setParam(params, "level", filters.level);
  setParam(params, "price", filters.price);
  setParam(params, "search", filters.search);
  setParam(params, "sort", filters.sort);

  if ((filters.limit ?? 8) !== 8) {
    setParam(params, "limit", String(filters.limit ?? 8));
  }

  if ((filters.skip ?? 0) > 0) {
    setParam(params, "skip", String(filters.skip ?? 0));
  }

  return params.size
    ? `/learner/course-catalog?${params.toString()}`
    : "/learner/course-catalog";
}

function getStringSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNumberSearchParam(
  value: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const parsedValue = Number(getStringSearchParam(value));

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(parsedValue)));
}

function getUniqueOptions(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  ).sort((a, b) => a.localeCompare(b));
}

function EmptyCatalogState() {
  return (
    <section className="mt-8 rounded-lg border border-[#cfcfcf] bg-[#f8f8f8] px-5 py-10 text-center">
      <h2 className="text-[22px] font-extrabold text-black">
        No courses found
      </h2>
      <p className="mx-auto mt-3 max-w-120 text-[14px] font-medium leading-[1.6] text-[#606060]">
        Try a different keyword, category, level, duration, or price.
      </p>
      <Link
        href="/learner/course-catalog"
        className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-(--brand-blue-500) px-5 text-[14px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
      >
        Clear filters
      </Link>
    </section>
  );
}

function getFilteredCatalogCourses(
  courses: BackendCourse[],
  filters: ReturnType<typeof getCatalogFilters>,
) {
  return courses.filter((course) => {
    if (filters.category && !matchesText(course.category, filters.category)) {
      return false;
    }

    if (filters.level && course.level !== filters.level) {
      return false;
    }

    if (filters.search && !matchesCourseSearch(course, filters.search)) {
      return false;
    }

    if (
      filters.duration &&
      !matchesDurationFilter(course.duration_hours, filters.duration)
    ) {
      return false;
    }

    if (filters.price && !matchesPriceFilter(course.price, filters.price)) {
      return false;
    }

    return true;
  });
}

function getSortedCatalogCourses(courses: BackendCourse[], sort?: string) {
  const sortedCourses = [...courses];

  if (sort === "popular") {
    return sortedCourses.sort(comparePopularCourses);
  }

  if (sort === "highest-rated") {
    return sortedCourses.sort(
      (firstCourse, secondCourse) =>
        getCourseRatingValue(secondCourse) - getCourseRatingValue(firstCourse),
    );
  }

  if (sort === "newest") {
    return sortedCourses.sort(compareNewestCourses);
  }

  if (sort === "shortest") {
    return sortedCourses.sort(
      (firstCourse, secondCourse) =>
        getDurationValue(firstCourse) - getDurationValue(secondCourse),
    );
  }

  return sortedCourses;
}

function getPopularCourses(courses: BackendCourse[]) {
  return [...courses].sort(comparePopularCourses);
}

function comparePopularCourses(
  firstCourse: BackendCourse,
  secondCourse: BackendCourse,
) {
  const enrollmentDifference =
    (secondCourse.enrollment_count ?? 0) - (firstCourse.enrollment_count ?? 0);

  if (enrollmentDifference !== 0) {
    return enrollmentDifference;
  }

  const ratingDifference =
    getCourseRatingValue(secondCourse) - getCourseRatingValue(firstCourse);

  if (ratingDifference !== 0) {
    return ratingDifference;
  }

  return firstCourse.title.localeCompare(secondCourse.title);
}

function compareNewestCourses(
  firstCourse: BackendCourse,
  secondCourse: BackendCourse,
) {
  const firstTime = getDateTime(firstCourse.created_at);
  const secondTime = getDateTime(secondCourse.created_at);

  if (firstTime !== secondTime) {
    return secondTime - firstTime;
  }

  return secondCourse.id - firstCourse.id;
}

function matchesCourseSearch(course: BackendCourse, search: string) {
  return [course.title, course.description, course.category]
    .filter(Boolean)
    .some((value) => matchesText(value, search));
}

function matchesText(value: string | null | undefined, search: string) {
  return value?.toLowerCase().includes(search.toLowerCase()) ?? false;
}

function matchesDurationFilter(
  durationHours: number | null | undefined,
  filter: string,
) {
  if (!durationHours) {
    return false;
  }

  if (filter === "under-30-minutes") {
    return durationHours < 0.5;
  }

  if (filter === "30-60-minutes") {
    return durationHours >= 0.5 && durationHours <= 1;
  }

  if (filter === "1-2-hours") {
    return durationHours > 1 && durationHours <= 2;
  }

  return true;
}

function matchesPriceFilter(
  price: BackendCourse["price"],
  filter: string,
) {
  const priceValue = getPriceValue(price);

  if (filter === "free" || filter === "scholarship-eligible") {
    return priceValue === 0;
  }

  if (filter === "paid") {
    return priceValue > 0;
  }

  return true;
}

function getPriceValue(price: BackendCourse["price"]) {
  if (typeof price === "number") {
    return price;
  }

  const normalizedPrice = price?.trim().toLowerCase();

  if (!normalizedPrice || normalizedPrice === "free") {
    return 0;
  }

  const parsedPrice = Number(normalizedPrice.replace(/[^0-9.]/g, ""));

  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

function getDurationValue(course: BackendCourse) {
  return course.duration_hours ?? Number.MAX_SAFE_INTEGER;
}

function getDateTime(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getCourseRatingValue(course: BackendCourse) {
  return 4 + (course.id % 6) / 10;
}

function setParam(
  params: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  if (value && value !== "0") {
    params.set(key, value);
  }
}
