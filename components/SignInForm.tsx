"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

// Define form schema with zod
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router]);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Sign-in failed");
        return;
      }

      login({
        email: data.email,
        username: data.username,
      });
      toast.success("Signed in successfully!");
      router.push(callbackUrl);
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast(error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-xl p-8 bg-card rounded-lg shadow-lg border border-border animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">
          Sign In to Maluda Anonymous
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-background text-foreground border-input focus:ring-ring"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 bg-background text-foreground border-input focus:ring-ring"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="mt-2 text-center text-muted-foreground">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
