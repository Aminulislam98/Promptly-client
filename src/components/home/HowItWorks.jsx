"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

const STEPS = [
  {
    icon: UserPlus,
    title: "Create a free account",
    desc: "Sign up in seconds — no credit card required. Unlock access to thousands of community-curated AI prompts right away.",
  },
  {
    icon: Search,
    title: "Find the right prompt",
    desc: "Search by title, filter by AI tool, category, or difficulty. Every prompt is reviewed before going live.",
  },
  {
    icon: Zap,
    title: "Copy and use instantly",
    desc: "One click copies the prompt to your clipboard. Paste it directly into ChatGPT, Claude, Midjourney, or any AI tool.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full border-t bg-surface py-12 lg:py-16">
      <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-base font-semibold text-brand">
            Simple Process
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            Up and running in 2 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            From sign-up to copying your first prompt — it really is that fast.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector line between steps — desktop only */}
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-full top-8 hidden w-full -translate-x-1/2 border-t-2 border-dashed border-border sm:block"
                  aria-hidden="true"
                />
              )}

              {/* Circle with icon + step number badge */}
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-brand">
                <item.icon className="h-7 w-7 text-white" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand bg-surface text-sm font-bold text-brand">
                  {i + 1}
                </span>
              </div>

              {/* Text */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold leading-tight text-text-primary">
                  {item.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
