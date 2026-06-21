import Link from "next/link";
import { Rss, Bell, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog – Promptly",
  description: "Tips, guides, and news about AI prompting from the Promptly team.",
};

const COMING_SOON_TOPICS = [
  "How to write prompts that actually work",
  "Top 10 ChatGPT prompts for marketers",
  "Midjourney v6 prompting guide",
  "Claude vs ChatGPT: which prompts work best where",
  "Building a prompt library for your team",
  "The anatomy of a great system prompt",
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      {/* Header */}
      <section className="border-b bg-surface py-16">
        <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1 text-base font-semibold text-brand">
            Blog
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-text-primary lg:text-4xl">
            AI prompting, made clear
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Guides, tips, and news about getting the most out of every AI tool.
            Written by the Promptly team and community.
          </p>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border bg-surface p-10 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light">
              <Rss className="h-7 w-7 text-brand" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-text-primary">
              Coming soon
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-text-secondary">
              We are writing our first articles right now. Here is a preview of
              what is coming:
            </p>
            <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
              {COMING_SOON_TOPICS.map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-2 text-base text-text-secondary"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  {topic}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/prompts"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.97]"
              >
                Browse prompts instead <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
