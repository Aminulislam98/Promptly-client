"use client";

import { useState } from "react";
import { Trash2, CheckCircle, XCircle, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const MOCK_PROMPTS = [
  {
    _id: "1",
    title: "Write a killer cold email",
    category: "Marketing",
    aiTool: "ChatGPT",
    creator: "Aminul Islam",
    status: "pending",
    featured: false,
  },
  {
    _id: "2",
    title: "Generate a React component",
    category: "Coding",
    aiTool: "Claude",
    creator: "Jane Smith",
    status: "approved",
    featured: true,
  },
  {
    _id: "3",
    title: "SEO meta description writer",
    category: "Writing",
    aiTool: "Gemini",
    creator: "Alex Ray",
    status: "rejected",
    featured: false,
  },
  {
    _id: "4",
    title: "Business plan generator",
    category: "Business",
    aiTool: "ChatGPT",
    creator: "Sara Khan",
    status: "pending",
    featured: false,
  },
];

const STATUS_STYLES = {
  approved: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-error/10 text-error",
};

function RejectModal({ prompt, onConfirm, onCancel }) {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-surface px-6 py-6">
        <h3 className="text-xl font-bold text-text-primary">Reject Prompt</h3>
        <p className="mt-1 text-base text-text-secondary">
          Provide feedback for{" "}
          <span className="font-semibold text-text-primary">
            "{prompt.title}"
          </span>
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <label
            htmlFor="feedback"
            className="text-base font-medium text-text-primary"
          >
            Rejection Reason <span className="text-error">*</span>
          </label>
          <textarea
            id="feedback"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Explain why this prompt is being rejected..."
            className={
              "w-full rounded-lg border-0 bg-surface-hover px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none ring-1 ring-border transition-all duration-150 focus:ring-2 focus:ring-brand resize-none " +
              focusRing
            }
          />
        </div>
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
            onClick={() => feedback.trim() && onConfirm(feedback)}
            disabled={!feedback.trim()}
            className={
              "inline-flex h-10 items-center justify-center rounded-lg bg-error px-4 text-base font-semibold text-on-brand transition-all hover:opacity-80 active:scale-[0.98] disabled:opacity-50 " +
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

function DeleteModal({ prompt, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-surface px-6 py-6">
        <h3 className="text-xl font-bold text-text-primary">Delete Prompt</h3>
        <p className="mt-2 text-base text-text-secondary">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-text-primary">
            "{prompt.title}"
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
              "inline-flex h-10 items-center justify-center rounded-lg bg-error px-4 text-base font-semibold text-on-brand transition-all hover:opacity-80 active:scale-[0.98] " +
              focusRing
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState(MOCK_PROMPTS);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleApprove = (id) => {
    setPrompts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status: "approved" } : p)),
    );
    toast.success("Prompt approved");
    // TODO: await fetch(`/api/admin/prompts/${id}/approve`, { method: "PATCH" });
  };

  const handleReject = (id, feedback) => {
    setPrompts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status: "rejected" } : p)),
    );
    setRejectTarget(null);
    toast.success("Prompt rejected");
    // TODO: await fetch(`/api/admin/prompts/${id}/reject`, { method: "PATCH", body: JSON.stringify({ feedback }) });
  };

  const handleFeature = (id) => {
    setPrompts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, featured: !p.featured } : p)),
    );
    const prompt = prompts.find((p) => p._id === id);
    toast.success(
      prompt.featured ? "Removed from featured" : "Marked as featured",
    );
    // TODO: await fetch(`/api/admin/prompts/${id}/feature`, { method: "PATCH" });
  };

  const handleDelete = (id) => {
    setPrompts((prev) => prev.filter((p) => p._id !== id));
    setDeleteTarget(null);
    toast.success("Prompt deleted");
    // TODO: await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
  };

  return (
    <section>
      <Toaster position="top-center" />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          All Prompts
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Review, approve, reject, and manage all prompts.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-surface">
        <table className="w-full min-w-[800px] text-base">
          <thead>
            <tr className="border-b">
              <th className="px-5 py-4 text-left font-semibold text-text-primary">
                Title
              </th>
              <th className="px-5 py-4 text-left font-semibold text-text-primary">
                Category
              </th>
              <th className="px-5 py-4 text-left font-semibold text-text-primary">
                AI Tool
              </th>
              <th className="px-5 py-4 text-left font-semibold text-text-primary">
                Creator
              </th>
              <th className="px-5 py-4 text-left font-semibold text-text-primary">
                Status
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
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text-primary line-clamp-1">
                      {prompt.title}
                    </p>
                    {prompt.featured && (
                      <span className="shrink-0 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {prompt.category}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {prompt.aiTool}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {prompt.creator}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-3 py-1 text-base font-medium capitalize " +
                      STATUS_STYLES[prompt.status]
                    }
                  >
                    {prompt.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {/* Approve */}
                    <button
                      type="button"
                      onClick={() => handleApprove(prompt._id)}
                      disabled={prompt.status === "approved"}
                      aria-label="Approve"
                      className={
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-success hover:bg-success/10 hover:text-success disabled:opacity-30 " +
                        focusRing
                      }
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    {/* Reject */}
                    <button
                      type="button"
                      onClick={() => setRejectTarget(prompt)}
                      disabled={prompt.status === "rejected"}
                      aria-label="Reject"
                      className={
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-error hover:bg-error/10 hover:text-error disabled:opacity-30 " +
                        focusRing
                      }
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                    {/* Feature */}
                    <button
                      type="button"
                      onClick={() => handleFeature(prompt._id)}
                      aria-label={prompt.featured ? "Unfeature" : "Feature"}
                      className={
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors " +
                        focusRing +
                        (prompt.featured
                          ? " border-warning bg-warning/10 text-warning"
                          : " text-text-secondary hover:border-warning hover:bg-warning/10 hover:text-warning")
                      }
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(prompt)}
                      aria-label="Delete"
                      className={
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-error hover:bg-error/10 hover:text-error " +
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

      {rejectTarget && (
        <RejectModal
          prompt={rejectTarget}
          onConfirm={(feedback) => handleReject(rejectTarget._id, feedback)}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          prompt={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
