"use client";

import { motion } from "framer-motion";

// Replace with real API call later
const REVIEWS = [
  {
    _id: "1",
    name: "Michael B.",
    role: "Product Designer",
    rating: 5,
    comment:
      "Promptly saved me hours every single week. The quality of prompts here is genuinely unmatched compared to anything else I have tried.",
    date: "2026-06-01",
  },
  {
    _id: "2",
    name: "Priya S.",
    role: "Content Strategist",
    rating: 5,
    comment:
      "Finally a platform where I can find prompts that actually work straight out of the box. No more trial and error. Highly recommend.",
    date: "2026-06-05",
  },
  {
    _id: "3",
    name: "Tom W.",
    role: "Software Engineer",
    rating: 4,
    comment:
      "Great collection across all the major AI tools. The Midjourney and Claude prompts are especially impressive. Will be back for more.",
    date: "2026-06-10",
  },
  {
    _id: "4",
    name: "Amara J.",
    role: "Marketing Manager",
    rating: 5,
    comment:
      "The marketing prompts alone are worth it. I used three of them in a single campaign and the results spoke for themselves.",
    date: "2026-06-12",
  },
  {
    _id: "5",
    name: "Kai L.",
    role: "Freelance Writer",
    rating: 5,
    comment:
      "I was sceptical at first but after using a few prompts my writing output doubled. The community here really knows what they are doing.",
    date: "2026-06-14",
  },
  {
    _id: "6",
    name: "Sara M.",
    role: "Startup Founder",
    rating: 4,
    comment:
      "Solid platform with a clean interface. The business plan prompts saved us a tonne of time in our early planning stages.",
    date: "2026-06-16",
  },
];

function Stars({ rating }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          viewBox="0 0 16 16"
          className={
            "h-4 w-4 " +
            (s <= rating
              ? "fill-warning text-warning"
              : "fill-border text-border")
          }
          aria-hidden="true"
        >
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
        </svg>
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

export function CustomerReviews() {
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
            Reviews
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 text-xl font-bold leading-tight text-text-primary sm:text-2xl"
          >
            What people are saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-base leading-relaxed text-text-secondary"
          >
            Real feedback from real users across the Promptly community.
          </motion.p>
        </div>

        {/* Reviews grid */}
        <div className="mt-10 grid grid-cols-1 gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.article
              key={review._id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col gap-4 bg-surface p-6"
            >
              <Stars rating={review.rating} />

              <p className="flex-1 text-base leading-relaxed text-text-primary">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="flex items-center gap-3 border-t pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border bg-brand text-base font-bold text-on-brand">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-semibold text-text-primary">
                    {review.name}
                  </p>
                  <p className="text-base text-text-secondary">{review.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
