import { IconSparkle } from "@/components/icons";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Qualfi experience"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4 text-fg"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="grid-bg pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative grid h-14 w-14 place-items-center rounded-full border border-brand-cyan/35 bg-brand-cyan/12 text-brand-cyan shadow-[0_0_30px_var(--brand-cyan-glow)]">
          <span className="animate-ping-soft absolute h-9 w-9 rounded-full bg-brand-cyan/30" />
          <IconSparkle className="h-6 w-6 animate-spin-slow" />
        </div>
        <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cyan">
          INITIALISING QUALFI ENGINE
        </p>
        <div className="mt-3 h-1.5 w-44 overflow-hidden rounded-full bg-surface-2">
          <div className="animate-loader-bar h-full rounded-full bg-linear-to-r from-brand-deep via-brand to-brand-cyan" />
        </div>
      </div>
    </div>
  );
}
