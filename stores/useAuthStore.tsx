import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  email: string;
  username: string;
}

// Define the AuthStore interface
interface AuthStore {
  user: User;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: Partial<User>) => void;
}

// Initial state
const initialState: User = {
  email: "",
  username: "",
};

// Create the Zustand store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: initialState,
      isAuthenticated: false,
      login: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: initialState,
          isAuthenticated: false,
        }),
      setUser: (user: Partial<User>) =>
        set((state) => ({
          user: { ...state.user, ...user },
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
