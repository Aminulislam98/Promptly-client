"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const MOCK_REPORTS = [
  {
    _id: "1",
    promptTitle: "Write a killer cold email",
    promptId: "p1",
    reportedBy: "Sara Khan",
    reason: "Spam",
    description: "This prompt is promoting spam emails.",
    createdAt: "2026-06-10",
  },
  {
    _id: "2",
    promptTitle: "Generate a React component",
    promptId: "p2",
    reportedBy: "Alex Ray",
    reason: "Copyright Violation",
    description: "Content is copied from another source.",
    createdAt: "2026-06-12",
  },
  {
    _id: "3",
    promptTitle: "SEO meta description writer",
    promptId: "p3",
    reportedBy: "John Doe",
    reason: "Inappropriate Content",
    description: "Contains misleading information.",
    createdAt: "2026-06-15",
  },
];

function WarnModal({ report, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-surface px-6 py-6">
        <h3 className="text-xl font-bold text-text-primary">Warn Creator</h3>
        <p className="mt-2 text-base text-text-secondary">
          Send a warning to the creator of{" "}
          <span className="font-semibold text-text-primary">
            "{report.promptTitle}"
          </span>
          ?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg bg-warning px-4 text-base font-semibold text-on-brand transition-all hover:opacity-80 active:scale-[0.98] " +
              focusRing
            }
          >
            Send Warning
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ report, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-surface px-6 py-6">
        <h3 className="text-xl font-bold text-text-primary">Remove Prompt</h3>
        <p className="mt-2 text-base text-text-secondary">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-text-primary">
            "{report.promptTitle}"
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg bg-error px-4 text-base font-semibold text-on-brand transition-all hover:opacity-80 active:scale-[0.98] " +
              focusRing
            }
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReportedPage() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [warnTarget, setWarnTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDismiss = (id) => {
    setReports((prev) => prev.filter((r) => r._id !== id));
    toast.success("Report dismissed");
    // TODO: await fetch(`/api/admin/reports/${id}/dismiss`, { method: "PATCH" });
  };

  const handleWarn = (id) => {
    setWarnTarget(null);
    toast.success("Warning sent to creator");
    // TODO: await fetch(`/api/admin/reports/${id}/warn`, { method: "POST" });
  };

  const handleRemove = (id) => {
    setReports((prev) => prev.filter((r) => r._id !== id));
    setDeleteTarget(null);
    toast.success("Prompt removed");
    // TODO: await fetch(`/api/admin/reports/${id}/remove`, { method: "DELETE" });
  };

  return (
    <section>
      <Toaster position="top-center" />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Reported Prompts
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Review and take action on reported prompts.
        </p>
      </div>

      {/* Empty state */}
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface px-6 py-16 text-center">
          <CheckCircle className="h-10 w-10 text-success" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No reported prompts
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            All clear — no reports to review right now.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-surface">
          <table className="w-full min-w-[700px] text-base">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Prompt
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Reported By
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Reason
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Date
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((report) => (
                <tr
                  key={report._id}
                  className="transition-colors hover:bg-surface-hover"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary line-clamp-1">
                      {report.promptTitle}
                    </p>
                    {report.description && (
                      <p className="mt-0.5 text-base text-text-secondary line-clamp-1">
                        {report.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {report.reportedBy}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-3 py-1 text-base font-medium text-error">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {new Date(report.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {/* Remove prompt */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(report)}
                        aria-label="Remove prompt"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-error hover:bg-error/10 hover:text-error " +
                          focusRing
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {/* Warn creator */}
                      <button
                        type="button"
                        onClick={() => setWarnTarget(report)}
                        aria-label="Warn creator"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-warning hover:bg-warning/10 hover:text-warning " +
                          focusRing
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                      {/* Dismiss */}
                      <button
                        type="button"
                        onClick={() => handleDismiss(report._id)}
                        aria-label="Dismiss report"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-success hover:bg-success/10 hover:text-success " +
                          focusRing
                        }
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {warnTarget && (
        <WarnModal
          report={warnTarget}
          onConfirm={() => handleWarn(warnTarget._id)}
          onCancel={() => setWarnTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          report={deleteTarget}
          onConfirm={() => handleRemove(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
