"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

const MOCK_PAYMENTS = [
  {
    _id: "1",
    email: "aminul@example.com",
    name: "Aminul Islam",
    amount: 5,
    transactionId: "txn_1A2B3C",
    date: "2026-06-01",
    status: "success",
  },
  {
    _id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    amount: 5,
    transactionId: "txn_4D5E6F",
    date: "2026-06-05",
    status: "success",
  },
  {
    _id: "3",
    email: "alex@example.com",
    name: "Alex Ray",
    amount: 5,
    transactionId: "txn_7G8H9I",
    date: "2026-06-10",
    status: "success",
  },
  {
    _id: "4",
    email: "sara@example.com",
    name: "Sara Khan",
    amount: 5,
    transactionId: "txn_0J1K2L",
    date: "2026-06-15",
    status: "success",
  },
];

export default function AdminPaymentsPage() {
  const [payments] = useState(MOCK_PAYMENTS);
  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <section>
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            All Payments
          </h1>
          <p className="mt-1 text-base text-text-secondary">
            All premium subscription transactions.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-surface px-5 py-3">
          <CreditCard className="h-5 w-5 text-brand" />
          <div>
            <p className="text-base text-text-secondary">Total Revenue</p>
            <p className="text-xl font-bold text-text-primary">${total}</p>
          </div>
        </div>
      </div>

      {/* Table */}
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
                Transaction ID
              </th>
              <th className="px-5 py-4 text-left font-semibold text-text-primary">
                Amount
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
                  {payment.name}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {payment.email}
                </td>
                <td className="px-5 py-4 font-mono text-base text-text-secondary">
                  {payment.transactionId}
                </td>
                <td className="px-5 py-4 font-semibold text-text-primary">
                  ${payment.amount}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {new Date(payment.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-base font-medium capitalize text-success">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
