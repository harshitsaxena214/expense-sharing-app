import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      skipHydration: true,
    }
  )
);