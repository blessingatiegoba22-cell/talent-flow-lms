"use server";

import {
  signInSchema,
  studentSignUpSchema,
  type SignInFormValues,
  type StudentSignUpFormValues,
} from "@/components/auth/auth-schemas";
import {
  BackendApiError,
  getBackendErrorMessage,
  getBackendFieldErrors,
  type LoginResponse,
} from "@/lib/backend";
import { loginUser, logoutUser, registerStudent } from "@/lib/auth-service";

type ActionResult<TData = null, TField extends string = string> =
  | {
      data: TData;
      ok: true;
    }
  | {
      fieldErrors?: Partial<Record<TField, string>>;
      message: string;
      ok: false;
    };

export async function signInAction(
  values: SignInFormValues,
): Promise<ActionResult<LoginResponse, keyof SignInFormValues & string>> {
  const parsedValues = signInSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      fieldErrors: flattenZodErrors(parsedValues.error.flatten().fieldErrors),
      message: "Check the highlighted fields and try again.",
      ok: false,
    };
  }

  try {
    const response = await loginUser(parsedValues.data);

    return {
      data: response,
      ok: true,
    };
  } catch (error) {
    return {
      fieldErrors: getBackendFieldErrors(error, {
        email: "email",
        password: "password",
      }),
      message: getActionErrorMessage(error, "Unable to sign in right now."),
      ok: false,
    };
  }
}

export async function studentSignUpAction(
  values: StudentSignUpFormValues,
): Promise<ActionResult<LoginResponse, keyof StudentSignUpFormValues & string>> {
  const parsedValues = studentSignUpSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      fieldErrors: flattenZodErrors(parsedValues.error.flatten().fieldErrors),
      message: "Check the highlighted fields and try again.",
      ok: false,
    };
  }

  const payload = {
    confirm_password: parsedValues.data.confirmPassword,
    email: parsedValues.data.email,
    name: parsedValues.data.fullName,
    password: parsedValues.data.password,
  };

  try {
    await registerStudent(payload);
  } catch (error) {
    return {
      fieldErrors: getBackendFieldErrors(error, {
        confirm_password: "confirmPassword",
        email: "email",
        name: "fullName",
        password: "password",
      }),
      message: getActionErrorMessage(error, "Unable to create your account."),
      ok: false,
    };
  }

  try {
    const response = await loginUser({
      email: parsedValues.data.email,
      password: parsedValues.data.password,
    });

    return {
      data: response,
      ok: true,
    };
  } catch (error) {
    return {
      message:
        getActionErrorMessage(error, "Your account was created, but automatic sign in failed.") +
        " Please sign in.",
      ok: false,
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await logoutUser();

    return {
      data: null,
      ok: true,
    };
  } catch (error) {
    return {
      message: getActionErrorMessage(error, "Unable to sign out right now."),
      ok: false,
    };
  }
}

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof BackendApiError) {
    return getBackendErrorMessage(error.payload) ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function flattenZodErrors<TField extends string>(
  fieldErrors: Partial<Record<TField, string[] | undefined>>,
) {
  const flattenedErrors: Partial<Record<TField, string>> = {};

  for (const field of Object.keys(fieldErrors) as TField[]) {
    const message = fieldErrors[field]?.[0];

    if (message) {
      flattenedErrors[field] = message;
    }
  }

  return flattenedErrors;
}
