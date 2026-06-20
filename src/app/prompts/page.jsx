"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border bg-surface animate-pulse overflow-hidden">
      <div className="aspect-[4/3] w-full bg-surface-hover" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 rounded bg-surface-hover" />
        <div className="h-4 w-full rounded bg-surface-hover" />
        <div className="h-4 w-3/4 rounded bg-surface-hover" />
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
              "flex h-8 items-center rounded-lg px-3 text-base font-medium transition-colors text-left " +
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
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-light shrink-0">
        {prompt.thumbnail ? (
          <Image
            src={prompt.thumbnail}
            alt={prompt.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-bold text-brand opacity-20">
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
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-base text-text-secondary truncate">
            @ {prompt.creatorName}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary group-hover:text-brand transition-colors" />
        </div>
        <h2 className="mt-2 text-base font-bold leading-snug text-text-primary line-clamp-2">
          {prompt.title}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-base font-medium text-brand">
            {prompt.category}
          </span>
          {prompt.aiTool && (
            <span className="rounded-full bg-surface-hover px-2.5 py-0.5 text-base text-text-secondary">
              {prompt.aiTool}
            </span>
          )}
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
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
                "inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-brand px-3 text-base font-semibold text-on-brand hover:bg-brand-hover active:scale-[0.98] " +
                focusRing
              }
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href={`/login?redirect=/prompts/${prompt._id}`}
              className={
                "inline-flex h-8 items-center justify-center rounded-lg border px-3 text-base font-medium text-text-primary hover:bg-surface-hover " +
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

function SuggestionCard({ prompt, isLoggedIn, onClose }) {
  const href = isLoggedIn
    ? `/prompts/${prompt._id}`
    : `/login?redirect=/prompts/${prompt._id}`;
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10 hover:border-white/20"
    >
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/10">
        {prompt.thumbnail ? (
          <Image
            src={prompt.thumbnail}
            alt={prompt.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xl font-bold text-white/30">
              {prompt.title?.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-white group-hover:text-brand-light">
          {prompt.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-brand/30 px-2 py-0.5 text-xs font-medium text-brand-light">
            {prompt.category}
          </span>
          <span className="text-xs text-white/50">{prompt.aiTool}</span>
          {prompt.visibility === "Private" && (
            <span className="flex items-center gap-0.5 text-xs font-medium text-warning">
              <Lock className="h-3 w-3" /> Premium
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 text-xs text-white/40">
        <Copy className="h-3 w-3" /> {prompt.copyCount}
      </div>
    </Link>
  );
}

function SearchOverlay({ onClose, isLoggedIn }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    getPrompts({ search: debouncedQuery.trim(), limit: 8, page: 1 })
      .then((data) => setSuggestions(data.prompts || []))
      .catch(() => setSuggestions([]))
      .finally(() => setIsSearching(false));
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Full blur backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel — fixed at top, no white bg, only glass */}
      <div
        className="relative z-10 flex flex-col"
        style={{ maxHeight: "85vh" }}
      >
        {/* Search bar */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <Search className="h-5 w-5 shrink-0 text-white/60" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts, tags, AI tools..."
              className="flex-1 bg-transparent text-base text-white placeholder:text-white/40 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-white/40 hover:text-white/80"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-base font-medium text-white/70 hover:bg-white/20 transition-colors"
            >
              Esc
            </button>
          </div>
        </div>

        {/* Results — scrollable */}
        <div className="overflow-y-auto">
          <div className="mx-auto max-w-[1600px] px-4 pb-6 pt-4 sm:px-6 lg:px-8">
            {/* Popular tags when empty */}
            {!query.trim() && !isSearching && (
              <div>
                <p className="mb-3 text-base font-medium text-white/50">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "ChatGPT",
                    "Marketing",
                    "Coding",
                    "Claude",
                    "Writing",
                    "Midjourney",
                    "Business",
                    "Productivity",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-base font-medium text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeletons */}
            {isSearching && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 animate-pulse"
                  >
                    <div className="h-14 w-20 rounded-lg bg-white/10 shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 w-3/4 rounded bg-white/10" />
                      <div className="h-3 w-1/2 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {!isSearching && query.trim() && suggestions.length === 0 && (
              <div className="flex flex-col items-center py-12 text-center">
                <Search className="h-10 w-10 text-white/30" />
                <p className="mt-3 text-base font-semibold text-white/70">
                  No results for "{query}"
                </p>
                <p className="text-base text-white/40">
                  Try different keywords
                </p>
              </div>
            )}

            {/* Results */}
            {!isSearching && suggestions.length > 0 && (
              <div>
                <p className="mb-3 text-base font-medium text-white/50">
                  {suggestions.length} result
                  {suggestions.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {suggestions.map((prompt) => (
                    <SuggestionCard
                      key={prompt._id}
                      prompt={prompt}
                      isLoggedIn={isLoggedIn}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const LIMIT = 1000;

  const { data: session } = authClient.useSession();
  useEffect(() => setMounted(true), []);
  const isLoggedIn = mounted && !!session?.user;

  const debouncedSearch = useDebounce(search, 300);

  const fetchPrompts = useCallback(() => {
    setIsLoading(true);
    const params = { page: 1, limit: LIMIT, sort };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
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
  }, [debouncedSearch, category, aiTool, difficulty, sort]);

  useEffect(() => {
    fetchPrompts();
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
      {searchOverlayOpen && (
        <SearchOverlay
          onClose={() => setSearchOverlayOpen(false)}
          isLoggedIn={isLoggedIn}
        />
      )}

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
          <button
            type="button"
            onClick={() => setSearchOverlayOpen(true)}
            className={
              "flex flex-1 items-center gap-2 rounded-lg border bg-surface px-3 py-2.5 text-base text-text-muted hover:border-brand transition-colors text-left " +
              focusRing
            }
          >
            <Search className="h-4 w-4 shrink-0 text-text-secondary" />
            <span className="flex-1">{search || "Search prompts..."}</span>
            {search && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch("");
                }}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </button>

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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
