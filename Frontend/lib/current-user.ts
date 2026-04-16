import type { BackendUser } from "@/lib/backend";

export type CurrentUser = Pick<BackendUser, "email" | "id" | "name" | "role">;

export function getFirstName(name: string | undefined) {
  return name?.trim().split(/\s+/)[0] || "Learner";
}

export function splitFullName(name: string | undefined) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const [firstName = "", ...lastNameParts] = parts;

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
}

export function getDisplayRole(role: string | undefined) {
  return role === "student" ? "Student" : (role ?? "Learner");
}
