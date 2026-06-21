"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flag, AlertTriangle, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getMyReceivedReports } from "@/lib/api";
import { useRouter } from "next/navigation";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const REASON_STYLES = {
  "Inappropriate Content": "bg-error/10 text-error",
  Spam: "bg-warning/10 text-warning",
  "Copyright Violation": "bg-error/10 text-error",
  "Misleading Information": "bg-warning/10 text-warning",
  Other: "bg-surface-hover text-text-secondary",
};

function ReportCard({ report }) {
  const reasonStyle =
    REASON_STYLES[report.reason] || "bg-surface-hover text-text-secondary";

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Unknown date";

  return (
    <article className="rounded-xl border bg-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3 min-w-0">
          {/* Prompt link */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/prompts/${report.promptId}`}
              className={
                "inline-flex items-center gap-1.5 text-base font-semibold text-text-primary underline-offset-2 hover:text-brand hover:underline transition-colors " +
                focusRing
              }
            >
              {report.promptTitle}
              <ExternalLink className="h-4 w-4 shrink-0 text-text-muted" />
            </Link>
            {report.promptCategory && (
              <span className="rounded-full bg-surface-hover px-3 py-0.5 text-sm font-medium text-text-secondary">
                {report.promptCategory}
              </span>
            )}
          </div>

          {/* Reason chip */}
          <span
            className={
              "w-fit rounded-full px-3 py-1 text-base font-semibold " +
              reasonStyle
            }
          >
            {report.reason}
          </span>

          {/* Description */}
          {report.description && (
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
              &ldquo;{report.description}&rdquo;
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-base text-text-muted">
              Reported by{" "}
              <span className="font-medium text-text-secondary">
                {report.reportedBy}
              </span>
            </p>
            <span className="text-text-muted">·</span>
            <p className="text-base text-text-muted">{formattedDate}</p>
          </div>
        </div>

        {/* Status — pending or admin-reviewed */}
        <div className="shrink-0">
          {report.warned ? (
            <span className="inline-flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-base font-semibold text-warning">
              <AlertTriangle className="h-4 w-4" />
              Admin Reviewed
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg border bg-surface-hover px-4 py-2 text-base font-medium text-text-secondary">
              <CheckCircle className="h-4 w-4" />
              Pending Review
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MyReportsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session?.user) return;
    getMyReceivedReports()
      .then((data) => setReports(data.reports || []))
      .catch((err) => setError(err.message || "Failed to load reports"))
      .finally(() => setIsLoading(false));
  }, [session]);

  if (isPending || isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-hover" />
        <div className="h-28 animate-pulse rounded-xl bg-surface-hover" />
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
          Reports that were reviewed and actioned by the Promptly admin team.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-brand/20 bg-brand-light px-5 py-4">
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        <p className="text-base text-text-secondary">
          All reports against your prompts are shown here. <span className="font-semibold text-text-primary">Pending Review</span> means admin hasn't acted yet. <span className="font-semibold text-text-primary">Admin Reviewed</span> means action was taken.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-error bg-error/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <p className="text-base text-error">{error}</p>
        </div>
      )}

      {!error && reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            All clear!
          </h2>
          <p className="mt-2 max-w-sm text-base text-text-secondary">
            None of your prompts have received any reviewed reports. Keep up the
            great work!
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
          <p className="text-base font-medium text-text-secondary">
            {reports.length} report{reports.length !== 1 ? "s" : ""} received
          </p>
          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}
