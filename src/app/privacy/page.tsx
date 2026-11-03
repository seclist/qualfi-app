import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Qualfi collects, uses, and protects personal data in compliance with UK GDPR.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div id="top" className="relative min-h-screen overflow-x-clip">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-40">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-cyan hover:underline"
          >
            ← Back to Qualfi
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-brand-cyan">
            Legal &amp; Compliance
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: October 2026</p>
        </div>

        <div className="card space-y-8 p-7 sm:p-10 text-sm leading-relaxed text-muted">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-fg">1. Overview</h2>
            <p>
              Qualfi (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) builds interactive diagnostic micro tools and lead
              qualification software for fitness coaches and service businesses in the United Kingdom. We
              are committed to protecting your privacy and handling your personal data transparently in
              accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection
              Act 2018.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-fg">2. Data We Collect</h2>
            <p>
              Our website is designed with privacy first. We do not use invasive contact forms or store
              your diagnostic tool inputs on our servers:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-fg">Interactive Live Demo &amp; Blueprint Configurator:</strong>{" "}
                All selections and inputs entered into our interactive macro demo and 30-second Early
                Access blueprint configurator run locally in your browser (using temporary session
                storage) and are never transmitted to or stored on our servers.
              </li>
              <li>
                <strong className="text-fg">Instagram Direct Messages (@qualfiapp):</strong> When you
                choose to claim an Early Access spot or contact us via Instagram DM, any details you
                share in that conversation are governed by Meta&apos;s privacy infrastructure and used
                solely to build your custom micro tool.
              </li>
              <li>
                <strong className="text-fg">Technical &amp; Usage Data:</strong> Standard anonymised server
                logs (such as browser type, device viewport, and page performance telemetry) required to
                keep our site secure and fast.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-fg">3. How We Use Your Data</h2>
            <p>We process your personal information strictly for the following lawful purposes:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>To review your eligibility for a Qualfi Early Access onboarding spot.</li>
              <li>
                To design, configure, and send your custom interactive tool wireframe and onboarding
                details via email or WhatsApp.
              </li>
              <li>To provide customer support, technical maintenance, and billing administration.</li>
            </ul>
            <p>
              We <strong className="text-fg">never</strong> sell, rent, or trade your personal contact
              details to third-party data brokers or marketers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-fg">4. Client Micro Tools (Processor Role)</h2>
            <p>
              When Qualfi deploys a branded micro tool for a fitness coach (&ldquo;the Client&rdquo;), the
              Client acts as the Data Controller for the leads collected through their custom tool, and
              Qualfi acts as the Data Processor. Lead notifications are transmitted securely via HTTPS to
              the Client&apos;s designated WhatsApp, SMS, or email inbox.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-fg">5. Data Retention &amp; Security</h2>
            <p>
              We retain inquiry and client records only for as long as necessary to provide our services
              and comply with UK tax and legal obligations. All data transmissions are encrypted in
              transit via TLS/HTTPS.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-fg">6. Your Rights Under UK GDPR</h2>
            <p>
              Under UK data protection law, you have the right to access, rectify, erase, restrict, or
              export your personal data, as well as the right to object to processing. For general
              inquiries, you can message us on Instagram at{" "}
              <a
                href="https://instagram.com/qualfiapp"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-cyan hover:underline"
              >
                @qualfiapp
              </a>
              . For formal data protection or legal requests, please email{" "}
              <a
                href="mailto:scalixvip@gmail.com"
                className="font-semibold text-brand-cyan hover:underline"
              >
                scalixvip@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

