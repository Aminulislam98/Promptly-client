"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Trash2, ExternalLink } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getMyReviews, deleteReview } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

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

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={
            "h-4 w-4 " +
            (s <= rating ? "fill-warning text-warning" : "text-border")
          }
        />
      ))}
    </div>
  );
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    getMyReviews()
      .then((data) => setReviews(data.reviews || []))
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-surface-hover"
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
          My Reviews
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          All reviews you have written.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface px-6 py-16 text-center">
          <Star className="h-10 w-10 text-text-secondary" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No reviews yet
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Explore prompts and share your feedback.
          </p>
          <Link
            href="/prompts"
            className={
              "mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover " +
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
                    {review.promptTitle}{" "}
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </Link>
                  <p className="text-base leading-relaxed text-text-secondary max-w-2xl">
                    {review.comment}
                  </p>
                </div>
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
