
import { Skeleton } from "@/components/ui/skeleton";

export default function SendMessageLoading() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-background px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        <Skeleton className="h-12 w-full mb-4 rounded-md" />
        <Skeleton className="h-6 w-3/4 mb-6 rounded-md" />
        <Skeleton className="h-32 w-full mb-4 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}