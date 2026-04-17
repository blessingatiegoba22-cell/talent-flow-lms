export type BackendValidationIssue = {
  ctx?: Record<string, unknown>;
  input?: unknown;
  loc?: Array<string | number>;
  msg: string;
  type?: string;
};

export type BackendErrorPayload = {
  detail?: BackendValidationIssue[] | string;
  message?: string;
};

export type BackendUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  verified: string;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  message: string;
  user_id: number;
  email: string;
};

export type LogoutResponse = {
  message: string;
};

export type BackendFetchResult<T> = {
  data: T;
  response: Response;
};

export class BackendApiError extends Error {
  payload: BackendErrorPayload | null;
  status: number;

  constructor(status: number, payload: BackendErrorPayload | null) {
    super(getBackendErrorMessage(payload) ?? "The backend request failed.");
    this.name = "BackendApiError";
    this.payload = payload;
    this.status = status;
  }
}

export function getBackendBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return baseUrl.replace(/\/+$/, "");
}

export function buildBackendUrl(path: string) {
  return `${getBackendBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function backendFetchJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<BackendFetchResult<T>> {
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildBackendUrl(path), {
    ...init,
    cache: "no-store",
    headers,
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new BackendApiError(
      response.status,
      isBackendErrorPayload(payload) ? payload : null,
    );
  }

  return {
    data: payload as T,
    response,
  };
}

export function getBackendErrorMessage(payload: BackendErrorPayload | null) {
  if (!payload) {
    return null;
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  if (Array.isArray(payload.detail) && payload.detail.length > 0) {
    return payload.detail.map((issue) => issue.msg).join(" ");
  }

  return payload.message ?? null;
}

export function getBackendFieldErrors<TField extends string>(
  error: unknown,
  fieldMap: Record<string, TField>,
) {
  const payload = error instanceof BackendApiError ? error.payload : null;
  const issues = Array.isArray(payload?.detail) ? payload.detail : [];
  const fieldErrors: Partial<Record<TField, string>> = {};

  for (const issue of issues) {
    const backendField = issue.loc?.findLast(
      (item): item is string => typeof item === "string" && item !== "body",
    );

    if (!backendField) {
      continue;
    }

    const frontendField = fieldMap[backendField];

    if (!frontendField) {
      continue;
    }

    if (!fieldErrors[frontendField]) {
      fieldErrors[frontendField] = issue.msg;
    }
  }

  return fieldErrors;
}

async function readJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text } satisfies BackendErrorPayload;
  }
}

function isBackendErrorPayload(payload: unknown): payload is BackendErrorPayload {
  return (
    !!payload &&
    typeof payload === "object" &&
    ("detail" in payload || "message" in payload)
  );
}
