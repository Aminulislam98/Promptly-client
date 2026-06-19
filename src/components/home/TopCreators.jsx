"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, FileText } from "lucide-react";
import { getTopCreators } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

function SkeletonCreator() {
  return (
    <div className="flex items-center gap-5 bg-surface p-6 animate-pulse">
      <div className="h-5 w-6 rounded bg-surface-hover shrink-0" />
      <div className="h-12 w-12 rounded bg-surface-hover shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-32 rounded bg-surface-hover" />
        <div className="h-3 w-24 rounded bg-surface-hover" />
      </div>
    </div>
  );
}

export function TopCreators() {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTopCreators()
      .then((data) => setCreators(data.creators || []))
      .catch(() => setCreators([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="w-full border-b bg-page-bg py-16">
      <div className="mx-auto w-full max-w-screen-xl px-3">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-semibold uppercase tracking-widest text-brand"
        >
          Community
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-2 text-2xl font-bold leading-tight text-text-primary"
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

      <div className="mt-10 grid grid-cols-1 gap-px border-y bg-border sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCreator key={i} />)
        ) : creators.length === 0 ? (
          <div className="col-span-3 flex items-center justify-center bg-surface py-16">
            <p className="text-base text-text-secondary">No creators yet.</p>
          </div>
        ) : (
          creators.map((creator, i) => (
            <motion.div
              key={creator._id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex items-center gap-5 bg-surface p-6"
            >
              <span className="w-8 shrink-0 text-base font-bold text-text-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border bg-brand text-base font-bold text-on-brand">
                {creator.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-text-primary">
                  {creator.name}
                </p>
                <div className="mt-1 flex items-center gap-4 text-base text-text-secondary">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> {creator.totalPrompts}{" "}
                    prompts
                  </span>
                  <span className="flex items-center gap-1">
                    <Copy className="h-3.5 w-3.5" /> {creator.totalCopies}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
