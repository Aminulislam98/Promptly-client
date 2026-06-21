"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Command,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Search,
  ChevronRight,
  ChevronDown,
  User,
  Copy,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getPrompts } from "@/lib/api";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];

const POPULAR_TAGS = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "Marketing",
  "Coding",
  "Writing",
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function getDashboardPath(role) {
  return role === "admin" ? "/admin" : "/dashboard";
}

function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ─────────────────────────────────────────────────────────────
// Search Modal
// ─────────────────────────────────────────────────────────────
function SearchModal({ onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dq = useDebounce(query, 280);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (!dq.trim()) { setResults([]); return; }
    setLoading(true);
    getPrompts({ search: dq.trim(), limit: 6, page: 1 })
      .then((d) => setResults(d.prompts || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [dq]);

  const go = (href) => { router.push(href); onClose(); };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Input row */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-text-secondary" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, categories, AI tools…"
            className="min-w-0 flex-1 bg-transparent text-base text-text-primary placeholder:text-text-muted outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 text-text-secondary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={
              "shrink-0 rounded-lg border px-2 py-1 text-sm font-medium text-text-secondary hover:bg-surface-hover " +
              focusRing
            }
          >
            Esc
          </button>
        </div>

        {/* Body */}
        <div className="max-h-96 overflow-y-auto p-3">
          {/* No query → popular tags */}
          {!query.trim() && (
            <div>
              <p className="px-2 pb-2 text-sm font-medium text-text-muted">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className={
                      "rounded-full border bg-surface-hover px-3 py-1 text-base font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand " +
                      focusRing
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => go("/prompts")}
                className={
                  "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-base font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-brand " +
                  focusRing
                }
              >
                Browse all prompts <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-3 rounded-xl border p-3"
                >
                  <div className="h-12 w-16 shrink-0 rounded-lg bg-surface-hover" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-4 w-3/4 rounded bg-surface-hover" />
                    <div className="h-3 w-1/2 rounded bg-surface-hover" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="px-2 pb-1 text-sm font-medium text-text-muted">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              {results.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => go(`/prompts/${p._id}`)}
                  className={
                    "group flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-colors hover:border-border hover:bg-surface-hover " +
                    focusRing
                  }
                >
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-light">
                    <span className="text-xl font-bold text-brand opacity-30">
                      {p.title?.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-text-primary group-hover:text-brand">
                      {p.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded-full bg-brand-light px-2 py-0.5 text-sm font-medium text-brand">
                        {p.category}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {p.aiTool}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-sm text-text-muted">
                    <Copy className="h-3 w-3" /> {p.copyCount}
                  </div>
                </button>
              ))}
              <button
                type="button"
                onClick={() => go(`/prompts?search=${encodeURIComponent(query)}`)}
                className={
                  "mt-1 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-base font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-brand " +
                  focusRing
                }
              >
                See all results for &ldquo;{query}&rdquo;{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center">
              <Search className="mb-3 h-8 w-8 text-text-secondary" />
              <p className="text-base font-semibold text-text-primary">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Try different keywords or browse all prompts
              </p>
              <button
                type="button"
                onClick={() => go("/prompts")}
                className={
                  "mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-base font-semibold text-on-brand hover:bg-brand-hover " +
                  focusRing
                }
              >
                Browse all prompts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Logout Confirmation Modal
// ─────────────────────────────────────────────────────────────
function LogoutModal({ onCancel, onConfirm, loading }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
            <LogOut className="h-7 w-7 text-error" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            Log out of Promptly?
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            You can always log back in at any time with your account.
          </p>
        </div>
        <div className="flex gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className={
              "flex h-11 flex-1 items-center justify-center rounded-xl border text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              "flex h-11 flex-1 items-center justify-center rounded-xl bg-error text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 " +
              focusRing
            }
          >
            {loading ? "Logging out…" : "Yes, Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Navbar
// ─────────────────────────────────────────────────────────────
export function Navbar({ name = "Promptly" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const dashboardPath = getDashboardPath(user?.role);

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  // Scroll shadow
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Theme
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    await authClient.signOut();
    localStorage.removeItem("server_token");
    setLogoutOpen(false);
    setLogoutLoading(false);
    setMenuOpen(false);
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // User avatar (image or initials)
  const AvatarCircle = ({ size = "sm" }) => {
    const dim = size === "lg" ? "h-10 w-10" : "h-9 w-9";
    const initials = user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

    if (user?.image) {
      return (
        <span
          className={
            "relative block shrink-0 overflow-hidden rounded-full " + dim
          }
        >
          <Image
            src={user.image}
            alt={user.name || "Profile"}
            fill
            className="object-cover"
            sizes="40px"
          />
        </span>
      );
    }
    return (
      <span
        className={
          "flex shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-on-brand " +
          dim
        }
      >
        {initials}
      </span>
    );
  };

  return (
    <>
      {/* Modals mounted at root level */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {logoutOpen && (
        <LogoutModal
          onCancel={() => setLogoutOpen(false)}
          onConfirm={confirmLogout}
          loading={logoutLoading}
        />
      )}

      <header
        className={
          "fixed left-0 right-0 top-0 z-50 border-b bg-surface transition-shadow duration-200 " +
          (scrolled ? "shadow-sm" : "shadow-none")
        }
      >
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label={`${name} home`}
            className={"flex shrink-0 items-center gap-2 rounded-lg " + focusRing}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
              <Command className="h-5 w-5 text-on-brand" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-black tracking-tight">
              <span className="text-text-primary">Prompt</span>
              <span className="text-brand">ly</span>
            </span>
          </Link>

          {/* ── Desktop Nav — YouTube-style underline active ── */}
          <nav
            className="hidden items-center self-stretch lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "relative flex h-full items-center px-5 text-base font-medium transition-colors duration-150 " +
                  focusRing +
                  (isActive(link.href)
                    ? " text-brand"
                    : " text-text-secondary hover:text-text-primary")
                }
              >
                {link.label}
                {/* Active underline indicator */}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-brand" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Right Actions ── */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">

            {/* Search pill */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search prompts"
              className={
                "flex h-9 items-center gap-2 rounded-full border bg-surface-hover pl-3 pr-2 text-base text-text-muted transition-all duration-150 hover:border-brand hover:text-text-primary " +
                focusRing
              }
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="hidden text-base xl:inline">Search prompts…</span>
              <kbd className="ml-1 flex items-center rounded-md border border-border bg-surface px-1.5 py-0.5 text-sm font-medium text-text-secondary">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
            </button>

            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={
                "flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary " +
                focusRing
              }
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <span className="h-5 w-px bg-border" aria-hidden="true" />

            {/* Skeleton */}
            {isPending && (
              <span className="h-9 w-28 animate-pulse rounded-full bg-surface-hover" />
            )}

            {/* Logged in — profile dropdown */}
            {!isPending && user && (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={profileOpen}
                  className={
                    "flex items-center gap-2 rounded-full border border-transparent px-1 py-1 pr-3 transition-colors hover:border-border hover:bg-surface-hover " +
                    focusRing
                  }
                >
                  <AvatarCircle size="sm" />
                  <span className="max-w-24 truncate text-base font-medium text-text-primary">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown
                    className={
                      "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-150 " +
                      (profileOpen ? "rotate-180" : "")
                    }
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                    {/* User header */}
                    <div className="flex items-center gap-3 border-b px-4 py-3">
                      <AvatarCircle size="lg" />
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-text-primary">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-text-muted">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {/* Menu items */}
                    <div className="p-1.5">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        className={
                          "flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                          focusRing
                        }
                      >
                        <User className="h-4 w-4 shrink-0 text-text-secondary" />
                        View Profile
                      </Link>
                      <Link
                        href={dashboardPath}
                        onClick={() => setProfileOpen(false)}
                        className={
                          "flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                          focusRing
                        }
                      >
                        <LayoutDashboard className="h-4 w-4 shrink-0 text-text-secondary" />
                        Dashboard
                      </Link>
                      <div className="my-1 h-px bg-border" />
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          setLogoutOpen(true);
                        }}
                        className={
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-error transition-colors hover:bg-error/10 " +
                          focusRing
                        }
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logged out */}
            {!isPending && !user && (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={
                    "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-base font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary " +
                    focusRing
                  }
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  href="/register"
                  className={
                    "inline-flex h-9 items-center gap-2 rounded-full bg-brand px-5 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.97] " +
                    focusRing
                  }
                >
                  Get Started <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Controls ── */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={
                "flex h-10 w-10 items-center justify-center rounded-full border bg-surface-hover text-text-secondary transition-colors hover:border-brand hover:text-text-primary " +
                focusRing
              }
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={
                "flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-hover " +
                focusRing
              }
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={
                "flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-hover " +
                focusRing
              }
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {menuOpen && (
          <nav
            className="border-t bg-surface lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto max-w-[1600px] space-y-1 px-4 py-3">
              {/* Nav links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={
                    "flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium transition-colors " +
                    focusRing +
                    (isActive(link.href)
                      ? " bg-brand-light font-semibold text-brand"
                      : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
                  }
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-border" />

              {/* Logged-in user card */}
              {!isPending && user && (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-surface-hover px-4 py-3">
                    <AvatarCircle size="lg" />
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-text-primary">
                        {user.name}
                      </p>
                      <p className="truncate text-sm text-text-muted">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className={
                      "flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                      focusRing
                    }
                  >
                    <User className="h-5 w-5 shrink-0 text-text-secondary" />
                    View Profile
                  </Link>
                  <Link
                    href={dashboardPath}
                    onClick={() => setMenuOpen(false)}
                    className={
                      "flex min-h-[48px] items-center gap-2 rounded-xl border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                      focusRing
                    }
                  >
                    <LayoutDashboard className="h-5 w-5 shrink-0 text-text-secondary" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); setLogoutOpen(true); }}
                    className={
                      "flex min-h-[48px] w-full items-center gap-2 rounded-xl border border-error/20 px-4 text-base font-medium text-error transition-colors hover:bg-error/5 " +
                      focusRing
                    }
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    Log Out
                  </button>
                </>
              )}

              {/* Logged-out auth */}
              {!isPending && !user && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={
                      "flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                      focusRing
                    }
                  >
                    <LogIn className="h-5 w-5" /> Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className={
                      "flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] " +
                      focusRing
                    }
                  >
                    <UserPlus className="h-5 w-5" /> Get Started Free
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
