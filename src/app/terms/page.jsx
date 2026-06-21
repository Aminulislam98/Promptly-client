export const metadata = {
  title: "Terms of Use – Promptly",
  description: "The terms and conditions governing your use of the Promptly platform.",
};

const LAST_UPDATED = "21 June 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <section className="border-b bg-surface py-12">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1 text-base font-semibold text-brand">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-text-primary">
            Terms of Use
          </h1>
          <p className="mt-2 text-base text-text-muted">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">

            <article>
              <h2 className="text-xl font-bold text-text-primary">1. Acceptance of terms</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                By accessing or using Promptly (&quot;the platform&quot;), you agree to be
                bound by these Terms of Use. If you do not agree with any part of
                these terms, you may not use the platform.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">2. Accounts</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                You must provide accurate information when creating an account. You
                are responsible for maintaining the confidentiality of your login
                credentials and for all activity that occurs under your account.
                You must be at least 13 years old to use the platform.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">3. User content</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                You retain ownership of any prompts or content you submit to
                Promptly. By submitting content, you grant Promptly a
                non-exclusive, worldwide, royalty-free licence to display,
                distribute, and promote that content within the platform. You are
                solely responsible for ensuring your content does not infringe
                third-party rights or violate any applicable law.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">4. Prohibited conduct</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                You agree not to: submit content that is unlawful, harmful,
                defamatory, or infringes third-party intellectual property; attempt
                to gain unauthorised access to the platform or other users&apos;
                accounts; use automated tools to scrape or bulk-copy content
                without written permission; or resell or redistribute premium
                content outside of the platform.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">5. Premium access</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                The Premium plan is a one-time payment that grants lifetime access
                to private and premium prompts. Payments are non-refundable except
                where required by applicable law. Promptly reserves the right to
                modify, expand, or limit premium features with reasonable notice.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">6. Intellectual property</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                The Promptly brand, logo, design, and all platform-provided content
                are the intellectual property of Promptly. You may not use these
                without our prior written consent.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">7. Disclaimer of warranties</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                The platform is provided &quot;as is&quot; without warranties of any kind,
                express or implied. We do not guarantee that the platform will be
                uninterrupted, error-free, or that any particular prompt will
                produce a specific result when used with an AI tool.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">8. Limitation of liability</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                To the fullest extent permitted by law, Promptly shall not be
                liable for any indirect, incidental, special, or consequential
                damages arising out of your use of the platform, even if we have
                been advised of the possibility of such damages.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">9. Termination</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                We reserve the right to suspend or terminate your account at any
                time if you violate these Terms of Use or engage in conduct that
                we determine, in our sole discretion, is harmful to the platform
                or its users.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">10. Changes to these terms</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                We may update these terms from time to time. Continued use of the
                platform after changes are posted constitutes your acceptance of
                the updated terms. We will notify registered users by email of any
                material changes.
              </p>
            </article>

            <article>
              <h2 className="text-xl font-bold text-text-primary">11. Contact</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                For questions about these Terms of Use, please contact us at{" "}
                <a
                  href="mailto:legal@promptly.ai"
                  className="font-medium text-brand hover:underline"
                >
                  legal@promptly.ai
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
