"use client";

import { create } from "zustand";

import type { DashboardRole } from "@/data/dashboard";
import {
  mockSessionCookieName,
  mockSessionMaxAgeSeconds,
} from "@/lib/mock-session";

type SignInPayload = {
  remember: boolean;
  role: DashboardRole;
};

type AuthSessionState = {
  remember: boolean;
  role: DashboardRole | null;
  signIn: (payload: SignInPayload) => void;
  signOut: () => void;
};

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  remember: false,
  role: null,
  signIn: ({ remember, role }) => {
    writeMockSessionCookie({ remember, role });
    set({ remember, role });
  },
  signOut: () => {
    clearMockSessionCookie();
    set({ remember: false, role: null });
  },
}));

function writeMockSessionCookie({
  remember,
  role,
}: {
  remember: boolean;
  role: DashboardRole;
}) {
  if (typeof document === "undefined") {
    return;
  }

  const maxAge = remember ? `; Max-Age=${mockSessionMaxAgeSeconds}` : "";
  document.cookie = `${mockSessionCookieName}=${role}; Path=/; SameSite=Lax${maxAge}`;
}

function clearMockSessionCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${mockSessionCookieName}=; Path=/; SameSite=Lax; Max-Age=0`;
}
