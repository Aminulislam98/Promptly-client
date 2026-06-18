"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Copy,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Terminal,
  Wand2,
  Cpu,
} from "lucide-react";
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

// Helper to assign proper representative icons dynamically based on string values
function getAiToolIcon(tool) {
  switch (tool.toLowerCase()) {
    case "chatgpt":
      return MessageSquare;
    case "claude":
      return Terminal;
    case "gemini":
      return Sparkles;
    case "midjourney":
      return Wand2;
    default:
      return Cpu;
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function FeaturedPrompts() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => setMounted(true), []);
  const isLoggedIn = mounted && !!session?.user;

  return (
    <section className="w-full bg-page-bg py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header Block (No border) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5 fill-white" /> Featured
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-text-primary sm:text-3xl max-w-2xl">
              Featured Prompts
            </h2>
          </div>
          <Link
            href="/prompts"
            className={`group flex items-center gap-2 text-base font-extrabold text-brand transition-colors hover:text-brand-hover sm:text-right pb-1 ${focusRing}`}
          >
            View all prompts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Fluid Grid Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {FEATURED_PROMPTS.map((prompt) => {
            const ToolIcon = getAiToolIcon(prompt.aiTool);

            return (
              <motion.article
                key={prompt._id}
                variants={cardVariants}
                className="group flex flex-col justify-between rounded-2xl bg-surface p-5 border-2 border-border transition-colors duration-200 hover:border-text-primary"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black uppercase tracking-widest text-text-primary/60">
                      {prompt.category}
                    </span>
                    <span className="rounded-lg border-2 border-border px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-text-primary">
                      {prompt.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black leading-snug text-text-primary sm:text-xl line-clamp-2 min-h-[3.5rem]">
                    {prompt.title}
                  </h3>

                  {/* Enhanced Parameter Layout incorporating tool names + icon */}
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-text-primary px-2.5 py-1 font-black text-surface tracking-wide">
                      <ToolIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{prompt.aiTool}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-text-primary">
                      <Copy className="h-4 w-4 text-brand" />
                      <span>{prompt.copyCount} copies</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-border flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-primary opacity-60">
                      Creator
                    </span>
                    <span className="text-sm font-extrabold text-text-primary truncate max-w-[130px]">
                      {prompt.creatorName}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isLoggedIn ? (
                      <Link
                        href={`/prompts/${prompt._id}`}
                        className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-brand px-4 text-xs font-black uppercase tracking-wider text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] ${focusRing}`}
                      >
                        Open <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className={`inline-flex h-9 items-center justify-center rounded-xl bg-text-primary px-4 text-xs font-black uppercase tracking-wider text-surface transition-colors hover:bg-text-primary/90 ${focusRing}`}
                      >
                        Unlock
                      </Link>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
