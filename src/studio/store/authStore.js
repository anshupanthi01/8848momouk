import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      sidebarCollapsed: false,
      setTokens: ({ access, refresh }) => set({ accessToken: access, refreshToken: refresh }),
      setUser: (user) => set({ user }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "studio-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)
