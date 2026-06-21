"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, ShieldOff, Clock, CheckCircle, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAdminAppeals, approveAppeal } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export default function AdminAppealsPage() {
  const [appeals, setAppeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    getAdminAppeals()
      .then((data) => setAppeals(data.appeals || []))
      .catch(() => toast.error("Failed to load appeals"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = async (appeal) => {
    setApprovingId(appeal._id);
    try {
      await approveAppeal(appeal._id);
      setAppeals((prev) =>
        prev.map((a) => (a._id === appeal._id ? { ...a, status: "approved" } : a))
      );
      toast.success(`Suspension lifted for ${appeal.userName}`);
    } catch (err) {
      toast.error(err.message || "Failed to approve appeal");
    } finally {
      setApprovingId(null);
    }
  };

  const pending  = appeals.filter((a) => a.status === "pending");
  const resolved = appeals.filter((a) => a.status !== "pending");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-hover" />
        <div className="h-32 animate-pulse rounded-xl bg-surface-hover" />
        <div className="h-32 animate-pulse rounded-xl bg-surface-hover" />
      </div>
    );
  }

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Suspension Appeals
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {pending.length} pending · {resolved.length} resolved
        </p>
      </div>

      {appeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <ShieldCheck className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base text-text-secondary">No appeals submitted yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Pending */}
          {pending.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">
                Pending Review
              </h2>
              {pending.map((appeal) => (
                <AppealCard
                  key={appeal._id}
                  appeal={appeal}
                  onApprove={handleApprove}
                  approvingId={approvingId}
                  focusRing={focusRing}
                />
              ))}
            </div>
          )}

          {/* Resolved */}
          {resolved.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-text-primary">
                Resolved
              </h2>
              {resolved.map((appeal) => (
                <AppealCard
                  key={appeal._id}
                  appeal={appeal}
                  onApprove={handleApprove}
                  approvingId={approvingId}
                  focusRing={focusRing}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function AppealCard({ appeal, onApprove, approvingId, focusRing }) {
  const isPending  = appeal.status === "pending";
  const isApproved = appeal.status === "approved";
  const isApproving = approvingId === appeal._id;

  const formattedDate = new Date(appeal.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className={
      "rounded-xl border bg-surface p-5 " +
      (isPending ? "border-warning/30" : "border-success/20")
    }>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2 min-w-0">
          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover">
              <User className="h-4 w-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-base font-semibold text-text-primary">{appeal.userName}</p>
              <p className="text-base text-text-muted">{appeal.userEmail}</p>
            </div>
          </div>

          {/* Appeal message */}
          <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
            &ldquo;{appeal.message}&rdquo;
          </p>

          <p className="text-base text-text-muted">{formattedDate}</p>
        </div>

        {/* Status / action */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          {isPending ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-warning/40 bg-warning/10 px-3 py-1.5 text-base font-medium text-warning">
                <Clock className="h-4 w-4" /> Pending
              </span>
              <button
                type="button"
                onClick={() => onApprove(appeal)}
                disabled={isApproving}
                className={
                  "inline-flex h-10 items-center gap-2 rounded-lg bg-success px-4 text-base font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 " +
                  focusRing
                }
              >
                {isApproving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Lifting…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Lift Suspension
                  </>
                )}
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-3 py-1.5 text-base font-semibold text-success">
              <CheckCircle className="h-4 w-4" /> Suspension Lifted
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
