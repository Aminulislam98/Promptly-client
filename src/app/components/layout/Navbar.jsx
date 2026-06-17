"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

// Desktop actions
const ghostBtn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-3 text-base font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
  focusRing;
const primaryBtn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-brand px-4 text-base font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.98] " +
  focusRing;
const iconBtn =
  "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
  focusRing;

// Mobile drawer actions (full-width, paired)
const outlineBlock =
  "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border text-base font-medium text-text-primary transition-colors duration-150 hover:bg-surface-hover " +
  focusRing;
const primaryBlock =
  "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.98] " +
  focusRing;

// Pass isLoggedIn={true} to show Dashboard + Logout instead of Login + Register.
export function Navbar({ name = "Promptly", isLoggedIn = false }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(null);

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

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const ThemeButton = () => (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={iconBtn}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-surface">
      <div className="mx-auto flex w-full h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + website name */}
        <Link
          href="/"
          aria-label={`${name} home`}
          className={"flex items-center gap-2 rounded-md " + focusRing}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand">
            <Command className="h-5 w-5 text-on-brand" />
          </span>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            {name}
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "inline-flex h-16 items-center border-b-2 px-4 text-base transition-colors duration-150 " +
                focusRing +
                (isActive(link.href)
                  ? " border-brand font-semibold text-text-primary"
                  : " border-transparent font-medium text-text-secondary hover:text-text-primary")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1 lg:flex">
          <ThemeButton />
          <span className="mx-2 h-6 w-px bg-border" aria-hidden="true" />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className={ghostBtn}>
                <LayoutDashboard className="h-5 w-5" /> Dashboard
              </Link>
              <button type="button" className={ghostBtn}>
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={ghostBtn}>
                <LogIn className="h-5 w-5" /> Login
              </Link>
              <Link href="/register" className={primaryBtn}>
                <UserPlus className="h-5 w-5" /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeButton />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={iconBtn}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="bg-surface lg:hidden" aria-label="Mobile">
          <ul className="px-3 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={
                    "flex min-h-[44px] items-center border-l-2 px-3 text-base transition-colors duration-150 " +
                    focusRing +
                    (isActive(link.href)
                      ? " border-brand font-semibold text-text-primary"
                      : " border-transparent font-medium text-text-secondary hover:text-text-primary")
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t px-4 py-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className={outlineBlock}
                >
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={outlineBlock}
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={outlineBlock}
                >
                  <LogIn className="h-5 w-5" /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={primaryBlock}
                >
                  <UserPlus className="h-5 w-5" /> Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
