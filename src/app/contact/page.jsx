import { Mail, MessageSquare, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Contact – Promptly",
  description: "Get in touch with the Promptly team for support, partnerships, or general enquiries.",
};

const CHANNELS = [
  {
    Icon: Mail,
    title: "Email us",
    body: "For general enquiries, partnerships, or billing questions.",
    cta: "hello@promptly.ai",
    href: "mailto:hello@promptly.ai",
  },
  {
    Icon: MessageSquare,
    title: "Community",
    body: "Join our Discord for instant help from the Promptly community and team.",
    cta: "Join Discord →",
    href: "https://discord.gg/promptly",
  },
  {
    Icon: Clock,
    title: "Response time",
    body: "We typically respond to all emails within 24 hours on business days.",
    cta: null,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      {/* Header */}
      <section className="border-b bg-surface py-16">
        <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1 text-base font-semibold text-brand">
            Contact
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-text-primary lg:text-4xl">
            Get in touch
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Have a question, a feature request, or just want to say hello?
            We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Channels */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CHANNELS.map(({ Icon, title, body, cta, href }) => (
              <div key={title} className="flex flex-col rounded-xl border bg-surface p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light">
                  <Icon className="h-5 w-5 text-brand" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-text-primary">{title}</h2>
                <p className="mt-2 flex-1 text-base leading-relaxed text-text-secondary">{body}</p>
                {cta && href && (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-1 text-base font-semibold text-brand hover:underline"
                  >
                    {cta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple contact form */}
      <section className="border-t bg-surface py-16">
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary">Send a message</h2>
          <p className="mt-1 text-base text-text-secondary">
            Fill in the form and we will get back to you as soon as possible.
          </p>
          <form
            action="mailto:hello@promptly.ai"
            method="dialog"
            className="mt-8 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-name"
                className="text-base font-medium text-text-primary"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="h-11 w-full rounded-xl border bg-page-bg px-4 text-base text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-email"
                className="text-base font-medium text-text-primary"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border bg-page-bg px-4 text-base text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-subject"
                className="text-base font-medium text-text-primary"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                required
                placeholder="What is this about?"
                className="h-11 w-full rounded-xl border bg-page-bg px-4 text-base text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-message"
                className="text-base font-medium text-text-primary"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder="Tell us more…"
                className="w-full resize-none rounded-xl border bg-page-bg px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Send message <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
