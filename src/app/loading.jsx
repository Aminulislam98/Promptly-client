import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center py-24"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-brand" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
