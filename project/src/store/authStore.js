import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem("user")) || null,
  isAuthenticated: !!sessionStorage.getItem("user"),
  login: (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
}));
