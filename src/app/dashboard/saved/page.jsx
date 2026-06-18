"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, BookmarkX, Eye, PlusCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

// Placeholder — replace with real API call
const MOCK_SAVED = [
  {
    _id: "1",
    title: "Write a killer cold email",
    category: "Marketing",
    aiTool: "ChatGPT",
    difficulty: "Beginner",
    copyCount: 42,
    creatorName: "John Doe",
    thumbnail: null,
  },
  {
    _id: "2",
    title: "Generate a React component",
    category: "Coding",
    aiTool: "Claude",
    difficulty: "Intermediate",
    copyCount: 18,
    creatorName: "Jane Smith",
    thumbnail: null,
  },
  {
    _id: "3",
    title: "SEO meta description writer",
    category: "Writing",
    aiTool: "Gemini",
    difficulty: "Beginner",
    copyCount: 91,
    creatorName: "Alex Ray",
    thumbnail: null,
  },
];

export default function SavedPromptsPage() {
  const [saved, setSaved] = useState(MOCK_SAVED);

  const handleRemove = (id) => {
    setSaved((prev) => prev.filter((p) => p._id !== id));
    toast.success("Bookmark removed");
    // TODO: await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
  };

  return (
    <section>
      <Toaster position="top-center" />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Saved Prompts
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          All prompts you have bookmarked in one place.
        </p>
      </div>

      {/* Empty state */}
      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface px-6 py-16 text-center">
          <Bookmark className="h-10 w-10 text-text-secondary" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No saved prompts
          </h2>
          <p className="mt-2 max-w-sm text-base text-text-secondary">
            You have not bookmarked any prompts yet. Browse and save ones you
            like.
          </p>
          <Link
            href="/prompts"
            className={
              "mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            <PlusCircle className="h-5 w-5" /> Browse Prompts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((prompt) => (
            <article
              key={prompt._id}
              className="flex flex-col rounded-xl border bg-surface transition-colors hover:bg-surface-hover"
            >
              {/* Thumbnail */}
              <div className="relative h-36 w-full overflow-hidden rounded-t-xl bg-brand-light">
                {prompt.thumbnail ? (
                  <Image
                    src={prompt.thumbnail}
                    alt={prompt.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Bookmark className="h-8 w-8 text-brand" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-light px-3 py-0.5 text-base font-medium text-brand">
                    {prompt.category}
                  </span>
                  <span className="rounded-full border px-3 py-0.5 text-base font-medium text-text-secondary">
                    {prompt.aiTool}
                  </span>
                </div>
                <h2 className="text-lg font-semibold leading-tight text-text-primary line-clamp-2">
                  {prompt.title}
                </h2>
                <p className="text-base text-text-secondary">
                  By {prompt.creatorName} · {prompt.copyCount} copies
                </p>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <Link
                    href={`/prompts/${prompt._id}`}
                    className={
                      "flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                      focusRing
                    }
                  >
                    <Eye className="h-4 w-4" /> View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(prompt._id)}
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
