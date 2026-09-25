export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="animate-pulse space-y-4">
      <div className="h-10 w-64 bg-cream/10" />
      <div className="h-32 bg-cream/10" />
      <div className="h-32 bg-cream/10" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
