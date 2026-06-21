"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const TOOLS = [
  {
    name: "ChatGPT",
    emoji: "🤖",
    desc: "Conversational prompts for OpenAI's GPT models",
  },
  {
    name: "Claude",
    emoji: "⚡",
    desc: "Reasoning & writing prompts for Anthropic's Claude",
  },
  {
    name: "Gemini",
    emoji: "✨",
    desc: "Multimodal prompts for Google's Gemini models",
  },
  {
    name: "Midjourney",
    emoji: "🎨",
    desc: "Image generation prompts for Midjourney",
  },
  {
    name: "DALL-E",
    emoji: "🖼️",
    desc: "Creative image prompts for OpenAI's DALL-E",
  },
  {
    name: "Stable Diffusion",
    emoji: "🌀",
    desc: "Open-source image generation prompts",
  },
];

export function BrowseByTool() {
  return (
    <section className="w-full border-b bg-surface py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className="mb-12 text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-base font-semibold text-brand">
            Browse by AI Tool
          </p>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            Prompts for every AI platform
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            Find curated prompts tailored specifically for your favourite AI tool.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              custom={i + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
            >
              <Link
                href={`/prompts?aiTool=${encodeURIComponent(tool.name)}`}
                className={
                  "group flex items-center gap-4 rounded-xl border bg-surface p-5 transition-colors duration-150 hover:bg-surface-hover " +
                  focusRing
                }
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-2xl">
                  {tool.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-text-primary transition-colors group-hover:text-brand">
                    {tool.name}
                  </p>
                  <p className="mt-0.5 truncate text-base text-text-secondary">
                    {tool.desc}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary transition-colors group-hover:text-brand" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
