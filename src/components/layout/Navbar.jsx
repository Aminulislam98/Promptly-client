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
  ChevronRight,
  ChevronDown,
  User,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function getDashboardPath(role) {
  return role === "admin" ? "/admin" : "/dashboard";
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
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const dashboardPath = getDashboardPath(user?.role);

  // Scroll shadow
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
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
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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

  // Avatar: image or initials
  const AvatarCircle = ({ size = "sm" }) => {
    const dim = size === "lg" ? "h-10 w-10" : "h-9 w-9";
    const initials = user?.name
      ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "U";

    if (user?.image) {
      return (
        <span className={"relative block shrink-0 overflow-hidden rounded-full " + dim}>
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
        {/* ── Three-column grid so nav is truly centred ── */}
        <div className="mx-auto grid h-16 w-full max-w-[1600px] grid-cols-3 items-center px-4 sm:px-6 lg:px-8">

          {/* ── Col 1 — Logo ── */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label={`${name} home`}
              className={"flex items-center gap-2.5 rounded-lg " + focusRing}
            >
              {/* Icon mark */}
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand">
                <Command className="h-5 w-5 text-on-brand" strokeWidth={2.5} />
                {/* Tiny sparkle accent */}
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning">
                  <Sparkles className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                </span>
              </span>

              {/* Wordmark + tagline */}
              <span className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tight">
                  <span className="text-text-primary">Prompt</span>
                  <span className="text-brand">ly</span>
                </span>
                <span className="mt-0.5 text-sm font-medium tracking-wide text-text-muted">
                  find your prompt
                </span>
              </span>
            </Link>
          </div>

          {/* ── Col 2 — Centered nav links (desktop) ── */}
          <nav
            className="hidden items-center justify-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "relative inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-base font-medium transition-all duration-150 " +
                    focusRing +
                    (active
                      ? " bg-brand text-on-brand font-semibold shadow-sm"
                      : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
                  }
                >
                  {link.label}
                  {/* Tiny pulse dot on active */}
                  {active && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-brand opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-on-brand opacity-75" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Col 3 — Right actions ── */}
          <div className="hidden shrink-0 items-center justify-end gap-2 lg:flex">

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
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <span className="h-5 w-px bg-border" aria-hidden="true" />

            {/* Auth skeleton */}
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
                    <div className="flex items-center gap-3 border-b px-4 py-3">
                      <AvatarCircle size="lg" />
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-text-primary">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-text-muted">{user.email}</p>
                      </div>
                    </div>
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
                        onClick={() => { setProfileOpen(false); setLogoutOpen(true); }}
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

          {/* ── Mobile Controls (replaces col 2+3) ── */}
          <div className="col-span-2 flex items-center justify-end gap-1 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={
                "flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-hover " +
                focusRing
              }
            >
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
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
          <nav className="border-t bg-surface lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto max-w-[1600px] space-y-1 px-4 py-3">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={
                      "flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-base font-medium transition-colors " +
                      focusRing +
                      (active
                        ? " bg-brand font-semibold text-on-brand"
                        : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
                    }
                  >
                    {link.label}
                    {active && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-on-brand opacity-75" />
                    )}
                  </Link>
                );
              })}

              <div className="my-2 h-px bg-border" />

              {!isPending && user && (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-surface-hover px-4 py-3">
                    <AvatarCircle size="lg" />
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-text-primary">{user.name}</p>
                      <p className="truncate text-sm text-text-muted">{user.email}</p>
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
