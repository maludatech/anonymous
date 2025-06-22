// app/send-message/[username]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import SendMessage from "@/components/SendMessage";

export const metadata: Metadata = {
  title: "Send Anonymous Message",
};

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { username } = await params;
  const { callbackUrl } = await searchParams;

  if (!username) {
    console.error("Missing username in params:", params);
    notFound();
  }

  await connectToDb();
  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    console.log(`User not found for username: ${username.toLowerCase()}`);
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 pt-28">
      <SendMessage username={user.username} callbackUrl={callbackUrl || "/"} />
    </div>
  );
}
