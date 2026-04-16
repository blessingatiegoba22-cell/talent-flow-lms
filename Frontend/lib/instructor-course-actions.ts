"use server";

import { revalidatePath } from "next/cache";

import {
  BackendApiError,
  getBackendErrorMessage,
} from "@/lib/backend";
import {
  createCourse,
  publishCourse,
  type BackendCourse,
} from "@/lib/course-service";
import {
  markInstructorCoursePublished,
  rememberInstructorCourse,
} from "@/lib/instructor-course-store";

export type CreateInstructorCourseState = {
  course?: BackendCourse;
  message: string;
  ok: boolean;
};

export type PublishInstructorCourseState = {
  courseId?: number;
  message: string;
  ok: boolean;
};

export async function createInstructorCourseAction(
  _state: CreateInstructorCourseState,
  formData: FormData,
): Promise<CreateInstructorCourseState> {
  const title = getStringValue(formData, "title");
  const description = getStringValue(formData, "description");
  const category = getStringValue(formData, "category");
  const level = getStringValue(formData, "level");
  const durationHours = getNumberValue(formData, "duration_hours");
  const price = getPriceInCents(formData);

  if (!title) {
    return {
      message: "Add a course title before saving this draft.",
      ok: false,
    };
  }

  try {
    const course = await createCourse({
      category,
      description,
      duration_hours: durationHours,
      level,
      price,
      title,
    });

    await rememberInstructorCourse(course);
    revalidateInstructorCoursePaths(course.id);

    return {
      course,
      message: `${course.title} was saved as a draft.`,
      ok: true,
    };
  } catch (error) {
    return {
      message: getActionErrorMessage(error, "Unable to create this course."),
      ok: false,
    };
  }
}

export async function publishInstructorCourseAction(
  _state: PublishInstructorCourseState,
  formData: FormData,
): Promise<PublishInstructorCourseState> {
  const courseId = Number(formData.get("courseId"));

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return {
      message: "Choose a saved draft before publishing.",
      ok: false,
    };
  }

  try {
    const response = await publishCourse(courseId);
    await markInstructorCoursePublished(courseId);
    revalidateInstructorCoursePaths(courseId);

    return {
      courseId,
      message: response.message ?? "Course published successfully.",
      ok: true,
    };
  } catch (error) {
    return {
      courseId,
      message: getActionErrorMessage(error, "Unable to publish this course."),
      ok: false,
    };
  }
}

function getStringValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  return value || undefined;
}

function getNumberValue(formData: FormData, key: string) {
  const value = Number(formData.get(key));

  return Number.isFinite(value) && value > 0 ? Math.round(value) : undefined;
}

function getPriceInCents(formData: FormData) {
  const value = Number(formData.get("price"));

  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.round(value * 100);
}

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof BackendApiError) {
    return getBackendErrorMessage(error.payload) ?? fallback;
  }

  return fallback;
}

function revalidateInstructorCoursePaths(courseId: number) {
  revalidatePath("/instructor/dashboard");
  revalidatePath("/instructor/my-course");
  revalidatePath("/learner/course-catalog");
  revalidatePath(`/learner/course-catalog/${courseId}`);
}
