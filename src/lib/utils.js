/**
 * Format a large number to a compact string.
 * 413 → "413"  |  4977 → "4.9K"  |  1200000 → "1.2M"
 */
export function formatCount(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) {
    const v = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return v + "M";
  }
  if (n >= 1_000) {
    const v = (n / 1_000).toFixed(1).replace(/\.0$/, "");
    return v + "K";
  }
  return String(n);
}

/**
 * Returns true if the given ISO date string is within `days` days of now.
 */
export function isNew(dateStr, days = 7) {
  if (!dateStr) return false;
  const ms = Date.now() - new Date(dateStr).getTime();
  return ms >= 0 && ms <= days * 24 * 60 * 60 * 1000;
}

/**
 * Returns Tailwind classes for a category badge.
 * Each category gets a consistent, distinct color — never all-blue.
 */
const CATEGORY_COLORS = {
  // Writing & content
  Writing:      "bg-violet-50 text-violet-700 border-violet-200",
  Copywriting:  "bg-violet-50 text-violet-700 border-violet-200",
  Storytelling: "bg-violet-50 text-violet-700 border-violet-200",

  // Marketing & business
  Marketing:    "bg-pink-50 text-pink-700 border-pink-200",
  Business:     "bg-pink-50 text-pink-700 border-pink-200",
  Sales:        "bg-pink-50 text-pink-700 border-pink-200",
  Advertising:  "bg-pink-50 text-pink-700 border-pink-200",

  // Coding & tech
  Coding:       "bg-blue-50 text-blue-700 border-blue-200",
  Development:  "bg-blue-50 text-blue-700 border-blue-200",
  Programming:  "bg-blue-50 text-blue-700 border-blue-200",
  Engineering:  "bg-blue-50 text-blue-700 border-blue-200",

  // Design & creative
  Design:       "bg-orange-50 text-orange-700 border-orange-200",
  Art:          "bg-orange-50 text-orange-700 border-orange-200",
  Creative:     "bg-orange-50 text-orange-700 border-orange-200",
  Photography:  "bg-orange-50 text-orange-700 border-orange-200",

  // Productivity & work
  Productivity: "bg-teal-50 text-teal-700 border-teal-200",
  Planning:     "bg-teal-50 text-teal-700 border-teal-200",
  Management:   "bg-teal-50 text-teal-700 border-teal-200",

  // Education & research
  Education:    "bg-green-50 text-green-700 border-green-200",
  Research:     "bg-green-50 text-green-700 border-green-200",
  Learning:     "bg-green-50 text-green-700 border-green-200",
  Academic:     "bg-green-50 text-green-700 border-green-200",

  // Social & SEO
  "Social Media": "bg-rose-50 text-rose-700 border-rose-200",
  SEO:            "bg-rose-50 text-rose-700 border-rose-200",
  Content:        "bg-rose-50 text-rose-700 border-rose-200",

  // Fun & entertainment
  Entertainment: "bg-amber-50 text-amber-700 border-amber-200",
  Gaming:        "bg-amber-50 text-amber-700 border-amber-200",
  Humor:         "bg-amber-50 text-amber-700 border-amber-200",
};

/** Fallback color for unknown categories */
const DEFAULT_CATEGORY_COLOR = "bg-brand-light text-brand border-brand/20";

export function categoryColor(category) {
  if (!category) return DEFAULT_CATEGORY_COLOR;
  // Exact match
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  // Partial match (e.g. "AI Writing" → Writing)
  const key = Object.keys(CATEGORY_COLORS).find((k) =>
    category.toLowerCase().includes(k.toLowerCase())
  );
  return key ? CATEGORY_COLORS[key] : DEFAULT_CATEGORY_COLOR;
}
