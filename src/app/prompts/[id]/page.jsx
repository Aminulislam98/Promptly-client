"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Copy,
  Bookmark,
  Flag,
  Star,
  Lock,
  ArrowLeft,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

// Placeholder — replace with real API call using params.id
const MOCK_PROMPT = {
  _id: "1",
  title: "Write a killer cold email that gets replies",
  description:
    "This prompt helps you craft personalised cold emails that convert. It uses psychological triggers and a proven framework used by top sales reps.",
  content:
    "You are an expert cold email copywriter. Write a cold email for [YOUR PRODUCT/SERVICE] targeting [TARGET AUDIENCE]. The email should:\n\n1. Open with a personalised observation\n2. Identify a specific pain point\n3. Present your solution clearly\n4. Include social proof\n5. End with a low-friction CTA\n\nKeep it under 150 words. Be conversational, not salesy.",
  category: "Marketing",
  aiTool: "ChatGPT",
  tags: ["email", "sales", "copywriting"],
  difficulty: "Beginner",
  usageInstructions:
    "Replace [YOUR PRODUCT/SERVICE] and [TARGET AUDIENCE] with your specific details. Paste into ChatGPT and iterate based on the output.",
  visibility: "Public",
  copyCount: 42,
  isBookmarked: false,
  creator: { name: "John Doe", email: "john@example.com" },
  reviews: [
    {
      _id: "r1",
      name: "Priya S.",
      email: "priya@example.com",
      rating: 5,
      comment: "Generated 3 replies in the first day. Incredible prompt.",
      date: "2026-06-01",
    },
    {
      _id: "r2",
      name: "Tom W.",
      email: "tom@example.com",
      rating: 4,
      comment:
        "Solid framework. Had to tweak slightly for B2B but worked well.",
      date: "2026-06-10",
    },
  ],
};

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

function ReportModal({ onClose }) {
  const [reason, setReason] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    toast.success("Report submitted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-surface px-6 py-6">
        <h3 className="text-xl font-bold text-text-primary">Report Prompt</h3>
        <p className="mt-1 text-base text-text-secondary">
          Help us keep Promptly safe and high quality.
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
            className={
              "inline-flex h-10 items-center justify-center rounded-lg bg-error px-4 text-base font-semibold text-on-brand transition-all hover:opacity-80 " +
              focusRing
            }
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PromptDetailsPage({ params }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(MOCK_PROMPT.isBookmarked);
  const [showReport, setShowReport] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { data: session } = authClient.useSession();

  useEffect(() => setMounted(true), []);

  const user = mounted ? session?.user : null;
  const isPremium = user?.plan === "premium";
  const isPrivate = MOCK_PROMPT.visibility === "Private";
  const isLocked = isPrivate && !isPremium;

  const handleCopy = () => {
    if (isLocked) return;
    navigator.clipboard.writeText(MOCK_PROMPT.content);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
    // TODO: increment copyCount via API
  };

  const handleBookmark = () => {
    setBookmarked((v) => !v);
    toast.success(bookmarked ? "Bookmark removed" : "Prompt bookmarked");
    // TODO: toggle bookmark via API
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }
    toast.success("Review submitted");
    setRating(0);
    setReview("");
    // TODO: submit review via API
  };

  return (
    <main className="min-h-screen bg-page-bg px-3 py-10">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Back */}
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
          {/* Main content */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Header card */}
            <div className="rounded-xl border bg-surface p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border px-3 py-1 text-base font-medium text-text-secondary">
                  {MOCK_PROMPT.aiTool}
                </span>
                <span className="rounded-md border px-3 py-1 text-base font-medium text-text-secondary">
                  {MOCK_PROMPT.category}
                </span>
                <span
                  className={
                    "rounded-md px-3 py-1 text-base font-medium " +
                    DIFFICULTY_STYLES[MOCK_PROMPT.difficulty]
                  }
                >
                  {MOCK_PROMPT.difficulty}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
                {MOCK_PROMPT.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                {MOCK_PROMPT.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {MOCK_PROMPT.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-brand-light px-3 py-1 text-base font-medium text-brand"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
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
                      "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-base font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary " +
                      focusRing
                    }
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-success" /> Copied
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
                    {MOCK_PROMPT.content}
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
                      href="/payment"
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
                  {MOCK_PROMPT.content}
                </pre>
              )}
            </div>

            {/* Usage instructions */}
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Usage Instructions
              </h2>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                {MOCK_PROMPT.usageInstructions}
              </p>
            </div>

            {/* Reviews */}
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Reviews & Ratings
              </h2>

              {/* Existing reviews */}
              <div className="mt-4 flex flex-col divide-y">
                {MOCK_PROMPT.reviews.map((r) => (
                  <div key={r._id} className="py-4">
                    <div className="flex items-center justify-between">
                      <Stars rating={r.rating} />
                      <span className="text-base text-text-secondary">
                        {new Date(r.date).toLocaleDateString("en-GB", {
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

              {/* Write review */}
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
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience with this prompt..."
                      className={
                        "w-full rounded-lg border bg-surface-hover px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand resize-none " +
                        focusRing
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className={
                      "inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                      focusRing
                    }
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {!user && (
                <p className="mt-4 border-t pt-4 text-base text-text-secondary">
                  <Link
                    href="/login"
                    className="font-semibold text-brand hover:underline"
                  >
                    Login
                  </Link>{" "}
                  to write a review.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            {/* Actions card */}
            <div className="rounded-xl border bg-surface p-5">
              <div className="flex items-center gap-3 text-base text-text-secondary">
                <Copy className="h-4 w-4" />
                <span>{MOCK_PROMPT.copyCount} copies</span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={isLocked}
                  className={
                    "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] disabled:opacity-50 " +
                    focusRing
                  }
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
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

            {/* Creator info */}
            <div className="rounded-xl border bg-surface p-5">
              <h2 className="text-base font-semibold text-text-primary">
                Creator
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-base font-bold text-on-brand">
                  {MOCK_PROMPT.creator.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-semibold text-text-primary">
                    {MOCK_PROMPT.creator.name}
                  </p>
                  <p className="text-base text-text-secondary">
                    {MOCK_PROMPT.creator.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt meta */}
            <div className="rounded-xl border bg-surface p-5">
              <h2 className="text-base font-semibold text-text-primary">
                Details
              </h2>
              <div className="mt-3 flex flex-col divide-y">
                {[
                  { label: "Category", value: MOCK_PROMPT.category },
                  { label: "AI Tool", value: MOCK_PROMPT.aiTool },
                  { label: "Difficulty", value: MOCK_PROMPT.difficulty },
                  { label: "Visibility", value: MOCK_PROMPT.visibility },
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

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </main>
  );
}
