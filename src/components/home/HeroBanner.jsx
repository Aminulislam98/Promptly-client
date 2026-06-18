"use client";

import { useState, useEffect } from "react";
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
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

export function HeroBanner() {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => setMounted(true), []);
  const isLoggedIn = mounted && !!session?.user;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/prompts?search=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <section className="relative w-full overflow-hidden border-b bg-surface px-4 py-20 sm:px-8 md:py-28 lg:py-36 xl:py-40">
      {/* Container optimized for wide screen displays */}
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Label */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-xs font-bold uppercase tracking-widest text-brand sm:text-sm"
        >
          AI Prompt Marketplace
        </motion.p>

        {/* Heading */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.15]"
        >
          Discover, Share &amp; Master <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand to-brand-hover bg-clip-text text-transparent">
            AI Prompts
          </span>{" "}
          for Every Tool
        </motion.h1>

        {/* Subtext */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl"
        >
          A community-driven platform for high-quality prompts across ChatGPT,
          Gemini, Claude, Midjourney, and more.
        </motion.p>

        {/* Search Input Group */}
        <motion.form
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onSubmit={handleSearch}
          className="mt-10 flex w-full max-w-2xl items-center gap-3 rounded-full border bg-background px-4 py-2.5 shadow-sm transition-all duration-200 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 sm:px-5 sm:py-3"
        >
          <Search className="h-5 w-5 shrink-0 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts, tags, AI tools..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none sm:text-base"
          />
          <button
            type="submit"
            className={`shrink-0 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover sm:px-5 sm:py-2 ${focusRing}`}
          >
            Search
          </button>
        </motion.form>

        {/* Trending tags */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 flex flex-wrap justify-center items-center gap-2 px-4"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted mr-1 sm:text-sm">
            Trending:
          </span>
          {TRENDING_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/prompts?search=${tag}`}
              className={`rounded-full border bg-background px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand sm:text-sm ${focusRing}`}
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
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/prompts"
            className={`inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] shadow-md shadow-brand/10 ${focusRing}`}
          >
            Browse All Prompts <ArrowRight className="h-4 w-4" />
          </Link>
          {!isLoggedIn && (
            <Link
              href="/register"
              className={`inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border bg-background px-6 text-base font-semibold text-text-primary transition-colors hover:bg-surface-hover active:scale-[0.98] ${focusRing}`}
            >
              Get Started Free
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
