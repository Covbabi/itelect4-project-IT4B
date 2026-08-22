import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userName: string | null;
  email: string | null;
  login: (email: string, userName?: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      email: null,
      login: (email, userName) => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUserName =
          userName?.trim() || normalizedEmail.split("@")[0] || "User";

        set({
          token: `lost-found-token-${normalizedEmail}`,
          userName: normalizedUserName,
          email: normalizedEmail,
        });
      },
      logout: () => set({ token: null, userName: null, email: null }),
    }),
    {
      name: "lost-found-auth",
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
        email: state.email,
      }),
    }
  )
);

export default useAuthStore;