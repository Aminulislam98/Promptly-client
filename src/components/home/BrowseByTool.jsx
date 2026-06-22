"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

const TOOLS = [
  {
    name: "ChatGPT",
    emoji: "🤖",
    desc: "Conversational & reasoning prompts for GPT-4o and o-series",
    card: "bg-green-50 border-green-100 hover:border-green-300",
    emojiWrap: "bg-green-100",
    label: "text-green-700",
  },
  {
    name: "Claude",
    emoji: "⚡",
    desc: "Long-context writing & analysis prompts for Anthropic Claude",
    card: "bg-brand-light border-brand/10 hover:border-brand/40",
    emojiWrap: "bg-brand/10",
    label: "text-brand",
  },
  {
    name: "Gemini",
    emoji: "✨",
    desc: "Multimodal prompts for Google Gemini 1.5 and 2.0",
    card: "bg-blue-50 border-blue-100 hover:border-blue-300",
    emojiWrap: "bg-blue-100",
    label: "text-blue-700",
  },
  {
    name: "Midjourney",
    emoji: "🎨",
    desc: "Cinematic image-generation prompts for Midjourney v6",
    card: "bg-purple-50 border-purple-100 hover:border-purple-300",
    emojiWrap: "bg-purple-100",
    label: "text-purple-700",
  },
  {
    name: "DALL-E",
    emoji: "🖼️",
    desc: "Creative image prompts for OpenAI DALL-E 3",
    card: "bg-orange-50 border-orange-100 hover:border-orange-300",
    emojiWrap: "bg-orange-100",
    label: "text-orange-700",
  },
  {
    name: "Stable Diffusion",
    emoji: "🌀",
    desc: "Open-source generative art with fine-tuned style control",
    card: "bg-pink-50 border-pink-100 hover:border-pink-300",
    emojiWrap: "bg-pink-100",
    label: "text-pink-700",
  },
];

export function BrowseByTool() {
  return (
    <section className="w-full border-t bg-page-bg py-12 lg:py-16">
      <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-base font-semibold text-brand">
            AI Tools
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            Prompts for every AI platform
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            Hand-picked prompts tuned specifically for how each AI thinks. Pick your tool and start creating.
          </p>
        </motion.div>

        {/* Tool cards grid */}
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
                  "group flex items-start gap-4 rounded-xl border p-5 transition-all duration-200 " +
                  tool.card + " " + focusRing
                }
              >
                <span
                  className={
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-transform duration-200 group-hover:scale-110 " +
                    tool.emojiWrap
                  }
                >
                  {tool.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={"text-base font-bold leading-tight " + tool.label}>
                    {tool.name}
                  </p>
                  <p className="mt-1 text-base leading-snug text-text-secondary">
                    {tool.desc}
                  </p>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
