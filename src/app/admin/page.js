"use client";

import { useState, useEffect } from "react";
import { Users, FileText, Star, Copy } from "lucide-react";
import { getAdminAnalytics } from "@/lib/api";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-surface p-6">
      <div
        className={
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg " +
          color
        }
      >
        <Icon className="h-6 w-6 text-on-brand" />
      </div>
      <div>
        <p className="text-base text-text-secondary">{label}</p>
        <p className="text-3xl font-bold text-text-primary">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const CARDS = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.totalUsers,
      color: "bg-brand",
    },
    {
      icon: FileText,
      label: "Total Prompts",
      value: stats?.totalPrompts,
      color: "bg-success",
    },
    {
      icon: Star,
      label: "Total Reviews",
      value: stats?.totalReviews,
      color: "bg-warning",
    },
    {
      icon: Copy,
      label: "Total Copies",
      value: stats?.totalCopies,
      color: "bg-error",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl bg-surface-hover"
          />
        ))}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Platform overview and analytics.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}
