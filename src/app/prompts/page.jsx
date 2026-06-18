"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const FEATURED_PROMPTS = [
  {
    _id: "1",
    title: "Write a killer cold email that gets replies",
    category: "Marketing",
    aiTool: "ChatGPT",
    copyCount: 42,
    creatorName: "John Doe",
    difficulty: "Beginner",
  },
  {
    _id: "2",
    title: "Generate a production-ready React component",
    category: "Coding",
    aiTool: "Claude",
    copyCount: 18,
    creatorName: "Jane Smith",
    difficulty: "Intermediate",
  },
  {
    _id: "3",
    title: "SEO meta description writer for any page",
    category: "Writing",
    aiTool: "Gemini",
    copyCount: 91,
    creatorName: "Alex Ray",
    difficulty: "Beginner",
  },
  {
    _id: "4",
    title: "Complete business plan generator",
    category: "Business",
    aiTool: "ChatGPT",
    copyCount: 34,
    creatorName: "Sara Khan",
    difficulty: "Pro",
  },
  {
    _id: "5",
    title: "Cinematic portrait prompt for Midjourney",
    category: "Design",
    aiTool: "Midjourney",
    copyCount: 67,
    creatorName: "Mike Chen",
    difficulty: "Beginner",
  },
  {
    _id: "6",
    title: "Python debugging assistant with context",
    category: "Coding",
    aiTool: "Claude",
    copyCount: 29,
    creatorName: "Lena Park",
    difficulty: "Intermediate",
  },
];

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

export default function PromptsPage() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="w-full border-b bg-page-bg py-10 sm:py-12 lg:py-16">
      {/* Heading */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-base font-semibold uppercase tracking-widest text-brand"
            >
              Trending Now
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-2 text-xl font-bold text-text-primary sm:text-2xl"
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
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-px border-y bg-border sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PROMPTS.map((prompt, i) => (
          <motion.article
            key={prompt._id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-brand">
                {prompt.category}
              </span>
              <span
                className={
                  "text-base font-medium " +
                  DIFFICULTY_STYLES[prompt.difficulty]
                }
              >
                {prompt.difficulty}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-semibold leading-snug text-text-primary line-clamp-2">
              {prompt.title}
            </h3>

            <div className="mt-3 flex items-center gap-3 text-base text-text-secondary">
              <span className="rounded-md border px-2 py-0.5">
                {prompt.aiTool}
              </span>
              <span className="flex items-center gap-1">
                <Copy className="h-3.5 w-3.5" /> {prompt.copyCount}
              </span>
            </div>

            <p className="mt-2 text-base text-text-secondary">
              by {prompt.creatorName}
            </p>

            <div className="mt-auto border-t pt-4 mt-6">
              {!mounted ? (
                <div className="h-10 w-full rounded-md bg-surface-hover animate-pulse" />
              ) : session?.user ? (
                <Link
                  href={`/prompts/${prompt._id}`}
                  className={
                    "flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                    focusRing
                  }
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={
                    "flex h-10 w-full items-center justify-center rounded-md border text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                    focusRing
                  }
                >
                  Login to View
                </Link>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-6 px-4 sm:hidden sm:px-6">
        <Link
          href="/prompts"
          className={
            "flex h-11 w-full items-center justify-center gap-2 rounded-md border text-base font-semibold text-text-primary transition-colors hover:bg-surface-hover " +
            focusRing
          }
        >
          View all prompts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
