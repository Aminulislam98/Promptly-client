"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Copy, ArrowRight, SlidersHorizontal, X } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const inputBase =
  "w-full rounded-md border-0 bg-surface-hover px-4 text-base text-text-primary placeholder:text-text-muted outline-none ring-1 ring-border transition-all duration-150 focus:ring-2 focus:ring-brand h-10";

// Placeholder data — replace with real API
const MOCK_PROMPTS = [
  {
    _id: "1",
    title: "Write a killer cold email that gets replies",
    category: "Marketing",
    aiTool: "ChatGPT",
    copyCount: 42,
    creatorName: "John Doe",
    difficulty: "Beginner",
    tags: ["email", "sales"],
  },
  {
    _id: "2",
    title: "Generate a production-ready React component",
    category: "Coding",
    aiTool: "Claude",
    copyCount: 18,
    creatorName: "Jane Smith",
    difficulty: "Intermediate",
    tags: ["react", "coding"],
  },
  {
    _id: "3",
    title: "SEO meta description writer for any page",
    category: "Writing",
    aiTool: "Gemini",
    copyCount: 91,
    creatorName: "Alex Ray",
    difficulty: "Beginner",
    tags: ["seo", "writing"],
  },
  {
    _id: "4",
    title: "Complete business plan generator",
    category: "Business",
    aiTool: "ChatGPT",
    copyCount: 34,
    creatorName: "Sara Khan",
    difficulty: "Pro",
    tags: ["business", "planning"],
  },
  {
    _id: "5",
    title: "Cinematic portrait prompt for Midjourney",
    category: "Design",
    aiTool: "Midjourney",
    copyCount: 67,
    creatorName: "Mike Chen",
    difficulty: "Beginner",
    tags: ["midjourney", "portrait"],
  },
  {
    _id: "6",
    title: "Python debugging assistant with context",
    category: "Coding",
    aiTool: "Claude",
    copyCount: 29,
    creatorName: "Lena Park",
    difficulty: "Intermediate",
    tags: ["python", "debugging"],
  },
  {
    _id: "7",
    title: "LinkedIn profile rewriter for job seekers",
    category: "Marketing",
    aiTool: "ChatGPT",
    copyCount: 55,
    creatorName: "Tom W.",
    difficulty: "Beginner",
    tags: ["linkedin", "jobs"],
  },
  {
    _id: "8",
    title: "Fantasy world building system prompt",
    category: "Writing",
    aiTool: "Claude",
    copyCount: 38,
    creatorName: "Priya S.",
    difficulty: "Intermediate",
    tags: ["fantasy", "worldbuilding"],
  },
  {
    _id: "9",
    title: "Logo concept generator for startups",
    category: "Design",
    aiTool: "Midjourney",
    copyCount: 44,
    creatorName: "Kai L.",
    difficulty: "Beginner",
    tags: ["logo", "design"],
  },
];

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

function FilterSection({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base font-semibold text-text-primary">{label}</p>
      <div className="flex flex-col gap-1">
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [aiTool, setAiTool] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("latest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Client-side filter (replace with server-side later)
  const filtered = MOCK_PROMPTS.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      p.aiTool.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || p.category === category;
    const matchTool = aiTool === "All" || p.aiTool === aiTool;
    const matchDifficulty = difficulty === "All" || p.difficulty === difficulty;
    return matchSearch && matchCategory && matchTool && matchDifficulty;
  }).sort((a, b) => {
    if (sort === "copies") return b.copyCount - a.copyCount;
    if (sort === "popular") return b.copyCount - a.copyCount;
    return 0;
  });

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
    <div className="flex flex-col gap-6">
      <FilterSection
        label="Category"
        options={CATEGORIES}
        value={category}
        onChange={setCategory}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="AI Tool"
        options={AI_TOOLS}
        value={aiTool}
        onChange={setAiTool}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="Difficulty"
        options={DIFFICULTIES}
        value={difficulty}
        onChange={setDifficulty}
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
      <div className="w-full px-3 pt-5 pb-10">
        {/* Search + Sort bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-md border bg-surface px-3">
            <Search className="h-4 w-4 shrink-0 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, tag, or AI tool..."
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
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className={
                "inline-flex h-10 items-center gap-2 rounded-md border bg-surface px-3 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover lg:hidden " +
                focusRing
              }
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Mobile filters drawer */}
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

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-48 shrink-0 lg:block">
            <div className="sticky top-24 rounded-md border bg-surface p-5">
              <Filters />
            </div>
          </aside>

          {/* Prompts grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
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
                <p className="mb-4 text-base text-text-secondary">
                  {filtered.length} prompt{filtered.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
                <div className="grid grid-cols-1 gap-px border bg-border sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((prompt) => (
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
                            DIFFICULTY_STYLES[prompt.difficulty]
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
                      </div>
                      <p className="mt-2 text-base text-text-secondary">
                        by {prompt.creatorName}
                      </p>
                      <div className="mt-auto border-t pt-4 mt-5">
                        <Link
                          href={`/prompts/${prompt._id}`}
                          className={
                            "flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                            focusRing
                          }
                        >
                          View Details <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
