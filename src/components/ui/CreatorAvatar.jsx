"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Copy, BadgeCheck } from "lucide-react";
import { getCreatorPrompts } from "@/lib/api";
import { formatCount } from "@/lib/utils";

// Module-level cache — one fetch per creator name per session
const cache = new Map();
// Cache for creator info (image, isVerified)
const infoCache = new Map();

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

// Tooltip width must match w-56 = 224px
const TOOLTIP_W = 224;
const EDGE_MARGIN = 12;

// Shared hook — any component can call this and get the same cached result
export function useCreatorInfo(name) {
  const [info, setInfo] = useState(
    infoCache.has(name) ? infoCache.get(name) : { image: null, isVerified: false }
  );
  useEffect(() => {
    if (!name) return;
    if (infoCache.has(name)) {
      setInfo(infoCache.get(name));
      return;
    }
    fetch(`/api/creator-info/${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((d) => {
        const i = { image: d.image || null, isVerified: !!d.isVerified };
        infoCache.set(name, i);
        setInfo(i);
      })
      .catch(() => {});
  }, [name]);
  return info;
}

export function CreatorAvatar({ name, size = "md", stopPropagation = false }) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [info, setInfo] = useState({ image: null, isVerified: false });
  // "left" = tooltip left-aligns with avatar, "right" = right-aligns, "center" = centered
  const [side, setSide] = useState("center");
  const timerRef = useRef(null);
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);

  // ALL hooks must come before any conditional return
  useEffect(() => () => {
    clearTimeout(timerRef.current);
    clearTimeout(closeTimer.current);
  }, []);

  // Fetch creator info (image + verified) eagerly so avatar photo loads fast
  useEffect(() => {
    if (!name) return;
    if (infoCache.has(name)) {
      setInfo(infoCache.get(name));
      return;
    }
    fetch(`/api/creator-info/${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((d) => {
        const i = { image: d.image || null, isVerified: !!d.isVerified };
        infoCache.set(name, i);
        setInfo(i);
      })
      .catch(() => {});
  }, [name]);

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
    clearTimeout(closeTimer.current);
    timerRef.current = setTimeout(() => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const avatarCenter = rect.left + rect.width / 2;
        const spaceRight = vw - rect.left - EDGE_MARGIN;
        const spaceLeft = rect.right - EDGE_MARGIN;

        if (spaceRight >= TOOLTIP_W) {
          setSide("left");
        } else if (spaceLeft >= TOOLTIP_W) {
          setSide("right");
        } else if (avatarCenter >= vw / 2) {
          setSide("right");
        } else {
          setSide("left");
        }
      }
      setOpen(true);
      fetchStats();
    }, 300);
  };

  // Delay close so user can move mouse from avatar into the tooltip
  const onLeave = () => {
    clearTimeout(timerRef.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const onTooltipEnter = () => clearTimeout(closeTimer.current);
  const onTooltipLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 100);
  };

  // Build tooltip and caret class strings based on detected side
  const tooltipPos =
    side === "left"
      ? "left-0"
      : side === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  const caretPos =
    side === "left"
      ? "left-4"
      : side === "right"
        ? "right-4"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Avatar circle — real photo if available, else initial */}
      <Link
        href={href}
        aria-label={`View ${name}'s profile`}
        onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        className={
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-on-brand transition-transform hover:scale-110 active:scale-95 " +
          (info.image ? "" : bg + " ") +
          SIZE[size] +
          " " +
          focusRing
        }
      >
        {info.image ? (
          <Image
            src={info.image}
            alt={name}
            fill
            sizes="44px"
            className="object-cover"
          />
        ) : (
          initial
        )}
      </Link>

      {/* Hover card — flips left/right based on available viewport space */}
      {open && (
        <div
          onMouseEnter={onTooltipEnter}
          onMouseLeave={onTooltipLeave}
          className={
            "absolute bottom-full z-50 mb-3 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg " +
            tooltipPos
          }
        >
          {/* Caret */}
          <div
            className={
              "absolute top-full h-3 w-3 -translate-y-1.5 rotate-45 border-b border-r border-border bg-surface " +
              caretPos
            }
          />

          <div className="p-3">
            {/* Creator row */}
            <div className="flex items-center gap-2">
              <div className={
                "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full " +
                (info.image ? "" : "items-center justify-center text-base font-bold text-on-brand " + bg)
              }>
                {info.image ? (
                  <Image src={info.image} alt={name} fill sizes="36px" className="object-cover" />
                ) : initial}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-1">
                  <p className="truncate text-base font-semibold text-text-primary">
                    {name}
                  </p>
                  {info.isVerified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-brand" title="Verified" />
                  )}
                </div>
                <p className="truncate text-sm text-text-secondary">Prompt Creator</p>
              </div>
            </div>

            {/* Stats — bordered split layout so text stays contained */}
            <div className="mt-3 flex overflow-hidden rounded-lg border border-border">
              {stats ? (
                <>
                  <div className="flex flex-1 flex-col items-center py-2.5">
                    <p className="text-base font-bold leading-none text-text-primary">
                      {formatCount(stats.count)}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
                      <FileText className="h-3 w-3 shrink-0" /> Prompts
                    </p>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex flex-1 flex-col items-center py-2.5">
                    <p className="text-base font-bold leading-none text-text-primary">
                      {formatCount(stats.totalCopies)}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
                      <Copy className="h-3 w-3 shrink-0" /> Copies
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-14 w-full animate-pulse bg-surface-hover" />
              )}
            </div>

            {/* CTA */}
            <Link
              href={href}
              className={
                "mt-3 flex h-8 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover active:scale-[0.98] " +
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
