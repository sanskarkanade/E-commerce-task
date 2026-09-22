export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/5] animate-pulse bg-ink/5" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-ink/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-ink/10" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-ink/10" />
      </div>
    </div>
  );
}
