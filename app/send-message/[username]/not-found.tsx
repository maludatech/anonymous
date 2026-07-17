"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SendMessageNotFound() {
  const pathname = usePathname();
  const username = pathname?.split("/").pop();

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-background">
      <div
        className={cn(
          "w-full max-w-xl p-8 bg-card rounded-lg shadow-lg border border-border text-center animate-in fade-in duration-500"
        )}
      >
        <UserX className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {username ? `We couldn't find @${username}` : "User not found"}
        </h1>
        <p className="text-muted-foreground mb-6">
          This link doesn&apos;t match any Maluda Anonymous account. Double-check
          the link you were given, or create your own to start receiving
          anonymous messages.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/sign-up">Create Your Account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
