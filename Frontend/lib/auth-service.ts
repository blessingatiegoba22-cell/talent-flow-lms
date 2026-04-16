import {
  backendFetchJson,
  type BackendUser,
  type LoginResponse,
  type LogoutResponse,
} from "@/lib/backend";
import {
  getRequestCookieHeader,
  storeBackendCookies,
} from "@/lib/backend-cookies";

type LoginPayload = {
  email: string;
  password: string;
};

type StudentRegistrationPayload = LoginPayload & {
  confirm_password: string;
  name: string;
};

export async function registerStudent(payload: StudentRegistrationPayload) {
  const { data } = await backendFetchJson<BackendUser>("/users/student", {
    body: JSON.stringify(payload),
    method: "POST",
  });

  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data, response } = await backendFetchJson<LoginResponse>("/auth/login", {
    body: JSON.stringify(payload),
    method: "POST",
  });

  await storeBackendCookies(response.headers);

  return data;
}

export async function logoutUser() {
  const cookieHeader = await getRequestCookieHeader();
  const { data, response } = await backendFetchJson<LogoutResponse>("/auth/logout", {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    method: "POST",
  });

  await storeBackendCookies(response.headers);

  return data;
}

export async function getCurrentUser() {
  const cookieHeader = await getRequestCookieHeader();
  const { data } = await backendFetchJson<BackendUser>("/users/me", {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    method: "GET",
  });

  return data;
}
