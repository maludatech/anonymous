// app/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-background">
      <div
        className={cn(
          "w-full max-w-xl p-8 bg-card rounded-lg shadow-lg border border-border text-center animate-in fade-in duration-500"
        )}
      >
        <AlertCircle className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
