"use client";

import { useState, useEffect } from "react";
import { Check, X, Star, Trash2, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getAdminPrompts,
  approvePrompt,
  rejectPrompt,
  featurePrompt,
  deleteAdminPrompt,
} from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
const STATUS_STYLES = {
  approved: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-error/10 text-error",
};

function RejectModal({ prompt, onConfirm, onCancel }) {
  const [feedback, setFeedback] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-surface p-6">
        <h3 className="text-xl font-bold text-text-primary">Reject Prompt</h3>
        <p className="mt-1 text-base text-text-secondary">
          Provide feedback for{" "}
          <span className="font-semibold">"{prompt.title}"</span>
        </p>
        <textarea
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Reason for rejection..."
          className={
            "mt-4 w-full rounded-lg border bg-surface-hover px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand resize-none " +
            focusRing
          }
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={
              "h-10 rounded-lg border px-4 text-base font-medium text-text-primary hover:bg-surface-hover " +
              focusRing
            }
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(feedback)}
            disabled={!feedback.trim()}
            className={
              "h-10 rounded-lg bg-error px-4 text-base font-semibold text-on-brand hover:opacity-80 disabled:opacity-50 " +
              focusRing
            }
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => {
    getAdminPrompts()
      .then((data) => setPrompts(data.prompts || []))
      .catch(() => toast.error("Failed to load prompts"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approvePrompt(id);
      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "approved" } : p)),
      );
      toast.success("Prompt approved");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id, feedback) => {
    try {
      await rejectPrompt(id, feedback);
      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "rejected" } : p)),
      );
      toast.success("Prompt rejected");
    } catch {
      toast.error("Failed to reject");
    } finally {
      setRejectTarget(null);
    }
  };

  const handleFeature = async (id) => {
    try {
      await featurePrompt(id);
      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, featured: !p.featured } : p)),
      );
      toast.success("Featured status updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminPrompt(id);
      setPrompts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Prompt deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />;

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Prompts
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {prompts.length} total prompts.
        </p>
      </div>
      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <FileText className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base text-text-secondary">No prompts yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-surface">
          <table className="w-full min-w-[800px] text-base">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Title
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Creator
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Category
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Status
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Featured
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {prompts.map((prompt) => (
                <tr
                  key={prompt._id}
                  className="transition-colors hover:bg-surface-hover"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary line-clamp-1">
                      {prompt.title}
                    </p>
                    <p className="text-base text-text-secondary">
                      {prompt.aiTool}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {prompt.creatorName}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {prompt.category}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        "rounded-full px-3 py-1 text-base font-medium capitalize " +
                        (STATUS_STYLES[prompt.status] || "")
                      }
                    >
                      {prompt.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleFeature(prompt._id)}
                      className={
                        "inline-flex h-8 items-center gap-1 rounded-full px-3 text-base font-medium transition-colors " +
                        (prompt.featured
                          ? "bg-warning/10 text-warning"
                          : "bg-surface-hover text-text-secondary hover:bg-warning/10 hover:text-warning") +
                        " " +
                        focusRing
                      }
                    >
                      <Star
                        className={
                          "h-3.5 w-3.5 " +
                          (prompt.featured ? "fill-warning" : "")
                        }
                      />
                      {prompt.featured ? "Featured" : "Feature"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {prompt.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(prompt._id)}
                            aria-label="Approve"
                            className={
                              "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary hover:border-success hover:bg-success/10 hover:text-success " +
                              focusRing
                            }
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectTarget(prompt)}
                            aria-label="Reject"
                            className={
                              "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary hover:border-error hover:bg-error/10 hover:text-error " +
                              focusRing
                            }
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(prompt._id)}
                        aria-label="Delete"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary hover:border-error hover:bg-error/10 hover:text-error " +
                          focusRing
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rejectTarget && (
        <RejectModal
          prompt={rejectTarget}
          onConfirm={(f) => handleReject(rejectTarget._id, f)}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </section>
  );
}
