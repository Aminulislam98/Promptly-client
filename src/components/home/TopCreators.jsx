"use client";

import { motion } from "framer-motion";
import { Copy, FileText, Award } from "lucide-react";

const TOP_CREATORS = [
  { _id: "1", name: "John Doe", prompts: 24, copies: 420, initials: "JD" },
  { _id: "2", name: "Jane Smith", prompts: 18, copies: 310, initials: "JS" },
  { _id: "3", name: "Alex Ray", prompts: 15, copies: 280, initials: "AR" },
  { _id: "4", name: "Sara Khan", prompts: 12, copies: 195, initials: "SK" },
  { _id: "5", name: "Mike Chen", prompts: 10, copies: 167, initials: "MC" },
  { _id: "6", name: "Lena Park", prompts: 9, copies: 143, initials: "LP" },
];

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

export function TopCreators() {
  return (
    <section className="w-full bg-page-bg py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Unified Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white shadow-sm">
              <Award className="h-3.5 w-3.5 fill-white" /> Leaderboard
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-text-primary sm:text-3xl max-w-2xl">
              Top Creators
            </h2>
          </div>
          <p className="text-sm font-bold text-text-primary sm:text-base max-w-md sm:text-right">
            Meet the power users crafting the community's best prompts.
          </p>
        </div>

        {/* Grid Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {TOP_CREATORS.map((creator, i) => (
            <motion.div
              key={creator._id}
              variants={cardVariants}
              className="group flex flex-col justify-between rounded-2xl bg-surface p-5 border-2 border-border transition-colors duration-200 hover:border-text-primary"
            >
              {/* Top Block: Profile Identity & Rank position */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Glassmorphism Blurred Avatar Badge */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-text-primary/10 border border-border backdrop-blur-md text-sm font-black text-text-primary transition-transform duration-300 group-hover:scale-105">
                    {creator.initials}
                  </div>

                  {/* Identity Labels */}
                  <div className="min-w-0">
                    <h3 className="text-base font-black text-text-primary tracking-tight truncate sm:text-lg">
                      {creator.name}
                    </h3>
                    <p className="text-[11px] font-black text-brand uppercase tracking-wider mt-0.5">
                      Pro Engineer
                    </p>
                  </div>
                </div>

                {/* Clean Geometric Rank Indicator Pill */}
                <span className="text-xs font-black tracking-tighter text-text-primary bg-page-bg border-2 border-border px-2.5 py-1 rounded-lg shrink-0 group-hover:border-text-primary transition-colors">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Bottom Block: Isolated Metrics Grid */}
              <div className="mt-6 pt-4 border-t-2 border-border grid grid-cols-2 gap-2 text-center">
                <div className="flex flex-col items-center justify-center border-r-2 border-border pr-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <span className="text-lg font-black text-text-primary leading-none">
                      {creator.prompts}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-primary/60 mt-1.5">
                    Prompts
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center pl-2">
                  <div className="flex items-center gap-1.5">
                    <Copy className="h-4 w-4 text-amber-500" />
                    <span className="text-lg font-black text-text-primary leading-none">
                      {creator.copies}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-primary/60 mt-1.5">
                    Copies
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
