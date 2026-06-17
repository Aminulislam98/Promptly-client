import Link from "next/link";
import { Compass } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-32 min-h-screen flex flex-col items-center justify-center">
      <h1 className="mt-2 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-text-secondary">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className={
            "inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand px-4 text-base font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.98] " +
            focusRing
          }
        >
          Back to home
        </Link>
        <Link
          href="/prompts"
          className={
            "inline-flex min-h-[44px] items-center justify-center rounded-md border px-4 text-base font-medium text-text-primary transition-colors duration-150 hover:bg-surface-hover " +
            focusRing
          }
        >
          Browse prompts
        </Link>
      </div>
    </section>
  );
}
