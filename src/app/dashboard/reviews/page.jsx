"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Trash2, ExternalLink } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

// Placeholder — replace with real API call
const MOCK_REVIEWS = [
  {
    _id: "1",
    promptTitle: "Write a killer cold email",
    promptId: "p1",
    rating: 5,
    comment:
      "This prompt saved me hours. The output was clean and professional.",
    createdAt: "2026-06-01",
  },
  {
    _id: "2",
    promptTitle: "Generate a React component",
    promptId: "p2",
    rating: 4,
    comment:
      "Very useful for boilerplate code. Would love more customization options.",
    createdAt: "2026-06-10",
  },
  {
    _id: "3",
    promptTitle: "SEO meta description writer",
    promptId: "p3",
    rating: 3,
    comment: "Decent prompt but needs more context for niche industries.",
    createdAt: "2026-06-15",
  },
];

function StarRating({ rating }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            "h-4 w-4 " +
            (star <= rating ? "fill-warning text-warning" : "text-border")
          }
        />
      ))}
    </div>
  );
}

function DeleteModal({ review, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-surface px-6 py-6">
        <h3 className="text-xl font-bold text-text-primary">Delete Review</h3>
        <p className="mt-2 text-base text-text-secondary">
          Are you sure you want to delete your review for{" "}
          <span className="font-semibold text-text-primary">
            "{review.promptTitle}"
          </span>
          ?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg bg-error px-4 text-base font-semibold text-on-brand transition-all hover:opacity-80 active:scale-[0.98] " +
              focusRing
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
    setDeleteTarget(null);
    toast.success("Review deleted");
    // TODO: await fetch(`/api/reviews/${id}`, { method: "DELETE" });
  };

  return (
    <section>
      <Toaster position="top-center" />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          My Reviews
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          All reviews you have written across prompts.
        </p>
      </div>

      {/* Empty state */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface px-6 py-16 text-center">
          <Star className="h-10 w-10 text-text-secondary" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No reviews yet
          </h2>
          <p className="mt-2 max-w-sm text-base text-text-secondary">
            You have not written any reviews. Explore prompts and share your
            feedback.
          </p>
          <Link
            href="/prompts"
            className={
              "mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Browse Prompts
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-xl border bg-surface px-5 py-5 transition-colors hover:bg-surface-hover"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                {/* Left — review content */}
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <StarRating rating={review.rating} />
                    <span className="text-base text-text-secondary">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Link
                    href={`/prompts/${review.promptId}`}
                    className={
                      "inline-flex items-center gap-1 text-lg font-semibold text-text-primary hover:text-brand transition-colors " +
                      focusRing
                    }
                  >
                    {review.promptTitle}
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </Link>
                  <p className="text-base leading-relaxed text-text-secondary max-w-2xl">
                    {review.comment}
                  </p>
                </div>

                {/* Right — delete */}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(review)}
                  aria-label="Delete review"
                  className={
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-error hover:bg-error/10 hover:text-error " +
                    focusRing
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          review={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
