"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Star,
  User,
  PlusCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const USER_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/add-prompt", label: "Add Prompt", icon: PlusCircle },
  { href: "/dashboard/my-prompts", label: "My Prompts", icon: FileText },
  { href: "/dashboard/saved", label: "Saved Prompts", icon: Bookmark },
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

function SidebarLink({ link, expanded }) {
  const pathname = usePathname();
  const isActive = link.exact
    ? pathname === link.href
    : pathname.startsWith(link.href);
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      title={!expanded ? link.label : undefined}
      className={
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors duration-150 " +
        focusRing +
        (isActive
          ? " bg-brand-light text-brand"
          : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {expanded && <span className="truncate">{link.label}</span>}
    </Link>
  );
}

function BottomTabBar() {
  const pathname = usePathname();
  const TABS = USER_LINKS.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-surface px-2 py-1 lg:hidden"
      aria-label="Mobile dashboard navigation"
    >
      {TABS.map((link) => {
        const Icon = link.icon;
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 transition-colors duration-150 " +
              focusRing +
              (isActive
                ? " text-brand"
                : " text-text-secondary hover:text-text-primary")
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">
              {link.label.split(" ")[0]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login");
      return;
    }
    if (session.user.role === "admin") {
      router.replace("/admin");
      return;
    }
    if (session.user.role === "creator") {
      router.replace("/creator");
    }
  }, [session, isPending, router]);

  // Show nothing while loading or redirecting
  if (isPending || !session?.user) return null;
  if (session.user.role === "admin" || session.user.role === "creator")
    return null;

  return (
    <div className="flex min-h-screen bg-page-bg pt-16">
      {/* Desktop collapsible sidebar */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={
          "fixed left-0 top-16 hidden h-[calc(100vh-4rem)] flex-col border-r bg-surface transition-all duration-200 lg:flex " +
          (expanded ? "w-56" : "w-16")
        }
      >
        <nav
          className="flex flex-col gap-1 overflow-hidden p-2 pt-4"
          aria-label="Dashboard navigation"
        >
          {USER_LINKS.map((link) => (
            <SidebarLink key={link.href} link={link} expanded={expanded} />
          ))}
        </nav>
      </aside>

      {/* Page content */}
      <main
        className={
          "flex-1 pb-24 transition-all duration-200 lg:pb-8 " +
          (expanded ? "lg:ml-56" : "lg:ml-16")
        }
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <BottomTabBar />
    </div>
  );
}
