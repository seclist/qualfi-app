import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | qualfi",
  description: "Privacy policy and data processing standards for qualfi diagnostic micro-tools.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] px-6 py-16 sm:py-24 text-[#121316] font-sans selection:bg-[#d9532f] selection:text-white">
      <div className="mx-auto max-w-2xl">
        {/* Navigation & Brand */}
        <div className="mb-12 flex items-center justify-between border-b border-stone-200/80 pb-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-sans text-xl font-black tracking-tight text-[#121316] hover:opacity-80 transition-opacity"
          >
            <span>qualfi</span>
            <span className="h-2 w-2 rounded-full bg-[#d9532f]" />
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-[#52555f] hover:text-[#d9532f] transition-colors"
          >
            ← Back to qualfi
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9532f]">
            Legal & Compliance
          </span>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-light text-[#121316] leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-[#52555f]">
            Effective Date: November 2026 · Compliant with GDPR (EU/UK) and CCPA/CPRA
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed text-[#52555f]">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              1. Overview
            </h2>
            <p>
              qualfi provides bespoke diagnostic bio funnels and prequalification micro-tools for coaches and service providers. This Privacy Policy describes how we collect, process, and protect your information when you interact with our website or complete an interactive diagnostic.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              2. Data We Collect
            </h2>
            <p>
              When you submit a funnel request or complete a coach diagnostic, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#121316]">Contact Details:</strong> Your name, Instagram handle, and mobile phone/WhatsApp number.
              </li>
              <li>
                <strong className="text-[#121316]">Diagnostic Inputs:</strong> Your coaching goals, training availability, primary bottlenecks, and target milestones.
              </li>
              <li>
                <strong className="text-[#121316]">Functional Storage:</strong> Local device progress saved to resume incomplete sessions (never used for third-party ad tracking).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              3. Purpose & Legal Basis for Processing
            </h2>
            <p>
              Under GDPR Article 6, we process your personal data based on legitimate interest and explicit consent:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To calibrate and generate your custom bio funnel or nutrition blueprint.</li>
              <li>To route verified diagnostic deliverables directly to your WhatsApp or mobile device.</li>
              <li>To verify handle availability and prevent automated spam submissions.</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to data brokers or third-party advertisers under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              4. WhatsApp & Webhook Integrations
            </h2>
            <p>
              When you submit an enquiry, your information may be transmitted via end-to-end encrypted webhooks to WhatsApp to deliver your live link within 72 hours. Communication is strictly transactional related to your request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              5. Your Rights (GDPR & CCPA)
            </h2>
            <p>
              Depending on your jurisdiction, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access and receive a copy of your personal data.</li>
              <li>Request immediate correction or permanent deletion of your data.</li>
              <li>Withdraw consent or opt out of communications at any time.</li>
            </ul>
            <p>
              To exercise any of these rights, contact our data protection team directly at{" "}
              <span className="font-medium text-[#121316]">hello@qualfi.com</span>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              6. Data Retention
            </h2>
            <p>
              We retain contact details only for as long as necessary to complete your funnel delivery and provide customer support, after which records are anonymized or purged.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-14 border-t border-stone-200/80 pt-6 text-xs text-[#52555f] flex items-center justify-between">
          <span>qualfi © 2026 · All rights reserved</span>
          <Link href="/" className="font-semibold text-[#d9532f] hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
