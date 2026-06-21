"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  FileText,
  DollarSign,
  Star,
  CheckCircle,
  Mail,
  Calendar,
  Lock,
  Eye,
  Trash2,
  UserCheck,
  Flag,
  BarChart2,
  Zap,
  Globe,
  Settings,
  Activity,
  Copy,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  getAdminAnalytics,
  getAdminPayments,
  getAdminUsers,
  getAdminPrompts,
  getCreatorRequests,
} from "@/lib/api";

/* ─── helpers ───────────────────────────────────────────────── */
function fmt(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function fmtMoney(n) {
  if (!n && n !== 0) return "$0";
  // amounts are already in dollars
  return "$" + Number(n).toFixed(2);
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const secs = Math.floor((Date.now() - d) / 1000);
  if (secs < 60)   return "just now";
  if (secs < 3600) return Math.floor(secs / 60) + "m ago";
  if (secs < 86400) return Math.floor(secs / 3600) + "h ago";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── sub-components ────────────────────────────────────────── */
function Skeleton({ h = "h-10", cls = "" }) {
  return <div className={"animate-pulse rounded-xl bg-surface-hover " + h + " " + cls} />;
}

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-surface p-5">
      <div className={"flex h-10 w-10 items-center justify-center rounded-lg " + color}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-text-primary">{value}</p>
        {sub && <p className="mt-0.5 text-sm text-text-muted">{sub}</p>}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-page-bg">
          <Icon className="h-4 w-4 text-text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-0.5 truncate text-base font-semibold text-text-primary">{value}</p>
        </div>
      </div>
      {badge && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-sm font-semibold text-success">
          <CheckCircle className="h-3.5 w-3.5" />
          {badge}
        </span>
      )}
    </div>
  );
}

