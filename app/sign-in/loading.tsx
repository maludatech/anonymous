// components/SignInFormSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SignInFormSkeleton() {
  return (
    <div className="flex justify-center items-center pt-16 px-4">
      <div
        className={cn(
          "w-full max-w-xl p-8 bg-card rounded-lg shadow-lg border border-border animate-in fade-in duration-500"
        )}
      >
        {/* Title */}
        <Skeleton className="h-8 w-3/4 mx-auto mb-6 bg-muted" />
        {/* Form Fields */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2 bg-muted" /> {/* Label */}
            <div className="relative">
              <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-muted" />{" "}
              {/* Icon */}
              <Skeleton className="h-10 w-full pl-10 bg-muted" /> {/* Input */}
            </div>
          </div>
          {/* Password Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2 bg-muted" /> {/* Label */}
            <div className="relative">
              <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-muted" />{" "}
              {/* Icon */}
              <Skeleton className="h-10 w-full pl-10 bg-muted" /> {/* Input */}
            </div>
          </div>
          {/* Submit Button */}
          <Skeleton className="h-10 w-full bg-muted" />
        </div>
        {/* Footer Link */}
        <div className="mt-4 text-center">
          <Skeleton className="h-4 w-1/2 mx-auto bg-muted" />
        </div>
      </div>
    </div>
  );
}
