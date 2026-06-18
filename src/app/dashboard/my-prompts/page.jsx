"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, BarChart2, PlusCircle, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

// Placeholder data — replace with real API call
const MOCK_PROMPTS = [
  {
    _id: "1",
    title: "Write a killer cold email",
    category: "Marketing",
    aiTool: "ChatGPT",
    difficulty: "Beginner",
    visibility: "Public",
    status: "approved",
    copyCount: 12,
  },
  {
    _id: "2",
    title: "Generate a React component",
    category: "Coding",
    aiTool: "Claude",
    difficulty: "Intermediate",
    visibility: "Private",
    status: "pending",
    copyCount: 0,
  },
  {
    _id: "3",
    title: "SEO meta description writer",
    category: "Writing",
    aiTool: "Gemini",
    difficulty: "Beginner",
    visibility: "Public",
    status: "rejected",
    copyCount: 0,
  },
];

const STATUS_STYLES = {
  approved: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-error/10 text-error",
};

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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyPromptsPage() {
  const [prompts, setPrompts] = useState(MOCK_PROMPTS);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // TODO: replace with real API call
  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/my`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then((r) => r.json())
  //     .then((data) => setPrompts(data));
  // }, []);

  const handleDelete = (id) => {
    setPrompts((prev) => prev.filter((p) => p._id !== id));
    setDeleteTarget(null);
    toast.success("Prompt deleted");
    // TODO: await fetch(`/api/prompts/${id}`, { method: "DELETE" });
  };

  return (
    <section>
      <Toaster position="top-center" />

      {/* Heading */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            My Prompts
          </h1>
          <p className="mt-1 text-base text-text-secondary">
            Manage and track all your submitted prompts.
          </p>
        </div>
        <Link
          href="/dashboard/add-prompt"
          className={
            "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
            focusRing
          }
        >
          <PlusCircle className="h-5 w-5" /> Add Prompt
        </Link>
      </div>

      {/* Empty state */}
      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface px-6 py-16 text-center">
          <FileText className="h-10 w-10 text-text-secondary" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No prompts yet
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            You have not submitted any prompts. Create your first one.
          </p>
          <Link
            href="/dashboard/add-prompt"
            className={
              "mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover " +
              focusRing
            }
          >
            <PlusCircle className="h-5 w-5" /> Add Prompt
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto rounded-xl border bg-surface">
          <table className="w-full min-w-[640px] text-base">
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
                  Status
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Copies
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
                      {prompt.difficulty} · {prompt.visibility}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {prompt.category}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {prompt.aiTool}
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
                  <td className="px-5 py-4 text-text-secondary">
                    {prompt.copyCount}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/prompts/${prompt._id}`}
                        aria-label="View prompt"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary " +
                          focusRing
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/my-prompts/${prompt._id}/edit`}
                        aria-label="Edit prompt"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary " +
                          focusRing
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/my-prompts/${prompt._id}/analytics`}
                        aria-label="View analytics"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary " +
                          focusRing
                        }
                      >
                        <BarChart2 className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(prompt)}
                        aria-label="Delete prompt"
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
      )}

      {/* Delete confirmation modal */}
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
