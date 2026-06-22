"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowRight, UserMinus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { unfollowCreator } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { MongoClient } from "mongodb";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export default function FollowingPage() {
  const { data: session } = authClient.useSession();
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unfollowingName, setUnfollowingName] = useState(null);

  useEffect(() => {
    fetch("/api/following", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setFollowing(d.following || []))
      .catch(() => toast.error("Failed to load following list"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleUnfollow = async (creatorName) => {
    setUnfollowingName(creatorName);
    try {
      await unfollowCreator(creatorName);
      setFollowing((prev) => prev.filter((f) => f.creatorName !== creatorName));
      toast.success(`Unfollowed ${creatorName}`);
    } catch {
      toast.error("Failed to unfollow");
    } finally {
      setUnfollowingName(null);
    }
  };

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">Following</h1>
        <p className="mt-1 text-base text-text-secondary">Creators you follow — visit their profiles to see new prompts.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl border bg-surface p-4">
              <div className="h-10 w-10 rounded-full bg-surface-hover" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-surface-hover" />
                <div className="h-3 w-20 rounded bg-surface-hover" />
              </div>
            </div>
          ))}
        </div>
      ) : following.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <Users className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base font-semibold text-text-primary">Not following anyone yet</p>
          <p className="mt-1 text-base text-text-secondary">Visit a creator&apos;s profile and click Follow.</p>
          <Link
            href="/prompts"
            className={"mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-white hover:bg-brand-hover " + focusRing}
          >
            Browse Prompts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {following.map((f) => (
            <div key={f.creatorName} className="flex items-center gap-4 rounded-xl border bg-surface p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-white">
                {f.creatorName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/creator/${encodeURIComponent(f.creatorName)}`}
                  className={"text-base font-semibold text-text-primary transition-colors hover:text-brand " + focusRing}
                >
                  {f.creatorName}
                </Link>
                <p className="text-base text-text-muted">
                  Following since {new Date(f.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleUnfollow(f.creatorName)}
                disabled={unfollowingName === f.creatorName}
                className={"inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-base font-medium text-text-secondary transition-colors hover:border-error hover:text-error disabled:opacity-50 " + focusRing}
              >
                <UserMinus className="h-4 w-4" />
                {unfollowingName === f.creatorName ? "…" : "Unfollow"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
