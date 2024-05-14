"use client";
import LoginForm from "./components/login";
import { AuthProvider } from "./context/authContext";

export default function Home() {
  return (
    <div>
      <AuthProvider>
        <LoginForm></LoginForm>
      </AuthProvider>
    </div>
  );
}
