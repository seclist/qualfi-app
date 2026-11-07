import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "qualfi",
  description:
    "Bespoke branded diagnostic micro-tools for fitness coaches. Prequalify followers in 60 seconds with 0 to 100 intent scoring and <2s WhatsApp routing.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${jakarta.variable} antialiased`}>
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
