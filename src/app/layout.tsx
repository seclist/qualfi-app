import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { SiteQolEnhancements } from "@/components/SiteQolEnhancements";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qualfi.app"),
  title: {
    default:
      "qualfi | 60-Second Bio Funnel & Lead Qualification for Fitness Coaches",
    template: "%s | qualfi",
  },
  description:
    "Replace your dead Linktree and 'DM me READY' with a custom 60-second macro & training split diagnostic. Pre-qualify fitness leads (0–100 intent score) and route buyers to WhatsApp in <2s.",
  keywords: [
    "fitness coach bio link",
    "personal trainer lead generation",
    "macro calculator funnel for coaches",
    "replace linktree for fitness coaches",
    "online fitness coaching funnel",
    "client pre-qualification micro-tool",
    "whatsapp lead routing for personal trainers",
    "qualfi",
  ],
  authors: [{ name: "qualfi", url: "https://www.qualfi.app" }],
  creator: "qualfi",
  publisher: "qualfi",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.qualfi.app",
    siteName: "qualfi",
    title:
      "qualfi — Turn Followers Into Pre-Qualified Coaching Buyers in 60s",
    description:
      "Bespoke 60-second macro & workout split diagnostic micro-tools for fitness coaches. 0–100 buyer intent scoring and <2s WhatsApp routing. Live in your bio in 72 hours.",
  },
  twitter: {
    card: "summary_large_image",
    title: "qualfi — 60-Second Bio Funnel for Fitness Coaches",
    description:
      "Kill the Linktree. Pre-qualify fitness leads in 60 seconds with custom macro & training split diagnostics and <2s WhatsApp routing.",
    creator: "@qualfiapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.qualfi.app/#organization",
      name: "qualfi",
      url: "https://www.qualfi.app",
      logo: {
        "@type": "ImageObject",
        url: "https://www.qualfi.app/icon.svg",
      },
      sameAs: ["https://www.instagram.com/qualfiapp/"],
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@qualfi.com",
        contactType: "customer support",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.qualfi.app/#website",
      url: "https://www.qualfi.app",
      name: "qualfi",
      publisher: {
        "@id": "https://www.qualfi.app/#organization",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.qualfi.app/#software",
      name: "qualfi 60-Second Bio Diagnostic Micro-Tool",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Bespoke branded 60-second macro & training split diagnostic micro-tools for fitness coaches and personal trainers, featuring 0–100 algorithmic lead pre-qualification and <2s WhatsApp lead dispatch.",
      provider: {
        "@id": "https://www.qualfi.app/#organization",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.qualfi.app/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why do fitness coaches replace Linktree with a qualfi diagnostic micro-tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Static Linktrees and 'DM me READY' posts force followers to read walls of text or fill out cold forms, causing over 80% drop-off. A qualfi micro-tool calculates custom daily calories, protein/carb/fat macros, and an optimal training split in 60 seconds in exchange for the prospect's WhatsApp number.",
          },
        },
        {
          "@type": "Question",
          name: "How does qualfi pre-qualify coaching leads and route them to WhatsApp?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Each prospect is scored from 0 to 100 on purchase intent based on their goal, training frequency, primary struggle, and commitment timeline. Verified leads are dispatched directly to the coach's WhatsApp in under 2 seconds while buying motivation is at its peak.",
          },
        },
        {
          "@type": "Question",
          name: "How fast is a custom qualfi bio funnel built and delivered?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every qualfi diagnostic micro-tool is custom-branded, calibrated to your coaching methodology, and delivered live for your Instagram or TikTok bio within 72 hours.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${jakarta.variable} antialiased selection:bg-[#d9532f] selection:text-white`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        <SiteQolEnhancements />
        {/* WCAG 2.4.1 Bypass Blocks: Skip to Main Content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#d9532f] focus:px-5 focus:py-2.5 focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#121316] focus:ring-offset-2"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
