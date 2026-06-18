"use client";
import CreatorHome from "@/components/dashboard/CreatorHome";
import UserHome from "@/components/dashboard/UserHome";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending)
    return (
      <div className="flex flex-col gap-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-surface-hover" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-surface-hover"
            />
          ))}
        </div>
        <div className="h-40 animate-pulse rounded-xl bg-surface-hover" />
      </div>
    );

  if (user?.role === "creator") return <CreatorHome user={user} />;
  return <UserHome user={user} />;
}
