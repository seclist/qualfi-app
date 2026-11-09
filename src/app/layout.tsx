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
  applicationName: "qualfi",
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
    "hyrox coach lead generation",
    "qualfi",
  ],
  authors: [{ name: "qualfi", url: "https://www.qualfi.app" }],
  creator: "qualfi",
  publisher: "qualfi",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
      knowsAbout: [
        "Fitness Coaching Lead Generation",
        "Interactive Bio Funnels",
        "Macronutrient & TDEE Calculators",
        "Algorithmic Buyer Intent Scoring",
        "WhatsApp Lead Automation",
      ],
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
      inLanguage: "en-GB",
      publisher: {
        "@id": "https://www.qualfi.app/#organization",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://www.qualfi.app/#webpage",
      url: "https://www.qualfi.app",
      name: "qualfi | 60-Second Bio Funnel & Lead Qualification for Fitness Coaches",
      description:
        "Replace your dead Linktree and 'DM me READY' with a custom 60-second macro & training split diagnostic. Pre-qualify fitness leads (0–100 intent score) and route buyers to WhatsApp in <2s.",
      isPartOf: {
        "@id": "https://www.qualfi.app/#website",
      },
      about: {
        "@id": "https://www.qualfi.app/#organization",
      },
      breadcrumb: {
        "@id": "https://www.qualfi.app/#breadcrumb",
      },
      inLanguage: "en-GB",
      datePublished: "2026-11-01T00:00:00.000Z",
      dateModified: "2026-11-09T00:00:00.000Z",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.qualfi.app/#breadcrumb",
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
          name: "60-Second Interactive Demo",
          item: "https://www.qualfi.app/#demo",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Get Your Custom Bio Funnel",
          item: "https://www.qualfi.app/#funnel",
        },
      ],
    },
    {
      "@type": "Service",
      "@id": "https://www.qualfi.app/#service",
      name: "Bespoke 60-Second Bio Diagnostic Funnel for Fitness Coaches",
      serviceType: "Lead Qualification & Conversion Micro-Tool Development",
      provider: {
        "@id": "https://www.qualfi.app/#organization",
      },
      areaServed: "Worldwide",
      audience: {
        "@type": "Audience",
        audienceType:
          "Online Fitness Coaches, Personal Trainers, Hyrox & Strength Coaches",
      },
      description:
        "Custom-designed, branded 60-second macro & training split diagnostic tools deployed to your Instagram or TikTok bio within 72 hours, featuring 0–100 lead scoring and <2s WhatsApp lead dispatch.",
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
      "@type": "HowTo",
      "@id": "https://www.qualfi.app/#howto",
      name: "How a qualfi 60-Second Fitness Bio Diagnostic Converts Followers Into Clients",
      description:
        "The 4-step value-exchange funnel that replaces static Linktrees and cold DMs for fitness coaches.",
      totalTime: "PT1M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Follower Taps Your Bio Link",
          text: "Instead of a dead Linktree list, your prospect opens your branded 60-second diagnostic micro-tool (qualfi.com/@yourhandle).",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "60-Second Biometric & Goal Inputs",
          text: "The prospect selects their primary goal (fat loss, muscle, recomposition), bodyweight, age, weekly training days (2–6), and biggest struggle.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Contact Gate Unlock",
          text: "To unlock their custom daily calories, protein/carb/fat macros, and workout split, the prospect enters their name and WhatsApp number.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Instant Value Delivery & <2s WhatsApp Handshake",
          text: "The prospect receives their custom nutrition & training blueprint on screen while you receive a verified hot lead (scored 0–100) on WhatsApp in under 2 seconds.",
        },
      ],
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
        {
          "@type": "Question",
          name: "How are the daily calories and macronutrients calculated in the diagnostic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Targets are computed using the scientifically validated Mifflin-St Jeor basal metabolic rate (BMR) equation, scaled by dynamic activity multipliers (1.35x to 1.75x) across 2 to 6 weekly training sessions and 2.0–2.2g of protein per kg of bodyweight.",
          },
        },
        {
          "@type": "Question",
          name: "Can a qualfi diagnostic micro-tool work in Instagram bios, TikTok bios, and existing coaching websites?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Every qualfi build operates both as an ultra-fast standalone bio link (qualfi.com/@handle) for Instagram, TikTok, and YouTube, and as a frictionless embed inside your existing coaching website or client portal.",
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
    <html lang="en-GB">
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
