"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { CountUp } from "./CountUp";
import { PhoneMockup } from "./PhoneMockup";
import {
  IconArrowRight,
  IconBolt,
  IconFilter,
  IconInstagram,
  IconSparkle,
  IconWhatsApp,
} from "./icons";

gsap.registerPlugin(ScrollTrigger);

const PIPELINE_NODES = [
  {
    step: "01",
    title: "Bio Link Tap",
    metric: "0.3s Load",
    detail: "Follower taps your Instagram or TikTok bio link — opens natively with zero lag.",
    icon: IconInstagram,
  },
  {
    step: "02",
    title: "Value-First Diagnostic",
    metric: "9.4% Opt-In",
    detail: "They answer 4 quick taps to unlock their custom calories, macros & training split.",
    icon: IconSparkle,
  },
  {
    step: "03",
    title: "Algorithmic Scoring",
    metric: "0–100 Grade",
    detail: "Engine scores their urgency, training commitment & coaching readiness automatically.",
    icon: IconFilter,
  },
  {
    step: "04",
    title: "Instant Lead Dispatch",
    metric: "< 1.8s Push",
    detail: "Hot buyers hit your phone immediately while they are still looking at their results.",
    icon: IconWhatsApp,
  },
];

const BENCHMARKS = [
  {
    end: 5.2,
    decimals: 1,
    prefix: "",
    suffix: "×",
    label: "Higher conversion vs Linktree & static forms",
    tag: "RECIPROCITY ENGINE",
  },
  {
    end: 1.8,
    decimals: 1,
    prefix: "< ",
    suffix: "s",
    label: "Real-time lead dossier delivered to your phone",
    tag: "SPEED TO LEAD",
  },
  {
    end: 100,
    decimals: 0,
    prefix: "",
    suffix: "%",
    label: "Pre-qualified by goal urgency & availability",
    tag: "ZERO TYRE-KICKERS",
  },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-hero-item",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.08,
        },
      );

      if (pipelineRef.current) {
        gsap.fromTo(
          ".gsap-pipeline-card",
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: pipelineRef.current,
              start: "top 84%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden pb-14 pt-24 sm:pb-20 sm:pt-28 md:pb-28 md:pt-36"
    >
      {/* Layered atmospheric backdrop */}
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* ───────────── Top Architectural Split ───────────── */}
        <div className="grid items-center gap-10 sm:gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Left 7 Columns: Editorial Typography & CTAs */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="gsap-hero-item inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start">
              <span className="hidden font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cyan sm:inline">
                01 / THE SHIFT
              </span>
              <span className="hidden h-3.5 w-px bg-line-strong sm:inline-block" />
              <a
                id="hero-offer-badge"
                href="#claim"
                className="group inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 py-1.5 pl-3 pr-3.5 text-[11.5px] sm:py-1 sm:pl-2.5 sm:pr-3 sm:text-xs font-medium text-fg backdrop-blur transition hover:border-brand-cyan/60 hover:bg-brand-cyan/15"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-brand-cyan" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cyan" />
                </span>
                <span className="font-semibold text-brand-cyan">Early Access</span>
                <span className="text-muted">£99 setup — normally £500</span>
                <IconArrowRight className="h-3 w-3 text-brand-cyan transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <h1 className="mt-5 sm:mt-6 text-[38px] font-semibold leading-[1.03] sm:leading-[1.01] tracking-[-0.04em] sm:tracking-[-0.045em] sm:text-[64px] lg:text-[76px]">
              <span className="block overflow-hidden pb-1">
                <span className="animate-line-up block text-fade">
                  Turn bio scrollers into
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span
                  className="animate-line-up serif text-shimmer block pr-1 sm:pr-2 text-[1.08em] sm:text-[1.1em] font-normal italic tracking-[-0.02em]"
                  style={{ animationDelay: "120ms" }}
                >
                  pre-qualified clients.
                </span>
              </span>
            </h1>

            <p className="gsap-hero-item mx-auto mt-4 sm:mt-6 max-w-xl text-[15px] sm:text-[16.5px] leading-relaxed text-muted md:text-[18.5px] lg:mx-0">
              Linktrees and contact forms make followers read walls of text and bounce. Qualfi
              builds bespoke <span className="font-medium text-fg">60-second diagnostic micro tools</span>{" "}
              that give visitors instant calorie &amp; split results, score buyer intent 0–100, and
              ping hot leads to your phone in under 2 seconds.
            </p>

            {/* Action Row */}
            <div className="gsap-hero-item mt-7 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 lg:justify-start">
              <a
                id="hero-cta-demo"
                href="#demo"
                className="btn-primary group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full py-3.5 pl-7 pr-4 text-[15px] font-semibold active:scale-[0.98]"
              >
                <span>Test the live demo</span>
                <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-black/15 dark:bg-[#02131a]/20 transition-transform duration-300 group-hover:scale-105">
                  <IconArrowRight className="h-3.5 w-3.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5 group-hover:opacity-0" />
                  <IconArrowRight className="absolute h-3.5 w-3.5 -translate-x-5 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
              </a>

              <a
                id="hero-cta-apply"
                href="#claim"
                className="btn-ghost group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full px-6 py-3.5 sm:py-4 text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/50 hover:shadow-[0_12px_30px_-12px_var(--brand-cyan-glow)] active:scale-[0.98]"
              >
                <span>Unlock £99 Early Access</span>
                <IconArrowRight className="h-3.5 w-3.5 text-brand-cyan transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </a>
            </div>

            {/* 3 Architectural Proof Pillars */}
            <div className="gsap-hero-item mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4 border-t border-line pt-6 sm:pt-8 text-center sm:text-left">
              {BENCHMARKS.map((b) => (
                <div
                  key={b.tag}
                  className="group rounded-2xl border border-line bg-surface/50 p-2.5 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <p className="font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.06em] sm:tracking-[0.16em] text-brand-cyan truncate">
                    {b.tag}
                  </p>
                  <p className="mt-1 text-xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                    <CountUp
                      end={b.end}
                      decimals={b.decimals}
                      prefix={b.prefix}
                      suffix={b.suffix}
                    />
                  </p>
                  <p className="mt-1 text-[10.5px] sm:text-xs leading-snug text-muted">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Interactive 3D OLED Device */}
          <div className="gsap-hero-item relative lg:col-span-5">
            <PhoneMockup />
          </div>
        </div>

        {/* ───────────── Live 4-Node Signal Pipeline Bento ───────────── */}
        <div
          ref={pipelineRef}
          className="card relative mt-12 overflow-hidden p-4 sm:mt-20 sm:p-8 md:mt-24 md:p-10"
        >
          <div className="relative z-10 flex flex-col justify-between gap-3 border-b border-line pb-4 sm:pb-6 sm:flex-row sm:items-center">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="mt-0.5 sm:mt-0 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-cyan/15 text-brand-cyan">
                <IconBolt className="h-4 w-4" />
              </span>
              <div>
                <p className="font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-brand-cyan">
                  LIVE TELEMETRY PIPELINE
                </p>
                <h2 className="text-[15px] sm:text-lg font-bold leading-snug tracking-tight text-fg">
                  How a casual profile click becomes a pre-scored buyer in 60 seconds
                </h2>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-2/80 px-3 py-1 font-mono text-[10px] sm:text-[11px] font-semibold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              STANDALONE BIO LINK OR WEBSITE EMBED
            </span>
          </div>

          {/* 4-Stage Pipeline Grid with Traveling Light Packet */}
          <div className="relative z-10 mt-5 sm:mt-8">
            {/* Desktop Horizontal Signal Track */}
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-7 hidden h-px bg-line-strong lg:block">
              <span className="animate-travel-x absolute -top-[3px] h-2 w-16 rounded-full bg-linear-to-r from-transparent via-brand-cyan to-white shadow-[0_0_16px_var(--brand-cyan)]" />
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PIPELINE_NODES.map((node, i) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.step}
                    className="gsap-pipeline-card group relative rounded-2xl border border-line bg-surface/85 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/45 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="animate-node grid h-9 w-9 place-items-center rounded-xl border border-brand-cyan/35 bg-surface-2 text-brand-cyan transition-colors group-hover:bg-brand-cyan group-hover:text-[#02131a]"
                        style={{ animationDelay: `${i * 0.9}s` }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-brand-cyan">
                        {node.metric}
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-xs font-bold text-muted-soft">
                        {node.step}
                      </span>
                      <h3 className="text-[15px] font-bold tracking-tight text-fg">
                        {node.title}
                      </h3>
                    </div>

                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      {node.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
