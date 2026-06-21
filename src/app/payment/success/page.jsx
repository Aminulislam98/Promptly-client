"use client";
import { authClient } from "@/lib/auth-client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Check, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { confirmPayment } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Wait for the session to finish loading before proceeding
    if (isPending) return;

    // If not logged in, can't confirm payment
    if (!session?.session?.token) {
      setStatus("error");
      return;
    }

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Sync the FRESH session token to localStorage before making the API call.
    // Better Auth may have rotated the token during the Stripe redirect, so the
    // old value in localStorage could be stale and cause a 401.
    localStorage.setItem("server_token", session.session.token);

    confirmPayment(sessionId)
      .then(async () => {
        setStatus("success");
        toast.success("Premium unlocked!");
        // refresh Better Auth session so isPremium reflects in the UI
        await authClient.getSession({ fetchOptions: { cache: "no-store" } });
        // clear old token so TokenSync picks up the refreshed session token
        localStorage.removeItem("server_token");
        // redirect back to where the user came from (e.g. the locked prompt)
        const returnTo = sessionStorage.getItem("postPaymentRedirect");
        if (returnTo) {
          sessionStorage.removeItem("postPaymentRedirect");
          setTimeout(() => router.replace(returnTo), 2000);
        }
      })
      .catch(() => {
        setStatus("error");
        toast.error("Failed to confirm payment. Contact support.");
      });
  }, [session, isPending, searchParams]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page-bg px-3">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="text-base text-text-secondary">
            Confirming your payment…
          </p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-page-bg px-3">
        <Toaster position="top-center" />
        <div className="w-full max-w-md rounded-xl border bg-surface p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <span className="text-3xl">✕</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">
            Payment Failed
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Something went wrong. Please contact{" "}
            <a
              href="mailto:support@promptly.ai"
              className="text-brand hover:underline"
            >
              support@promptly.ai
            </a>
          </p>
          <Link
            href="/payment"
            className={
              "mt-6 inline-flex h-11 items-center justify-center rounded-lg border px-6 text-base font-semibold text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Try Again
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-page-bg px-3">
      <Toaster position="top-center" />
      <div className="w-full max-w-md rounded-xl border bg-surface p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">
          You are now Premium! 🎉
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Your account has been upgraded. All private prompts are now unlocked.
        </p>

        <div className="mt-6 flex flex-col gap-3 rounded-xl bg-brand-light p-4 text-left">
          {[
            "All private & premium prompts unlocked",
            "Unlimited prompt publishing",
            "Priority support",
            "Early access to new features",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <Crown className="h-4 w-4 shrink-0 text-brand" />
              <span className="text-base text-text-primary">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/prompts"
            className={
              "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Browse Premium Prompts
          </Link>
          <Link
            href="/dashboard"
            className={
              "inline-flex h-11 items-center justify-center rounded-lg border px-6 text-base font-semibold text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
