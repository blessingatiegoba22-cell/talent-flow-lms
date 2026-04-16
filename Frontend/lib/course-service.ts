import { backendFetchJson } from "@/lib/backend";
import { getRequestCookieHeader } from "@/lib/backend-cookies";

export type BackendCourse = {
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
  duration_hours?: number | null;
  enrollment_count?: number;
  id: number;
  instructor_id?: number | string | null;
  is_published?: boolean;
  level?: string | null;
  price?: number | string | null;
  title: string;
  updated_at?: string | null;
};

export type CourseQuery = {
  category?: string;
  level?: string;
  limit?: number;
  search?: string;
  skip?: number;
};

export type EnrollCourseResponse = {
  course_id?: number;
  message?: string;
};

export async function getCourses(query: CourseQuery = {}) {
  const searchParams = new URLSearchParams();

  setNumericSearchParam(searchParams, "skip", query.skip);
  setNumericSearchParam(searchParams, "limit", query.limit);
  setTextSearchParam(searchParams, "category", query.category);
  setTextSearchParam(searchParams, "level", query.level);
  setTextSearchParam(searchParams, "search", query.search);

  const path = searchParams.size
    ? `/courses/?${searchParams.toString()}`
    : "/courses/";
  const { data } = await backendFetchJson<BackendCourse[]>(path);

  return data;
}

export async function getCourse(courseId: number) {
  const { data } = await backendFetchJson<BackendCourse>(
    `/courses/${courseId}`,
  );

  return data;
}

export async function enrollInCourse(courseId: number) {
  const cookieHeader = await getRequestCookieHeader();
  const { data } = await backendFetchJson<EnrollCourseResponse>(
    `/courses/${courseId}/enroll`,
    {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      method: "POST",
    },
  );

  return data;
}

function setTextSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  const trimmedValue = value?.trim();

  if (trimmedValue) {
    searchParams.set(key, trimmedValue);
  }
}

function setNumericSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: number | undefined,
) {
  if (typeof value === "number" && Number.isFinite(value)) {
    searchParams.set(key, String(value));
  }
}
