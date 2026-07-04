import { createContext } from "react";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  name: string;
};

export type AuthSession = {
  id: string;
  expiresAt: Date;
  userId: string;
};

export interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
