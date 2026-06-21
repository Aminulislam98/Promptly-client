"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Flag,
  BarChart2,
  ShieldCheck,
  UserCheck,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const ADMIN_PAGE_TITLES = {
  "/admin": "Admin Analytics | Promptly",
  "/admin/users": "Manage Users | Promptly",
  "/admin/prompts": "Manage Prompts | Promptly",
  "/admin/payments": "All Payments | Promptly",
  "/admin/reported": "Reported Prompts | Promptly",
  "/admin/creator-requests": "Creator Requests | Promptly",
  "/admin/profile": "Admin Profile | Promptly",
};

const ADMIN_LINKS = [
  { href: "/admin", label: "Analytics", icon: BarChart2, exact: true },
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/prompts", label: "All Prompts", icon: FileText },
  { href: "/admin/payments", label: "All Payments", icon: CreditCard },
  { href: "/admin/reported", label: "Reported Prompts", icon: Flag },
  { href: "/admin/creator-requests", label: "Creator Requests", icon: UserCheck },
  { href: "/admin/profile", label: "My Profile", icon: User },
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
        "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-all duration-150 " +
        focusRing +
        (isActive
          ? " bg-brand text-on-brand"
          : " text-text-secondary hover:bg-surface-hover hover:text-text-primary")
      }
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-on-brand" />
      )}
      <Icon className="h-5 w-5 shrink-0" />
      {expanded && <span className="truncate">{link.label}</span>}
    </Link>
  );
}

function BottomTabBar() {
  const pathname = usePathname();
  const TABS = ADMIN_LINKS.slice(0, 4).concat(ADMIN_LINKS[ADMIN_LINKS.length - 1]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-surface px-2 py-1 lg:hidden"
      aria-label="Admin mobile navigation"
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

export default function AdminLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.title = ADMIN_PAGE_TITLES[pathname] || "Admin | Promptly";
  }, [pathname]);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login");
      return;
    }
    if (session.user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) return null;
  if (session.user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-page-bg ">
      {/* Desktop sidebar */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={
          "fixed left-0 top-16 hidden h-[calc(100vh-4rem)] flex-col border-r bg-surface transition-all duration-200 lg:flex " +
          (expanded ? "w-64" : "w-20")
        }
      >
        {/* Admin identity */}
        <Link
          href="/admin/profile"
          className={
            "flex items-center gap-3 border-b px-4 py-4 transition-colors hover:bg-surface-hover " +
            (expanded ? "justify-start" : "justify-center")
          }
        >
          <div className="relative shrink-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-base font-bold text-on-brand">
              {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-surface bg-brand">
              <ShieldCheck className="h-2.5 w-2.5 text-on-brand" />
            </span>
          </div>
          {expanded && (
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-text-primary">
                {session?.user?.name || "Admin"}
              </p>
              <p className="truncate text-sm text-text-muted">
                Admin
              </p>
            </div>
          )}
        </Link>

        {/* Nav links */}
        <nav
          className="flex flex-col gap-1 p-3 pt-4"
          aria-label="Admin navigation"
        >
          {ADMIN_LINKS.map((link) => (
            <SidebarLink key={link.href} link={link} expanded={expanded} />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={
          "flex-1 pb-24 transition-all duration-200 lg:pb-8 " +
          (expanded ? "lg:ml-64" : "lg:ml-20")
        }
      >
        <div className="p-4 sm:p-6">{children}</div>
      </main>

      <BottomTabBar />
    </div>
  );
}
