"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FileText, Copy } from "lucide-react";
import { getCreatorPrompts } from "@/lib/api";

// Module-level cache — one fetch per creator name per session
const cache = new Map();

// Deterministic color from name — uses only design-token bg classes
const PALETTE = ["bg-brand", "bg-success", "bg-error"];
export function avatarBg(name = "") {
  const n = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[n % PALETTE.length];
}

const SIZE = {
  sm: "h-8 w-8 text-base",
  md: "h-9 w-9 text-base",
  lg: "h-11 w-11 text-lg",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface";

export function CreatorAvatar({ name, size = "md", stopPropagation = false }) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const timerRef = useRef(null);

  // ALL hooks must come before any conditional return
  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!name) return null;

  const initial = name.charAt(0).toUpperCase();
  const href = `/creator/${encodeURIComponent(name)}`;
  const bg = avatarBg(name);

  const fetchStats = async () => {
    if (cache.has(name)) {
      setStats(cache.get(name));
      return;
    }
    try {
      const res = await getCreatorPrompts(name);
      const prompts = res.prompts || [];
      const totalCopies = prompts.reduce((s, p) => s + (p.copyCount || 0), 0);
      const data = { count: prompts.length, totalCopies };
      cache.set(name, data);
      setStats(data);
    } catch {
      const data = { count: 0, totalCopies: 0 };
      cache.set(name, data);
      setStats(data);
    }
  };

  const onEnter = () => {
    timerRef.current = setTimeout(() => {
      setOpen(true);
      fetchStats();
    }, 380);
  };

  const onLeave = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Avatar circle */}
      <Link
        href={href}
        aria-label={`View ${name}'s profile`}
        onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        className={
          "flex shrink-0 items-center justify-center rounded-full font-bold text-on-brand transition-transform hover:scale-110 active:scale-95 " +
          bg +
          " " +
          SIZE[size] +
          " " +
          focusRing
        }
      >
        {initial}
      </Link>

      {/* Hover card */}
      {open && (
        <div className="absolute bottom-full left-1/2 z-50 mb-3 w-56 -translate-x-1/2 rounded-xl border bg-surface">
          {/* Caret */}
          <div className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-b border-r border-border bg-surface" />

          <div className="p-4">
            {/* Creator row */}
            <div className="flex items-center gap-3">
              <div
                className={
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-on-brand " +
                  bg
                }
              >
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-text-primary">
                  {name}
                </p>
                <p className="text-base text-text-secondary">Prompt Creator</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-3 flex items-center gap-4 rounded-lg bg-page-bg px-3 py-2.5">
              {stats ? (
                <>
                  <div className="flex flex-1 items-center gap-2">
                    <FileText className="h-4 w-4 text-brand" />
                    <div>
                      <p className="text-base font-bold text-text-primary leading-none">
                        {stats.count}
                      </p>
                      <p className="mt-0.5 text-base text-text-secondary">
                        Prompts
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="flex flex-1 items-center gap-2">
                    <Copy className="h-4 w-4 text-brand" />
                    <div>
                      <p className="text-base font-bold text-text-primary leading-none">
                        {stats.totalCopies}
                      </p>
                      <p className="mt-0.5 text-base text-text-secondary">
                        Total copies
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-10 w-full animate-pulse rounded-lg bg-surface-hover" />
              )}
            </div>

            {/* CTA */}
            <Link
              href={href}
              className={
                "mt-3 flex h-9 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-on-brand transition-colors hover:bg-brand-hover active:scale-[0.98] " +
                focusRing
              }
            >
              View Profile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
