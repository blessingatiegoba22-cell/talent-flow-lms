export const mockSessionCookieName = "talent_flow_mock_role";
export const mockSessionMaxAgeSeconds = 60 * 60 * 24 * 30;

export const mockDashboardRoles = ["admin", "instructor", "learner"] as const;

export type MockDashboardRole = (typeof mockDashboardRoles)[number];

export function isMockDashboardRole(
  value: string | undefined,
): value is MockDashboardRole {
  return mockDashboardRoles.some((role) => role === value);
}

export function getMockRoleFromCookie(
  value: string | undefined,
): MockDashboardRole | null {
  return isMockDashboardRole(value) ? value : null;
}

export function resolveMockRoleFromEmail(email: string): MockDashboardRole {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.includes("admin")) {
    return "admin";
  }

  if (
    normalizedEmail.includes("instructor") ||
    normalizedEmail.includes("mentor") ||
    normalizedEmail.includes("teacher")
  ) {
    return "instructor";
  }

  return "learner";
}
