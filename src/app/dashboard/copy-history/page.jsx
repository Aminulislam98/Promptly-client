"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { History, Copy, ArrowRight } from "lucide-react";
import { getCopyHistory } from "@/lib/api";
import { categoryColor } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-xl border bg-surface p-4">
      <div className="h-10 w-10 rounded-lg bg-surface-hover" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 rounded bg-surface-hover" />
        <div className="h-3 w-24 rounded bg-surface-hover" />
      </div>
    </div>
  );
}

export default function CopyHistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCopyHistory()
      .then((d) => setHistory(d.history || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">Copy History</h1>
        <p className="mt-1 text-base text-text-secondary">The last 30 prompts you copied, newest first.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <History className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base font-semibold text-text-primary">No copies yet</p>
          <p className="mt-1 text-base text-text-secondary">When you copy a prompt it will appear here.</p>
          <Link
            href="/prompts"
            className={"mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-white hover:bg-brand-hover " + focusRing}
          >
            Browse Prompts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((item) => (
            <Link
              key={item._id || item.promptId}
              href={`/prompts/${item.promptId}`}
              className={"group flex items-center gap-4 rounded-xl border bg-surface p-4 transition-colors hover:border-brand hover:bg-surface-hover " + focusRing}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light">
                <Copy className="h-5 w-5 text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-text-primary group-hover:text-brand">
                  {item.promptTitle || "Untitled Prompt"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {item.promptCategory && (
                    <span className={"rounded-full border px-2 py-0.5 text-sm font-medium " + categoryColor(item.promptCategory)}>
                      {item.promptCategory}
                    </span>
                  )}
                  <span className="text-sm text-text-muted">
                    {new Date(item.copiedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-text-muted group-hover:text-brand" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
