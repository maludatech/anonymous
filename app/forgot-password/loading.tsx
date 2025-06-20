import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ForgotPasswordFormSkeleton() {
  return (
    <div className="flex justify-center items-center pt-16 px-4">
      <div
        className={cn(
          "w-full max-w-xl p-8 bg-card rounded-lg shadow-lg border border-border animate-in fade-in duration-500"
        )}
      >
        <Skeleton className="h-8 w-3/4 mx-auto mb-6 bg-muted" />
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-1/4 mb-2 bg-muted" />
            <div className="relative">
              <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-muted" />
              <Skeleton className="h-10 w-full pl-10 bg-muted" />
            </div>
          </div>
          <Skeleton className="h-10 w-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
