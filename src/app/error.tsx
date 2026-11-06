"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { IconArrowRight, IconBolt } from "@/components/icons";
import { Nav } from "@/components/Nav";

export default function ErrorPage({
  error,
  retry,
  reset,
}: {
  error: unknown;
  retry: () => void;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Qualfi 500 Route Error]", error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;

  const handleRecover = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    }
  };

  return (
    <div id="top" className="relative flex min-h-screen flex-col justify-between overflow-x-clip">
      <div className="hero-glow pointer-events-none fixed inset-0" />
      <div className="grid-bg pointer-events-none fixed inset-0" />

      <Nav />

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-28 sm:px-6 text-center">
        <div className="card w-full p-8 sm:p-12">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
            <IconBolt className="h-3.5 w-3.5" />
            <span>ERROR 500 · INTERNAL SERVER / RUNTIME EXCEPTION</span>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-5xl">
            Something interrupted{" "}
            <span className="serif text-shimmer font-normal italic">the engine.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-[15px]">
            An unexpected server or rendering exception occurred. Our safeguard boundary caught the
            fault before it could affect your session.
          </p>

          {digest ? (
            <p className="mt-3 font-mono text-[11px] text-muted-soft">
              Diagnostic Digest: {digest}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleRecover}
              className="btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer active:scale-[0.98]"
            >
              <span>Retry Request</span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </button>

            <Link
              href="/"
              className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:border-brand-cyan/50"
            >
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
