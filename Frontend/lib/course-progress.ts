import { cookies } from "next/headers";

const COURSE_PROGRESS_COOKIE = "talentflow_course_progress";
const ONE_YEAR = 60 * 60 * 24 * 365;

export type CourseProgressMap = Record<string, number>;

export type CourseProgressUpdate = {
  courseId: number;
  progress: number;
  reachedCompletion: boolean;
};

export async function getStoredCourseProgressMap() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COURSE_PROGRESS_COOKIE)?.value;

  return parseCourseProgress(value);
}

export async function advanceStoredCourseProgress(
  courseId: number,
  increment = 15,
): Promise<CourseProgressUpdate> {
  const cookieStore = await cookies();
  const progressMap = parseCourseProgress(
    cookieStore.get(COURSE_PROGRESS_COOKIE)?.value,
  );
  const key = String(courseId);
  const previousProgress = normalizeProgress(progressMap[key] ?? 0);
  const nextProgress = normalizeProgress(previousProgress + increment);

  progressMap[key] = nextProgress;
  cookieStore.set(COURSE_PROGRESS_COOKIE, stringifyCourseProgress(progressMap), {
    httpOnly: true,
    maxAge: ONE_YEAR,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return {
    courseId,
    progress: nextProgress,
    reachedCompletion: previousProgress < 100 && nextProgress >= 100,
  };
}

export async function clearStoredCourseProgress() {
  const cookieStore = await cookies();

  cookieStore.set(COURSE_PROGRESS_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function parseCourseProgress(value: string | undefined): CourseProgressMap {
  if (!value) {
    return {};
  }

  return value.split(",").reduce<CourseProgressMap>((progressMap, entry) => {
    const [courseId, progress] = entry.split(":");
    const parsedCourseId = Number(courseId);
    const parsedProgress = Number(progress);

    if (
      Number.isInteger(parsedCourseId) &&
      parsedCourseId > 0 &&
      Number.isFinite(parsedProgress)
    ) {
      progressMap[String(parsedCourseId)] = normalizeProgress(parsedProgress);
    }

    return progressMap;
  }, {});
}

function stringifyCourseProgress(progressMap: CourseProgressMap) {
  return Object.entries(progressMap)
    .filter(([courseId, progress]) => {
      const parsedCourseId = Number(courseId);

      return (
        Number.isInteger(parsedCourseId) &&
        parsedCourseId > 0 &&
        Number.isFinite(progress)
      );
    })
    .map(([courseId, progress]) => `${courseId}:${normalizeProgress(progress)}`)
    .join(",");
}

function normalizeProgress(progress: number) {
  return Math.min(100, Math.max(0, Math.round(progress)));
}
