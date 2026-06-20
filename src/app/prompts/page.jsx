"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Copy, ArrowRight, SlidersHorizontal, X } from "lucide-react";
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

const DIFFICULTY_STYLES = {
  Beginner: "text-success",
  Intermediate: "text-warning",
  Pro: "text-error",
};

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-surface p-5 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-20 rounded bg-surface-hover" />
        <div className="h-4 w-16 rounded bg-surface-hover" />
      </div>
      <div className="mt-3 h-5 w-3/4 rounded bg-surface-hover" />
      <div className="mt-2 h-4 w-1/2 rounded bg-surface-hover" />
      <div className="mt-2 h-4 w-1/3 rounded bg-surface-hover" />
      <div className="mt-auto border-t pt-4 mt-5">
        <div className="h-10 w-full rounded-md bg-surface-hover" />
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
              "flex h-9 items-center rounded-md px-3 text-base font-medium transition-colors duration-150 text-left " +
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
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  const { data: session } = authClient.useSession();

  useEffect(() => setMounted(true), []);

  const isLoggedIn = mounted && !!session?.user;

  const fetchPrompts = useCallback(() => {
    setIsLoading(true);
    const params = { page, limit: LIMIT, sort };
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
  }, [search, category, aiTool, difficulty, sort, page]);

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
    setPage(1);
  };

  const hasActiveFilters =
    search || category !== "All" || aiTool !== "All" || difficulty !== "All";
  const totalPages = Math.ceil(total / LIMIT);

  const Filters = () => (
    <div className="flex flex-col gap-5">
      <FilterSection
        label="Category"
        options={CATEGORIES}
        value={category}
        onChange={(v) => {
          setCategory(v);
          setPage(1);
        }}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="AI Tool"
        options={AI_TOOLS}
        value={aiTool}
        onChange={(v) => {
          setAiTool(v);
          setPage(1);
        }}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="Difficulty"
        options={DIFFICULTIES}
        value={difficulty}
        onChange={(v) => {
          setDifficulty(v);
          setPage(1);
        }}
      />
      {hasActiveFilters && (
        <>
          <div className="h-px bg-border" />
          <button
            type="button"
            onClick={clearFilters}
            className={
              "flex h-9 items-center gap-2 rounded-md px-3 text-base font-medium text-error transition-colors hover:bg-error/10 " +
              focusRing
            }
          >
            <X className="h-4 w-4" /> Clear filters
          </button>
        </>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-page-bg">
      <div className="w-full px-3 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            All Prompts
          </h1>
          <p className="mt-1 text-base text-text-secondary">
            Browse {total} prompts across all categories and AI tools.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-md border bg-surface px-3">
            <Search className="h-4 w-4 shrink-0 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, tag, or AI tool..."
              className="flex-1 bg-transparent py-2.5 text-base text-text-primary placeholder:text-text-muted outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className={
                "rounded-md border bg-surface px-3 text-base text-text-primary outline-none h-10 cursor-pointer " +
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
                "inline-flex h-10 items-center gap-2 rounded-md border bg-surface px-3 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover lg:hidden " +
                focusRing
              }
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        {mobileFiltersOpen && (
          <div className="mb-6 rounded-md border bg-surface p-5 lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-base font-semibold text-text-primary">
                Filters
              </p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className={
                  "rounded-md p-1 text-text-secondary hover:text-text-primary " +
                  focusRing
                }
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Filters />
          </div>
        )}

        <div className="flex gap-4">
          <aside className="hidden w-44 shrink-0 lg:block">
            <div className="sticky top-20 rounded-md border bg-surface p-4">
              <Filters />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {!isLoading && (
              <p className="mb-4 text-base text-text-secondary">
                {total} prompt{total !== 1 ? "s" : ""} found
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 gap-px border-y bg-border sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : prompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border bg-surface py-16 text-center">
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
                    "mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover " +
                    focusRing
                  }
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-px border-y bg-border sm:grid-cols-2 xl:grid-cols-3">
                  {prompts.map((prompt) => (
                    <article
                      key={prompt._id}
                      className="flex flex-col bg-surface p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-brand">
                          {prompt.category}
                        </span>
                        <span
                          className={
                            "text-base font-medium " +
                            (DIFFICULTY_STYLES[prompt.difficulty] ||
                              "text-text-secondary")
                          }
                        >
                          {prompt.difficulty}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-semibold leading-snug text-text-primary line-clamp-2">
                        {prompt.title}
                      </h2>
                      <div className="mt-3 flex items-center gap-3 text-base text-text-secondary">
                        <span className="rounded-md border px-2 py-0.5">
                          {prompt.aiTool}
                        </span>
                        <span className="flex items-center gap-1">
                          <Copy className="h-3.5 w-3.5" /> {prompt.copyCount}
                        </span>
                        {prompt.visibility === "Private" && (
                          <span className="rounded-md bg-warning/10 px-2 py-0.5 text-base font-medium text-warning">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-base text-text-secondary">
                        by {prompt.creatorName}
                      </p>
                      <div className="mt-auto border-t pt-4 mt-5">
                        {isLoggedIn ? (
                          <Link
                            href={`/prompts/${prompt._id}`}
                            className={
                              "flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                              focusRing
                            }
                          >
                            View Details <ArrowRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <Link
                            href={`/login?redirect=/prompts/${prompt._id}`}
                            className={
                              "flex h-10 w-full items-center justify-center rounded-md border text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                              focusRing
                            }
                          >
                            Login to View
                          </Link>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={
                        "inline-flex h-10 items-center justify-center rounded-md border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover disabled:opacity-40 " +
                        focusRing
                      }
                    >
                      Previous
                    </button>
                    <span className="text-base text-text-secondary">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className={
                        "inline-flex h-10 items-center justify-center rounded-md border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover disabled:opacity-40 " +
                        focusRing
                      }
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
