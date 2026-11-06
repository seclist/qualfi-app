"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
  reset,
}: {
  error: unknown;
  retry: () => void;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Qualfi Global Fatal Error]", error);
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
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <html lang="en-GB" data-theme="dark" className="dark h-full antialiased">
      <head>
        <title>System Recovery | Qualfi</title>
      </head>
      <body className="flex min-h-full items-center justify-center bg-bg px-4 py-16 text-fg">
        <div className="card max-w-lg w-full p-8 sm:p-10 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-cyan">
            CRITICAL SAFEGUARD · SYSTEM RECOVERY
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            Application recovery triggered
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted">
            A root-level exception was intercepted by the global error boundary. Click below to
            re-initialize the application safely.
          </p>
          {digest ? (
            <p className="mt-2 font-mono text-[11px] text-muted-soft">Digest: {digest}</p>
          ) : null}
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleRecover}
              className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold cursor-pointer"
            >
              Re-initialize Qualfi
            </button>
            <Link
              href="/"
              className="btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
            >
              Reload Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
