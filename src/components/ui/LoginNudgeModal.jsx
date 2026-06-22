"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Bookmark,
  Copy,
  Star,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

const STORAGE_KEY = "promptly_login_nudge_dismissed";
const DELAY_MS = 25000; // 25 seconds

const BENEFITS = [
  {
    icon: Bookmark,
    colorClass: "bg-brand-light text-brand",
    title: "Save your favourites",
    desc: "Bookmark prompts you love and build your personal library — find them instantly any time.",
  },
  {
    icon: Copy,
    colorClass: "bg-success/10 text-success",
    title: "Copy & use prompts",
    desc: "One-click copy any prompt straight to your clipboard. No re-typing, no friction.",
  },
  {
    icon: Star,
    colorClass: "bg-warning/10 text-warning",
    title: "Rate & review",
    desc: "Tell the community what works. Your reviews help others find the best prompts faster.",
  },
  {
    icon: Shield,
    colorClass: "bg-brand-light text-brand",
    title: "Publish your own prompts",
    desc: "Share your best prompts with thousands of users and earn a verified creator badge.",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export function LoginNudgeModal({ redirectPath = "/prompts" }) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage unavailable — still show the modal
    }

    const timer = setTimeout(() => {
      setVisible(true);
      // Small frame delay so the CSS transition fires
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 250);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  // Close on backdrop click or Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible]);

  if (!visible) return null;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to unlock features"
      onClick={dismiss}
      className={
        "fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:items-center sm:pb-0 transition-all duration-250 " +
        (animateIn ? "bg-black/50" : "bg-black/0")
      }
    >
      {/* Card — stop propagation so clicking inside doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          "relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-250 " +
          (animateIn
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-6 opacity-0 scale-95")
        }
      >
        {/* Gradient hero strip */}
        <div className="relative flex flex-col items-center gap-3 bg-brand px-6 pb-8 pt-8 text-center">
          {/* Close */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className={
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 " +
              focusRing
            }
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon cluster */}
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold leading-tight text-white">
            You&apos;re missing out
          </h2>
          <p className="max-w-xs text-base leading-relaxed text-white/80">
            Sign in for free and unlock everything Promptly has to offer — bookmarks, ratings, your own prompts, and more.
          </p>
        </div>

        {/* Caret */}
        <div className="relative h-0">
          <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border bg-surface" />
        </div>

        {/* Benefits list */}
        <div className="flex flex-col gap-4 px-6 pb-2 pt-8">
          {BENEFITS.map(({ icon: Icon, colorClass, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className={
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl " + colorClass
              }>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-text-primary">{title}</p>
                <p className="mt-0.5 text-base leading-relaxed text-text-secondary">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verified badge nudge */}
        <div className="mx-6 mt-5 flex items-center gap-2 rounded-xl border border-brand/20 bg-brand-light px-4 py-3">
          <VerifiedBadge size="sm" />
          <p className="text-base font-medium text-brand">
            Top creators earn a verified badge — could be you.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 px-6 pb-6 pt-5">
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            onClick={dismiss}
            className={
              "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-bold text-white transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Sign in — it&apos;s free <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className={
              "h-11 w-full rounded-xl text-base font-medium text-text-secondary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
