import { cookies } from "next/headers";

import type { BackendCourse } from "@/lib/course-service";

const INSTRUCTOR_COURSES_COOKIE = "talentflow_instructor_course_drafts";
const ONE_YEAR = 60 * 60 * 24 * 365;

export type StoredInstructorCourse = Pick<
  BackendCourse,
  | "category"
  | "created_at"
  | "description"
  | "duration_hours"
  | "id"
  | "is_published"
  | "level"
  | "price"
  | "title"
  | "updated_at"
>;

export async function getStoredInstructorCourses() {
  const cookieStore = await cookies();
  const value = cookieStore.get(INSTRUCTOR_COURSES_COOKIE)?.value;

  return parseStoredInstructorCourses(value);
}

export async function rememberInstructorCourse(course: BackendCourse) {
  const courses = await getStoredInstructorCourses();
  const nextCourses = upsertStoredCourse(courses, course);

  await storeInstructorCourses(nextCourses);

  return nextCourses;
}

export async function markInstructorCoursePublished(courseId: number) {
  const courses = await getStoredInstructorCourses();
  const nextCourses = courses.map((course) =>
    course.id === courseId
      ? {
          ...course,
          is_published: true,
          updated_at: new Date().toISOString(),
        }
      : course,
  );

  await storeInstructorCourses(nextCourses);

  return nextCourses;
}

function parseStoredInstructorCourses(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(decodeURIComponent(value)) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map(normalizeStoredCourse)
      .filter((course): course is StoredInstructorCourse => Boolean(course));
  } catch {
    return [];
  }
}

async function storeInstructorCourses(courses: StoredInstructorCourse[]) {
  const cookieStore = await cookies();
  const safeCourses = courses.slice(-8);

  cookieStore.set(
    INSTRUCTOR_COURSES_COOKIE,
    encodeURIComponent(JSON.stringify(safeCourses)),
    {
      httpOnly: true,
      maxAge: ONE_YEAR,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

function upsertStoredCourse(
  courses: StoredInstructorCourse[],
  course: BackendCourse,
) {
  const storedCourse = normalizeStoredCourse(course);

  if (!storedCourse) {
    return courses;
  }

  const remainingCourses = courses.filter((item) => item.id !== storedCourse.id);

  return [storedCourse, ...remainingCourses];
}

function normalizeStoredCourse(course: unknown): StoredInstructorCourse | null {
  if (!course || typeof course !== "object") {
    return null;
  }

  const candidate = course as Partial<StoredInstructorCourse>;
  const courseId = candidate.id;

  if (!Number.isInteger(courseId) || !courseId || !candidate.title) {
    return null;
  }

  return {
    category: candidate.category ?? null,
    created_at: candidate.created_at ?? null,
    description: candidate.description ?? null,
    duration_hours: candidate.duration_hours ?? null,
    id: courseId,
    is_published: Boolean(candidate.is_published),
    level: candidate.level ?? null,
    price: candidate.price ?? null,
    title: candidate.title,
    updated_at: candidate.updated_at ?? null,
  };
}
