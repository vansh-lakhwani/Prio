import { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Authentication | Prio",
  description: "Sign in to your Prio account to manage your tasks.",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-8">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-space-grotesk font-bold text-foreground">Welcome back</h2>
        <p className="text-foreground/60 mt-2 font-manrope font-medium">
          Enter your credentials to access your workspace
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <GoogleSignInButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-outline"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-4 text-foreground/40 font-bold tracking-wider">
              Or continue with email
            </span>
          </div>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
