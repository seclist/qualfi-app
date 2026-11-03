"use client";

import { useRef, type MouseEvent } from "react";
import { IconArrowRight, IconBolt, IconLock, IconWhatsApp } from "./icons";

const macros = [
  { label: "Protein", grams: 175, pct: 33, color: "bg-brand-cyan" },
  { label: "Carbs", grams: 185, pct: 35, color: "bg-brand" },
  { label: "Fat", grams: 75, pct: 32, color: "bg-brand-deep" },
];

const sampleExercises = [
  "Barbell Bench Press — 4 × 6–8",
  "Seated Cable Row — 3 × 8–10",
  "Overhead DB Press — 3 × 10",
];

/** Interactive 3D-tilt hero device mirroring the updated MacroDemo UI + live WhatsApp lead alert. */
export function PhoneMockup() {
  const frameRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
  };

  const handleMouseLeave = () => {
    const el = frameRef.current;
    if (!el) return;
    el.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div
      className="relative mx-auto w-[294px] sm:w-[322px] select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient aura */}
      <div className="animate-aurora pointer-events-none absolute -inset-16 rounded-full bg-brand-cyan/20 blur-3xl" />

      {/* Floating telemetry chip — Left (Matches Coach View Intent Score) */}
      <div className="animate-float pointer-events-none absolute -left-24 top-[26%] z-30 hidden items-center gap-2.5 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl sm:flex">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-brand-cyan" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-cyan" />
        </span>
        <div className="leading-tight">
          <p className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-brand-cyan">
            INTENT SCORE
          </p>
          <p className="text-sm font-bold text-fg tabular-nums">
            96<span className="text-muted">/100</span> · <span className="text-brand-cyan">Hot</span>
          </p>
        </div>
      </div>

      {/* Floating telemetry chip — Right (Matches Coach View WhatsApp Push) */}
      <div className="animate-float-delayed pointer-events-none absolute -right-20 bottom-[16%] z-30 hidden items-center gap-2.5 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl sm:flex">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-whatsapp/15 text-whatsapp">
          <IconBolt className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-whatsapp">
            WHATSAPP PUSH
          </p>
          <p className="text-sm font-bold text-fg tabular-nums">1.8s latency</p>
        </div>
      </div>

      {/* 3D Tilt Titanium OLED Chassis */}
      <div
        ref={frameRef}
        className="relative rounded-[50px] border border-slate-300/80 bg-linear-to-b from-[#1c2636] to-[#090d14] p-[9px] shadow-[0_40px_100px_-25px_rgba(0,180,210,0.3)] transition-transform duration-300 ease-out dark:border-white/14 dark:shadow-[0_50px_120px_-30px_rgba(0,210,220,0.38)]"
      >
        <div className="relative h-[612px] overflow-hidden rounded-[42px] bg-linear-to-b from-[#0b131e] via-[#080f18] to-[#05080e]">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-3 z-40 flex h-[24px] w-[94px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80 animate-pulse" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pt-3.5 text-[11px] font-semibold text-white/80">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="font-mono text-[9px] text-brand-cyan">5G</span>
              <span className="h-2 w-3.5 rounded-[2px] border border-white/70 bg-white/80" />
            </span>
          </div>

          {/* Sliding WhatsApp Lead Engine Notification (Matches MacroDemo Coach View) */}
          <div className="animate-notify absolute inset-x-2.5 top-11 z-30 rounded-[20px] border border-white/12 bg-[#111c26]/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-whatsapp text-white shadow-sm">
                <IconWhatsApp className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11.5px] font-semibold text-white">Qualfi Lead Engine</p>
                  <span className="rounded-full border border-brand-cyan/35 bg-brand-cyan/15 px-2 py-0.5 font-mono text-[9px] font-bold text-brand-cyan">
                    Hot · 96/100
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-white/85">
                  <strong className="text-white">Sophie</strong>{" "}
                  <span className="font-mono text-brand-cyan">@sophie.trains</span> · 2,130 kcal ·
                  4d/wk Upper/Lower
                </p>
              </div>
            </div>
          </div>

          {/* Updated Demo Header inside Phone (Matches MacroDemo Top Telemetry Bar) */}
          <div className="mt-4 border-b border-white/8 bg-white/[0.02] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-brand-cyan to-brand-deep text-xs font-bold text-[#02131a]">
                  A
                </span>
                <div className="leading-tight">
                  <p className="text-[12.5px] font-semibold text-white">Coach Alex</p>
                  <p className="text-[10px] text-white/55">60-second macro &amp; split diagnostic</p>
                </div>
              </div>
              <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/12 px-2.5 py-0.5 font-mono text-[9.5px] font-bold text-brand-cyan">
                UNLOCKED
              </span>
            </div>
          </div>

          {/* Full-bleed Progress Line */}
          <div className="h-[2.5px] w-full bg-white/8">
            <div className="h-full w-full bg-linear-to-r from-brand-deep via-brand to-brand-cyan" />
          </div>

          {/* Updated Results Body (Matches MacroDemo Step 4 Results) */}
          <div className="space-y-3 px-4 pt-3.5">
            {/* Cyan-Tinted Daily Target Card */}
            <div className="rounded-2xl border border-brand-cyan/30 bg-brand-cyan/[0.08] p-3.5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-cyan">
                  Daily Target
                </p>
                <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[9.5px] font-semibold text-brand-cyan">
                  -0.5 kg/wk
                </span>
              </div>
              <p className="mt-1 text-[32px] font-bold leading-none tracking-[-0.04em] text-white tabular-nums">
                2,130<span className="ml-1 text-xs font-medium text-white/55">kcal</span>
              </p>
              <p className="mt-1.5 text-[11px] font-medium text-white/65">
                Fat Loss · 4d/wk · Upper / Lower
              </p>
            </div>

            {/* Macros Card */}
            <div className="space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
              {macros.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-white/65">{m.label}</span>
                    <span className="font-mono font-bold text-white tabular-nums">{m.grams}g</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/8">
                    <div
                      className={`animate-bar h-full rounded-full ${m.color}`}
                      style={{ width: `${m.pct * 2.3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Gated Day 1 · Upper Body Session Card (Matches MacroDemo Blueprint Gate) */}
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-white/55">
                  Day 1 · Upper Body Session
                </p>
                <span className="font-mono text-[9.5px] text-brand-cyan">4-Week Progression</span>
              </div>

              <ul className="mt-2 space-y-1 text-[11px] text-white/80 blur-[4px]">
                {sampleExercises.map((ex) => (
                  <li key={ex} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-brand-cyan" />
                    {ex}
                  </li>
                ))}
              </ul>

              <div className="absolute inset-x-0 bottom-0 top-7 flex flex-col items-center justify-center bg-[#09111b]/88 px-3 backdrop-blur-[3px]">
                <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-white">
                  <IconLock className="h-3.5 w-3.5 text-brand-cyan" />
                  <span>Unlock 4-week plan &amp; fire coach alert</span>
                </div>
                <span className="mt-1 rounded-full bg-brand-cyan/15 px-2 py-0.5 font-mono text-[9px] font-bold text-brand-cyan">
                  PRE-FILLED DEMO BELOW
                </span>
              </div>
            </div>

            {/* Interactive Relay-Arrow CTA to Scroll to Demo */}
            <a
              href="#demo"
              className="btn-primary group flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-center text-[12px] font-semibold active:scale-[0.98]"
            >
              <span>Send Plan &amp; Ping Coach</span>
              <span className="relative grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-black/15 dark:bg-[#02131a]/20">
                <IconArrowRight className="h-3 w-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4 group-hover:opacity-0" />
                <IconArrowRight className="absolute h-3 w-3 -translate-x-4 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
