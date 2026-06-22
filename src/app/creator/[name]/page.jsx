"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Copy, Lock, User, FileText, UserPlus, UserCheck } from "lucide-react";
import { getCreatorPrompts, getFollowStatus, followCreator, unfollowCreator } from "@/lib/api";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

const DIFFICULTY_STYLES = {
  Beginner: "text-success bg-success/10",
  Intermediate: "text-warning bg-warning/10",
  Pro: "text-error bg-error/10",
};

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border bg-surface animate-pulse overflow-hidden">
      <div className="aspect-video w-full bg-surface-hover" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 rounded bg-surface-hover" />
        <div className="h-4 w-full rounded bg-surface-hover" />
        <div className="h-4 w-3/4 rounded bg-surface-hover" />
      </div>
    </div>
  );
}

function CreatorAvatar({ name, image }) {
  if (image) {
    return (
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
        <Image
          src={image}
          alt={name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand text-3xl font-bold text-on-brand">
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
  );
}

export default function CreatorProfilePage({ params }) {
  const { name } = use(params);
  const creatorName = decodeURIComponent(name);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const [prompts, setPrompts] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState({ image: null, isVerified: false });
  const [isLoading, setIsLoading] = useState(true);
  const [followCount, setFollowCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getCreatorPrompts(creatorName),
      fetch(`/api/creator-info/${encodeURIComponent(creatorName)}`).then((r) => r.json()),
      getFollowStatus(creatorName),
    ])
      .then(([promptsData, info, followData]) => {
        setPrompts(promptsData.prompts || []);
        setCreatorInfo({ image: info.image || null, isVerified: !!info.isVerified });
        setFollowCount(followData.count || 0);
        setIsFollowing(!!followData.isFollowing);
      })
      .catch(() => setPrompts([]))
      .finally(() => setIsLoading(false));
  }, [creatorName]);

  const handleFollow = async () => {
    if (!isLoggedIn) { toast.error("Log in to follow creators"); return; }
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowCreator(creatorName);
        setIsFollowing(false);
        setFollowCount((n) => Math.max(0, n - 1));
      } else {
        await followCreator(creatorName);
        setIsFollowing(true);
        setFollowCount((n) => n + 1);
      }
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setFollowLoading(false);
    }
  };

  const totalCopies = prompts.reduce((s, p) => s + (p.copyCount || 0), 0);

  return (
    <main className="min-h-screen bg-page-bg py-6 px-3">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Back */}
        <Link
          href="/prompts"
          className={
            "inline-flex items-center gap-2 text-base font-medium text-text-secondary transition-colors hover:text-text-primary " +
            focusRing
          }
        >
          <ArrowLeft className="h-4 w-4" /> All Prompts
        </Link>

        {/* Creator header */}
        <div className="mt-6 flex flex-col gap-6 rounded-xl border bg-surface p-6 sm:flex-row sm:items-center">
          <CreatorAvatar name={creatorName} image={creatorInfo.image} />

          <div className="flex-1 min-w-0">
            {/* Name + verified badge */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold leading-tight text-text-primary">
                {creatorName}
              </h1>
              {creatorInfo.isVerified && <VerifiedBadge size="xl" />}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-base text-text-secondary">Prompt Creator</p>
              {creatorInfo.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-sm font-semibold text-on-brand">
                  <VerifiedBadge size="xs" /> Verified
                </span>
              )}
            </div>

            {!isLoading && (
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-text-secondary" />
                  <span className="text-base font-semibold text-text-primary">{prompts.length}</span>
                  <span className="text-base text-text-secondary">Prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-text-secondary" />
                  <span className="text-base font-semibold text-text-primary">{totalCopies}</span>
                  <span className="text-base text-text-secondary">Total copies</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-text-secondary" />
                  <span className="text-base font-semibold text-text-primary">{followCount}</span>
                  <span className="text-base text-text-secondary">Followers</span>
                </div>
              </div>
            )}

            {/* Follow button — don't show on own profile */}
            {isLoggedIn && session?.user?.name !== creatorName && (
              <button
                type="button"
                onClick={handleFollow}
                disabled={followLoading}
                className={
                  "mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-5 text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-60 " +
                  (isFollowing
                    ? "border border-border bg-surface text-text-primary hover:bg-surface-hover"
                    : "bg-brand text-white hover:bg-brand-hover") +
                  " " + focusRing
                }
              >
                {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Prompts grid */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-text-primary">
            {isLoading
              ? "Loading prompts…"
              : `${prompts.length} Published Prompt${prompts.length !== 1 ? "s" : ""}`}
          </h2>

          {isLoading ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
              <User className="h-10 w-10 text-text-secondary" />
              <p className="mt-4 text-base font-semibold text-text-primary">
                No public prompts yet
              </p>
              <p className="mt-1 text-base text-text-secondary">
                This creator hasn&apos;t published any prompts.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {prompts.map((prompt) => {
                const href = isLoggedIn
                  ? `/prompts/${prompt._id}`
                  : `/login?redirect=/prompts/${prompt._id}`;
                return (
                  <Link
                    key={prompt._id}
                    href={href}
                    className={
                      "group flex flex-col rounded-xl border bg-surface overflow-hidden transition-colors hover:border-brand " +
                      focusRing
                    }
                  >
                    {/* Colour swatch */}
                    <div className="relative flex h-24 w-full items-center justify-center bg-brand-light">
                      <span className="text-4xl font-bold text-brand opacity-20">
                        {prompt.title?.charAt(0).toUpperCase()}
                      </span>
                      {prompt.visibility === "Private" && (
                        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-sm font-semibold text-on-brand">
                          <Lock className="h-3 w-3" /> Premium
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-md bg-brand-light px-2 py-0.5 text-base font-medium text-brand">
                          {prompt.aiTool}
                        </span>
                        <span
                          className={
                            "rounded-md px-2 py-0.5 text-base font-medium " +
                            (DIFFICULTY_STYLES[prompt.difficulty] || "")
                          }
                        >
                          {prompt.difficulty}
                        </span>
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-text-primary group-hover:text-brand">
                        {prompt.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-base text-text-secondary">
                        {prompt.description}
                      </p>
                      <div className="mt-auto flex items-center gap-1 pt-3 text-base text-text-secondary">
                        <Copy className="h-3.5 w-3.5" />
                        {prompt.copyCount || 0} copies
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
