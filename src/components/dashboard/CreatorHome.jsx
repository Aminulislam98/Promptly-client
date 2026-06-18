"use client";

import { Copy, Bookmark, FileText, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Placeholder — replace with real API
const COPY_DATA = [
  { month: "Jan", copies: 12 },
  { month: "Feb", copies: 28 },
  { month: "Mar", copies: 19 },
  { month: "Apr", copies: 45 },
  { month: "May", copies: 38 },
  { month: "Jun", copies: 62 },
];

const GROWTH_DATA = [
  { month: "Jan", prompts: 1 },
  { month: "Feb", prompts: 2 },
  { month: "Mar", prompts: 3 },
  { month: "Apr", prompts: 4 },
  { month: "May", prompts: 5 },
  { month: "Jun", prompts: 7 },
];

const STAT_CARDS = [
  { label: "Total Prompts", value: "7", icon: FileText },
  { label: "Total Copies", value: "204", icon: Copy },
  { label: "Total Bookmarks", value: "38", icon: Bookmark },
  { label: "Growth", value: "+18%", icon: TrendingUp },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-surface px-3 py-2 text-base">
      <p className="font-medium text-text-primary">{label}</p>
      <p className="text-text-secondary">
        {payload[0].name}:{" "}
        <span className="font-semibold text-brand">{payload[0].value}</span>
      </p>
    </div>
  );
}

export default function CreatorHome({ user }) {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Creator Home
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Track your prompt performance and growth.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon }) => (
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

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Area chart — copies */}
        <div className="rounded-xl border bg-surface px-5 py-5">
          <h2 className="mb-1 text-xl font-semibold text-text-primary">
            Total Copies
          </h2>
          <p className="mb-6 text-base text-text-secondary">
            Copies per month across all prompts.
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={COPY_DATA}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="copyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 13, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 13, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "var(--border)" }}
              />
              <Area
                type="monotone"
                dataKey="copies"
                name="Copies"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#copyGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#2563eb",
                  stroke: "var(--surface)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — growth */}
        <div className="rounded-xl border bg-surface px-5 py-5">
          <h2 className="mb-1 text-xl font-semibold text-text-primary">
            Prompt Growth
          </h2>
          <p className="mb-6 text-base text-text-secondary">
            Total prompts published each month.
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={GROWTH_DATA}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 13, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 13, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--surface-hover)" }}
              />
              <Bar
                dataKey="prompts"
                name="Prompts"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
