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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const ghostBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
  focusRing;
const primaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.98] " +
  focusRing;
const iconBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
  focusRing;
const outlineBlock =
  "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border text-base font-medium text-text-primary transition-colors duration-150 hover:bg-surface-hover " +
  focusRing;
const primaryBlock =
  "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-brand text-base font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.98] " +
  focusRing;

function getDashboardPath(role) {
  if (role === "admin") return "/admin";
  if (role === "creator") return "/creator";
  return "/dashboard";
}

export function Navbar({ name = "Promptly" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const dashboardPath = getDashboardPath(user?.role);

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

  const ThemeButton = ({ iconClassName = "h-4 w-4" }) => (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={iconBtn}
    >
      {theme === "dark" ? (
        <Moon className={iconClassName} />
      ) : (
        <Sun className={iconClassName} />
      )}
    </button>
  );

  const AuthDesktop = () => {
    if (isPending)
      return (
        <span className="h-10 w-32 animate-pulse rounded-md bg-surface-hover" />
      );
    if (user)
      return (
        <>
          <Link href={dashboardPath} className={ghostBtn}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <button type="button" onClick={handleLogout} className={ghostBtn}>
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </>
      );
    return (
      <>
        <Link href="/login" className={ghostBtn}>
          <LogIn className="h-4 w-4" /> Login
        </Link>
        <Link href="/register" className={primaryBtn}>
          <UserPlus className="h-4 w-4" /> Register
        </Link>
      </>
    );
  };

  const AuthMobile = () => {
    if (isPending) return null;
    if (user)
      return (
        <>
          <Link
            href={dashboardPath}
            onClick={() => setOpen(false)}
            className={outlineBlock}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <button type="button" onClick={handleLogout} className={outlineBlock}>
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </>
      );
    return (
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
    );
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
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

        {/* Desktop nav links */}
        <nav className="hidden items-center lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "inline-flex h-16 items-center border-b-2 px-4 text-sm transition-colors duration-150 " +
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
          <ThemeButton iconClassName="h-4 w-4" />
          <span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
          <AuthDesktop />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeButton iconClassName="h-5 w-5" />
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
        <nav className="border-b bg-surface lg:hidden" aria-label="Mobile">
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
            <AuthMobile />
          </div>
        </nav>
      )}
    </header>
  );
}
