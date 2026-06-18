import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Star,
  Crown,
  PlusCircle,
} from "lucide-react";

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
  {
    href: "/dashboard/saved",
    icon: Bookmark,
    label: "Saved Prompts",
    desc: "Browse your bookmarked prompts",
  },
  {
    href: "/dashboard/reviews",
    icon: Star,
    label: "My Reviews",
    desc: "See reviews you have written",
  },
];

export default function UserHome({ user }) {
  const stats = [
    { label: "Total Prompts", value: "0 / 3" },
    { label: "Saved Prompts", value: "0" },
    { label: "Reviews Given", value: "0" },
    { label: "Plan", value: "Free" },
  ];

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Here is a summary of your activity on Promptly.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-surface px-5 py-4"
          >
            <p className="text-base text-text-secondary">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Upgrade banner */}
      {!user?.isPremium && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-brand bg-brand-light px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-base font-semibold text-text-primary">
                Upgrade to Premium
              </p>
              <p className="text-base text-text-secondary">
                Unlock all private prompts and publish unlimited prompts.
              </p>
            </div>
          </div>
          <Link
            href="/payment"
            className={
              "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            <Crown className="h-4 w-4" /> Go Premium — $5
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
              "flex items-center gap-4 rounded-xl border bg-surface px-5 py-4 transition-colors duration-150 hover:bg-surface-hover " +
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
