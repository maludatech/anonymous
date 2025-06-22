
import { Metadata } from "next";
import Profile from "@/components/Profile";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await props.searchParams;
  return (
    <div className="flex flex-col min-h-screen bg-background px-4 pt-28">
      <Profile callbackUrl={callbackUrl || "/sign-in"} />
    </div>
  );
}