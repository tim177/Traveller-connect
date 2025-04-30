"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //load the user form localstorage if present
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  //login the user
  const login = async (email: string, password: string) => {
    //TODO: This is hardcoded remove when adding backend
    if (email === "demo@emample.com" && password === "password") {
      const user = {
        id: "user-1",
        name: "demo",
        email: "demo@example.com",
      };

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return;
    }

    //TODO: this is for demo remove when added backend
    const user = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0],
      email,
    };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = async (name: string, email: string, password: string) => {
    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
    };

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}
