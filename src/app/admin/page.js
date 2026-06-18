"use client";

import { Users, FileText, Star, Copy } from "lucide-react";

// Placeholder — replace with real API
const STATS = [
  { label: "Total Users", value: "1,240", icon: Users },
  { label: "Total Prompts", value: "348", icon: FileText },
  { label: "Total Reviews", value: "892", icon: Star },
  { label: "Total Copies", value: "5,610", icon: Copy },
];

export default function AdminAnalyticsPage() {
  return (
    <section>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Analytics
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Platform overview at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col gap-3 rounded-xl border bg-surface px-5 py-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-base text-text-secondary">{label}</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light">
                <Icon className="h-5 w-5 text-brand" />
              </span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
