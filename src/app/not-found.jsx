import Link from "next/link";
import { Command, Home, LayoutGrid, ArrowRight } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-page-bg px-4 py-16 text-center">
      {/* Brand mark */}
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/20">
        <Command className="h-8 w-8 text-on-brand" strokeWidth={2.5} />
      </span>

      {/* 404 number */}
      <p className="mt-8 text-8xl font-black tracking-tight text-brand opacity-10 select-none">
        404
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-text-primary lg:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-text-secondary">
        This page doesn&apos;t exist or may have been moved. Let&apos;s get you back on
        track.
      </p>

      {/* Quick links */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className={
            "inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.97] " +
            focusRing
          }
        >
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link
          href="/prompts"
          className={
            "inline-flex h-11 items-center gap-2 rounded-full border px-6 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
            focusRing
          }
        >
          <LayoutGrid className="h-4 w-4" /> Browse Prompts
        </Link>
      </div>

      {/* Suggested categories */}
      <div className="mt-10 border-t pt-8 w-full max-w-sm">
        <p className="text-sm font-medium text-text-muted mb-4">Popular categories</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["ChatGPT", "Claude", "Midjourney", "Coding", "Marketing", "Writing"].map(
            (tag) => (
              <Link
                key={tag}
                href={`/prompts?search=${tag}`}
                className={
                  "rounded-full border bg-surface px-3 py-1 text-base font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand " +
                  focusRing
                }
              >
                {tag}
              </Link>
            )
          )}
        </div>
      </div>
    </main>
  );
}
