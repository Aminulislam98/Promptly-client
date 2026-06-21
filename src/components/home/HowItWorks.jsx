"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create an Account",
    desc: "Sign up for free in seconds. No credit card required. Start exploring thousands of community-curated AI prompts right away.",
  },
  {
    icon: Search,
    step: "02",
    title: "Find the Right Prompt",
    desc: "Search by title, filter by AI tool, category, or difficulty. Every prompt is reviewed by our team before going live.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Copy & Use Instantly",
    desc: "One click copies the prompt to your clipboard. Paste it directly into ChatGPT, Claude, Midjourney, Gemini, or any AI tool.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b bg-page-bg py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className="mb-12 text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-base font-semibold text-brand">
            Simple Process
          </p>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            From sign-up to copying your first prompt — it takes under 2 minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              custom={i + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="relative flex flex-col rounded-xl border bg-surface p-6"
            >
              <span className="absolute right-5 top-5 select-none text-4xl font-black text-border">
                {item.step}
              </span>
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light">
                <item.icon className="h-6 w-6 text-brand" />
              </span>
              <h3 className="text-lg font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
