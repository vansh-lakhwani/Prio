import { redirect } from "next/navigation";

export default function LandingPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  if (searchParams?.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }
  redirect("/login");
}
