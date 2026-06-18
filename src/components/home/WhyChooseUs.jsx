"use client";

import { Sparkles, Zap, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Curated Quality",
    desc: "Every prompt is reviewed by our team before going live. No spam, no low-effort content — only prompts that actually deliver results.",
    iconColor:
      "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Copy and paste prompts that work immediately. No tweaking, no guessing — straight from the community to your AI tool of choice.",
    iconColor:
      "text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50",
  },
  {
    icon: Shield,
    title: "Safe & Moderated",
    desc: "Community-driven reporting keeps the platform clean. Admins review flagged content and take action fast.",
    iconColor:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    icon: Users,
    title: "Built for Creators",
    desc: "Share your prompts, grow your audience, and earn recognition. Promptly is a platform where creators get credit.",
    iconColor:
      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function WhyChooseUs() {
  return (
    <section className="w-full bg-page-bg py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-on-brand shadow-sm">
              Why Promptly
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-text-primary sm:text-3xl max-w-2xl">
              Everything you need to get the most out of AI
            </h2>
          </div>
          <p className="text-sm font-bold text-text-primary/70 sm:text-base max-w-md sm:text-right">
            We built Promptly because finding great AI prompts should not be
            hard. Here is what makes us different.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map(({ icon: Icon, title, desc, iconColor }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group flex flex-col justify-between rounded-2xl bg-surface p-6 border-2 border-border transition-colors duration-200 hover:border-text-primary"
            >
              <div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${iconColor}`}
                >
                  <Icon className="h-6 w-6 stroke-[2.5]" />
                </div>

                <h3 className="mt-6 text-lg font-black text-text-primary sm:text-xl tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm font-bold leading-relaxed text-text-primary opacity-85 sm:text-base">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
