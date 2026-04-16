import { cookies } from "next/headers";

const ENROLLED_COURSES_COOKIE = "talentflow_enrolled_course_ids";
const ONE_YEAR = 60 * 60 * 24 * 365;

// The backend enroll endpoint writes the source of truth, but there is no
// enrolled-courses read endpoint yet. This cookie lets server-rendered learner
// pages reflect enrollments immediately after a successful POST.
export async function getStoredEnrolledCourseIds() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ENROLLED_COURSES_COOKIE)?.value;

  return parseCourseIds(value);
}

export async function storeEnrolledCourseId(courseId: number) {
  const cookieStore = await cookies();
  const courseIds = parseCourseIds(
    cookieStore.get(ENROLLED_COURSES_COOKIE)?.value,
  );

  if (!courseIds.includes(courseId)) {
    courseIds.push(courseId);
  }

  cookieStore.set(ENROLLED_COURSES_COOKIE, courseIds.join(","), {
    httpOnly: true,
    maxAge: ONE_YEAR,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return courseIds;
}

function parseCourseIds(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
}
