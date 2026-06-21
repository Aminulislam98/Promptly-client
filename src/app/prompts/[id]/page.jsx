"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Bookmark, Flag, ArrowLeft, Check, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  getPromptById,
  getReviews,
  getBookmarks,
  incrementCopyCount,
  toggleBookmark,
  addReview,
  reportPrompt,
} from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const REPORT_REASONS = [
  "Inappropriate Content",
  "Spam",
  "Copyright Violation",
  "Misleading Information",
  "Other",
];

const DIFFICULTY_STYLES = {
  Beginner: "text-success bg-success/10",
  Intermediate: "text-warning bg-warning/10",
  Pro: "text-error bg-error/10",
};

function Stars({ rating, interactive = false, onRate }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onRate(s) : undefined}
          className={
            interactive
              ? "transition-transform hover:scale-110 " + focusRing
              : ""
          }
          aria-label={interactive ? `Rate ${s} stars` : undefined}
        >
          <svg
            viewBox="0 0 16 16"
            className={
              "h-5 w-5 " + (s <= rating ? "fill-warning" : "fill-border")
            }
            aria-hidden="true"
          >
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReportModal({ onClose, promptId }) {
  const [reason, setReason] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setIsLoading(true);
    try {
      await reportPrompt({ promptId, reason, description: desc });
      toast.success("Report submitted");
      onClose();
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-surface px-6 py-6">
        <h3 className="text-xl font-bold text-text-primary">Report Prompt</h3>
        <p className="mt-1 text-base text-text-secondary">
          Help us keep Promptly safe.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <label className="text-base font-medium text-text-primary">
            Reason <span className="text-error">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={
              "h-11 w-full rounded-lg border bg-surface-hover px-3 text-base text-text-primary outline-none focus:ring-2 focus:ring-brand " +
              focusRing
            }
          >
            <option value="">Select a reason</option>
            {REPORT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <label className="text-base font-medium text-text-primary">
            Description (optional)
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="Add more details..."
            className={
              "w-full rounded-lg border bg-surface-hover px-3 py-2 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand resize-none " +
              focusRing
            }
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg bg-error px-4 text-base font-semibold text-on-brand transition-all hover:opacity-80 disabled:opacity-60 " +
              focusRing
            }
          >
            {isLoading ? "Submitting…" : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PromptDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const copyingRef = useRef(false);
  const { data: session } = authClient.useSession();

  useEffect(() => setMounted(true), []);

  // Private route — redirect to login if not logged in
  useEffect(() => {
    if (mounted && !session?.user) {
      router.replace("/login");
    }
  }, [mounted, session, router]);

  useEffect(() => {
    if (!id) return;
    Promise.all([getPromptById(id), getReviews(id), getBookmarks()])
      .then(([promptData, reviewData, bookmarksData]) => {
        setPrompt(promptData.prompt);
        setCopyCount(promptData.prompt?.copyCount || 0);
        setReviews(reviewData.reviews || []);
        const bookmarkedIds = (bookmarksData?.bookmarks || []).map(
          (b) => b._id || b.promptId || b
        );
        setBookmarked(bookmarkedIds.includes(id));
        // Set browser tab title to the actual prompt name
        if (promptData.prompt?.title) {
          document.title = `${promptData.prompt.title} | Promptly`;
        }
      })
      .catch(() => toast.error("Failed to load prompt"))
      .finally(() => setIsLoading(false));

    return () => {
      document.title = "Promptly — AI Prompt Marketplace";
    };
  }, [id]);

  const user = mounted ? session?.user : null;
  const isPremium = user?.isPremium === true;
  const isPrivate = prompt?.visibility === "Private";
  const isLocked = isPrivate && !isPremium;

  const handleCopy = async () => {
    if (isLocked || copyingRef.current) return;
    const copiedKey = `copied_${prompt._id}`;
    const alreadyCopied = localStorage.getItem(copiedKey);
    copyingRef.current = true;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      if (!alreadyCopied) {
        setCopyCount((prev) => prev + 1);
        await incrementCopyCount(prompt._id);
        localStorage.setItem(copiedKey, "true");
      }
      toast.success("Prompt copied to clipboard");
      setTimeout(() => {
        setCopied(false);
        copyingRef.current = false;
      }, 2000);
    } catch {
      toast.error("Failed to copy");
      copyingRef.current = false;
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark");
      return;
    }
    try {
      const data = await toggleBookmark(prompt._id);
      setBookmarked(data.action === "added");
      toast.success(
        data.action === "added" ? "Prompt bookmarked" : "Bookmark removed",
      );
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    setSubmittingReview(true);
    try {
      await addReview({
        promptId: prompt._id,
        promptTitle: prompt.title,
        name: user.name,
        email: user.email,
        rating,
        comment: reviewText,
      });
      toast.success("Review submitted");
      setRating(0);
      setReviewText("");
      const data = await getReviews(prompt._id);
      setReviews(data.reviews || []);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Show nothing while checking auth
  if (!mounted || !session?.user) return null;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-page-bg px-3 py-6">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="h-6 w-32 animate-pulse rounded bg-surface-hover" />
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="h-48 animate-pulse rounded-xl bg-surface-hover" />
              <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
            </div>
            <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
          </div>
        </div>
      </main>
    );
  }

  if (!prompt) {
    return (
      <main className="min-h-screen bg-page-bg px-3 py-6">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h1 className="text-2xl font-bold text-text-primary">
            Prompt not found
          </h1>
          <Link
            href="/prompts"
            className={
              "mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-base font-semibold text-on-brand " +
              focusRing
            }
          >
            Back to All Prompts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page-bg px-3 py-6">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-screen-xl">
        <Link
          href="/prompts"
          className={
            "inline-flex items-center gap-2 text-base font-medium text-text-secondary transition-colors hover:text-text-primary " +
            focusRing
          }
        >
          <ArrowLeft className="h-4 w-4" /> All Prompts
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Header */}
            <div className="rounded-xl border bg-surface p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border px-3 py-1 text-base font-medium text-text-secondary">
                  {prompt.aiTool}
                </span>
                <span className="rounded-md border px-3 py-1 text-base font-medium text-text-secondary">
                  {prompt.category}
                </span>
                <span
                  className={
                    "rounded-md px-3 py-1 text-base font-medium " +
                    (DIFFICULTY_STYLES[prompt.difficulty] || "")
                  }
                >
                  {prompt.difficulty}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
                {prompt.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                {prompt.description}
              </p>
              {prompt.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-brand-light px-3 py-1 text-base font-medium text-brand"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt content */}
            <div className="rounded-xl border bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">
                  Prompt Content
                </h2>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={
                      "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-base font-medium transition-colors hover:bg-surface-hover " +
                      (copied
                        ? "border-success text-success"
                        : "text-text-secondary hover:text-text-primary") +
                      " " +
                      focusRing
                    }
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              {isLocked ? (
                <div className="relative mt-4 overflow-hidden rounded-lg border">
                  <pre className="select-none p-4 text-base leading-relaxed text-text-secondary opacity-30 blur-sm line-clamp-4 font-mono whitespace-pre-wrap">
                    {prompt.content}
                  </pre>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface/80 p-6 text-center">
                    <Lock className="h-8 w-8 text-text-secondary" />
                    <p className="text-lg font-semibold text-text-primary">
                      Premium Prompt
                    </p>
                    <p className="text-base text-text-secondary">
                      Subscribe to Premium to unlock this prompt.
                    </p>
                    <Link
                      href={`/payment?from=/prompts/${id}`}
                      className={
                        "inline-flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover " +
                        focusRing
                      }
                    >
                      Subscribe to Premium — $5
                    </Link>
                  </div>
                </div>
              ) : (
                <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-surface-hover p-4 font-mono text-base leading-relaxed text-text-primary">
                  {prompt.content}
                </pre>
              )}
            </div>

            {/* Usage instructions */}
            {prompt.usageInstructions && (
              <div className="rounded-xl border bg-surface p-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  Usage Instructions
                </h2>
                <p className="mt-3 text-base leading-relaxed text-text-secondary">
                  {prompt.usageInstructions}
                </p>
              </div>
            )}

            {/* Reviews */}
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Reviews & Ratings ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-4 text-base text-text-secondary">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="mt-4 flex flex-col divide-y">
                  {reviews.map((r) => (
                    <div key={r._id} className="py-4">
                      <div className="flex items-center justify-between">
                        <Stars rating={r.rating} />
                        <span className="text-base text-text-secondary">
                          {new Date(r.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-base font-semibold text-text-primary">
                        {r.name}
                      </p>
                      <p className="mt-1 text-base text-text-secondary">
                        {r.email}
                      </p>
                      <p className="mt-2 text-base leading-relaxed text-text-primary">
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {user && !isLocked && (
                <form
                  onSubmit={handleReview}
                  className="mt-6 flex flex-col gap-4 border-t pt-6"
                >
                  <h3 className="text-lg font-semibold text-text-primary">
                    Write a Review
                  </h3>
                  <div>
                    <p className="mb-2 text-base font-medium text-text-primary">
                      Your Rating
                    </p>
                    <Stars rating={rating} interactive onRate={setRating} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="review"
                      className="text-base font-medium text-text-primary"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="review"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this prompt..."
                      className={
                        "w-full rounded-lg border bg-surface-hover px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand resize-none " +
                        focusRing
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className={
                      "inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 " +
                      focusRing
                    }
                  >
                    {submittingReview ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-xl border bg-surface p-5">
              <div className="flex items-center gap-3 text-base text-text-secondary">
                <Copy className="h-4 w-4" />
                <span>{copyCount} copies</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={isLocked}
                  className={
                    "flex h-11 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold text-on-brand transition-all active:scale-[0.98] disabled:opacity-50 " +
                    (copied
                      ? "bg-success hover:opacity-90"
                      : "bg-brand hover:bg-brand-hover") +
                    " " +
                    focusRing
                  }
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Prompt
                    </>
                  )}
                </button>
                {user && (
                  <>
                    <button
                      type="button"
                      onClick={handleBookmark}
                      className={
                        "flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-base font-medium transition-colors hover:bg-surface-hover " +
                        focusRing +
                        (bookmarked
                          ? " border-brand text-brand"
                          : " text-text-primary")
                      }
                    >
                      <Bookmark
                        className={
                          "h-4 w-4 " + (bookmarked ? "fill-brand" : "")
                        }
                      />
                      {bookmarked ? "Bookmarked" : "Bookmark"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReport(true)}
                      className={
                        "flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-base font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-error " +
                        focusRing
                      }
                    >
                      <Flag className="h-4 w-4" /> Report
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-surface p-5">
              <h2 className="text-base font-semibold text-text-primary">
                Creator
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-base font-bold text-on-brand">
                  {prompt.creatorName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-base font-semibold text-text-primary">
                    {prompt.creatorName}
                  </p>
                  <p className="text-base text-text-secondary">
                    {prompt.creatorEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-surface p-5">
              <h2 className="text-base font-semibold text-text-primary">
                Details
              </h2>
              <div className="mt-3 flex flex-col divide-y">
                {[
                  { label: "Category", value: prompt.category },
                  { label: "AI Tool", value: prompt.aiTool },
                  { label: "Difficulty", value: prompt.difficulty },
                  { label: "Visibility", value: prompt.visibility },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-base text-text-secondary">
                      {label}
                    </span>
                    <span className="text-base font-medium text-text-primary">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showReport && (
        <ReportModal
          promptId={prompt._id}
          onClose={() => setShowReport(false)}
        />
      )}
    </main>
  );
}
