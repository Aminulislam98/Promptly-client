"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Crown,
  Mail,
  Shield,
  BadgeCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  applyForCreator,
  getCreatorRequestStatus,
  getMyProfile,
  getMyPrompts,
  getMyReviews,
} from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const REQUIRED = 3;

/* ─── Requirement row inside modal ─────────────────────────── */
function RequirementRow({ icon: Icon, label, current, required, href, cta }) {
  const done = current >= required;
  const left = Math.max(0, required - current);

  return (
    <div className={
      "flex items-center gap-4 rounded-xl border p-4 transition-colors " +
      (done ? "border-success/30 bg-success/5" : "border-border bg-page-bg")
    }>
      {/* progress ring */}
      <div className="relative shrink-0 h-12 w-12">
        <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="#e4e6ea" strokeWidth="4" />
          <circle
            cx="22" cy="22" r="18" fill="none"
            stroke={done ? "#1e8e3e" : "#6366f1"}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 18}`}
            strokeDashoffset={`${2 * Math.PI * 18 * (1 - Math.min(current / required, 1))}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">
          {Math.min(current, required)}/{required}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Icon className={"h-4 w-4 shrink-0 " + (done ? "text-success" : "text-text-secondary")} />
          <p className="text-base font-semibold text-text-primary">{label}</p>
        </div>
        <p className={"mt-0.5 text-sm " + (done ? "text-success font-medium" : "text-text-secondary")}>
          {done ? "Requirement met ✓" : `${left} more ${left === 1 ? "needed" : "needed"} — ${left} left`}
        </p>
      </div>

      {!done && (
        <Link
          href={href}
          className={
            "shrink-0 inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover " +
            focusRing
          }
        >
          {cta} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
      {done && <CheckCircle className="h-5 w-5 shrink-0 text-success" />}
    </div>
  );
}

/* ─── Verification modal ────────────────────────────────────── */
function VerifyModal({ onClose, onVerified }) {
  const [promptCount, setPromptCount] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const allMet = promptCount >= REQUIRED && reviewCount >= REQUIRED;

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("server_token") : null;
      const [pd, rd] = await Promise.all([
        getMyPrompts().catch(() => ({ prompts: [] })),
        getMyReviews().catch(() => ({ reviews: [] })),
      ]);
      setPromptCount((pd.prompts || []).length);
      setReviewCount((rd.reviews || []).length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
    // Close on Escape
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [fetchProgress, onClose]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("server_token") : null;
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      toast.success("🎉 You are now verified!");
      onVerified();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
              <BadgeCheck className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Get Verified</h2>
              <p className="mt-0.5 text-sm text-text-secondary">Complete both requirements to earn your badge</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={"flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors " + focusRing}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          {loading ? (
            <>
              <div className="h-20 animate-pulse rounded-xl bg-surface-hover" />
              <div className="h-20 animate-pulse rounded-xl bg-surface-hover" />
            </>
          ) : (
            <>
              <RequirementRow
                icon={FileText}
                label="Post at least 3 prompts"
                current={promptCount}
                required={REQUIRED}
                href="/dashboard/add-prompt"
                cta="Add prompt"
              />
              <RequirementRow
                icon={Star}
                label="Write at least 3 reviews"
                current={reviewCount}
                required={REQUIRED}
                href="/prompts"
                cta="Browse & review"
              />
            </>
          )}

          {/* Overall status */}
          {!loading && (
            <div className={
              "flex items-center gap-3 rounded-xl border px-4 py-3 " +
              (allMet ? "border-success/30 bg-success/5" : "border-border bg-page-bg")
            }>
              {allMet
                ? <CheckCircle className="h-5 w-5 shrink-0 text-success" />
                : <XCircle className="h-5 w-5 shrink-0 text-text-muted" />
              }
              <p className={"text-base font-medium " + (allMet ? "text-success" : "text-text-secondary")}>
                {allMet
                  ? "All requirements met! You can claim your badge now."
                  : `${[promptCount < REQUIRED && `${REQUIRED - promptCount} more prompt${REQUIRED - promptCount > 1 ? "s" : ""}`, reviewCount < REQUIRED && `${REQUIRED - reviewCount} more review${REQUIRED - reviewCount > 1 ? "s" : ""}`].filter(Boolean).join(" and ")} to go.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-page-bg px-6 py-4">
          <button
            type="button"
            onClick={fetchProgress}
            disabled={loading}
            className={"text-sm font-medium text-brand hover:underline disabled:opacity-50 " + focusRing}
          >
            Refresh progress
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={"h-10 rounded-lg border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " + focusRing}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleClaim}
              disabled={!allMet || claiming || loading}
              className={
                "inline-flex h-10 items-center gap-2 rounded-lg px-5 text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed " +
                (allMet
                  ? "bg-brand text-on-brand hover:bg-brand-hover " + focusRing
                  : "bg-surface-hover text-text-muted cursor-not-allowed")
              }
            >
              {claiming && <Loader2 className="h-4 w-4 animate-spin" />}
              {claiming ? "Claiming…" : "Claim Verification"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Profile page
═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [requestStatus, setRequestStatus] = useState(null);
  const [applying, setApplying] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  // local isVerified tracks claimed state before session refreshes
  const [localVerified, setLocalVerified] = useState(false);

  useEffect(() => {
    if (user) {
      getCreatorRequestStatus()
        .then((data) => setRequestStatus(data.request?.status || null))
        .catch(() => {});

      getMyProfile()
        .then((data) => setProfileData(data.user))
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

  const handleVerified = () => {
    setLocalVerified(true);
    setShowVerifyModal(false);
    // Reload after short delay so session refreshes and badge shows everywhere
    setTimeout(() => window.location.reload(), 1500);
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

  const warningCount = profileData?.warnings?.length || 0;
  const isSuspended = profileData?.isSuspended || false;
  const currentRole = profileData?.role || user?.role || "user";
  // session.user.isVerified from Better Auth, or localVerified if just claimed
  const isVerified = localVerified || !!user?.isVerified;

  const INFO_ROWS = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Shield, label: "Role", value: currentRole },
    {
      icon: BadgeCheck,
      label: "Subscription",
      value: profileData?.isPremium ? "Premium" : "Free",
    },
  ];

  return (
    <section>
      <Toaster position="top-center" />

      {showVerifyModal && (
        <VerifyModal
          onClose={() => setShowVerifyModal(false)}
          onVerified={handleVerified}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          My Profile
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Manage your account and subscription.
        </p>
      </div>

      {/* Suspension banner */}
      {isSuspended && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-error bg-error/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div>
            <p className="text-base font-semibold text-error">Your account is suspended</p>
            <p className="mt-1 text-base text-text-secondary">
              You have received 3 or more warnings and can no longer add prompts. Contact{" "}
              <a href="mailto:support@promptly.ai" className="text-brand hover:underline">
                support@promptly.ai
              </a>{" "}
              to appeal.
            </p>
          </div>
        </div>
      )}

      {/* Warning banner */}
      {!isSuspended && warningCount > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-warning bg-warning/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <p className="text-base font-semibold text-warning">
              You have {warningCount}/3 warning{warningCount > 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-base text-text-secondary">
              Please review our community guidelines. At 3 warnings your account will be suspended.
            </p>
          </div>
        </div>
      )}

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
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold leading-tight text-text-primary">
                {user?.name ?? "User"}
              </h2>
              {/* Verified badge next to name — like Facebook */}
              {isVerified && (
                <BadgeCheck
                  className="h-6 w-6 text-brand"
                  aria-label="Verified account"
                  title="Verified Promptly member"
                />
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-base font-medium text-brand">
                <Shield className="h-4 w-4" /> {currentRole}
              </span>
              {profileData?.isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-base font-medium text-success">
                  <Crown className="h-4 w-4" /> Premium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-base font-medium text-text-secondary">
                  Free Plan
                </span>
              )}
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-base font-medium text-brand">
                  <BadgeCheck className="h-4 w-4" /> Verified
                </span>
              )}
              {isSuspended && (
                <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-3 py-1 text-base font-medium text-error">
                  <AlertTriangle className="h-4 w-4" /> Suspended
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
                <span className="text-base font-medium text-text-secondary">{label}</span>
              </div>
              <span className="text-base font-semibold text-text-primary capitalize">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade banner */}
      {!profileData?.isPremium && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-brand bg-brand-light px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Crown className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-base font-semibold text-text-primary">Upgrade to Premium</p>
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
      {currentRole === "user" && !isSuspended && (
        <div className="mt-4 flex flex-col gap-4 rounded-xl border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-text-primary">Become a Creator</p>
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

      {/* ── Get Verified ─────────────────────────────────────── */}
      {isVerified ? (
        /* Already verified card */
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-brand/30 bg-brand/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-base font-semibold text-text-primary">
                Verified Promptly Member
              </p>
              <p className="mt-0.5 text-base text-text-secondary">
                Your verified badge is active and visible on your profile.
              </p>
            </div>
          </div>
          <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-brand/10 px-5 text-base font-semibold text-brand">
            <BadgeCheck className="h-4 w-4" /> Verified
          </span>
        </div>
      ) : (
        /* Get verified CTA */
        <div className="mt-4 flex flex-col gap-4 rounded-xl border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary" />
            <div>
              <p className="text-base font-semibold text-text-primary">Get Verified</p>
              <p className="mt-0.5 text-base text-text-secondary">
                Post 3 prompts and write 3 reviews to earn your verified badge.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            className={
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-5 text-base font-semibold text-text-primary transition-all hover:bg-surface-hover active:scale-[0.98] " +
              focusRing
            }
          >
            <BadgeCheck className="h-4 w-4" /> Check Status
          </button>
        </div>
      )}
    </section>
  );
}
