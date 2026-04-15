import { NextResponse, type NextRequest } from "next/server";

import {
  getMockRoleFromCookie,
  mockSessionCookieName,
  type MockDashboardRole,
} from "@/lib/mock-session";
import { dashboardHrefByRole } from "@/lib/routes";

const publicPathPrefixes = [
  "/",
  "/forgot-password",
  "/reset-password",
  "/sign-in",
  "/sign-up",
] as const;

const privatePathPrefixes: Record<MockDashboardRole, string> = {
  admin: "/admin",
  instructor: "/instructor",
  learner: "/learner",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getMockRoleFromCookie(
    request.cookies.get(mockSessionCookieName)?.value,
  );
  const requiredRole = getRequiredRole(pathname);

  if (requiredRole) {
    if (!role) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("next", pathname);

      return NextResponse.redirect(signInUrl);
    }

    if (role !== requiredRole) {
      return NextResponse.redirect(new URL(dashboardHrefByRole[role], request.url));
    }

    return NextResponse.next();
  }

  if (role && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(dashboardHrefByRole[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

function getRequiredRole(pathname: string) {
  return Object.entries(privatePathPrefixes).find(([, prefix]) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  )?.[0] as MockDashboardRole | undefined;
}

function isPublicPath(pathname: string) {
  return publicPathPrefixes.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
