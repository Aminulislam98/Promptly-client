"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Copy, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { CreatorAvatar } from "@/components/ui/CreatorAvatar";

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

  if (!session?.user || items.length === 0) return null;

  return (
    <section className="w-full border-t bg-surface py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
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
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {items.map((p) => (
            <article
              key={p._id}
              className="flex w-64 shrink-0 flex-col rounded-xl border bg-surface p-4 transition-colors hover:border-brand"
            >
              {/* Creator row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {p.creatorName ? (
                    <CreatorAvatar name={p.creatorName} size="sm" />
                  ) : null}
                  <span className="truncate text-base font-medium text-text-secondary">
                    {p.creatorName || "Creator"}
                  </span>
                </div>
                <span className="shrink-0 text-base text-text-secondary">
                  {p.viewedAt
                    ? new Date(p.viewedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    : ""}
                </span>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand-light px-2 py-0.5 text-base font-medium text-brand">
                  {p.aiTool}
                </span>
                {p.visibility === "Private" && (
                  <span className="flex items-center gap-1 rounded-md bg-surface-hover px-2 py-0.5 text-base text-text-secondary">
                    <Lock className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>

              {/* Title — this is the primary navigation target */}
              <Link
                href={`/prompts/${p._id}`}
                className={
                  "mt-2 line-clamp-2 text-base font-semibold leading-snug text-text-primary hover:text-brand " +
                  focusRing
                }
              >
                {p.title}
              </Link>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex flex-wrap items-center gap-2">
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
                <span className="flex items-center gap-1 text-base text-text-secondary">
                  <Copy className="h-3.5 w-3.5" />
                  {p.copyCount ?? 0}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
