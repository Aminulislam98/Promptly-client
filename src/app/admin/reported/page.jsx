"use client";

import { useState, useEffect } from "react";
import { Flag, Trash2, AlertTriangle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAdminReports, dismissReport, warnCreator } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export default function AdminReportedPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminReports()
      .then((data) => setReports(data.reports || []))
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDismiss = async (id) => {
    try {
      await dismissReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      toast.success("Report dismissed");
    } catch {
      toast.error("Failed to dismiss");
    }
  };

  const handleWarn = async (id) => {
    try {
      const data = await warnCreator(id);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, warned: true } : r)),
      );
      if (data.suspended) {
        toast.success("Creator suspended and prompt removed!");
      } else {
        toast.success("Warning sent to creator");
      }
    } catch {
      toast.error("Failed to send warning");
    }
  };

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />;

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Reported Content
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {reports.length} active reports.
        </p>
      </div>
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <Flag className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base text-text-secondary">No reports yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <article
              key={report._id}
              className="rounded-xl border bg-surface p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="rounded-full bg-error/10 px-3 py-1 text-base font-medium text-error w-fit">
                    {report.reason}
                  </span>
                  <p className="text-base font-semibold text-text-primary">
                    Prompt ID:{" "}
                    <span className="font-mono text-text-secondary">
                      {report.promptId}
                    </span>
                  </p>
                  {report.description && (
                    <p className="text-base text-text-secondary max-w-2xl">
                      {report.description}
                    </p>
                  )}
                  <p className="text-base text-text-secondary">
                    Reported by:{" "}
                    <span className="font-medium text-text-primary">
                      {report.reportedBy}
                    </span>
                  </p>
                  <p className="text-base text-text-muted">
                    {new Date(report.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {report.warned ? (
                    <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-warning bg-warning/10 px-3 text-base font-medium text-warning">
                      <AlertTriangle className="h-4 w-4" /> Warned
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleWarn(report._id)}
                      className={
                        "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-base font-medium text-warning hover:bg-warning/10 " +
                        focusRing
                      }
                    >
                      <AlertTriangle className="h-4 w-4" /> Warn
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDismiss(report._id)}
                    className={
                      "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-base font-medium text-text-secondary hover:border-error hover:bg-error/10 hover:text-error " +
                      focusRing
                    }
                  >
                    <Trash2 className="h-4 w-4" /> Dismiss
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
