"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Copy, Lock, ArrowRight } from "lucide-react";
import { CreatorAvatar, avatarBg } from "@/components/ui/CreatorAvatar";
import { motion } from "framer-motion";
import { getPrompts } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const DIFFICULTY_STYLES = {
  Beginner: "text-success bg-success/10",
  Intermediate: "text-warning bg-warning/10",
  Pro: "text-error bg-error/10",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06 },
  }),
};

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-surface p-4 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-hover" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-surface-hover" />
        <div className="h-3 w-1/2 rounded bg-surface-hover" />
      </div>
      <div className="h-4 w-12 rounded bg-surface-hover shrink-0" />
    </div>
  );
}

export function TrendingPrompts() {
  const { data: session } = authClient.useSession();
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    getPrompts({ sort: "copies", limit: 8, page: 1 })
      .then((data) => setPrompts(data.prompts || []))
      .catch(() => setPrompts([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && prompts.length === 0) return null;

  return (
    <section className="w-full border-b bg-page-bg py-10 sm:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-base font-semibold uppercase tracking-widest text-brand"
            >
              Trending
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-2 text-2xl font-bold leading-tight text-text-primary"
            >
              Most Copied This Week
            </motion.h2>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-brand" />
            <Link
              href="/prompts?sort=copies"
              className={"text-base font-medium text-brand hover:underline " + focusRing}
            >
              See all →
            </Link>
          </div>
        </div>

        {/* Two-column list */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : prompts.map((prompt, i) => {
                const href = isLoggedIn
                  ? `/prompts/${prompt._id}`
                  : `/login?redirect=/prompts/${prompt._id}`;
                return (
                  <motion.div
                    key={prompt._id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <Link
                      href={href}
                      className={
                        "group flex items-center gap-4 rounded-xl border bg-surface p-4 transition-colors hover:border-brand " +
                        focusRing
                      }
                    >
                      {/* Rank */}
                      <span
                        className={
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold " +
                          (i === 0
                            ? "bg-warning/10 text-warning"
                            : i === 1
                              ? "bg-surface-hover text-text-secondary"
                              : i === 2
                                ? "bg-surface-hover text-text-secondary"
                                : "bg-surface-hover text-text-muted")
                        }
                      >
                        {i + 1}
                      </span>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-base font-semibold text-text-primary group-hover:text-brand">
                            {prompt.title}
                          </p>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {prompt.creatorName && (
                            <span className="flex items-center gap-1.5">
                              {/* Non-link avatar — card itself is already a Link */}
                              <span className={
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base font-bold text-on-brand " +
                                avatarBg(prompt.creatorName)
                              }>
                                {prompt.creatorName.charAt(0).toUpperCase()}
                              </span>
                              <span className="truncate text-base text-text-secondary">
                                {prompt.creatorName}
                              </span>
                            </span>
                          )}
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
                          {prompt.visibility === "Private" && (
                            <span className="flex items-center gap-1 text-base font-medium text-warning">
                              <Lock className="h-3 w-3" /> Premium
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Copy count */}
                      <div className="flex shrink-0 items-center gap-1 text-base font-semibold text-text-secondary">
                        <Copy className="h-3.5 w-3.5" />
                        {prompt.copyCount}
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
