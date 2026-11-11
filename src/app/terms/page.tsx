import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions of service for qualfi diagnostic micro-tools and custom bio funnels.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | qualfi",
    description:
      "Terms and conditions of service for qualfi diagnostic micro-tools and custom bio funnels.",
    url: "https://www.qualfi.app/terms",
    type: "website",
  },
};

const termsBreadcrumbJsonLd = {
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
      name: "Terms of Service",
      item: "https://www.qualfi.app/terms",
    },
  ],
};

function safeJsonLdStringify(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

export default function TermsPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#faf7f2] px-6 py-16 sm:py-24 text-[#121316] font-sans selection:bg-[#d9532f] selection:text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(termsBreadcrumbJsonLd),
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
            Service Agreement
          </span>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-light text-[#121316] leading-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-[#52555f]">
            Effective Date: November 2026
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed text-[#52555f]">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing qualfi.app or utilizing any qualfi diagnostic micro-tool, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              2. Description of Services
            </h2>
            <p>
              qualfi designs, develops, and deploys high-converting diagnostic web applications and bio links for coaches and service businesses. Our 72-hour delivery timeline applies to standard customized micro-tool configurations upon submission and confirmation of diagnostic requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              3. User Responsibilities & Acceptable Use
            </h2>
            <p>
              When requesting or deploying a qualfi tool, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide accurate contact details (name, handle, and WhatsApp/phone number).</li>
              <li>Not use qualfi tools for unlawful, fraudulent, defamatory, or abusive activities.</li>
              <li>Ensure any health, nutrition, or training formulas configured in your tool comply with applicable industry licensing and fitness regulations in your jurisdiction.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              4. Intellectual Property
            </h2>
            <p>
              The qualfi software, architecture, design assets, and Wabi-Sabi brand identity remain the exclusive property of qualfi. Client branding, logos, and custom copy provided by the coach remain the intellectual property of the respective coach.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              5. Disclaimer of Warranties
            </h2>
            <p>
              qualfi diagnostic tools are provided on an &quot;as is&quot; and &quot;as available&quot; basis. Diagnostic calculations (such as caloric targets, macronutrient grams, or training splits) are intended for educational and informational fitness planning, and do not constitute formal medical or clinical advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-normal text-[#121316]">
              6. Contact Information
            </h2>
            <p>
              For any questions regarding these Terms of Service, contact us at{" "}
              <a href="mailto:scalixvip@gmail.com" className="font-medium text-[#d9532f] underline underline-offset-2">
                scalixvip@gmail.com
              </a>.
            </p>
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
