"use client";

import { useState } from "react";
import { CheckCircle, XCircle, UserCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const MOCK_REQUESTS = [
  {
    _id: "1",
    name: "Sara Khan",
    email: "sara@example.com",
    reason: "I want to share my AI prompts with the community.",
    createdAt: "2026-06-10",
    status: "pending",
  },
  {
    _id: "2",
    name: "John Doe",
    email: "john@example.com",
    reason: "I have 50+ prompts ready to publish for productivity.",
    createdAt: "2026-06-12",
    status: "pending",
  },
  {
    _id: "3",
    name: "Mia Lee",
    email: "mia@example.com",
    reason: "I am a prompt engineer and want to monetize my work.",
    createdAt: "2026-06-15",
    status: "pending",
  },
];

const STATUS_STYLES = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-error/10 text-error",
};

export default function CreatorRequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r)),
    );
    toast.success("Request approved — user is now a creator");
    // TODO:
    // await fetch(`/api/admin/creator-requests/${id}/approve`, { method: "PATCH" });
    // This will update user role to "creator" in MongoDB
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r)),
    );
    toast.success("Request rejected");
    // TODO:
    // await fetch(`/api/admin/creator-requests/${id}/reject`, { method: "PATCH" });
  };

  return (
    <section>
      <Toaster position="top-center" />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Creator Requests
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Review and approve users who want to become creators.
        </p>
      </div>

      {/* Empty state */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface px-6 py-16 text-center">
          <UserCheck className="h-10 w-10 text-text-secondary" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No pending requests
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            No users have applied to become a creator yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-surface">
          <table className="w-full min-w-[640px] text-base">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Name
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Email
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Reason
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Date
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
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="transition-colors hover:bg-surface-hover"
                >
                  <td className="px-5 py-4 font-medium text-text-primary">
                    {req.name}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">{req.email}</td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-text-secondary line-clamp-2">
                      {req.reason}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {new Date(req.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-3 py-1 text-base font-medium capitalize " +
                        STATUS_STYLES[req.status]
                      }
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(req._id)}
                        disabled={req.status !== "pending"}
                        aria-label="Approve request"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-success hover:bg-success/10 hover:text-success disabled:opacity-30 " +
                          focusRing
                        }
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(req._id)}
                        disabled={req.status !== "pending"}
                        aria-label="Reject request"
                        className={
                          "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-error hover:bg-error/10 hover:text-error disabled:opacity-30 " +
                          focusRing
                        }
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
