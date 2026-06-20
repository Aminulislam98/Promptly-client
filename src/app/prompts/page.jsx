"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Copy,
  ArrowRight,
  SlidersHorizontal,
  X,
  Lock,
} from "lucide-react";
import { getPrompts } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const CATEGORIES = [
  "All",
  "Marketing",
  "Coding",
  "Writing",
  "Business",
  "Design",
  "Education",
  "Productivity",
];
const AI_TOOLS = [
  "All",
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Pro"];
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "copies", label: "Most Copied" },
];

const DIFFICULTY_COLORS = {
  Beginner: "text-success",
  Intermediate: "text-warning",
  Pro: "text-error",
};

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border bg-surface animate-pulse overflow-hidden">
      <div className="h-32 w-full bg-surface-hover" />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-surface-hover" />
          <div className="h-3 w-3 rounded bg-surface-hover" />
        </div>
        <div className="h-4 w-full rounded bg-surface-hover" />
        <div className="h-4 w-3/4 rounded bg-surface-hover" />
        <div className="h-3 w-1/2 rounded bg-surface-hover" />
        <div className="mt-1 h-8 w-full rounded-lg bg-surface-hover" />
      </div>
    </div>
  );
}

function FilterSection({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-base font-semibold text-text-primary">{label}</p>
      <div className="flex flex-col gap-0.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              "flex h-8 items-center rounded-lg px-3 text-base font-medium transition-colors duration-150 text-left " +
              focusRing +
              (value === opt
                ? " bg-brand-light text-brand"
                : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function PromptCard({ prompt, isLoggedIn }) {
  return (
    <article className="group flex flex-col rounded-xl border bg-surface overflow-hidden transition-colors hover:bg-surface-hover">
      {/* Thumbnail */}
      <div className="relative h-32 w-full overflow-hidden bg-brand-light shrink-0">
        {prompt.thumbnail ? (
          <Image
            src={prompt.thumbnail}
            alt={prompt.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-bold text-brand opacity-20">
              {prompt.title?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {prompt.visibility === "Private" && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-base font-semibold text-on-brand">
            <Lock className="h-3 w-3" /> Premium
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-base text-text-secondary truncate">
            @ {prompt.creatorName}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary group-hover:text-brand transition-colors" />
        </div>

        {/* Title */}
        <h2 className="mt-2 text-base font-bold leading-snug text-text-primary line-clamp-2">
          {prompt.title}
        </h2>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full border-l-2 border-brand pl-2 pr-2 py-0.5 text-base font-medium text-text-secondary bg-page-bg">
            {prompt.category}
          </span>
          {prompt.aiTool && (
            <span className="rounded-full border-l-2 border-border pl-2 pr-2 py-0.5 text-base text-text-secondary bg-page-bg">
              {prompt.aiTool}
            </span>
          )}
        </div>

        {/* Bottom */}
        <div className="mt-auto border-t pt-3 mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-base text-text-secondary">
            <span className="flex items-center gap-1">
              <Copy className="h-3.5 w-3.5" /> {prompt.copyCount}
            </span>
            <span
              className={
                "font-medium " + (DIFFICULTY_COLORS[prompt.difficulty] || "")
              }
            >
              {prompt.difficulty}
            </span>
          </div>
          {isLoggedIn ? (
            <Link
              href={`/prompts/${prompt._id}`}
              className={
                "inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-brand px-3 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                focusRing
              }
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href={`/login?redirect=/prompts/${prompt._id}`}
              className={
                "inline-flex h-8 items-center justify-center rounded-lg border px-3 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                focusRing
              }
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AllPromptsPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [aiTool, setAiTool] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("latest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Set a large limit to show all prompts at once without pagination controls
  const LIMIT = 1000;

  const { data: session } = authClient.useSession();
  useEffect(() => setMounted(true), []);
  const isLoggedIn = mounted && !!session?.user;

  const fetchPrompts = useCallback(() => {
    setIsLoading(true);
    const params = { page: 1, limit: LIMIT, sort };
    if (search.trim()) params.search = search.trim();
    if (category !== "All") params.category = category;
    if (aiTool !== "All") params.aiTool = aiTool;
    if (difficulty !== "All") params.difficulty = difficulty;
    getPrompts(params)
      .then((data) => {
        setPrompts(data.prompts || []);
        setTotal(data.total || 0);
      })
      .catch(() => setPrompts([]))
      .finally(() => setIsLoading(false));
  }, [search, category, aiTool, difficulty, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchPrompts, 300);
    return () => clearTimeout(timer);
  }, [fetchPrompts]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setAiTool("All");
    setDifficulty("All");
    setSort("latest");
  };

  const hasActiveFilters =
    search || category !== "All" || aiTool !== "All" || difficulty !== "All";

  const Filters = () => (
    <div className="flex flex-col gap-4">
      <FilterSection
        label="Category"
        options={CATEGORIES}
        value={category}
        onChange={(v) => setCategory(v)}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="AI Tool"
        options={AI_TOOLS}
        value={aiTool}
        onChange={(v) => setAiTool(v)}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="Difficulty"
        options={DIFFICULTIES}
        value={difficulty}
        onChange={(v) => setDifficulty(v)}
      />
      {hasActiveFilters && (
        <>
          <div className="h-px bg-border" />
          <button
            type="button"
            onClick={clearFilters}
            className={
              "flex h-8 items-center gap-2 rounded-lg px-3 text-base font-medium text-error hover:bg-error/10 " +
              focusRing
            }
          >
            <X className="h-4 w-4" /> Clear
          </button>
        </>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-page-bg">
      <div className="w-full px-3 py-6">
        <div className="mb-5">
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            All Prompts
          </h1>
          <p className="mt-1 text-base text-text-secondary">
            Browse {total} prompts across all categories.
          </p>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-surface px-3">
            <Search className="h-4 w-4 shrink-0 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="flex-1 bg-transparent py-2.5 text-base text-text-primary placeholder:text-text-muted outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={
                "rounded-lg border bg-surface px-3 text-base text-text-primary outline-none h-10 cursor-pointer " +
                focusRing
              }
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className={
                "inline-flex h-10 items-center gap-2 rounded-lg border bg-surface px-3 text-base font-medium text-text-primary hover:bg-surface-hover lg:hidden " +
                focusRing
              }
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        {mobileFiltersOpen && (
          <div className="mb-5 rounded-xl border bg-surface p-4 lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-base font-semibold text-text-primary">
                Filters
              </p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className={
                  "rounded-lg p-1 text-text-secondary hover:text-text-primary " +
                  focusRing
                }
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Filters />
          </div>
        )}

        <div className="flex gap-5">
          <aside className="hidden w-40 shrink-0 lg:block">
            <div className="sticky top-20 rounded-xl border bg-surface p-3">
              <Filters />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {!isLoading && (
              <p className="mb-3 text-base text-text-secondary">
                {total} prompt{total !== 1 ? "s" : ""} found
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : prompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
                <Search className="h-10 w-10 text-text-secondary" />
                <h2 className="mt-4 text-xl font-semibold text-text-primary">
                  No prompts found
                </h2>
                <p className="mt-2 text-base text-text-secondary">
                  Try adjusting your filters or search term.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className={
                    "mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-on-brand hover:bg-brand-hover " +
                    focusRing
                  }
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {prompts.map((prompt) => (
                  <PromptCard
                    key={prompt._id}
                    prompt={prompt}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
