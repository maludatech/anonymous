import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--primary)_0%,transparent_70%)] opacity-15 dark:opacity-25"
      />
      <div className="container mx-auto px-4 pt-24 pb-20 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-pop" />
          Free forever. No app to install.
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Hear what people really
          <span className="block text-primary">think of you</span>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Get your own link, share it anywhere, and receive honest anonymous
          messages from friends and followers — no name attached, ever.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Get my link <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/sign-in">I already have an account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
