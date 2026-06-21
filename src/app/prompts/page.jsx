"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import { CreatorAvatar } from "@/components/ui/CreatorAvatar";
import { authClient } from "@/lib/auth-client";
import { formatCount, isNew } from "@/lib/utils";

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

const POPULAR_TAGS = [
  "ChatGPT",
  "Marketing",
  "Coding",
  "Claude",
  "Writing",
  "Midjourney",
  "Business",
  "Productivity",
];

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
    <div className="flex flex-col rounded-xl border bg-surface animate-pulse">
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

function StarRating({ rating, count }) {
  if (!rating || rating === 0) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            viewBox="0 0 16 16"
            className={
              "h-3.5 w-3.5 " +
              (s <= full
                ? "fill-warning"
                : s === full + 1 && half
                  ? "fill-warning opacity-50"
                  : "fill-border")
            }
            aria-hidden="true"
          >
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
          </svg>
        ))}
      </div>
      <span className="text-base text-text-secondary">
        {rating.toFixed(1)}
        {count ? ` (${count})` : ""}
      </span>
    </div>
  );
}

function PromptCard({ prompt, isLoggedIn }) {
  return (
    <article className="group flex flex-col rounded-xl border bg-surface transition-colors hover:bg-surface-hover">
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
        {isNew(prompt.createdAt) && (
          <div className="absolute left-2 top-2 rounded-full bg-success px-2 py-0.5 text-base font-semibold text-on-brand">
            New
          </div>
        )}
        {prompt.visibility === "Private" && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-base font-semibold text-on-brand">
            <Lock className="h-3 w-3" /> Premium
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CreatorAvatar name={prompt.creatorName} size="sm" />
            <span className="truncate text-base font-medium text-text-secondary">
              {prompt.creatorName}
            </span>
          </div>
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
        {prompt.avgRating > 0 && (
          <div className="mt-2">
            <StarRating rating={prompt.avgRating} count={prompt.reviewCount} />
          </div>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-base text-text-secondary">
            <span className="flex items-center gap-1">
              <Copy className="h-3.5 w-3.5" /> {formatCount(prompt.copyCount)}
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
      className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:bg-surface-hover hover:border-brand"
    >
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-light">
        {prompt.thumbnail ? (
          <Image
            src={prompt.thumbnail}
            alt={prompt.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-lg font-bold text-brand opacity-30">
              {prompt.title?.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-text-primary group-hover:text-brand">
          {prompt.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand">
            {prompt.category}
          </span>
          <span className="text-xs text-text-secondary">{prompt.aiTool}</span>
          {prompt.visibility === "Private" && (
            <span className="flex items-center gap-0.5 text-xs font-medium text-warning">
              <Lock className="h-3 w-3" /> Premium
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 text-xs text-text-muted">
        <Copy className="h-3 w-3" /> {prompt.copyCount}
      </div>
    </Link>
  );
}

function SearchOverlay({ onClose, isLoggedIn, onUrlUpdate }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

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
    getPrompts({ search: debouncedQuery.trim(), limit: 6, page: 1 })
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

  const handleQueryChange = (val) => {
    setQuery(val);
    onUrlUpdate("search", val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fully solid white backdrop */}
      <div className="absolute inset-0 bg-surface" onClick={onClose} />

      {/* Flat container with shadow removed */}
      <div
        className="relative z-10 flex flex-col border-b bg-surface"
        style={{ maxHeight: "80vh" }}
      >
        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Search className="h-5 w-5 shrink-0 text-brand" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search prompts, tags, AI tools..."
            className="flex-1 bg-transparent text-base text-text-primary placeholder:text-text-muted outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={
              "rounded-lg border px-3 py-1.5 text-base font-medium text-text-secondary hover:bg-surface-hover transition-colors " +
              focusRing
            }
          >
            Esc
          </button>
        </div>

        <div className="overflow-y-auto border-t">
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-5 pt-4 sm:px-6 lg:px-8">
            {!query.trim() && !isSearching && (
              <div>
                <p className="mb-3 text-base font-medium text-text-secondary">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQueryChange(tag)}
                      className={
                        "rounded-full border bg-surface-hover px-3 py-1 text-base font-medium text-text-secondary hover:border-brand hover:text-brand transition-colors " +
                        focusRing
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isSearching && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border bg-surface p-3 animate-pulse"
                  >
                    <div className="h-12 w-16 rounded-lg bg-surface-hover shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 w-3/4 rounded bg-surface-hover" />
                      <div className="h-3 w-1/2 rounded bg-surface-hover" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && query.trim() && suggestions.length === 0 && (
              <div className="flex flex-col items-center py-10 text-center">
                <Search className="h-8 w-8 text-text-secondary" />
                <p className="mt-2 text-base font-semibold text-text-primary">
                  No results for "{query}"
                </p>
                <p className="text-base text-text-secondary">
                  Try different keywords
                </p>
              </div>
            )}

            {!isSearching && suggestions.length > 0 && (
              <div>
                <p className="mb-3 text-base font-medium text-text-secondary">
                  {suggestions.length} result
                  {suggestions.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((prompt) => (
                    <SuggestionCard
                      key={prompt._id}
                      prompt={prompt}
                      isLoggedIn={isLoggedIn}
                      onClose={onClose}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className={
                    "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-base font-medium text-text-secondary hover:bg-surface-hover hover:text-brand transition-colors w-full " +
                    focusRing
                  }
                >
                  See all results for "{query}"{" "}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllPromptsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const aiTool = searchParams.get("aiTool") || "All";
  const difficulty = searchParams.get("difficulty") || "All";
  const sort = searchParams.get("sort") || "latest";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 12;
  const totalPages = Math.ceil(total / LIMIT);

  const { data: session } = authClient.useSession();
  useEffect(() => setMounted(true), []);
  const isLoggedIn = mounted && !!session?.user;

  const updateURL = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "All" || (key === "sort" && value === "latest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  // Reset to page 1 whenever filters/sort/search change
  useEffect(() => {
    setPage(1);
  }, [search, category, aiTool, difficulty, sort]);

  useEffect(() => {
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

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters =
    search || category !== "All" || aiTool !== "All" || difficulty !== "All";

  const Filters = () => (
    <div className="flex flex-col gap-4">
      <FilterSection
        label="Category"
        options={CATEGORIES}
        value={category}
        onChange={(v) => updateURL("category", v)}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="AI Tool"
        options={AI_TOOLS}
        value={aiTool}
        onChange={(v) => updateURL("aiTool", v)}
      />
      <div className="h-px bg-border" />
      <FilterSection
        label="Difficulty"
        options={DIFFICULTIES}
        value={difficulty}
        onChange={(v) => updateURL("difficulty", v)}
      />
      <div className="h-px bg-border" />
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-text-primary">Sort By</p>
        <div className="flex flex-col gap-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateURL("sort", opt.value)}
              className={
                "flex h-8 items-center rounded-lg px-3 text-base font-medium transition-colors text-left " +
                focusRing +
                (sort === opt.value
                  ? " bg-brand-light text-brand"
                  : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
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
            <X className="h-4 w-4" /> Clear all
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
          onUrlUpdate={updateURL}
        />
      )}

      <div className="w-full px-3 py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            onClick={() => setSearchOverlayOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setSearchOverlayOpen(true);
            }}
            className={
              "flex flex-1 items-center gap-2 rounded-lg border bg-surface px-3 py-2.5 text-base text-text-muted hover:border-brand transition-colors text-left cursor-pointer " +
              focusRing
            }
          >
            <Search className="h-4 w-4 shrink-0 text-text-secondary" />
            <span className="flex-1 truncate">
              {search || "Search prompts..."}
            </span>
            {search && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateURL("search", "");
                }}
                className="text-text-secondary hover:text-text-primary shrink-0 relative z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

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

        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {search && (
              <span className="flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-base font-medium text-brand">
                "{search}"
                <button
                  type="button"
                  onClick={() => updateURL("search", "")}
                  className="hover:text-brand-hover"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {category !== "All" && (
              <span className="flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-base font-medium text-brand">
                {category}
                <button
                  type="button"
                  onClick={() => updateURL("category", "All")}
                  className="hover:text-brand-hover"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {aiTool !== "All" && (
              <span className="flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-base font-medium text-brand">
                {aiTool}
                <button
                  type="button"
                  onClick={() => updateURL("aiTool", "All")}
                  className="hover:text-brand-hover"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {difficulty !== "All" && (
              <span className="flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-base font-medium text-brand">
                {difficulty}
                <button
                  type="button"
                  onClick={() => updateURL("difficulty", "All")}
                  className="hover:text-brand-hover"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="text-base font-medium text-error hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

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
          <aside className="hidden w-44 shrink-0 lg:block">
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

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={
                    "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover disabled:opacity-40 " +
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
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={
                    "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover disabled:opacity-40 " +
                    focusRing
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
