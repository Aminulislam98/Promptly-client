"use client";

import { useState } from "react";
import { Check, Crown, Lock, Zap, Shield, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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

const TRUST = [
  { icon: Shield, label: "Secure Payment", desc: "256-bit SSL encryption" },
  { icon: Zap, label: "Instant Access", desc: "Unlocked immediately" },
  { icon: Star, label: "One-time Only", desc: "No recurring charges" },
];

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      toast.success("Redirecting to payment...");
      // TODO: const res = await fetch("/api/payment/create-checkout", { method: "POST" });
      // const { url } = await res.json();
      // window.location.href = url;
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-page-bg">
      <Toaster position="top-center" />

      {/* Hero strip */}
      <div className="w-full border-b bg-surface px-3 py-16">
        <div className="mx-auto w-full max-w-screen-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Premium
          </p>
          <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight text-text-primary lg:text-4xl">
            Unlock everything on Promptly
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-text-secondary">
            One payment of $5 gives you lifetime access to all premium prompts,
            unlimited publishing, and priority support.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap gap-6">
            {TRUST.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-brand" />
                <div>
                  <p className="text-base font-semibold text-text-primary">
                    {label}
                  </p>
                  <p className="text-base text-text-secondary">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-screen-xl px-3 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left — benefits */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Benefits */}
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-xl font-bold text-text-primary">
                What's included
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-success/10">
                      <Check className="h-4 w-4 text-success" />
                    </span>
                    <span className="text-base text-text-primary">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-xl border bg-surface p-6">
              <h2 className="text-xl font-bold text-text-primary">
                What happens after payment
              </h2>
              <ol className="mt-6 flex flex-col gap-5">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand text-base font-bold text-on-brand">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-base leading-relaxed text-text-secondary">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right — payment card */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border bg-surface p-6">
              <div className="flex items-center gap-3 border-b pb-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand">
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

              <div className="py-5 border-b">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-primary">
                    $5
                  </span>
                  <span className="text-base text-text-secondary">
                    one-time
                  </span>
                </div>
                <p className="mt-1 text-base text-success font-medium">
                  No subscription. No renewal.
                </p>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isLoading}
                  className={
                    "flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 " +
                    focusRing
                  }
                >
                  <Crown className="h-5 w-5" />
                  {isLoading ? "Processing…" : "Pay $5 — Get Premium"}
                </button>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-base text-text-secondary">
                  <Lock className="h-4 w-4 shrink-0" />
                  Secured by Stripe
                </p>
              </div>
            </div>

            {/* Questions */}
            <div className="rounded-xl border bg-surface p-5">
              <p className="text-base font-semibold text-text-primary">
                Questions?
              </p>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                Contact us at{" "}
                <a
                  href="mailto:support@promptly.ai"
                  className={
                    "font-medium text-brand hover:underline " + focusRing
                  }
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
