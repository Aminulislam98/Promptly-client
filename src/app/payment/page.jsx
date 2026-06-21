"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Crown, Lock, CheckCircle, LayoutDashboard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createCheckout } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const BENEFITS = [
  "Unlock all private & premium prompts",
  "Unlimited prompt publishing",
  "Priority support",
  "Early access to new features",
  "Download prompts as PDF",
  "Ad-free experience",
];

const STEPS = [
  "Your account is instantly upgraded to Premium.",
  "All private and premium prompts are unlocked.",
  "You can now publish unlimited prompts.",
  "Transaction details are saved to your account.",
];

// ── Already-premium state ─────────────────────────────────────
function AlreadyPremium({ user }) {
  return (
    <main className="min-h-screen bg-page-bg">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-10 w-10 text-success" />
        </span>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-text-primary">
          You&apos;re already Premium!
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-secondary">
          {user?.name ? `${user.name.split(" ")[0]}, you` : "You"} already have
          lifetime Premium access. All private prompts are unlocked and you can
          publish unlimited prompts.
        </p>

        {/* Premium perks reminder */}
        <ul className="mt-8 w-full rounded-xl border bg-surface p-6 text-left">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-3 py-1.5">
              <Check className="h-4 w-4 shrink-0 text-success" />
              <span className="text-base text-text-primary">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className={
              "inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.97] " +
              focusRing
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/prompts"
            className={
              "inline-flex h-11 items-center gap-2 rounded-full border px-6 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Browse Prompts
          </Link>
        </div>
      </div>
    </main>
  );
}

// ── Main payment page ─────────────────────────────────────────
export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isPremium = user?.isPremium === true;

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const from = searchParams.get("from");
      if (from) sessionStorage.setItem("postPaymentRedirect", from);
      const data = await createCheckout();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading skeleton
  if (isPending) {
    return (
      <main className="min-h-screen bg-page-bg">
        <div className="mx-auto w-full max-w-screen-xl px-3 py-10">
          <div className="mb-8 flex flex-col gap-3">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-surface-hover" />
            <div className="h-5 w-80 animate-pulse rounded-lg bg-surface-hover" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-xl bg-surface-hover lg:col-span-2" />
            <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
          </div>
        </div>
      </main>
    );
  }

  // Already premium — show a different screen
  if (isPremium) return <AlreadyPremium user={user} />;

  // Normal payment page
  return (
    <main className="min-h-screen bg-page-bg">
      <Toaster position="top-center" />

      <div className="mx-auto w-full max-w-screen-xl px-3 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            Upgrade to Premium
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            One-time payment of $5. Lifetime access. No subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-xl font-semibold text-text-primary">
                What&apos;s included
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <Check className="h-4 w-4 shrink-0 text-success" />
                    <span className="text-base text-text-primary">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-xl font-semibold text-text-primary">
                What happens after payment
              </h2>
              <ol className="mt-4 flex flex-col gap-4">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand text-sm font-bold text-on-brand">
                      {i + 1}
                    </span>
                    <p className="text-base text-text-secondary">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="sticky top-20 rounded-xl border bg-surface p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand">
                  <Crown className="h-5 w-5 text-on-brand" />
                </span>
                <div>
                  <p className="text-base font-bold text-text-primary">
                    Premium Plan
                  </p>
                  <p className="text-base text-text-secondary">
                    Lifetime access
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t pt-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-primary">$5</span>
                  <span className="text-base text-text-secondary">one-time</span>
                </div>
                <p className="mt-1 text-base font-medium text-success">
                  No subscription. No renewal.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isLoading}
                className={
                  "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 " +
                  focusRing
                }
              >
                <Crown className="h-4 w-4" />
                {isLoading ? "Processing…" : "Pay $5 — Get Premium"}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-base text-text-secondary">
                <Lock className="h-4 w-4 shrink-0" />
                Secured by Stripe
              </p>
            </div>

            <div className="rounded-xl border bg-surface p-5">
              <p className="text-base font-semibold text-text-primary">Questions?</p>
              <p className="mt-1 text-base text-text-secondary">
                Email us at{" "}
                <a
                  href="mailto:support@promptly.ai"
                  className={"font-medium text-brand hover:underline " + focusRing}
                >
                  support@promptly.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
