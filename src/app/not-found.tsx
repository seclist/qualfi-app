import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { IconArrowRight, IconSparkle } from "@/components/icons";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The requested Qualfi page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div id="top" className="relative flex min-h-screen flex-col justify-between overflow-x-clip">
      <div className="hero-glow pointer-events-none fixed inset-0" />
      <div className="grid-bg pointer-events-none fixed inset-0" />

      <Nav />

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-28 sm:px-6 text-center">
        <div className="card w-full p-8 sm:p-12">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
            <IconSparkle className="h-3.5 w-3.5" />
            <span>ERROR 404 · ROUTE NOT FOUND</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-fg sm:text-6xl">
            Diagnostic link{" "}
            <span className="serif text-shimmer font-normal italic">not found.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-[15px]">
            The page or bio-link diagnostic you are looking for may have moved or no longer exists.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold active:scale-[0.98]"
            >
              <span>Return to Qualfi Home</span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/#demo"
              className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:border-brand-cyan/50"
            >
              <span>Try Interactive Demo</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
