"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Copy, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const DIFFICULTY_STYLES = {
  Beginner: "text-success bg-success/10",
  Intermediate: "text-warning bg-warning/10",
  Pro: "text-error bg-error/10",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export function RecentlyViewed() {
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!session?.user) return;
    try {
      const raw = localStorage.getItem("recently_viewed");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, [session]);

  // Only render for logged-in users with history
  if (!session?.user || items.length === 0) return null;

  return (
    <section className="w-full border-b bg-page-bg py-10 sm:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-brand" />
            <h2 className="text-xl font-semibold text-text-primary sm:text-2xl">
              Recently Viewed
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("recently_viewed");
              setItems([]);
            }}
            className={
              "rounded text-base text-text-secondary transition-colors hover:text-error " +
              focusRing
            }
          >
            Clear
          </button>
        </div>

        {/* Horizontal scroll row */}
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((p) => (
            <Link
              key={p._id}
              href={`/prompts/${p._id}`}
              className={
                "group flex w-64 shrink-0 flex-col rounded-xl border bg-surface p-4 transition-colors hover:border-brand " +
                focusRing
              }
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand-light px-2 py-0.5 text-base font-medium text-brand">
                  {p.aiTool}
                </span>
                {p.visibility === "Private" && (
                  <span className="flex items-center gap-1 rounded-md bg-surface-hover px-2 py-0.5 text-base text-text-secondary">
                    <Lock className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>

              {/* Title */}
              <p className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-text-primary group-hover:text-brand">
                {p.title}
              </p>

              {/* Category + difficulty */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md border px-2 py-0.5 text-base text-text-secondary">
                  {p.category}
                </span>
                <span
                  className={
                    "rounded-md px-2 py-0.5 text-base font-medium " +
                    (DIFFICULTY_STYLES[p.difficulty] || "")
                  }
                >
                  {p.difficulty}
                </span>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="flex items-center gap-1 text-base text-text-secondary">
                  <Copy className="h-3.5 w-3.5" />
                  {p.copyCount ?? 0}
                </span>
                <span className="text-base text-text-secondary">
                  {p.viewedAt
                    ? new Date(p.viewedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
