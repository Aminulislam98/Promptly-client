"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, BookmarkX, Eye, PlusCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getBookmarks, removeBookmark } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function SavedPromptsPage() {
  const [saved, setSaved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBookmarks()
      .then((data) => setSaved(data.bookmarks || []))
      .catch(() => toast.error("Failed to load bookmarks"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (promptId) => {
    try {
      await removeBookmark(promptId);
      setSaved((prev) => prev.filter((b) => b.promptId !== promptId));
      toast.success("Bookmark removed");
    } catch {
      toast.error("Failed to remove bookmark");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl bg-surface-hover"
          />
        ))}
      </div>
    );
  }

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Saved Prompts
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          All prompts you have bookmarked.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface px-6 py-16 text-center">
          <Bookmark className="h-10 w-10 text-text-secondary" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No saved prompts
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Browse prompts and save ones you like.
          </p>
          <Link
            href="/prompts"
            className={
              "mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover " +
              focusRing
            }
          >
            <PlusCircle className="h-5 w-5" /> Browse Prompts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((bookmark) => (
            <article
              key={bookmark._id}
              className="flex flex-col rounded-xl border bg-surface transition-colors hover:bg-surface-hover"
            >
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {bookmark.prompt?.category && (
                    <span className="rounded-full bg-brand-light px-3 py-0.5 text-base font-medium text-brand">
                      {bookmark.prompt.category}
                    </span>
                  )}
                  {bookmark.prompt?.aiTool && (
                    <span className="rounded-full border px-3 py-0.5 text-base font-medium text-text-secondary">
                      {bookmark.prompt.aiTool}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold leading-tight text-text-primary line-clamp-2">
                  {bookmark.prompt?.title || "Prompt"}
                </h2>
                <p className="text-base text-text-secondary">
                  by {bookmark.prompt?.creatorName || "Unknown"}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <Link
                    href={`/prompts/${bookmark.promptId}`}
                    className={
                      "flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                      focusRing
                    }
                  >
                    <Eye className="h-4 w-4" /> View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(bookmark.promptId)}
                    aria-label="Remove bookmark"
                    className={
                      "inline-flex h-10 w-10 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-error hover:bg-error/10 hover:text-error " +
                      focusRing
                    }
                  >
                    <BookmarkX className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
