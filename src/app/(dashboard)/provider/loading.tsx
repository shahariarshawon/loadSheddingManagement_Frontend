import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-border/80 pb-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
