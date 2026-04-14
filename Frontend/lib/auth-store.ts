"use client";

import { create } from "zustand";

import type { DashboardRole } from "@/data/dashboard";

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
  signIn: ({ remember, role }) => set({ remember, role }),
  signOut: () => set({ remember: false, role: null }),
}));
