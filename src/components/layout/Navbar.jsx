"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Zap,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "Explore" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function getDashboardPath(role) {
  if (role === "admin") return "/admin";
  return "/dashboard";
}

function UserAvatar({ name, size = "sm" }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";
  return (
    <span
      className={
        "flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-on-brand " +
        (size === "lg" ? "h-11 w-11 text-base" : "h-8 w-8 text-base")
      }
    >
      {initials}
    </span>
  );
}

export function Navbar({ name = "Promptly" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const dashboardPath = getDashboardPath(user?.role);

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/prompts");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

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

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem("server_token");
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={
        "fixed left-0 right-0 top-0 z-50 border-b bg-surface transition-all duration-200 " +
        (scrolled ? "shadow-sm" : "shadow-none")
      }
    >
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link
          href="/"
          aria-label={`${name} home`}
          className={"flex shrink-0 items-center gap-2 rounded-lg " + focusRing}
        >
          {/* Icon mark */}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-sm">
            <Command className="h-5 w-5 text-on-brand" strokeWidth={2.5} />
          </span>
          {/* Wordmark */}
          <span className="text-lg font-bold tracking-tight text-text-primary">
            {name}
          </span>
          {/* AI badge */}
          <span className="hidden items-center gap-0.5 rounded-full bg-brand-light px-2 py-0.5 text-base font-semibold text-brand sm:flex">
            <Zap className="h-3 w-3" />
            AI
          </span>
        </Link>

        {/* ── Desktop Nav links (pill active) ── */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "inline-flex h-9 items-center rounded-full px-5 text-base font-medium transition-all duration-150 " +
                focusRing +
                (isActive(link.href)
                  ? " bg-brand font-semibold text-on-brand shadow-sm"
                  : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Right Actions ── */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {/* Search pill */}
          <button
            type="button"
            onClick={() => router.push("/prompts")}
            aria-label="Search prompts"
            className={
              "flex h-9 items-center gap-2 rounded-full border bg-page-bg pl-3 pr-2 text-base text-text-muted transition-colors duration-150 hover:border-brand hover:text-text-primary " +
              focusRing
            }
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden text-base xl:inline">Search prompts…</span>
            <kbd className="ml-1 flex items-center rounded-md border border-border bg-surface px-1.5 py-0.5 text-base font-medium text-text-secondary">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={
              "flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
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

          {/* Auth — skeleton */}
          {isPending && (
            <span className="h-9 w-32 animate-pulse rounded-full bg-surface-hover" />
          )}

          {/* Auth — logged in */}
          {!isPending && user && (
            <div className="flex items-center gap-1">
              <UserAvatar name={user.name} size="sm" />
              <Link
                href={dashboardPath}
                className={
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-base font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
                  focusRing
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className={
                  "inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-error " +
                  focusRing
                }
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Auth — logged out */}
          {!isPending && !user && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-base font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
                  focusRing
                }
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                className={
                  "inline-flex h-9 items-center gap-2 rounded-full bg-brand px-5 text-base font-semibold text-on-brand transition-all duration-150 hover:bg-brand-hover active:scale-[0.97] " +
                  focusRing
                }
              >
                Get Started
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Controls ── */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => router.push("/prompts")}
            aria-label="Search"
            className={
              "flex h-10 w-10 items-center justify-center rounded-full border bg-page-bg text-text-secondary transition-colors hover:border-brand hover:text-text-primary " +
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
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={
              "flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {open && (
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
                onClick={() => setOpen(false)}
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
                <div className="flex items-center gap-3 rounded-xl bg-page-bg px-4 py-3">
                  <UserAvatar name={user.name} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-text-primary">
                      {user.name}
                    </p>
                    <p className="truncate text-base text-text-secondary">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href={dashboardPath}
                  onClick={() => setOpen(false)}
                  className={
                    "flex min-h-[48px] items-center gap-2 rounded-xl border px-4 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                    focusRing
                  }
                >
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={
                    "flex min-h-[48px] w-full items-center gap-2 rounded-xl border border-error/20 px-4 text-base font-medium text-error transition-colors hover:bg-error/5 " +
                    focusRing
                  }
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            )}

            {/* Logged-out auth */}
            {!isPending && !user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={
                    "flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
                    focusRing
                  }
                >
                  <LogIn className="h-5 w-5" /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
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
  );
}
