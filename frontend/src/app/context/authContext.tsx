import { createContext, useState } from "react";
import { setCookie } from "nookies";
import api from "../api/api";

export type User = {
  name: string;
  username: string;
};

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  signIn: (data: SignInData) => Promise<void>;
};

type SignInData = {
  username: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  async function signIn({ username, password }: SignInData) {
    const response = await api.post("user/login/", {
      username,
      password,
    });
    const { token, user } = response.data;
    setCookie(undefined, "app.token", token, {
      maxAge: 60 * 60,
    });
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
