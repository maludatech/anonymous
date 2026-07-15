"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MailCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage("This verification link is invalid.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }
        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Verification failed");
      }
    };

    verify();
  }, [email, token]);

  return (
    <div className="flex justify-center items-center py-24 px-4">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border border-border animate-in fade-in duration-500 text-center">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            status === "error" ? "bg-destructive/10" : "bg-primary/10"
          }`}
        >
          {status === "verifying" && (
            <MailCheck className="h-6 w-6 text-primary animate-pulse" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-6 w-6 text-primary" />
          )}
          {status === "error" && (
            <ShieldAlert className="h-6 w-6 text-destructive" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {status === "verifying" && "Verifying your email..."}
          {status === "success" && "Email verified"}
          {status === "error" && "Verification failed"}
        </h2>
        {message && (
          <p className="text-muted-foreground mb-6">{message}</p>
        )}
        {status !== "verifying" && (
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/sign-in">Go to Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
