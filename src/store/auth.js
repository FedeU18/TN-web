import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: "",
      user: null,
      setToken: (token) => set(() => ({ token })),
      setUser: (user) => set(() => ({ user })),
      logout: () => set(() => ({ token: "", user: null })), //limpiar token
    }),
    { name: "auth" } //clave en localStorage
  )
);
