"use client";
import { ReactNode, createContext, useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import api from "../api/api";

export type User = {
  name: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: SignInData) => Promise<void>;
};

type SignInData = {
  username: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  async function findUserName() {
    const cookies = parseCookies();
    const token = cookies["app.token"];
    if (token) {
      try {
        const response = await api.get("user/find");
        const { name, username } = response.data;
        setUser({
          name,
          username,
        });
      } catch (error) {
        console.log("Error finding user");
      }
    }
  }

  useEffect(() => {
    findUserName();
  }, []);

  async function signIn({ username, password }: SignInData) {
    const response = await api.post("user/login/", {
      username,
      password,
    });
    const { token, name } = response.data;
    setCookie(undefined, "app.token", token, {
      maxAge: 60 * 60,
    });
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
    setUser({
      name,
      username,
    });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
