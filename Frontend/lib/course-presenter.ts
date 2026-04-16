import type { BackendCourse } from "@/lib/course-service";

export type CourseCardView = {
  author?: string;
  cta: string;
  href: string;
  id: number;
  image: string;
  isEnrolled?: boolean;
  lessonHref?: string;
  meta: string;
  progress: number;
  rating?: string;
  title: string;
};

export type CourseLesson = {
  duration: string;
  id: string;
  kind: "video" | "reading";
  moduleId: string;
  moduleTitle: string;
  overview: string;
  resourceLabel: string;
  title: string;
};

export type CourseModule = {
  id: string;
  lessons: CourseLesson[];
  title: string;
};

type CourseProgressLookup = Record<string, number>;

const COURSE_IMAGES = [
  "/course-1.webp",
  "/course-2.webp",
  "/course-3.webp",
  "/course-4.webp",
  "/course-5.webp",
  "/course-6.webp",
  "/course-7.webp",
  "/course-8.webp",
];

export function toCourseCardView(
  course: BackendCourse,
  enrolledCourseIds: readonly number[] = [],
  courseProgress: CourseProgressLookup = {},
): CourseCardView {
  const isEnrolled = enrolledCourseIds.includes(course.id);
  const firstLesson = buildCourseModules(course)[0]?.lessons[0];
  const firstLessonHref = getLessonHref(course.id, firstLesson?.id ?? "m1-l1");
  const progress = isEnrolled ? getCourseProgress(course.id, courseProgress) : 0;

  return {
    author: getInstructorLabel(course),
    cta: isEnrolled ? "Continue" : "Enroll",
    href: getCourseHref(course.id),
    id: course.id,
    image: getCourseImage(course),
    isEnrolled,
    lessonHref: firstLessonHref,
    meta: getCourseMeta(course),
    progress,
    rating: getCourseRating(course),
    title: course.title,
  };
}

export function toLearningCourseView(
  course: BackendCourse,
  enrolledCourseIds: readonly number[] = [],
  courseProgress: CourseProgressLookup = {},
): CourseCardView {
  const card = toCourseCardView(course, enrolledCourseIds, courseProgress);

  return {
    ...card,
    cta:
      card.progress >= 100 ? "View" : card.progress > 0 ? "Continue" : "Start",
    meta: getLearningMeta(course, card.progress),
  };
}

export function getCourseHref(courseId: number) {
  return `/learner/course-catalog/${courseId}`;
}

export function getLessonHref(courseId: number, lessonId: string) {
  return `${getCourseHref(courseId)}/lessons/${lessonId}`;
}

export function getCourseImage(course: BackendCourse) {
  return COURSE_IMAGES[(course.id - 1) % COURSE_IMAGES.length];
}

export function buildCourseModules(course: BackendCourse): CourseModule[] {
  const subject = getSubject(course);
  const minutes = getLessonMinutes(course);
  const description =
    course.description ??
    `Build a practical foundation in ${subject} through guided examples and focused practice.`;

  // Courses do not return modules or lessons yet, so the UI derives a stable
  // lesson structure from each course until the backend exposes course content.
  const moduleBlueprints = [
    {
      lessons: [
        `Welcome to ${subject}`,
        `Core ideas in ${subject}`,
        `${subject} tools and workflow`,
        `Guided practice session`,
      ],
      title: `Introduction to ${subject}`,
    },
    {
      lessons: [
        `Planning a ${subject} project`,
        `Common patterns and decisions`,
        `Quality checks and review`,
      ],
      title: `${subject} Foundations`,
    },
  ];

  return moduleBlueprints.map((module, moduleIndex) => {
    const moduleId = `module-${moduleIndex + 1}`;
    const moduleTitle = `Module ${moduleIndex + 1}: ${module.title}`;

    return {
      id: moduleId,
      lessons: module.lessons.map((lessonTitle, lessonIndex) => ({
        duration: `${minutes + lessonIndex * 3} mins`,
        id: `m${moduleIndex + 1}-l${lessonIndex + 1}`,
        kind: lessonIndex === module.lessons.length - 1 ? "reading" : "video",
        moduleId,
        moduleTitle,
        overview: getLessonOverview(description, lessonTitle, subject),
        resourceLabel: `${lessonTitle} resource`,
        title: lessonTitle,
      })),
      title: moduleTitle,
    };
  });
}

export function getCourseLessons(course: BackendCourse) {
  return buildCourseModules(course).flatMap((module) => module.lessons);
}

export function findCourseLesson(course: BackendCourse, lessonId: string) {
  return getCourseLessons(course).find((lesson) => lesson.id === lessonId);
}

export function getCourseProgress(
  courseId: number,
  courseProgress: CourseProgressLookup = {},
) {
  const progress = courseProgress[String(courseId)] ?? 0;

  return Math.min(100, Math.max(0, Math.round(progress)));
}

export function getLevelLabel(level: string | null | undefined) {
  if (!level) {
    return "All levels";
  }

  return level.charAt(0).toUpperCase() + level.slice(1);
}

function getCourseMeta(course: BackendCourse) {
  const parts = [
    course.duration_hours ? formatHours(course.duration_hours) : null,
    getLevelLabel(course.level),
    course.category,
  ].filter(Boolean);

  return parts.join(" . ");
}

function getLearningMeta(course: BackendCourse, progress: number) {
  const lessonCount = getCourseLessons(course).length;
  const currentLesson = Math.max(1, Math.ceil((progress / 100) * lessonCount));

  return `Lesson ${currentLesson} . ${formatHours(course.duration_hours ?? 1)} left`;
}

function getInstructorLabel(course: BackendCourse) {
  if (!course.instructor_id) {
    return "By TalentFlow";
  }

  return `By Instructor ${course.instructor_id}`;
}

function getCourseRating(course: BackendCourse) {
  return (4 + (course.id % 6) / 10).toFixed(1);
}

function formatHours(hours: number) {
  return hours === 1 ? "1 hr" : `${hours} hrs`;
}

function getSubject(course: BackendCourse) {
  return course.category?.trim() || course.title;
}

function getLessonMinutes(course: BackendCourse) {
  const hours = course.duration_hours ?? 4;
  const minutes = Math.round((hours * 60) / 14);

  return Math.min(35, Math.max(5, minutes));
}

function getLessonOverview(
  description: string,
  lessonTitle: string,
  subject: string,
) {
  return `${description} This lesson focuses on ${lessonTitle.toLowerCase()} so you can connect the concepts to real ${subject.toLowerCase()} work.`;
}
