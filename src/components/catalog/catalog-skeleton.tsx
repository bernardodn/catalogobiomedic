import { Skeleton } from "@/components/ui/skeleton";

export function CatalogSkeleton() {
  return (
    <div className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Carregando catálogo">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="bg-background p-4">
          <Skeleton className="aspect-[8/5] w-full rounded-sm" />
          <Skeleton className="mt-5 h-5 w-2/3 rounded-sm" />
          <Skeleton className="mt-3 h-14 w-full rounded-sm" />
        </div>
      ))}
    </div>
  );
}
