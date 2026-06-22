"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  { _id: "1", name: "Michael B.", role: "Product Designer", rating: 5, comment: "Promptly saved me hours every single week. The quality of prompts here is genuinely unmatched compared to anything else I have tried.", date: "Jun 2026", initial: "M" },
  { _id: "2", name: "Priya S.", role: "Content Strategist", rating: 5, comment: "Finally a platform where I can find prompts that actually work straight out of the box. No more trial and error. Highly recommend.", date: "Jun 2026", initial: "P" },
  { _id: "3", name: "Tom W.", role: "Software Engineer", rating: 4, comment: "Great collection across all the major AI tools. The Midjourney and Claude prompts are especially impressive. Will be back for more.", date: "May 2026", initial: "T" },
  { _id: "4", name: "Amara J.", role: "Marketing Manager", rating: 5, comment: "The marketing prompts alone are worth it. I used three of them in a single campaign and the results spoke for themselves.", date: "May 2026", initial: "A" },
  { _id: "5", name: "Kai L.", role: "Freelance Writer", rating: 5, comment: "I was sceptical at first but after using a few prompts my writing output doubled. The community here really knows what they are doing.", date: "Apr 2026", initial: "K" },
  { _id: "6", name: "Sara M.", role: "Startup Founder", rating: 4, comment: "Solid platform with a clean interface. The business plan prompts saved us a tonne of time in our early planning stages.", date: "Apr 2026", initial: "S" },
];

const AVG_RATING = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

const AVATAR_COLORS = [
  "bg-brand", "bg-purple-500", "bg-green-600",
  "bg-orange-500", "bg-pink-500", "bg-blue-600",
];

function Stars({ rating, size = "sm" }) {
  const cls = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cls + " " + (s <= rating ? "fill-warning text-warning" : "fill-border text-border")} aria-hidden="true" />
      ))}
    </div>
  );
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

export function CustomerReviews() {
  return (
    <section className="w-full border-t bg-page-bg py-12 lg:py-16">
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
            Reviews
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            What people are saying
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            Real feedback from real users across the Promptly community.
          </p>

          {/* Trust bar */}
          <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border bg-surface px-8 py-5">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-text-primary">{AVG_RATING}</span>
              <Stars rating={5} size="lg" />
              <span className="text-base text-text-muted">Average rating</span>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-text-primary">{REVIEWS.length}+</span>
              <span className="text-base text-text-muted">Verified reviews</span>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-text-primary">98%</span>
              <span className="text-base text-text-muted">Would recommend</span>
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {REVIEWS.map((review, idx) => (
            <motion.article
              key={review._id}
              variants={cardVariants}
              className="group flex flex-col rounded-xl border bg-surface p-6 transition-colors hover:border-brand"
            >
              {/* Quote + stars */}
              <div className="flex items-start justify-between">
                <Quote className="h-8 w-8 text-brand opacity-20" aria-hidden="true" />
                <div className="flex flex-col items-end gap-1">
                  <Stars rating={review.rating} />
                  <span className="text-base text-text-muted">{review.date}</span>
                </div>
              </div>

              {/* Comment */}
              <p className="mt-4 flex-1 text-base leading-relaxed text-text-secondary">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t pt-4">
                <div className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white transition-transform group-hover:scale-105 " + AVATAR_COLORS[idx % AVATAR_COLORS.length]}>
                  {review.initial}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-text-primary">{review.name}</p>
                  <p className="text-base text-text-secondary">{review.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
