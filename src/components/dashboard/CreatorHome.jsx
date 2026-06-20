"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Copy, Bookmark, PlusCircle } from "lucide-react";
import { getCreatorAnalytics } from "@/lib/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const QUICK_LINKS = [
  {
    href: "/dashboard/add-prompt",
    icon: PlusCircle,
    label: "Add Prompt",
    desc: "Create and publish a new prompt",
  },
  {
    href: "/dashboard/my-prompts",
    icon: FileText,
    label: "My Prompts",
    desc: "Manage your published prompts",
  },
];

export default function CreatorHome({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCreatorAnalytics()
      .then((data) => setAnalytics(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const STAT_CARDS = [
    {
      icon: FileText,
      label: "Total Prompts",
      value: analytics?.totalPrompts ?? 0,
    },
    { icon: Copy, label: "Total Copies", value: analytics?.totalCopies ?? 0 },
    {
      icon: Bookmark,
      label: "Total Bookmarks",
      value: analytics?.totalBookmarks ?? 0,
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Welcome back, {user?.name?.split(" ")[0] ?? "Creator"}
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Here is your creator analytics overview.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-surface px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="h-5 w-5 text-brand" />
              <p className="text-base text-text-secondary">{stat.label}</p>
            </div>
            {isLoading ? (
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-surface-hover" />
            ) : (
              <p className="mt-2 text-3xl font-bold text-text-primary">
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
          <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
        </div>
      ) : analytics?.chartData?.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Copies chart */}
          <div className="rounded-xl border bg-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Total Copies (Last 6 Months)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
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
                  dataKey="copies"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                  dot={{ fill: "#1d4ed8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Prompt growth chart */}
          <div className="rounded-xl border bg-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Prompt Growth (Last 6 Months)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
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
                <Bar dataKey="prompts" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border bg-surface py-12 text-center">
          <FileText className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base font-semibold text-text-primary">
            No data yet
          </p>
          <p className="mt-1 text-base text-text-secondary">
            Add prompts to see your analytics.
          </p>
          <Link
            href="/dashboard/add-prompt"
            className={
              "mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover " +
              focusRing
            }
          >
            <PlusCircle className="h-4 w-4" /> Add Your First Prompt
          </Link>
        </div>
      )}

      {/* Quick links */}
      <h2 className="mb-4 mt-10 text-xl font-semibold text-text-primary">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className={
              "flex items-center gap-4 rounded-xl border bg-surface px-5 py-4 transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light">
              <Icon className="h-5 w-5 text-brand" />
            </span>
            <div className="min-w-0">
              <p className="text-base font-semibold text-text-primary">
                {label}
              </p>
              <p className="truncate text-base text-text-secondary">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
