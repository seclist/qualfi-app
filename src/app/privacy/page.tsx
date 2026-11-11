import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy, GDPR/PECR compliance, and data processing standards for qualfi diagnostic micro-tools.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | qualfi",
    description:
      "Privacy policy, GDPR/PECR compliance, and data processing standards for qualfi diagnostic micro-tools.",
    url: "https://www.qualfi.app/privacy",
    type: "website",
  },
};

const privacyBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.qualfi.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Privacy Policy",
      item: "https://www.qualfi.app/privacy",
    },
  ],
};

function safeJsonLdStringify(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#faf7f2] px-6 py-16 sm:py-24 text-[#121316] font-sans selection:bg-[#d9532f] selection:text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(privacyBreadcrumbJsonLd),
        }}
      />
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
            Effective Date: November 2026 · Compliant with UK GDPR, EU GDPR (Regulation (EU) 2016/679), and PECR
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed text-[#52555f]">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              1. Data Controller Identity & Contact
            </h2>
            <p>
              This website and the qualfi diagnostic services are operated by the founders of <strong>qualfi</strong> as an unincorporated commercial venture based in the United Kingdom (formal limited company registration currently in progress).
            </p>
            <p>
              Under the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018, the designated Data Protection Contact for qualfi can be reached at:
            </p>
            <div className="rounded-2xl border border-stone-200 bg-[#faf7f2] p-4 text-xs font-mono text-[#121316] space-y-1">
              <div><strong>Designated Privacy Lead:</strong> Data Protection Lead, qualfi</div>
              <div><strong>Email:</strong> scalixvip@gmail.com</div>
              <div><strong>Location:</strong> London / United Kingdom</div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              2. Data We Collect
            </h2>
            <p>
              When you submit a bio funnel enquiry or test a coach diagnostic micro-tool, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#121316]">Contact Data:</strong> Your name, Instagram handle, and mobile phone/WhatsApp number.
              </li>
              <li>
                <strong className="text-[#121316]">Coaching & Business Inputs:</strong> Coaching focus, monthly client volume goals, and current conversion bottlenecks.
              </li>
              <li>
                <strong className="text-[#121316]">Health & Physiological Inputs (Special Category Data):</strong> Current bodyweight, age, training frequency, dietary consistency struggles, and metabolic slowdown markers used to compute caloric targets and workout splits.
              </li>
              <li>
                <strong className="text-[#121316]">Technical & Telemetry Data:</strong> IP address (processed strictly for rate limiting and network security), device category (Mobile/Desktop), and timestamp of submission.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              3. Lawful Basis for Processing (GDPR Articles 6 & 9)
            </h2>
            <p>
              We process personal data only when a valid statutory legal basis exists:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[#121316]">Contractual Necessity (Article 6(1)(b)):</strong> To configure, calibrate, and build your requested bespoke bio funnel preview and calculate your sample nutrition and workout split targets.
              </li>
              <li>
                <strong className="text-[#121316]">Explicit Consent (Article 6(1)(a) & Article 9(2)(a)):</strong> To process physiological health/dietary metrics and to transmit your preview link and onboarding assistance to your personal WhatsApp number.
              </li>
              <li>
                <strong className="text-[#121316]">Legitimate Interests (Article 6(1)(f)):</strong> To enforce rate limiting, prevent automated bot spam, verify handle availability, and secure our web infrastructure.
              </li>
            </ul>
            <p>
              We never sell, rent, or trade your personal data to brokers or third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              4. Third-Party Sub-Processors & International Transfers
            </h2>
            <p>
              We utilize trusted cloud sub-processors to deliver our services. Where data is transferred outside the UK/EEA, transfers are safeguarded under Standard Contractual Clauses (SCCs), UK International Data Transfer Addenda, or adequacy regulations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#121316]">Vercel Inc. (USA):</strong> Cloud hosting, Edge routing, and serverless compute infrastructure (covered by Data Processing Addendum and SCCs).
              </li>
              <li>
                <strong className="text-[#121316]">Google LLC (USA):</strong> Cloud spreadsheet storage and API integration for lead management (covered by Google Cloud Data Processing Terms).
              </li>
              <li>
                <strong className="text-[#121316]">Meta Platforms Inc. / WhatsApp (USA/EU):</strong> Transactional messaging channel used to dispatch your working bio link preview.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              5. Data Retention Schedule
            </h2>
            <p>
              Contact details and funnel enquiry submissions are retained in our lead management system for a maximum of <strong>90 days</strong> from the date of submission, after which inactive records are permanently purged or anonymized, unless an active service engagement is executed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              6. Your Statutory Rights (GDPR & CCPA)
            </h2>
            <p>
              Under applicable data protection legislation, you hold the following enforceable rights:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Right of Access (Article 15):</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification (Article 16):</strong> Request correction of inaccurate personal data.</li>
              <li><strong>Right to Erasure (Article 17):</strong> Request permanent deletion of your data from our systems.</li>
              <li><strong>Right to Restriction of Processing (Article 18):</strong> Restrict how your data is processed.</li>
              <li><strong>Right to Data Portability (Article 20):</strong> Receive your personal data in a machine-readable JSON/CSV format.</li>
              <li><strong>Right to Object (Article 21):</strong> Object to processing based on legitimate interests or direct marketing at any time.</li>
              <li><strong>Right to Withdraw Consent (Article 7(3)):</strong> Withdraw consent at any time without affecting the lawfulness of processing prior to withdrawal.</li>
            </ul>
            <p>
              To exercise any statutory right, email our team at{" "}
              <a href="mailto:scalixvip@gmail.com" className="font-medium text-[#d9532f] underline underline-offset-2">
                scalixvip@gmail.com
              </a>. We respond to all verified requests within 30 days free of charge.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              7. Right to Lodge a Complaint with a Supervisory Authority
            </h2>
            <p>
              If you believe our processing of your personal data infringes data protection laws, you have the statutory right under GDPR Article 77 to lodge a formal complaint with a supervisory authority:
            </p>
            <div className="rounded-2xl border border-stone-200 bg-[#faf7f2] p-4 text-xs font-mono text-[#121316] space-y-1">
              <div><strong>United Kingdom:</strong> Information Commissioner&rsquo;s Office (ICO)</div>
              <div><strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#d9532f] underline">ico.org.uk</a></div>
              <div><strong>Helpline:</strong> 0303 123 1113</div>
              <div className="pt-1 text-[#52555f] font-sans">EU residents may lodge a complaint with their local National Data Protection Authority.</div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-stone-200/80 pt-6 text-xs text-[#52555f] flex flex-wrap items-center justify-between gap-4">
          <span>qualfi © 2026 · All rights reserved</span>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/qualfiapp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d9532f] transition-colors"
            >
              @qualfiapp
            </a>
            <Link href="/" className="font-semibold text-[#d9532f] hover:underline">
              Return to Homepage
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
