import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  email: string;
  username: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: Partial<User>) => void;
}

const initialState: User = {
  email: "",
  username: "",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      setUser: (user: Partial<User>) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...user }
            : { ...initialState, ...user },
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
