"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Bookmark, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getPromptById, getReviews, getBookmarks } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function PromptAnalyticsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [prompt, setPrompt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getPromptById(id), getReviews(id)])
      .then(([promptData, reviewData]) => {
        setPrompt(promptData.prompt);
        setReviews(reviewData.reviews || []);
      })
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-hover" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-surface-hover"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base text-text-secondary">Prompt not found.</p>
        <Link
          href="/dashboard/my-prompts"
          className={
            "mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand " +
            focusRing
          }
        >
          Back to My Prompts
        </Link>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "—";

  const STATS = [
    { icon: Copy, label: "Total Copies", value: prompt.copyCount || 0 },
    { icon: Star, label: "Avg Rating", value: avgRating },
    { icon: Bookmark, label: "Total Reviews", value: reviews.length },
  ];

  // Build last 6 months review chart data
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString("en-GB", { month: "short" });
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const monthReviews = reviews.filter((r) => {
      const d = new Date(r.createdAt);
      return d >= monthStart && d < monthEnd;
    });
    chartData.push({ month, reviews: monthReviews.length });
  }

  return (
    <section>
      <Toaster position="top-center" />

      <button
        type="button"
        onClick={() => router.push("/dashboard/my-prompts")}
        className={
          "mb-6 inline-flex items-center gap-2 text-base font-medium text-text-secondary transition-colors hover:text-text-primary " +
          focusRing
        }
      >
        <ArrowLeft className="h-4 w-4" /> My Prompts
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Prompt Analytics
        </h1>
        <p className="mt-1 text-base text-text-secondary">{prompt.title}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-surface px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="h-5 w-5 text-brand" />
              <p className="text-base text-text-secondary">{stat.label}</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-text-primary">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Reviews chart */}
      <div className="mt-6 rounded-xl border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Reviews (Last 6 Months)
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-text-primary)" }}
            />
            <Line
              type="monotone"
              dataKey="reviews"
              stroke="#1d4ed8"
              strokeWidth={2}
              dot={{ fill: "#1d4ed8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent reviews */}
      {reviews.length > 0 && (
        <div className="mt-6 rounded-xl border bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Recent Reviews
          </h2>
          <div className="flex flex-col divide-y">
            {reviews.slice(0, 5).map((r) => (
              <div key={r._id} className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-text-primary">
                    {r.name}
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        viewBox="0 0 16 16"
                        className={
                          "h-4 w-4 " +
                          (s <= r.rating ? "fill-warning" : "fill-border")
                        }
                        aria-hidden="true"
                      >
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-base text-text-secondary">
                  {r.comment}
                </p>
                <p className="mt-1 text-base text-text-muted">
                  {new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
