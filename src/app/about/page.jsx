"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Command, Users, Zap, Globe, ArrowRight, Star, LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getPrompts, getTopCreators } from "@/lib/api";

const VALUES = [
  {
    Icon: Zap,
    title: "Quality over quantity",
    body: "Every prompt in our marketplace is tested and refined by real users. We surface what actually works, not just what sounds good.",
  },
  {
    Icon: Users,
    title: "Community first",
    body: "Promptly is built around creators who share their expertise. The more you contribute, the better the platform gets for everyone.",
  },
  {
    Icon: Globe,
    title: "Open to everyone",
    body: "Thousands of free prompts are available to anyone. Premium unlocks the most powerful, professionally crafted prompts for a one-time $5 payment.",
  },
];

export default function AboutPage() {
  const { data: session } = authClient.useSession();
  const isPremium = session?.user?.isPremium === true;

  const [totalPrompts, setTotalPrompts] = useState(null);
  const [totalCreators, setTotalCreators] = useState(null);

  useEffect(() => {
    // Fetch real total prompt count
    getPrompts({ limit: 1, page: 1 })
      .then((d) => { if (d.total) setTotalPrompts(d.total); })
      .catch(() => {});

    // Fetch real creator count
    getTopCreators()
      .then((d) => {
        const creators = d.creators || d;
        if (Array.isArray(creators)) setTotalCreators(creators.length);
      })
      .catch(() => {});
  }, []);

  function fmt(n) {
    if (!n) return null;
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
    return n + "+";
  }

  const STATS = [
    {
      value: fmt(totalPrompts) || "Growing",
      label: "Prompts shared",
    },
    {
      value: fmt(totalCreators) || "Active",
      label: "Top creators",
    },
    { value: "10+", label: "AI tools covered" },
    { value: "Free", label: "To get started" },
  ];

  return (
    <main className="min-h-screen bg-page-bg">
      {/* Hero */}
      <section className="border-b bg-surface py-16 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand">
            <Command className="h-7 w-7 text-on-brand" strokeWidth={2.5} />
          </span>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-text-primary lg:text-4xl">
            About <span className="text-brand">Promptly</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            Promptly is an AI prompt sharing and marketplace platform. We make
            it easy to discover, copy, and share prompts for ChatGPT, Claude,
            Midjourney, Gemini, and every major AI tool — all in one place.
          </p>
        </div>
      </section>

      {/* Live stats */}
      <section className="border-b bg-page-bg py-12">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center bg-surface px-6 py-8 text-center"
              >
                <dt className="text-sm font-medium text-text-secondary">
                  {s.label}
                </dt>
                <dd className="mt-1 text-3xl font-black text-brand">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b bg-surface py-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary">Our mission</h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-text-secondary">
            We started Promptly because getting great results from AI tools
            takes skill and iteration — and most of that knowledge was scattered
            across forums, tweets, and Discord servers. We built a single place
            where the best prompts live, can be copied instantly, and get better
            through community feedback.
          </p>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-text-secondary">
            Whether you are a marketer looking for campaign copy, a developer
            writing code with an AI pair programmer, or a designer prompting
            Midjourney for visuals — Promptly has something for you.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-b bg-page-bg py-16">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary">
            What we believe
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {VALUES.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-xl border bg-surface p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light">
                  <Icon className="h-5 w-5 text-brand" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-text-secondary">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — changes based on premium status */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-xl px-4 text-center sm:px-6 lg:px-8">
          <Star className="mx-auto h-8 w-8 text-warning" />

          {isPremium ? (
            <>
              <h2 className="mt-4 text-2xl font-bold text-text-primary">
                You&apos;re a Premium member
              </h2>
              <p className="mt-2 text-base text-text-secondary">
                All prompts are unlocked. Keep exploring and sharing.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/prompts"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Browse prompts <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center gap-2 rounded-full border px-6 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <LayoutDashboard className="h-4 w-4" /> My Dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-2xl font-bold text-text-primary">
                Ready to explore?
              </h2>
              <p className="mt-2 text-base text-text-secondary">
                Browse thousands of free prompts or unlock everything with a
                one-time $5 payment.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/prompts"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Browse prompts <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/payment"
                  className="inline-flex h-11 items-center rounded-full border px-6 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  See Premium
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
