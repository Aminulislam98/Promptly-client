"use client";

import { useState, useEffect } from "react";
import { Check, X, Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getCreatorRequests,
  approveCreatorRequest,
  rejectCreatorRequest,
} from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
const STATUS_STYLES = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-error/10 text-error",
};

export default function AdminCreatorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCreatorRequests()
      .then((data) => setRequests(data.requests || []))
      .catch(() => toast.error("Failed to load requests"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveCreatorRequest(id);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r)),
      );
      toast.success("Creator request approved");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCreatorRequest(id);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r)),
      );
      toast.success("Request rejected");
    } catch {
      toast.error("Failed to reject");
    }
  };

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />;

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Creator Requests
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {requests.length} total requests.
        </p>
      </div>
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <Users className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base text-text-secondary">
            No creator requests yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-surface">
          <table className="w-full min-w-[640px] text-base">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  User
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Email
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Reason
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Status
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
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="transition-colors hover:bg-surface-hover"
                >
                  <td className="px-5 py-4 font-medium text-text-primary">
                    {req.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {req.userEmail}
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-text-secondary line-clamp-2">
                      {req.reason || "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        "rounded-full px-3 py-1 text-base font-medium capitalize " +
                        (STATUS_STYLES[req.status] || "")
                      }
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {new Date(req.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    {req.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(req._id)}
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
                          onClick={() => handleReject(req._id)}
                          aria-label="Reject"
                          className={
                            "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary hover:border-error hover:bg-error/10 hover:text-error " +
                            focusRing
                          }
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
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
