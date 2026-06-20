"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, FileText, Trophy } from "lucide-react";
import { getTopCreators } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07 },
  }),
};

const RANK_STYLES = [
  { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" },
  {
    bg: "bg-surface-hover",
    text: "text-text-secondary",
    border: "border-border",
  },
  {
    bg: "bg-surface-hover",
    text: "text-text-secondary",
    border: "border-border",
  },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border bg-surface p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-8 rounded bg-surface-hover" />
        <div className="h-6 w-16 rounded-full bg-surface-hover" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-surface-hover shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-28 rounded bg-surface-hover" />
          <div className="h-3 w-20 rounded bg-surface-hover" />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-8 flex-1 rounded-lg bg-surface-hover" />
        <div className="h-8 flex-1 rounded-lg bg-surface-hover" />
      </div>
    </div>
  );
}

export function TopCreators() {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTopCreators()
      .then((data) => setCreators(data.creators || []))
      .catch(() => setCreators([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && creators.length === 0) return null;

  return (
    <section className="w-full border-b bg-page-bg py-16">
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
              Community
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-2 text-2xl font-bold leading-tight text-text-primary"
            >
              Top Creators
            </motion.h2>
          </div>
          <Trophy className="h-8 w-8 text-warning" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-2 text-base text-text-secondary"
        >
          Meet the people building the best prompts on Promptly.
        </motion.p>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : creators.map((creator, i) => {
                const rank = RANK_STYLES[i] || RANK_STYLES[2];
                return (
                  <motion.div
                    key={creator._id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="group flex flex-col rounded-xl border bg-surface p-5 transition-colors hover:border-brand"
                  >
                    {/* Top row — rank + badge */}
                    <div className="flex items-center justify-between">
                      <span className={"text-base font-bold " + rank.text}>
                        #{i + 1}
                      </span>
                      {i === 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-base font-semibold text-warning">
                          🏆 Top Creator
                        </span>
                      )}
                      {i === 1 && (
                        <span className="rounded-full bg-surface-hover px-3 py-1 text-base font-medium text-text-secondary">
                          🥈 Runner Up
                        </span>
                      )}
                      {i === 2 && (
                        <span className="rounded-full bg-surface-hover px-3 py-1 text-base font-medium text-text-secondary">
                          🥉 3rd Place
                        </span>
                      )}
                    </div>

                    {/* Creator info */}
                    <div className="mt-4 flex items-center gap-3">
                      <div
                        className={
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-lg font-bold text-on-brand transition-transform group-hover:scale-105 " +
                          (i === 0
                            ? "bg-warning border-warning/30"
                            : "bg-brand border-brand/20")
                        }
                      >
                        {creator.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-text-primary">
                          {creator.name}
                        </p>
                        <p className="text-base text-text-secondary">
                          Prompt Creator
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex gap-3">
                      <div className="flex flex-1 flex-col items-center rounded-lg bg-page-bg py-2.5">
                        <span className="text-lg font-bold text-text-primary">
                          {creator.totalPrompts}
                        </span>
                        <span className="flex items-center gap-1 text-base text-text-secondary">
                          <FileText className="h-3 w-3" /> Prompts
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col items-center rounded-lg bg-page-bg py-2.5">
                        <span className="text-lg font-bold text-text-primary">
                          {creator.totalCopies}
                        </span>
                        <span className="flex items-center gap-1 text-base text-text-secondary">
                          <Copy className="h-3 w-3" /> Copies
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
