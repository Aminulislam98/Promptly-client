"use client";

import { useState, useEffect } from "react";
import { Trash2, Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAdminUsers, changeUserRole, deleteUser } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
const ROLES = ["user", "creator", "admin"];
const ROLE_STYLES = {
  admin: "bg-error/10 text-error",
  creator: "bg-brand-light text-brand",
  user: "bg-surface-hover text-text-secondary",
};

function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-surface p-6">
        <h3 className="text-xl font-bold text-text-primary">Delete User</h3>
        <p className="mt-2 text-base text-text-secondary">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-text-primary">{user.name}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
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
            onClick={onConfirm}
            className={
              "h-10 rounded-lg bg-error px-4 text-base font-semibold text-on-brand hover:opacity-80 " +
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    getAdminUsers()
      .then((data) => setUsers(data.users || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await changeUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />;

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Users
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {users.length} total users.
        </p>
      </div>
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <Users className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base text-text-secondary">No users yet.</p>
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
                  Role
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Plan
                </th>
                <th className="px-5 py-4 text-left font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="transition-colors hover:bg-surface-hover"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-on-brand">
                        {user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-text-primary">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className={
                        "rounded-lg border px-3 py-1.5 text-base outline-none focus:ring-2 focus:ring-brand capitalize " +
                        (ROLE_STYLES[user.role] || "") +
                        " " +
                        focusRing
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        "rounded-full px-3 py-1 text-base font-medium " +
                        (user.isPremium
                          ? "bg-success/10 text-success"
                          : "bg-surface-hover text-text-secondary")
                      }
                    >
                      {user.isPremium ? "Premium" : "Free"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(user)}
                      aria-label="Delete"
                      className={
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-error hover:bg-error/10 hover:text-error " +
                        focusRing
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
