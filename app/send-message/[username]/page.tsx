import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import SendMessage from "@/components/SendMessage";

export const metadata: Metadata = {
  title: "Send Anonymous Message",
};

interface Props {
  params: { username: string };
  searchParams: { callbackUrl?: string };
}

export default async function Page({ params, searchParams }: Props) {
  const { username } = params;
  const { callbackUrl } = searchParams;

  await connectToDb();
  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 pt-28">
      <SendMessage username={user.username} callbackUrl={callbackUrl || "/"} />
    </div>
  );
}