function CapabilityChip({ icon: Icon, label, description }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-surface p-4 transition-colors hover:bg-surface-hover">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <div className="min-w-0">
        <p className="text-base font-semibold text-text-primary">{label}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main page
═══════════════════════════════════════════════════════════════ */
export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [analytics,   setAnalytics]   = useState(null);
  const [payments,    setPayments]    = useState([]);
  const [users,       setUsers]       = useState([]);
  const [prompts,     setPrompts]     = useState([]);
  const [requests,    setRequests]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getAdminAnalytics(),
      getAdminPayments(),
      getAdminUsers(),
      getAdminPrompts(),
      getCreatorRequests(),
    ]).then(([a, p, u, pr, r]) => {
      if (a.status  === "fulfilled") setAnalytics(a.value);
      if (p.status  === "fulfilled") setPayments(p.value?.payments || []);
      if (u.status  === "fulfilled") setUsers(u.value?.users || []);
      if (pr.status === "fulfilled") setPrompts(pr.value?.prompts || []);
      if (r.status  === "fulfilled") setRequests(r.value?.requests || []);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue    = useMemo(() => payments.reduce((s, p) => s + (p.amount || 0), 0), [payments]);
  const pendingRequests = useMemo(() => requests.filter((r) => r.status === "pending").length, [requests]);
  const pendingPrompts  = useMemo(() => prompts.filter((p) => p.status === "pending").length, [prompts]);

  /* avatar initials */
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "A";

  const STATS = [
    {
      icon: Users,
      label: "Total Users",
      value: fmt(analytics?.totalUsers ?? users.length),
      color: "bg-[#6366f1]",
      sub: `${users.filter((u) => u.role === "creator").length} creators`,
    },
    {
      icon: FileText,
      label: "Total Prompts",
      value: fmt(analytics?.totalPrompts ?? prompts.length),
      color: "bg-[#10b981]",
      sub: `${pendingPrompts} pending`,
    },
    {
      icon: DollarSign,
      label: "Revenue Generated",
      value: fmtMoney(totalRevenue),
      color: "bg-[#f59e0b]",
      sub: `${payments.length} transactions`,
    },
    {
      icon: Star,
      label: "Total Reviews",
      value: fmt(analytics?.totalReviews),
      color: "bg-[#8b5cf6]",
      sub: `${fmt(analytics?.totalCopies)} copies`,
    },
  ];

  const CAPABILITIES = [
    {
      icon: BarChart2,
      label: "Analytics & Insights",
      description: "Full platform analytics — revenue, user growth, prompt performance, and category trends.",
    },
    {
      icon: Users,
      label: "User Administration",
      description: "View, search, change roles, and delete any user account on the platform.",
    },
    {
      icon: Eye,
      label: "Content Moderation",
      description: "Approve, reject, feature, or delete prompts. Review flagged and reported content.",
    },
    {
      icon: DollarSign,
      label: "Financial Oversight",
      description: "Monitor all payment transactions, revenue history, and premium membership status.",
    },
    {
      icon: UserCheck,
      label: "Creator Approvals",
      description: "Review creator access requests and promote users to creator status.",
    },
    {
      icon: Flag,
      label: "Reports Management",
      description: "Investigate user-submitted reports and take action on policy violations.",
    },
    {
      icon: Settings,
      label: "Platform Configuration",
      description: "Full control over platform settings, feature flags, and system behaviour.",
    },
    {
      icon: Globe,
      label: "Global Access",
      description: "Unrestricted access to all areas of the platform without role restrictions.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Hero card ─────────────────────────────────────────── */}
      <div className="rounded-xl border bg-surface p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left — avatar + name */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-brand flex items-center justify-center shadow-sm">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Admin"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <span className="text-xl font-bold text-on-brand">{initials}</span>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-brand">
                <ShieldCheck className="h-3 w-3 text-on-brand" strokeWidth={2.5} />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold leading-tight text-text-primary">
                  {user?.name || "Admin"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-sm font-bold text-brand">
                  <ShieldCheck className="h-3 w-3" /> Admin
                </span>
              </div>
              <p className="mt-0.5 text-base text-text-secondary">{user?.email || "—"}</p>
              <p className="mt-1 text-sm text-text-muted">Full platform access · No restrictions</p>
            </div>
          </div>

          {/* Right — status */}
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
            <Activity className="h-3.5 w-3.5" /> Account Active
          </span>
        </div>
      </div>

      {/* ── Platform stats ────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-text-primary">Platform Overview</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h="h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        )}
      </div>

      {/* ── Account details + Quick actions ──────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Account info */}
        <div className="rounded-xl border bg-surface">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-text-primary">Account Details</h2>
            <p className="mt-0.5 text-sm text-text-secondary">Your admin account information</p>
          </div>
          <div className="divide-y px-6">
            <InfoRow icon={Mail} label="Email Address" value={user?.email || "—"} badge="Verified" />
            <InfoRow icon={ShieldCheck} label="Account Role" value="Administrator" badge="Full Access" />
            <InfoRow icon={Calendar} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"} />
            <InfoRow icon={Lock} label="Account Security" value="Protected by Better Auth" badge="Secure" />
            <InfoRow icon={Zap} label="Access Level" value="Full platform — no restrictions" />
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border bg-surface">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-text-primary">Quick Actions</h2>
            <p className="mt-0.5 text-sm text-text-secondary">Jump to the most common tasks</p>
          </div>
          <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2">
            {[
              { href: "/admin/users",             icon: Users,      label: "Manage Users",       color: "bg-[#6366f1]/10 text-[#6366f1]" },
              { href: "/admin/prompts",            icon: FileText,   label: "Review Prompts",     color: "bg-[#10b981]/10 text-[#10b981]" },
              { href: "/admin/payments",           icon: DollarSign, label: "View Payments",      color: "bg-[#f59e0b]/10 text-[#f59e0b]" },
              { href: "/admin/creator-requests",   icon: UserCheck,  label: "Creator Requests",   color: "bg-[#8b5cf6]/10 text-[#8b5cf6]" },
              { href: "/admin/reported",           icon: Flag,       label: "Reported Prompts",   color: "bg-[#ef4444]/10 text-[#ef4444]" },
              { href: "/admin",                    icon: BarChart2,  label: "Analytics",          color: "bg-[#06b6d4]/10 text-[#06b6d4]" },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl border bg-page-bg p-4 transition-all hover:border-brand hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <div className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " + color}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-base font-semibold text-text-primary">{label}</span>
              </Link>
            ))}
          </div>

          {/* Pending alerts */}
          {!loading && (pendingPrompts > 0 || pendingRequests > 0) && (
            <div className="border-t px-6 pb-6 pt-4 space-y-2">
              {pendingPrompts > 0 && (
                <Link href="/admin/prompts" className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-2.5 text-sm font-medium text-warning transition-colors hover:bg-warning/10">
                  <FileText className="h-4 w-4 shrink-0" />
                  {pendingPrompts} prompt{pendingPrompts > 1 ? "s" : ""} need review
                </Link>
              )}
              {pendingRequests > 0 && (
                <Link href="/admin/creator-requests" className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-4 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand/10">
                  <UserCheck className="h-4 w-4 shrink-0" />
                  {pendingRequests} creator request{pendingRequests > 1 ? "s" : ""} pending
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Admin capabilities ────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-semibold text-text-primary">Admin Capabilities</h2>
          <span className="rounded-full bg-brand px-2.5 py-0.5 text-sm font-bold text-on-brand">
            {CAPABILITIES.length}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CAPABILITIES.map((cap) => (
            <CapabilityChip key={cap.label} {...cap} />
          ))}
        </div>
      </div>

      {/* ── Platform health meter ─────────────────────────────── */}
      <div className="rounded-xl border bg-surface p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Platform Health</h2>
            <p className="mt-0.5 text-sm text-text-secondary">Real-time status of key platform metrics</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
            <Activity className="h-3.5 w-3.5" /> Healthy
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h="h-8" />)}
          </div>
        ) : (
          <div className="space-y-5">
            {[
              {
                label: "User Growth",
                pct: Math.min(100, users.length > 0 ? Math.round((users.length / Math.max(users.length, 100)) * 100) : 0),
                color: "bg-[#6366f1]",
                value: `${users.length} users`,
              },
              {
                label: "Content Volume",
                pct: Math.min(100, prompts.length > 0 ? Math.round((prompts.length / Math.max(prompts.length, 200)) * 100) : 0),
                color: "bg-[#10b981]",
                value: `${prompts.length} prompts`,
              },
              {
                label: "Revenue Health",
                pct: Math.min(100, payments.length > 0 ? Math.round((payments.filter((p) => p.status === "completed" || p.status === "succeeded").length / payments.length) * 100) : 100),
                color: "bg-[#f59e0b]",
                value: `${payments.length > 0 ? Math.round((payments.filter((p) => p.status === "completed" || p.status === "succeeded").length / payments.length) * 100) : 100}% success rate`,
              },
              {
                label: "Engagement",
                pct: Math.min(100, analytics?.totalCopies > 0 ? Math.min(100, Math.round((analytics.totalCopies / (analytics.totalPrompts || 1)) * 10)) : 0),
                color: "bg-[#8b5cf6]",
                value: `${fmt(analytics?.totalCopies)} total copies`,
              },
            ].map(({ label, pct, color, value }) => (
              <div key={label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-base font-medium text-text-primary">{label}</span>
                  <span className="text-sm font-semibold text-text-secondary">{value}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className={"h-full rounded-full transition-all duration-700 " + color}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
