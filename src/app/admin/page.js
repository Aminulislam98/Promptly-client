"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  FileText,
  Star,
  Copy,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getAdminAnalytics,
  getAdminPayments,
  getAdminUsers,
  getAdminPrompts,
} from "@/lib/api";

/* ─── helpers ──────────────────────────────────────────────── */
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function groupByMonth(items, dateKey = "createdAt", valueKey = null) {
  const map = {};
  (items || []).forEach((item) => {
    const d = new Date(item[dateKey]);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map[key]) map[key] = { year: d.getFullYear(), month: d.getMonth(), count: 0, total: 0 };
    map[key].count += 1;
    if (valueKey) map[key].total += Number(item[valueKey]) || 0;
  });
  return Object.values(map)
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .slice(-6)
    .map((m) => ({
      name: `${MONTH_SHORT[m.month]} ${String(m.year).slice(2)}`,
      count: m.count,
      total: m.total,
    }));
}

function groupByField(items, key) {
  const map = {};
  (items || []).forEach((item) => {
    const v = item[key] || "Unknown";
    map[v] = (map[v] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
}

function fmt(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function fmtMoney(n) {
  if (!n && n !== 0) return "$0";
  return "$" + (n / 100).toFixed(0);
}

/* ─── chart colour palettes ────────────────────────────────── */
const CHART_BRAND   = "#6366f1";
const CHART_AMBER   = "#f59e0b";

const ROLE_COLORS = {
  admin:   "#6366f1",
  creator: "#10b981",
  user:    "#94a3b8",
};

const CAT_COLORS = [
  "#6366f1","#10b981","#f59e0b","#ef4444",
  "#8b5cf6","#06b6d4","#ec4899","#f97316",
];

/* ─── custom tooltip ────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, prefix = "", suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-surface px-4 py-3 shadow-lg">
      <p className="mb-1 text-sm font-semibold text-text-secondary">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-base font-bold" style={{ color: p.color }}>
          {prefix}{p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

/* ─── KPI card ──────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-surface p-6">
      <div className={"flex h-11 w-11 items-center justify-center rounded-xl " + color}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <p className="mt-0.5 text-3xl font-bold text-text-primary">{value ?? "—"}</p>
        {sub && <p className="mt-1 text-sm text-text-muted">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── section header ────────────────────────────────────────── */
function SectionHeader({ title, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      {sub && <p className="mt-0.5 text-sm text-text-secondary">{sub}</p>}
    </div>
  );
}

/* ─── skeleton ──────────────────────────────────────────────── */
function Skeleton({ h = "h-64" }) {
  return <div className={"w-full animate-pulse rounded-xl bg-surface-hover " + h} />;
}

/* ─── payment status badge ──────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    completed: "bg-success/10 text-success",
    succeeded: "bg-success/10 text-success",
    pending:   "bg-warning/10 text-warning",
    failed:    "bg-error/10 text-error",
  };
  const Icon =
    status === "completed" || status === "succeeded" ? CheckCircle
    : status === "failed" ? XCircle
    : Clock;
  return (
    <span className={"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold capitalize " + (map[status] || "bg-surface-hover text-text-muted")}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main page
═══════════════════════════════════════════════════════════════ */
export default function AdminHomePage() {
  const [analytics, setAnalytics] = useState(null);
  const [payments,  setPayments]  = useState([]);
  const [users,     setUsers]     = useState([]);
  const [prompts,   setPrompts]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getAdminAnalytics(),
      getAdminPayments(),
      getAdminUsers(),
      getAdminPrompts(),
    ]).then(([a, p, u, pr]) => {
      if (a.status  === "fulfilled") setAnalytics(a.value);
      if (p.status  === "fulfilled") setPayments(p.value?.payments || []);
      if (u.status  === "fulfilled") setUsers(u.value?.users || []);
      if (pr.status === "fulfilled") setPrompts(pr.value?.prompts || []);
    }).finally(() => setLoading(false));
  }, []);

  /* derived data */
  const revenueByMonth    = useMemo(() => groupByMonth(payments, "createdAt", "amount"), [payments]);
  const usersJoinedMonth  = useMemo(() => groupByMonth(users, "createdAt"), [users]);
  const usersByRole       = useMemo(() => groupByField(users, "role"), [users]);
  const promptsByCategory = useMemo(() => groupByField(prompts, "category"), [prompts]);
  const totalRevenue      = useMemo(() => payments.reduce((s, p) => s + (p.amount || 0), 0), [payments]);
  const recentPayments    = useMemo(() => [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8), [payments]);
  const pendingPrompts    = useMemo(() => prompts.filter((p) => p.status === "pending").length, [prompts]);

  const KPI_CARDS = [
    {
      icon: Users,
      label: "Total Users",
      value: fmt(analytics?.totalUsers ?? (users.length || null)),
      color: "bg-[#6366f1]",
      sub: `${users.filter((u) => u.role === "creator").length} creators`,
    },
    {
      icon: FileText,
      label: "Total Prompts",
      value: fmt(analytics?.totalPrompts ?? (prompts.length || null)),
      color: "bg-[#10b981]",
      sub: `${pendingPrompts} pending review`,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: fmtMoney(totalRevenue),
      color: "bg-[#f59e0b]",
      sub: `${payments.length} transactions`,
    },
    {
      icon: Star,
      label: "Total Reviews",
      value: fmt(analytics?.totalReviews),
      color: "bg-[#8b5cf6]",
      sub: `${fmt(analytics?.totalCopies)} copies made`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* page heading */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-text-primary">Analytics</h1>
          <p className="mt-1 text-base text-text-secondary">
            Platform-wide performance and activity overview.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
          <Activity className="h-3.5 w-3.5" /> Live
        </span>
      </div>

      {/* KPI grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h="h-36" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPI_CARDS.map((card) => <KpiCard key={card.label} {...card} />)}
        </div>
      )}

      {/* Row 2 — Revenue line + User role donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Revenue over time */}
        <div className="rounded-xl border bg-surface p-6 lg:col-span-3">
          <SectionHeader title="Revenue over Time" sub="Monthly earnings from premium purchases" />
          {loading ? <Skeleton h="h-60" /> : revenueByMonth.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-base text-text-muted">No payment data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueByMonth} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e6ea" />
                <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#606060" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: "#606060" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/100).toFixed(0)}`} />
                <Tooltip content={<ChartTooltip prefix="$" />} formatter={(v) => (v/100).toFixed(0)} />
                <Line type="monotone" dataKey="total" stroke={CHART_AMBER} strokeWidth={2.5} dot={{ fill: CHART_AMBER, r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Users by role donut */}
        <div className="rounded-xl border bg-surface p-6 lg:col-span-2">
          <SectionHeader title="Users by Role" sub="Role distribution breakdown" />
          {loading ? <Skeleton h="h-60" /> : usersByRole.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-base text-text-muted">No users yet</div>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={usersByRole}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {usersByRole.map((entry) => (
                      <Cell key={entry.name} fill={ROLE_COLORS[entry.name] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                {usersByRole.map((r) => (
                  <span key={r.name} className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: ROLE_COLORS[r.name] || "#94a3b8" }} />
                    <span className="capitalize">{r.name}</span>
                    <span className="font-bold text-text-primary">({r.value})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 3 — New users bar + Prompts by category */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* New users per month */}
        <div className="rounded-xl border bg-surface p-6">
          <SectionHeader title="New Users per Month" sub="Last 6 months signup activity" />
          {loading ? <Skeleton h="h-52" /> : usersJoinedMonth.length === 0 ? (
            <div className="flex h-52 items-center justify-center text-base text-text-muted">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usersJoinedMonth} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e6ea" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#606060" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: "#606060" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip suffix=" users" />} />
                <Bar dataKey="count" fill={CHART_BRAND} radius={[4, 4, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Prompts by category */}
        <div className="rounded-xl border bg-surface p-6">
          <SectionHeader title="Prompts by Category" sub="Top 8 most populated categories" />
          {loading ? <Skeleton h="h-52" /> : promptsByCategory.length === 0 ? (
            <div className="flex h-52 items-center justify-center text-base text-text-muted">No prompts yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={promptsByCategory} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e6ea" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#606060" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#606060" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<ChartTooltip suffix=" prompts" />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Prompts">
                  {promptsByCategory.map((_, i) => (
                    <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 4 — Recent payments */}
      <div className="rounded-xl border bg-surface">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Recent Payments</h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              {recentPayments.length > 0 ? `Latest ${recentPayments.length} transactions` : "All time payment history"}
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-text-muted" />
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h="h-10" />)}
          </div>
        ) : recentPayments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <DollarSign className="h-10 w-10 text-text-muted" />
            <p className="text-base font-semibold text-text-primary">No payments yet</p>
            <p className="text-sm text-text-secondary">Transactions will appear here once users start purchasing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead>
                <tr className="border-b bg-page-bg">
                  <th className="px-6 py-3 text-sm font-semibold text-text-secondary">User</th>
                  <th className="px-6 py-3 text-sm font-semibold text-text-secondary">Amount</th>
                  <th className="px-6 py-3 text-sm font-semibold text-text-secondary">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-text-secondary">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentPayments.map((p, i) => (
                  <tr key={p._id || i} className="transition-colors hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                          {(p.userName || p.userEmail || "?")[0].toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-text-primary">{p.userName || "—"}</p>
                          <p className="truncate text-sm text-text-muted">{p.userEmail || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-text-primary">
                      {fmtMoney(p.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Alert banner — pending prompts */}
      {!loading && pendingPrompts > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <p className="font-semibold text-text-primary">
              {pendingPrompts} prompt{pendingPrompts > 1 ? "s" : ""} awaiting review
            </p>
            <p className="mt-0.5 text-sm text-text-secondary">
              Review and approve or reject these to keep platform quality high.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
