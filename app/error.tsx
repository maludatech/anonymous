// app/error.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error (e.g., to a service like Sentry or console)
    console.error("Error:", error);
    toast.error(error.message || "Something went wrong. Please try again.");
  }, [error]);

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-background">
      <div
        className={cn(
          "w-full max-w-xl p-8 bg-card rounded-lg shadow-lg border border-border text-center animate-in fade-in duration-500"
        )}
      >
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Please try again or contact support.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
