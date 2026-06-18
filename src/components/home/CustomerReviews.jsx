"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

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
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          // Swapped out black/gray for premium vibrant rating gold
          className={`h-5 w-5 ${
            s <= rating
              ? "text-amber-500 fill-amber-500"
              : "text-text-primary/20 fill-transparent"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

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

export function CustomerReviews() {
  return (
    <section className="w-full bg-page-bg py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Large Typography Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b-2 border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-text-primary px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-surface shadow-sm">
              <MessageSquare className="h-3.5 w-3.5" /> Reviews
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-text-primary sm:text-3xl max-w-2xl">
              What people are saying
            </h2>
          </div>
          <p className="text-sm font-bold text-text-primary sm:text-base max-w-md sm:text-right">
            Real feedback from real users across the Promptly community.
          </p>
        </div>

        {/* High-Contrast Full Screen Responsive Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {REVIEWS.map((review) => (
            <motion.article
              key={review._id}
              variants={cardVariants}
              className="group flex flex-col justify-between rounded-2xl bg-surface p-6 border-2 border-border transition-colors duration-200 hover:border-text-primary"
            >
              <div>
                {/* Premium Golden Stars */}
                <Stars rating={review.rating} />

                {/* Scaled & Legible Comment Body */}
                <p className="mt-5 text-base font-bold leading-relaxed text-text-primary sm:text-lg">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Stack-Safe Footer Info Container */}
              <div className="mt-8 pt-4 border-t-2 border-border flex items-center gap-4">
                {/* Monochromatic Geometric Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-text-primary text-base font-black text-surface tracking-wide transition-transform duration-300 group-hover:scale-105">
                  {review.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="text-base font-black text-text-primary tracking-tight truncate">
                    {review.name}
                  </p>
                  <p className="text-xs font-black text-brand uppercase tracking-wider mt-0.5">
                    {review.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
