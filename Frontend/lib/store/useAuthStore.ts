import { create } from 'zustand'

//  It defines what chrome remembers
interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions to change the state
  setUser: (user: any) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, error: null }),
}))