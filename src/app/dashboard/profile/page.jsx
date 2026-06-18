"use client";

import Link from "next/link";
import Image from "next/image";
import { Crown, Mail, Shield, FileText, BadgeCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-hover" />
        <div className="h-40 w-full animate-pulse rounded-xl bg-surface-hover" />
        <div className="h-40 w-full animate-pulse rounded-xl bg-surface-hover" />
      </div>
    );
  }

  const INFO_ROWS = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Shield, label: "Role", value: user?.role || "user" },
    { icon: FileText, label: "Total Prompts", value: user?.totalPrompts ?? 0 },
    {
      icon: BadgeCheck,
      label: "Subscription",
      value: user?.isPremium ? "Premium" : "Free",
    },
  ];

  return (
    <section>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          My Profile
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Manage your account details and subscription.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border bg-surface px-6 py-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="shrink-0">
            {user?.image ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src={user.image}
                  alt={user.name ?? "Profile photo"}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand">
                <span className="text-2xl font-bold text-on-brand">
                  {user?.name?.charAt(0).toUpperCase() ?? "U"}
                </span>
              </div>
            )}
          </div>

          {/* Name + badge */}
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-tight text-text-primary">
              {user?.name ?? "User"}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-base font-medium text-brand">
                <Shield className="h-4 w-4" />
                {user?.role ?? "user"}
              </span>
              {user?.isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-base font-medium text-success">
                  <Crown className="h-4 w-4" />
                  Premium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-base font-medium text-text-secondary">
                  Free Plan
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="mt-6 divide-y border-t">
          {INFO_ROWS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-text-secondary" />
                <span className="text-base font-medium text-text-secondary">
                  {label}
                </span>
              </div>
              <span className="text-base font-semibold text-text-primary capitalize">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade banner — free users only */}
      {!user?.isPremium && (
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-brand bg-brand-light px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Crown className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-base font-semibold text-text-primary">
                Upgrade to Premium
              </p>
              <p className="mt-0.5 text-base text-text-secondary">
                Unlock all private prompts and remove the 3-prompt limit.
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
            <Crown className="h-4 w-4" />
            Go Premium — $5
          </Link>
        </div>
      )}

      {/* Become a creator */}
      {!user?.isPremium && user?.role === "user" && (
        <div className="mt-4 flex flex-col gap-4 rounded-xl border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-text-primary">
              Become a Creator
            </p>
            <p className="mt-0.5 text-base text-text-secondary">
              Apply to become a creator and publish unlimited prompts with
              analytics.
            </p>
          </div>
          <button
            type="button"
            className={
              "inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-5 text-base font-semibold text-text-primary transition-all duration-200 hover:bg-surface-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Apply Now
          </button>
        </div>
      )}
    </section>
  );
}
