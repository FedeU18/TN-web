import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set(() => ({ token })),
      logout: () => set(() => ({ token: "" })) //limpiar token
    }),
    { name: "auth" } //clave en localStorage
  )
);