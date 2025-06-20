import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Welcome to Maluda Anonymous
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        A modern platform for anonymous feedback and scheduling. Join us to
        streamline your workflows.
      </p>
      <Button size="lg" className="mt-8" asChild>
        <Link href="/sign-up">
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </section>
  );
}
