import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getMe } from "@/lib/api";
type User = {
  id: string;
  name: string;
  email: string;
  genius?: {
    level: number;
    completedLast24Months: number;
    nextThreshold: number | null;
    remaining: number;
  };
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    (async () => {
      try {
        const me = await getMe();
        const next = {
          id: me.id,
          name: me.name,
          email: me.email,
          genius: me.genius,
        } as User;
        setUser(next);
        localStorage.setItem("user", JSON.stringify(next));
      } catch {
        // ignore if unauthorized
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
