import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Register Account",
  description:
    "Register for a new residential customer account on the GridWatch power outage platform.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
