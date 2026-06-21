export const metadata = {
  title: "Privacy Policy – Promptly",
  description: "How Promptly collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "21 June 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <section className="border-b bg-surface py-12">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1 text-base font-semibold text-brand">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-text-primary">
            Privacy Policy
          </h1>
          <p className="mt-2 text-base text-text-muted">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose-custom flex flex-col gap-10">

            <article>
              <h2 className="text-xl font-bold text-text-primary">1. Who we are</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                Promptly (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Promptly platform at
                promptly.ai. We are committed to protecting your privacy and
                handling your data transparently.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">2. Information we collect</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                We collect information you provide directly to us when you create
                an account, submit prompts, or contact support. This includes your
                name, email address, and any content you upload to the platform.
                We also collect usage data automatically — such as pages visited,
                features used, and device information — through standard server
                logs and analytics tools.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">3. How we use your information</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                We use the information we collect to provide and improve the
                Promptly service, process payments, send transactional emails
                (such as account confirmations and receipts), and respond to your
                support requests. We do not sell your personal information to
                third parties.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">4. Payments</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                Payment processing is handled by Stripe. We do not store your
                full card number or CVV on our servers. Stripe&apos;s privacy policy
                applies to all payment transactions.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">5. Cookies</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                We use cookies and similar technologies to maintain your session,
                remember your preferences (such as theme), and analyse usage
                patterns. You may disable cookies in your browser settings, but
                some features of the platform may not function correctly.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">6. Data retention</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                We retain your account information for as long as your account is
                active. If you request deletion of your account, we will remove
                your personal data within 30 days, except where we are required
                to retain it for legal or financial compliance purposes.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">7. Your rights</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                Depending on your location, you may have the right to access,
                correct, or delete the personal information we hold about you.
                To exercise these rights, please contact us at
                privacy@promptly.ai. We will respond to all requests within 30
                days.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">8. Changes to this policy</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                We may update this Privacy Policy from time to time. When we do,
                we will revise the &quot;Last updated&quot; date at the top of this page
                and, where appropriate, notify you by email. Your continued use
                of the platform after changes are posted constitutes your
                acceptance of the updated policy.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">9. Contact</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                If you have questions about this Privacy Policy, please contact
                us at{" "}
                <a
                  href="mailto:privacy@promptly.ai"
                  className="font-medium text-brand hover:underline"
                >
                  privacy@promptly.ai
                </a>
                .
              </p>
            </article>

          </div>
        </div>
      </section>
    </main>
  );
}
