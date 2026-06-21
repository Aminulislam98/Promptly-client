"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Copy, ArrowRight, Lock, Bookmark } from "lucide-react";
import { CreatorAvatar } from "@/components/ui/CreatorAvatar";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { getFeaturedPrompts, toggleBookmark } from "@/lib/api";
import { formatCount, isNew, categoryColor } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const DIFFICULTY_STYLES = {
  Beginner: "text-success",
  Intermediate: "text-warning",
  Pro: "text-error",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

function BookmarkBtn({ promptId, isLoggedIn }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/prompts/${promptId}`;
      return;
    }
    setBusy(true);
    try {
      await toggleBookmark(promptId);
      setSaved((v) => !v);
    } catch {
      /* silent */
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={busy}
      aria-label={saved ? "Remove bookmark" : "Save prompt"}
      className={
        "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-surface/90 backdrop-blur-sm shadow-sm transition-all duration-150 hover:scale-110 active:scale-95 disabled:opacity-60 " +
        (saved ? "border-brand text-brand" : "border-border text-text-secondary hover:border-brand hover:text-brand")
      }
    >
      <Bookmark className={"h-4 w-4 " + (saved ? "fill-brand" : "")} />
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border bg-surface animate-pulse">
      <div className="aspect-[4/3] w-full bg-surface-hover" />
      <div className="flex flex-col gap-2 p-5">
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-surface-hover" />
          <div className="h-4 w-16 rounded bg-surface-hover" />
        </div>
        <div className="h-5 w-3/4 rounded bg-surface-hover" />
        <div className="h-4 w-1/2 rounded bg-surface-hover" />
        <div className="mt-2 h-10 w-full rounded-lg bg-surface-hover" />
      </div>
    </div>
  );
}

export function FeaturedPrompts() {
  const [mounted, setMounted] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    getFeaturedPrompts()
      .then((data) => setPrompts(data.prompts || []))
      .catch(() => setPrompts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const isLoggedIn = mounted && !!session?.user;

  if (!isLoading && prompts.length === 0) return null;

  return (
    <section className="w-full border-t bg-surface py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-2 text-2xl font-bold text-text-primary"
            >
              Featured Prompts
            </motion.h2>
          </div>
          <Link
            href="/prompts"
            className={
              "hidden items-center gap-1 text-base font-medium text-brand hover:underline sm:flex " +
              focusRing
            }
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid — with padding, cards with rounded corners */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : prompts.map((prompt, i) => (
                <motion.article
                  key={prompt._id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group flex flex-col rounded-xl border bg-surface transition-colors hover:bg-surface-hover"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-light shrink-0">
                    {prompt.thumbnail ? (
                      <Image
                        src={prompt.thumbnail}
                        alt={prompt.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-4xl font-bold text-brand opacity-20">
                          {prompt.title?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {isNew(prompt.createdAt) && (
                      <div className="absolute left-3 top-3 rounded-full bg-success px-2 py-0.5 text-base font-semibold text-on-brand">
                        New
                      </div>
                    )}
                    {prompt.visibility === "Private" && (
                      <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full bg-warning px-2 py-1 text-sm font-semibold text-on-brand">
                        <Lock className="h-3 w-3" /> Premium
                      </div>
                    )}
                    {/* Quick bookmark */}
                    <BookmarkBtn promptId={prompt._id} isLoggedIn={isLoggedIn} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between">
                      <span className={"rounded-full border px-2.5 py-0.5 text-sm font-semibold " + categoryColor(prompt.category)}>
                        {prompt.category}
                      </span>
                      <span
                        className={
                          "text-base font-medium " +
                          (DIFFICULTY_STYLES[prompt.difficulty] ||
                            "text-text-secondary")
                        }
                      >
                        {prompt.difficulty}
                      </span>
                    </div>
                    <h3 className="mt-2 min-h-[3rem] text-lg font-semibold leading-snug text-text-primary line-clamp-2">
                      {prompt.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-base text-text-secondary">
                      <span className="rounded-md border px-2 py-0.5">
                        {prompt.aiTool}
                      </span>
                      <span className="flex items-center gap-1">
                        <Copy className="h-3.5 w-3.5" /> {formatCount(prompt.copyCount)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <CreatorAvatar name={prompt.creatorName} size="sm" />
                      <span className="truncate text-base text-text-secondary">
                        {prompt.creatorName}
                      </span>
                    </div>

                    <div className="mt-4">
                      {isLoggedIn ? (
                        <Link
                          href={`/prompts/${prompt._id}`}
                          className={
                            "flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                            focusRing
                          }
                        >
                          View Details <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Link
                          href={`/login?redirect=/prompts/${prompt._id}`}
                          className={
                            "flex h-10 w-full items-center justify-center rounded-lg border text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                            focusRing
                          }
                        >
                          Login to View
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/prompts"
            className={
              "flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-base font-semibold text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            View all prompts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
