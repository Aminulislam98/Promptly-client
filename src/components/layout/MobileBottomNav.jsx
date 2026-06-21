"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  PlusCircle,
  Bookmark,
  User,
  LogIn,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1";

function NavTab({ href, icon: Icon, label, active, accent = false }) {
  return (
    <Link
      href={href}
      className={
        "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-150 " +
        focusRing +
        (accent
          ? " text-on-brand"
          : active
          ? " text-brand"
          : " text-text-secondary hover:text-text-primary")
      }
      aria-current={active ? "page" : undefined}
    >
      {accent ? (
        /* centre "Add" button — elevated circle */
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand shadow-md shadow-brand/30 active:scale-95 transition-transform duration-100">
          <Icon className="h-5 w-5 text-on-brand" strokeWidth={2.5} />
        </span>
      ) : (
        <>
          <Icon
            className={"h-5 w-5 transition-transform duration-150 " + (active ? "scale-110" : "")}
            strokeWidth={active ? 2.5 : 2}
          />
          <span className="text-[10px] font-medium leading-none">{label}</span>
        </>
      )}
    </Link>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;
  // Hide on auth pages (clean login/register)
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-surface lg:hidden"
      aria-label="Mobile navigation"
    >
      {/* Safe area spacer for phones with home indicators */}
      <div className="flex h-14 items-stretch">
        <NavTab href="/" icon={Home} label="Home" active={isActive("/")} />
        <NavTab
          href="/prompts"
          icon={LayoutGrid}
          label="Explore"
          active={isActive("/prompts") && !pathname.startsWith("/prompts/")}
        />

        {user ? (
          <>
            {/* Elevated Add button */}
            <NavTab
              href="/dashboard/add-prompt"
              icon={PlusCircle}
              label="Add"
              active={false}
              accent
            />
            <NavTab
              href="/dashboard/saved"
              icon={Bookmark}
              label="Saved"
              active={isActive("/dashboard/saved")}
            />
            <NavTab
              href="/dashboard/profile"
              icon={User}
              label="Profile"
              active={
                isActive("/dashboard/profile") ||
                (isActive("/dashboard") &&
                  !isActive("/dashboard/saved") &&
                  !isActive("/dashboard/add-prompt") &&
                  !isActive("/dashboard/my-prompts"))
              }
            />
          </>
        ) : (
          <NavTab href="/login" icon={LogIn} label="Login" active={isActive("/login")} />
        )}
      </div>

      {/* iPhone home indicator spacer */}
      <div className="h-safe-area-inset-bottom bg-surface" />
    </nav>
  );
}
