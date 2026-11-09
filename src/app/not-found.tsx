import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found (404)",
  description:
    "The page you are looking for could not be found. Explore the live 60-second qualfi diagnostic demo or request your custom fitness bio funnel.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-[#faf7f2] px-6 py-20 text-center text-[#121316] font-sans selection:bg-[#d9532f] selection:text-white"
    >
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 shadow-[0_20px_50px_rgba(18,19,22,0.06)]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d9532f]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d9532f]">
          Error 404
        </span>

        <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-[#121316]">
          This link isn&apos;t live{" "}
          <span className="italic font-normal text-[#d9532f]">yet.</span>
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[#52555f]">
          The page or bio funnel you requested doesn&apos;t exist at this address. Test our live 60-second diagnostic demo or reserve your custom coach handle below.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/#funnel"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#d9532f] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#b83e1d] transition-colors"
          >
            <span>Get Your Custom Bio Funnel</span>
            <span>→</span>
          </Link>

          <Link
            href="/"
            className="flex min-h-[48px] w-full items-center justify-center rounded-full border border-stone-200 bg-[#faf7f2] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#121316] hover:border-[#d9532f] hover:text-[#d9532f] transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
