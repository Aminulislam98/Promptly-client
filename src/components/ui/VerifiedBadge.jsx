"use client";

import { Check } from "lucide-react";

/**
 * Facebook-style verified badge — solid brand circle with white checkmark.
 * Sizes: xs (14px), sm (16px), md (20px), lg (24px), xl (28px)
 */
const SIZES = {
  xs: { wrap: "h-3.5 w-3.5", icon: "h-2 w-2" },
  sm: { wrap: "h-4 w-4",     icon: "h-2.5 w-2.5" },
  md: { wrap: "h-5 w-5",     icon: "h-3 w-3" },
  lg: { wrap: "h-6 w-6",     icon: "h-3.5 w-3.5" },
  xl: { wrap: "h-7 w-7",     icon: "h-4 w-4" },
};

export function VerifiedBadge({ size = "sm", className = "", title = "Verified Promptly member" }) {
  const s = SIZES[size] || SIZES.sm;
  return (
    <span
      className={
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand " +
        s.wrap +
        (className ? " " + className : "")
      }
      aria-label="Verified"
      title={title}
    >
      <Check className={"text-white " + s.icon} strokeWidth={3} />
    </span>
  );
}
