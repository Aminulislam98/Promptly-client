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

// 6 icons only — 3 left, 3 right — properly centered with content
const AI_ICONS = [
  {
    label: "ChatGPT",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    rotate: -8,
    pos: { top: "15%", left: "4%" },
    icon: (
      <svg viewBox="0 0 24 24" fill="#10a37f" className="h-8 w-8">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
      </svg>
    ),
  },
  {
    label: "Claude",
    bg: "#fffbeb",
    border: "#fde68a",
    rotate: 6,
    pos: { top: "45%", left: "2%" },
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#D97706">
        <path d="M17.304 1.273C16.836.481 16.019 0 15.094 0h-2.132c-.654 0-1.218.354-1.526.9L4.45 14.025c-.308.546-.308 1.226 0 1.8l1.066 1.872c.308.546.9.9 1.526.9H9.17c.654 0 1.218-.354 1.526-.9l6.989-12.243c.308-.546.308-1.226 0-1.8l-1.066-1.9a1.788 1.788 0 0 0-.315-.481z" />
      </svg>
    ),
  },
  {
    label: "Gemini",
    bg: "#eff6ff",
    border: "#bfdbfe",
    rotate: -5,
    pos: { top: "75%", left: "5%" },
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
        <defs>
          <linearGradient id="gem1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="100%" stopColor="#0F9D58" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14a6 6 0 0 0 0 12A6 6 0 0 0 12 6z"
          fill="url(#gem1)"
        />
        <circle cx="12" cy="12" r="3" fill="#4285F4" />
      </svg>
    ),
  },
  {
    label: "Midjourney",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    rotate: 7,
    pos: { top: "15%", right: "4%" },
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.8"
      >
        <path d="M3 18l4.5-9 4.5 9M9 16h4.5M16.5 9l2.5 9" />
        <circle cx="19" cy="7" r="1.5" fill="#7c3aed" />
      </svg>
    ),
  },
  {
    label: "Grok",
    bg: "#f9fafb",
    border: "#e5e7eb",
    rotate: -6,
    pos: { top: "45%", right: "2%" },
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#111827">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "DALL·E",
    bg: "#fdf4ff",
    border: "#f0abfc",
    rotate: 5,
    pos: { top: "75%", right: "5%" },
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#a21caf" strokeWidth="1.5" />
        <path d="M8 12a4 4 0 0 1 8 0" stroke="#a21caf" strokeWidth="1.5" />
        <circle cx="9" cy="9.5" r="1.2" fill="#a21caf" />
        <circle cx="15" cy="9.5" r="1.2" fill="#a21caf" />
      </svg>
    ),
  },
];

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

  if (!mounted) return null;

  return (
    <section className="relative w-full overflow-hidden bg-surface">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1d4ed820 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Center glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand/5 blur-3xl pointer-events-none" />

      {/* Floating icons — desktop only */}
      <div className="absolute inset-0 hidden xl:block">
        {AI_ICONS.map((tool, i) => (
          <motion.div
            key={tool.label}
            style={{ position: "absolute", ...tool.pos }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
            className="flex flex-col items-center gap-1.5 select-none pointer-events-none"
          >
            <div
              style={{
                backgroundColor: tool.bg,
                borderColor: tool.border,
                transform: `rotate(${tool.rotate}deg)`,
              }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 shadow-lg"
            >
              {tool.icon}
            </div>
            <span className="rounded-full border border-border bg-surface/90 px-2 py-0.5 text-xs font-medium text-text-secondary backdrop-blur-sm whitespace-nowrap shadow-sm">
              {tool.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Main content — perfectly centered */}
      <div className="relative flex min-h-[600px] items-center justify-center px-4 py-20 lg:min-h-[680px]">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-base font-semibold text-brand"
          >
            ✨ AI Prompt Marketplace
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            Discover, Share &amp; Master
            <br />
            <span className="bg-gradient-to-r from-brand to-brand-hover bg-clip-text text-transparent">
              AI Prompts
            </span>{" "}
            for Every Tool
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            A community-driven platform for high-quality prompts across ChatGPT,
            Gemini, Claude, Midjourney, and more.
          </motion.p>

          {/* Search */}
          <motion.form
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            onSubmit={handleSearch}
            className="mt-10 flex w-full max-w-xl items-center gap-3 rounded-full border bg-surface px-5 py-3 shadow-sm transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10"
          >
            <Search className="h-5 w-5 shrink-0 text-text-muted" />
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
                "shrink-0 rounded-full bg-brand px-5 py-2 text-base font-semibold text-on-brand transition-colors hover:bg-brand-hover " +
                focusRing
              }
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
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-base font-medium text-text-muted">
              Trending:
            </span>
            {TRENDING_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/prompts?search=${tag}`}
                className={
                  "rounded-full border bg-surface px-3 py-1 text-base font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand " +
                  focusRing
                }
              >
                {tag}
              </Link>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/prompts"
              className={
                "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-8 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] shadow-lg shadow-brand/20 " +
                focusRing
              }
            >
              Browse All Prompts <ArrowRight className="h-4 w-4" />
            </Link>
            {!isLoggedIn && (
              <Link
                href="/register"
                className={
                  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-surface px-8 text-base font-semibold text-text-primary transition-colors hover:bg-surface-hover active:scale-[0.98] " +
                  focusRing
                }
              >
                Get Started Free
              </Link>
            )}
          </motion.div>

          {/* Mobile icons strip */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 xl:hidden"
          >
            {AI_ICONS.map((tool) => (
              <div
                key={tool.label}
                className="flex flex-col items-center gap-1"
              >
                <div
                  style={{ backgroundColor: tool.bg, borderColor: tool.border }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-2 shadow-md"
                >
                  {tool.icon}
                </div>
                <span className="text-xs text-text-muted">{tool.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
