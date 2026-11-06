import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SITE_URL, THEME_STORAGE_KEY } from "@/lib/constants";
import { WabiSabiGrain } from "@/lib/wabi-motion";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Qualfi — Interactive Micro Tools That Turn Followers Into Qualified Clients",
    template: "%s | Qualfi",
  },
  description:
    "Qualfi builds bespoke, branded diagnostic micro tools for fitness coaches. Give visitors instant calorie & split results, pre-qualify leads by algorithm, and get WhatsApp alerts in under 2 seconds.",
  keywords: [
    "fitness coach lead generation",
    "online fitness coach funnel",
    "macro calculator lead magnet",
    "interactive lead generation tools",
    "personal trainer bio link",
    "Qualfi",
    "WhatsApp lead alerts",
  ],
  authors: [{ name: "Qualfi" }],
  creator: "Qualfi",
  publisher: "Qualfi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Qualfi",
    title: "Qualfi — Turn Scrollers Into Pre-Qualified Coaching Clients",
    description:
      "Replace dead Linktrees and static forms with a 60-second custom fitness diagnostic. 5.2x higher conversion + instant WhatsApp lead alerts in < 2 seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qualfi — Interactive Micro Tools for Fitness Coaches",
    description:
      "Give visitors instant macro & training split results, score every lead 0–100, and receive hot leads on WhatsApp in under 2 seconds.",
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#12110f" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')==='light'?'light':'dark',d=document.documentElement;d.classList.toggle('dark',t==='dark');d.setAttribute('data-theme',t);d.style.colorScheme=t}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      data-theme="dark"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-bg text-fg transition-colors duration-300">
        <WabiSabiGrain />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
