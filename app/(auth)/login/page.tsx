import { Metadata } from "next";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Authentication | Prio",
  description: "Sign in to your Prio account to manage your tasks.",
};

export default function LoginPage() {
  return <LoginView />;
}
