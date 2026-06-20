"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    _id: "1",
    name: "Michael B.",
    role: "Product Designer",
    rating: 5,
    comment:
      "Promptly saved me hours every single week. The quality of prompts here is genuinely unmatched compared to anything else I have tried.",
    date: "Jun 2026",
  },
  {
    _id: "2",
    name: "Priya S.",
    role: "Content Strategist",
    rating: 5,
    comment:
      "Finally a platform where I can find prompts that actually work straight out of the box. No more trial and error. Highly recommend.",
    date: "Jun 2026",
  },
  {
    _id: "3",
    name: "Tom W.",
    role: "Software Engineer",
    rating: 4,
    comment:
      "Great collection across all the major AI tools. The Midjourney and Claude prompts are especially impressive. Will be back for more.",
    date: "Jun 2026",
  },
  {
    _id: "4",
    name: "Amara J.",
    role: "Marketing Manager",
    rating: 5,
    comment:
      "The marketing prompts alone are worth it. I used three of them in a single campaign and the results spoke for themselves.",
    date: "Jun 2026",
  },
  {
    _id: "5",
    name: "Kai L.",
    role: "Freelance Writer",
    rating: 5,
    comment:
      "I was sceptical at first but after using a few prompts my writing output doubled. The community here really knows what they are doing.",
    date: "Jun 2026",
  },
  {
    _id: "6",
    name: "Sara M.",
    role: "Startup Founder",
    rating: 4,
    comment:
      "Solid platform with a clean interface. The business plan prompts saved us a tonne of time in our early planning stages.",
    date: "Jun 2026",
  },
];

function Stars({ rating }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={
            "h-4 w-4 " +
            (s <= rating
              ? "fill-warning text-warning"
              : "fill-border text-border")
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function CustomerReviews() {
  return (
    <section className="w-full border-b bg-page-bg py-16">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-base font-semibold text-on-brand">
              Reviews
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
              What people are saying
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-text-secondary sm:text-right">
            Real feedback from real users across the Promptly community.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {REVIEWS.map((review) => (
            <motion.article
              key={review._id}
              variants={cardVariants}
              className="group flex flex-col rounded-xl border bg-surface p-6 transition-colors hover:border-brand"
            >
              {/* Stars + date */}
              <div className="flex items-center justify-between">
                <Stars rating={review.rating} />
                <span className="text-base text-text-muted">{review.date}</span>
              </div>

              {/* Comment */}
              <p className="mt-4 flex-1 text-base leading-relaxed text-text-secondary">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-base font-bold text-on-brand transition-transform group-hover:scale-105">
                  {review.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-text-primary truncate">
                    {review.name}
                  </p>
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
