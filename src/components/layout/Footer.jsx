"use client";

import Link from "next/link";
import { Command, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

// --- Icons defined inside the file ---
function XIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// --- Data constants ---
const SOCIALS = [
  { label: "Promptly on X", href: "https://x.com", Icon: XIcon },
  { label: "Promptly on GitHub", href: "https://github.com", Icon: GitHubIcon },
  {
    label: "Promptly on LinkedIn",
    href: "https://linkedin.com",
    Icon: LinkedInIcon,
  },
];

const PRODUCT_BASE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export function Footer({ name = "Promptly" }) {
  const year = new Date().getFullYear();
  const { data: session } = authClient.useSession();
  const isPremium = session?.user?.isPremium === true;
  const pathname = usePathname();

  // Admin control panel has its own layout — footer would be hidden behind the fixed sidebar
  if (pathname?.startsWith("/admin")) return null;

  const COLUMNS = [
    {
      title: "Product",
      links: [
        ...PRODUCT_BASE_LINKS,
        isPremium
          ? { href: "/dashboard", label: "My Dashboard", premium: true }
          : { href: "/payment", label: "Go Premium" },
      ],
    },
    { title: "Company", links: COMPANY_LINKS },
    { title: "Legal", links: LEGAL_LINKS },
  ];

  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className={
                "inline-flex w-fit items-center gap-2 rounded-md " + focusRing
              }
              aria-label={`${name} home`}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand">
                <Command className="h-5 w-5 text-on-brand" />
              </span>
              <span className="text-lg font-bold tracking-tight text-text-primary">
                {name}
              </span>
            </Link>
            <p className="max-w-prose text-sm leading-relaxed text-text-secondary">
              Discover, share, and master AI prompts for ChatGPT, Gemini,
              Claude, Midjourney, and more.
            </p>
            <ul className="flex items-center gap-1" aria-label="Social links">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={
                      "inline-flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary " +
                      focusRing
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-1">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={
                        "inline-flex h-9 items-center gap-1.5 text-sm font-medium transition-colors duration-150 " +
                        focusRing +
                        (link.premium
                          ? " text-success hover:text-success"
                          : " text-text-secondary hover:text-text-primary")
                      }
                    >
                      {link.premium && (
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                      )}
                      {link.label}
                      {link.premium && (
                        <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-xs font-semibold text-success">
                          Active
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            © {year} {name}. All rights reserved.
          </p>
          <p className="text-sm text-text-secondary">
            Built for creators, powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
