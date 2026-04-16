"use server";

import { revalidatePath } from "next/cache";

import {
  BackendApiError,
  getBackendErrorMessage,
} from "@/lib/backend";
import { enrollInCourse } from "@/lib/course-service";
import { advanceStoredCourseProgress } from "@/lib/course-progress";
import { storeEnrolledCourseId } from "@/lib/enrolled-courses";

export type EnrollCourseState = {
  courseId?: number;
  message: string;
  ok: boolean;
};

export async function enrollCourseAction(
  _state: EnrollCourseState,
  formData: FormData,
): Promise<EnrollCourseState> {
  const courseId = Number(formData.get("courseId"));

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return {
      message: "Choose a valid course and try again.",
      ok: false,
    };
  }

  try {
    const response = await enrollInCourse(courseId);
    await rememberEnrollment(courseId);

    return {
      courseId,
      message: response.message ?? "Course added to My Learning.",
      ok: true,
    };
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 409) {
      await rememberEnrollment(courseId);

      return {
        courseId,
        message: "This course is already in My Learning.",
        ok: true,
      };
    }

    if (
      error instanceof BackendApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      return {
        courseId,
        message: "Sign in again to enroll in this course.",
        ok: false,
      };
    }

    return {
      courseId,
      message:
        error instanceof BackendApiError
          ? getBackendErrorMessage(error.payload) ?? "Unable to enroll right now."
          : "Unable to enroll right now.",
      ok: false,
    };
  }
}

export async function advanceCourseProgressAction(
  courseId: number,
  increment = 15,
) {
  if (!Number.isInteger(courseId) || courseId <= 0) {
    return {
      courseId,
      progress: 0,
      reachedCompletion: false,
    };
  }

  const update = await advanceStoredCourseProgress(courseId, increment);

  revalidatePath("/learner/dashboard");
  revalidatePath("/learner/my-learning");
  revalidatePath("/learner/course-catalog");
  revalidatePath(`/learner/course-catalog/${courseId}`);
  revalidatePath(`/learner/course-catalog/${courseId}/lessons`);

  return update;
}

async function rememberEnrollment(courseId: number) {
  await storeEnrolledCourseId(courseId);
  revalidatePath("/learner/dashboard");
  revalidatePath("/learner/my-learning");
  revalidatePath("/learner/course-catalog");
  revalidatePath(`/learner/course-catalog/${courseId}`);
}
