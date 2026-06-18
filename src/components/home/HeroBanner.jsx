"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const TRENDING_TAGS = [
  "ChatGPT",
  "Midjourney",
  "Claude",
  "Gemini",
  "Coding",
  "Marketing",
  "Writing",
  "Productivity",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export function HeroBanner() {
  const [search, setSearch] = useState("");
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/prompts?search=${encodeURIComponent(search)}`;
    }
  };

  return (
    <section className="w-full border-b bg-surface px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-4xl">
        {/* Label */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base font-semibold uppercase tracking-widest text-brand"
        >
          AI Prompt Marketplace
        </motion.p>

        {/* Heading */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl lg:text-4xl"
        >
          Discover, Share &amp; Master
          <br />
          AI Prompts for Every Tool
        </motion.h1>

        {/* Subtext */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary"
        >
          A community-driven platform for high-quality prompts across ChatGPT,
          Gemini, Claude, Midjourney, and more. Find what works, copy it, and
          create faster.
        </motion.p>

        {/* Search */}
        <motion.form
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onSubmit={handleSearch}
          className="mt-8 flex w-full max-w-2xl items-center gap-3 border-b-2 border-border pb-2 transition-colors focus-within:border-brand"
        >
          <Search className="h-5 w-5 shrink-0 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts, tags, AI tools..."
            className="flex-1 bg-transparent text-base text-text-primary placeholder:text-text-muted outline-none"
          />
          <button
            type="submit"
            className={
              "inline-flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Search <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>

        {/* Trending tags */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 flex flex-wrap items-center gap-2"
        >
          <span className="text-base font-medium text-text-secondary">
            Trending:
          </span>
          {TRENDING_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/prompts?search=${tag}`}
              className={
                "rounded-md border px-3 py-1 text-base font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand " +
                focusRing
              }
            >
              {tag}
            </Link>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/prompts"
            className={
              "inline-flex h-11 items-center gap-2 rounded-md bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Browse All Prompts <ArrowRight className="h-4 w-4" />
          </Link>
          {!isLoggedIn && (
            <Link
              href="/register"
              className={
                "inline-flex h-11 items-center gap-2 rounded-md border px-6 text-base font-semibold text-text-primary transition-colors hover:bg-surface-hover active:scale-[0.98] " +
                focusRing
              }
            >
              Get Started Free
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
