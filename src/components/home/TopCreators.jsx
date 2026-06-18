"use client";

import { motion } from "framer-motion";
import { Copy, FileText } from "lucide-react";

// Replace with real API call later
const TOP_CREATORS = [
  { _id: "1", name: "John Doe", prompts: 24, copies: 420, initials: "JD" },
  { _id: "2", name: "Jane Smith", prompts: 18, copies: 310, initials: "JS" },
  { _id: "3", name: "Alex Ray", prompts: 15, copies: 280, initials: "AR" },
  { _id: "4", name: "Sara Khan", prompts: 12, copies: 195, initials: "SK" },
  { _id: "5", name: "Mike Chen", prompts: 10, copies: 167, initials: "MC" },
  { _id: "6", name: "Lena Park", prompts: 9, copies: 143, initials: "LP" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

export function TopCreators() {
  return (
    <section className="w-full border-b bg-page-bg px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base font-semibold uppercase tracking-widest text-brand"
          >
            Community
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 text-xl font-bold leading-tight text-text-primary sm:text-2xl"
          >
            Top Creators
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-base leading-relaxed text-text-secondary"
          >
            Meet the people building the best prompts on Promptly.
          </motion.p>
        </div>

        {/* Creators grid */}
        <div className="mt-10 grid grid-cols-1 gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {TOP_CREATORS.map((creator, i) => (
            <motion.div
              key={creator._id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex items-center gap-5 bg-surface p-6"
            >
              {/* Rank */}
              <span className="w-6 shrink-0 text-lg font-bold text-text-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border bg-brand text-base font-bold text-on-brand">
                {creator.initials}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-text-primary">
                  {creator.name}
                </p>
                <div className="mt-1 flex items-center gap-4 text-base text-text-secondary">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {creator.prompts} prompts
                  </span>
                  <span className="flex items-center gap-1">
                    <Copy className="h-3.5 w-3.5" />
                    {creator.copies} copies
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
