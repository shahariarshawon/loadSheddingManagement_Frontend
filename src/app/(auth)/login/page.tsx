import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to GridWatch using email and password or one-click evaluator demo access.",
};

export default function LoginPage() {
  return <LoginForm />;
}
