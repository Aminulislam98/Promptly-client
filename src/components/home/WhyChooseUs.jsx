"use client";

import { Sparkles, Zap, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Curated Quality",
    desc: "Every prompt is reviewed by our team before going live. No spam, no low-effort content — only prompts that actually deliver results.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Copy and paste prompts that work immediately. No tweaking, no guessing — straight from the community to your AI tool of choice.",
  },
  {
    icon: Shield,
    title: "Safe & Moderated",
    desc: "Community-driven reporting keeps the platform clean. Admins review flagged content and take action fast.",
  },
  {
    icon: Users,
    title: "Built for Creators",
    desc: "Share your prompts, grow your audience, and earn recognition. Promptly is a platform where creators get credit.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
};

export function WhyChooseUs() {
  return (
    <section className="w-full border-b bg-surface px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base font-semibold uppercase tracking-widest text-brand"
          >
            Why Promptly
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 text-xl font-bold leading-tight text-text-primary sm:text-2xl"
          >
            Everything you need to get the most out of AI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-base leading-relaxed text-text-secondary"
          >
            We built Promptly because finding great AI prompts should not be
            hard. Here is what makes us different.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="mt-10 grid grid-cols-1 gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col gap-4 bg-surface p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center border bg-page-bg">
                <Icon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-text-secondary">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
