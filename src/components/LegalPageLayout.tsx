import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated = "October 2026",
  children,
}: LegalPageLayoutProps) {
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
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>
        </div>

        <div className="card space-y-8 p-7 sm:p-10 text-sm leading-relaxed text-muted">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
