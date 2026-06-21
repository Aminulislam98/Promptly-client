"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flag, AlertTriangle, ArrowLeft, ExternalLink, CheckCircle, ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getMyProfile, getMyPrompts } from "@/lib/api";
import { useRouter } from "next/navigation";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

function WarningCard({ warning, promptMap }) {
  // Warning objects from the backend vary — handle all known field shapes
  const reason   = warning.reason || warning.type || "Policy Violation";
  const promptId = warning.promptId || warning.prompt || null;
  const date     = warning.date || warning.createdAt || warning.warnedAt || null;
  const message  = warning.message || warning.description || null;

  const promptTitle = promptId ? (promptMap[String(promptId)] || "View Prompt") : null;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="rounded-xl border border-warning/30 bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2 min-w-0">
          {/* Reason */}
          <span className="w-fit rounded-full bg-warning/10 px-3 py-1 text-base font-semibold text-warning">
            {reason}
          </span>

          {/* Prompt link */}
          {promptId && (
            <Link
              href={`/prompts/${promptId}`}
              className={
                "inline-flex items-center gap-1.5 text-base font-semibold text-text-primary underline-offset-2 hover:text-brand hover:underline transition-colors " +
                focusRing
              }
            >
              {promptTitle}
              <ExternalLink className="h-4 w-4 shrink-0 text-text-muted" />
            </Link>
          )}

          {/* Admin message */}
          {message && (
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
              &ldquo;{message}&rdquo;
            </p>
          )}

          {formattedDate && (
            <p className="text-base text-text-muted">{formattedDate}</p>
          )}
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-base font-semibold text-warning">
          <AlertTriangle className="h-4 w-4" />
          Admin Warned
        </span>
      </div>
    </article>
  );
}

export default function MyReportsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [warnings, setWarnings] = useState([]);
  const [promptMap, setPromptMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/login");
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session?.user) return;

    Promise.all([getMyProfile(), getMyPrompts()])
      .then(([profileData, promptsData]) => {
        const w = profileData?.user?.warnings || [];
        setWarnings(w);

        // Build promptId → title map for enrichment
        const map = {};
        (promptsData?.prompts || []).forEach((p) => {
          map[String(p._id)] = p.title;
        });
        setPromptMap(map);
      })
      .catch((err) => setError(err.message || "Failed to load reports"))
      .finally(() => setIsLoading(false));
  }, [session]);

  if (isPending || isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-hover" />
        <div className="h-28 animate-pulse rounded-xl bg-surface-hover" />
        <div className="h-28 animate-pulse rounded-xl bg-surface-hover" />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/dashboard/profile"
          className={
            "inline-flex items-center gap-1.5 text-base font-medium text-text-secondary transition-colors hover:text-text-primary " +
            focusRing
          }
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>
      </div>

      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Reports on Your Prompts
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Warnings issued by the Promptly admin team against your content.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-error bg-error/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <p className="text-base text-error">{error}</p>
        </div>
      )}

      {!error && warnings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            All clear!
          </h2>
          <p className="mt-2 max-w-sm text-base text-text-secondary">
            No warnings have been issued against any of your prompts.
          </p>
          <Link
            href="/dashboard"
            className={
              "mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Warning count summary */}
          <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 px-5 py-4">
            <ShieldAlert className="h-5 w-5 shrink-0 text-warning" />
            <p className="text-base font-semibold text-warning">
              {warnings.length}/3 warning{warnings.length !== 1 ? "s" : ""} — at 3 warnings your account is suspended.
            </p>
          </div>

          {warnings.map((w, i) => (
            <WarningCard key={i} warning={w} promptMap={promptMap} />
          ))}
        </div>
      )}
    </section>
  );
}
