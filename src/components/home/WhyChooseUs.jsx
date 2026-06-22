"use client";

import { Sparkles, Zap, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Curated Quality",
    desc: "Every prompt is reviewed before going live. No spam, no low-effort content — only prompts that deliver real results.",
    iconBg: "bg-brand-light",
    iconColor: "text-brand",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Copy and paste prompts that work immediately. No tweaking, no guessing — straight from the community to your AI tool.",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    icon: Shield,
    title: "Safe & Moderated",
    desc: "Community-driven reporting keeps the platform clean. Admins review flagged content and take action fast.",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    icon: Users,
    title: "Built for Creators",
    desc: "Share your prompts, grow your audience, and earn recognition. Promptly is where creators get the credit they deserve.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

export function WhyChooseUs() {
  return (
    <section className="w-full border-t bg-surface py-12 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-base font-semibold text-brand">
            Why Promptly
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            Everything you need to get the most out of AI
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            We built Promptly because finding great AI prompts should not be hard. Here is what makes us different.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map(({ icon: Icon, title, desc, iconBg, iconColor }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group flex flex-col rounded-xl border bg-surface p-6 transition-colors duration-200 hover:border-brand"
            >
              <div className={"flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 " + iconBg}>
                <Icon className={"h-6 w-6 " + iconColor} />
              </div>
              <h3 className="mt-5 text-lg font-semibold leading-snug text-text-primary">
                {title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
