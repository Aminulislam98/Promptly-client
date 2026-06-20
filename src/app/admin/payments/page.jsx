"use client";

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAdminPayments } from "@/lib/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminPayments()
      .then((data) => setPayments(data.payments || []))
      .catch(() => toast.error("Failed to load payments"))
      .finally(() => setIsLoading(false));
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />;

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            Payments
          </h1>
          <p className="mt-1 text-base text-text-secondary">
            {payments.length} transactions.
          </p>
        </div>
        <div className="rounded-xl border bg-surface px-6 py-4">
          <p className="text-base text-text-secondary">Total Revenue</p>
          <p className="text-3xl font-bold text-success">${totalRevenue}</p>
        </div>
      </div>
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <CreditCard className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base text-text-secondary">No payments yet.</p>
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
                  Amount
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Transaction ID
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Date
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="transition-colors hover:bg-surface-hover"
                >
                  <td className="px-5 py-4 font-medium text-text-primary">
                    {payment.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {payment.email}
                  </td>
                  <td className="px-5 py-4 font-semibold text-success">
                    ${payment.amount}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-surface-hover px-2 py-1 font-mono text-base text-text-secondary">
                      {payment.transactionId?.slice(0, 16)}…
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {new Date(payment.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-success/10 px-3 py-1 text-base font-medium text-success">
                      {payment.status || "success"}
                    </span>
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
