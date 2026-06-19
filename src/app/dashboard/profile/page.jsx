"use client";

import Link from "next/link";
import Image from "next/image";
import { Crown, Mail, Shield, FileText, BadgeCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { applyForCreator, getCreatorRequestStatus } from "@/lib/api";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [requestStatus, setRequestStatus] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (user) {
      getCreatorRequestStatus()
        .then((data) => setRequestStatus(data.request?.status || null))
        .catch(() => {});
    }
  }, [user]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyForCreator({
        name: user.name,
        email: user.email,
        reason: "I want to share my prompts with the community.",
      });
      setRequestStatus("pending");
      toast.success("Creator request submitted!");
    } catch (err) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setApplying(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-hover" />
        <div className="h-40 animate-pulse rounded-xl bg-surface-hover" />
        <div className="h-40 animate-pulse rounded-xl bg-surface-hover" />
      </div>
    );
  }

  const INFO_ROWS = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Shield, label: "Role", value: user?.role || "user" },
    {
      icon: BadgeCheck,
      label: "Subscription",
      value: user?.isPremium ? "Premium" : "Free",
    },
  ];

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          My Profile
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Manage your account and subscription.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border bg-surface px-6 py-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="shrink-0">
            {user?.image ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src={user.image}
                  alt={user.name ?? "Profile"}
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
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-tight text-text-primary">
              {user?.name ?? "User"}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-base font-medium text-brand">
                <Shield className="h-4 w-4" /> {user?.role ?? "user"}
              </span>
              {user?.isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-base font-medium text-success">
                  <Crown className="h-4 w-4" /> Premium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-base font-medium text-text-secondary">
                  Free Plan
                </span>
              )}
            </div>
          </div>
        </div>

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

      {/* Upgrade banner */}
      {!user?.isPremium && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-brand bg-brand-light px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
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
              "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            <Crown className="h-4 w-4" /> Go Premium — $5
          </Link>
        </div>
      )}

      {/* Become a creator */}
      {user?.role === "user" && (
        <div className="mt-4 flex flex-col gap-4 rounded-xl border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-text-primary">
              Become a Creator
            </p>
            <p className="mt-0.5 text-base text-text-secondary">
              Apply to publish unlimited prompts and access analytics.
            </p>
          </div>
          {requestStatus === "pending" ? (
            <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-5 text-base font-medium text-warning">
              Request Pending…
            </span>
          ) : requestStatus === "approved" ? (
            <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-5 text-base font-medium text-success">
              Approved ✓
            </span>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              disabled={applying}
              className={
                "inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-5 text-base font-semibold text-text-primary transition-all hover:bg-surface-hover active:scale-[0.98] disabled:opacity-60 " +
                focusRing
              }
            >
              {applying ? "Applying…" : "Apply Now"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
