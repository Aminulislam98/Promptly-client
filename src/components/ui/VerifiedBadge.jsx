"use client";

import { RiVerifiedBadgeFill } from "react-icons/ri";

/**
 * Verified badge — wavy scalloped shape (like X/Twitter) in brand blue.
 * Sizes: xs (14px), sm (16px), md (20px), lg (24px), xl (28px)
 */
const SIZE_CLASS = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

export function VerifiedBadge({ size = "sm", className = "", title = "Verified Promptly member" }) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.sm;
  return (
    <RiVerifiedBadgeFill
      className={"shrink-0 text-brand " + sizeClass + (className ? " " + className : "")}
      aria-label="Verified"
      title={title}
    />
  );
}
