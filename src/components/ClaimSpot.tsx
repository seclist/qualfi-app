"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconInstagram,
  IconSparkle,
} from "./icons";

gsap.registerPlugin(ScrollTrigger);

type Step = 0 | 1 | 2 | "analyzing" | "result";

const FITNESS_MODELS = [
  {
    id: "fat-loss",
    label: "Fat Loss & Transformation",
    tag: "Macros & Deficit",
    icon: "🔥",
    toolConcept: "60s Macro & Body Recomp Diagnostic",
  },
  {
    id: "hypertrophy",
    label: "Muscle & Hypertrophy",
    tag: "Splits & Surplus",
    icon: "🏋️‍♂️",
    toolConcept: "Strength Split & Lean Surplus Diagnostic",
  },
  {
    id: "lifestyle",
    label: "Nutrition & Habits",
    tag: "TDEE & Accountability",
    icon: "🥗",
    toolConcept: "Metabolic Rate & Nutrition Diagnostic",
  },
  {
    id: "hybrid",
    label: "1-on-1 PT + Online",
    tag: "Hybrid Coaching",
    icon: "⚡",
    toolConcept: "Training Readiness & Split Diagnostic",
  },
];

const CURRENT_SETUPS = [
  {
    id: "linktree",
    label: "Linktree / Stan Store / Beacons",
    short: "Linktree / Bio Directory",
    tag: "1.5% avg opt-in",
  },
  {
    id: "google-form",
    label: "Google Form / Typeform",
    short: "Static Application Form",
    tag: "75% drop-off",
  },
  {
    id: "dm-ready",
    label: "“DM me READY” on Instagram",
    short: "Manual DM Qualification",
    tag: "Manual sorting",
  },
  {
    id: "website",
    label: "Static Website / No Bio Link",
    short: "Static Landing Page",
    tag: "Passive traffic",
  },
];

const INTAKE_GOALS = [
  {
    id: "3-5",
    label: "3 – 5 new clients / month",
    sub: "Consistent baseline growth",
    revenue: "+£1,000/mo",
  },
  {
    id: "6-10",
    label: "6 – 10 new clients / month",
    sub: "Full-time roster momentum",
    revenue: "+£2,250/mo",
  },
  {
    id: "10-plus",
    label: "10+ new clients / month",
    sub: "High-volume automated funnel",
    revenue: "+£4,000+/mo",
  },
];

const INCLUDED_PILLS = [
  "Custom Branded UI",
  "0.3s Bio Link + Embed",
  "0–100 Lead Scoring",
  "< 2s WhatsApp Alerts",
];

const INSTAGRAM_DM_URL = "https://ig.me/m/qualfiapp";
const STORAGE_KEY = "qualfi-blueprint-v1";

export function ClaimSpot() {
  const sectionRef = useRef<HTMLElement>(null);
  const hydratedRef = useRef(false);
  const [step, setStep] = useState<Step>(0);
  const [exiting, setExiting] = useState(false);
  const [model, setModel] = useState<string | null>(null);
  const [setup, setSetup] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            step?: Step;
            model?: string | null;
            setup?: string | null;
            goal?: string | null;
          };
          if (parsed.model) setModel(parsed.model);
          if (parsed.setup) setSetup(parsed.setup);
          if (parsed.goal) setGoal(parsed.goal);
          if (parsed.step !== undefined) {
            setStep(parsed.step === "analyzing" ? "result" : parsed.step);
          }
        }
      } catch {
        // Ignore sessionStorage errors in restricted browser contexts
      } finally {
        hydratedRef.current = true;
      }
    });

    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || step === "analyzing") return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, model, setup, goal }),
      );
    } catch {
      // Ignore sessionStorage write errors
    }
  }, [step, model, setup, goal]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-enquire-reveal",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const selectedModel = FITNESS_MODELS.find((m) => m.id === model);
  const selectedSetup = CURRENT_SETUPS.find((s) => s.id === setup);
  const selectedGoal = INTAKE_GOALS.find((g) => g.id === goal);

  const finalModel = selectedModel ?? FITNESS_MODELS[0];
  const finalGoal = selectedGoal ?? INTAKE_GOALS[1];

  const transitionTo = (nextStep: Step, delayBeforeExit = 140) => {
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setStep(nextStep);
        setExiting(false);
      }, 180);
    }, delayBeforeExit);
  };

  const chooseModel = (id: string) => {
    if (exiting) return;
    setModel(id);
    transitionTo(1, 140);
  };

  const chooseSetup = (id: string) => {
    if (exiting) return;
    setSetup(id);
    transitionTo(2, 140);
  };

  const chooseGoal = (id: string) => {
    if (exiting) return;
    setGoal(id);
    transitionTo("analyzing", 140);
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setStep("result");
        setExiting(false);
      }, 200);
    }, 1100);
  };

  const jumpToStep = (target: Step) => {
    if (exiting || target === step) return;
    setExiting(true);
    setTimeout(() => {
      setStep(target);
      setExiting(false);
    }, 160);
  };

  const restart = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore sessionStorage errors
      }
      setModel(null);
      setSetup(null);
      setGoal(null);
      setStep(0);
      setExiting(false);
    }, 180);
  };

  const progressPct =
    step === 0 ? 33 : step === 1 ? 66 : step === 2 ? 90 : 100;

  return (
    <section ref={sectionRef} id="claim" className="relative py-16 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 -top-36 h-[640px] bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(0,210,220,0.16),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* ───────────── Architectural Section Header ───────────── */}
        <div className="gsap-enquire-reveal flex flex-col justify-between gap-4 sm:gap-6 border-b border-line pb-6 sm:pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-brand-cyan">
                03 / ENQUIRE
              </span>
              <span className="h-3.5 w-px bg-line-strong" />
              <span className="font-mono text-[11px] sm:text-xs text-muted">COHORT 01 · 2 OF 5 SPOTS OPEN</span>
            </div>
            <h2 className="mt-2.5 sm:mt-3 text-[30px] font-semibold leading-[1.06] sm:leading-[1.04] tracking-[-0.035em] text-fg sm:text-5xl">
              Configure your tool &amp;{" "}
              <span className="serif text-shimmer font-normal italic">claim your spot.</span>
            </h2>
          </div>

          <p className="max-w-md text-[13.5px] sm:text-sm leading-relaxed text-muted">
            Zero contact forms. Tap 3 quick answers below to generate your custom tool blueprint and
            lock in the £99 Early Access rate via Instagram DM.
          </p>
        </div>

        {/* ───────────── Asymmetric 12-Col Spec + Configurator Grid ───────────── */}
        <div className="gsap-enquire-reveal mt-8 sm:mt-12 grid gap-5 sm:gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Left 4 Cols on Desktop (Second on Mobile): Live Architectural Telemetry Ledger */}
          <div className="card order-2 lg:order-1 flex flex-col justify-between p-5 sm:p-8 lg:col-span-4">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-3.5 sm:pb-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                  LIVE SPEC LEDGER
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-cyan/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-brand-cyan">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  SPOT #04
                </span>
              </div>

              <dl className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 text-xs">
                <div className="rounded-xl border border-line bg-surface-2/50 p-3 sm:p-3.5 transition-all">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    01 · Coaching Focus
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-fg">
                    {selectedModel ? selectedModel.label : "Awaiting selection…"}
                  </dd>
                </div>

                <div className="rounded-xl border border-line bg-surface-2/50 p-3 sm:p-3.5 transition-all">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    02 · Replacing Funnel
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-fg">
                    {selectedSetup ? selectedSetup.short : "Awaiting selection…"}
                  </dd>
                </div>

                <div className="rounded-xl border border-line bg-surface-2/50 p-3 sm:p-3.5 transition-all">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    03 · Monthly Client Target
                  </dt>
                  <dd className="mt-1 flex items-center justify-between text-sm font-semibold text-fg">
                    <span>{selectedGoal ? selectedGoal.label : "Awaiting selection…"}</span>
                    {selectedGoal ? (
                      <span className="font-mono text-xs font-bold text-brand-cyan">
                        {selectedGoal.revenue}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 sm:mt-6 rounded-2xl border border-brand-cyan/25 bg-brand-cyan/[0.06] p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-brand-cyan">
                  EARLY ACCESS RATE
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                  SAVE £401
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-fg">£99</span>
                <span className="text-sm text-muted-soft line-through">£500</span>
                <span className="text-xs text-muted">one-off · £0/mo</span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
                Designed, coded &amp; deployed on your bio link in 10 days.
              </p>
            </div>
          </div>

          {/* Right 8 Cols on Desktop (First on Mobile): Interactive Configurator & Blueprint Card */}
          <div className="card order-1 lg:order-2 relative flex flex-col justify-between overflow-hidden p-0 lg:col-span-8">
            {/* Top Progress Line */}
            <div className="h-[3px] w-full bg-line">
              <div
                className="h-full bg-linear-to-r from-brand-deep via-brand to-brand-cyan transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="relative z-10 flex min-h-[340px] sm:min-h-[450px] flex-col justify-between p-4 sm:p-9 md:p-10">
              {/* Stepper Header */}
              {typeof step === "number" ? (
                <div className="flex items-center justify-between border-b border-line pb-3.5 sm:pb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[0, 1, 2].map((idx) => {
                      const active = step === idx;
                      const done = step > idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!done}
                          onClick={() => done && jumpToStep(idx as Step)}
                          aria-label={`Step ${idx + 1}`}
                          className={`flex h-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-300 ${
                            active
                              ? "w-12 sm:w-14 bg-brand-cyan text-white dark:text-[#02131a] shadow-xs"
                              : done
                                ? "w-7 bg-brand-cyan/20 text-brand-cyan cursor-pointer hover:bg-brand-cyan/30"
                                : "w-7 bg-surface-2 text-muted-soft"
                          }`}
                        >
                          {done ? <IconCheck className="h-3.5 w-3.5" /> : `0${idx + 1}`}
                        </button>
                      );
                    })}
                    <span className="ml-1.5 hidden text-xs font-medium text-muted sm:inline">
                      Step {step + 1} of 3
                    </span>
                  </div>

                  <span className="font-mono text-[10px] sm:text-[11px] text-muted-soft">
                    ZERO FORMS · 30s CHECK
                  </span>
                </div>
              ) : null}

              {/* Stage Container with Smooth Crossfade */}
              <div
                className={`my-auto flex flex-1 flex-col justify-center transition-all duration-200 ease-out ${
                  exiting
                    ? "pointer-events-none -translate-y-2 scale-[0.99] opacity-0"
                    : "translate-y-0 scale-100 opacity-100"
                }`}
              >
                {/* Step 0: Coaching Focus */}
                {step === 0 ? (
                  <div key="step-0" className="animate-step-enter pt-4 sm:pt-5">
                    <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                      QUESTION 01 · COACHING MODEL
                    </p>
                    <h3 className="mt-1 text-xl sm:text-[26px] font-bold tracking-tight text-fg">
                      What is your primary coaching focus?
                    </h3>

                    <div className="mt-4 sm:mt-6 grid gap-2.5 sm:gap-3.5 sm:grid-cols-2">
                      {FITNESS_MODELS.map((m, idx) => {
                        const active = model === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => chooseModel(m.id)}
                            style={{ animationDelay: `${idx * 40}ms` }}
                            className={`animate-ticket-item group flex items-center justify-between gap-3 rounded-2xl border p-3.5 sm:p-4.5 text-left transition-all duration-200 cursor-pointer ${
                              active
                                ? "border-brand-cyan bg-brand-cyan/12 shadow-[0_0_0_3px_var(--brand-cyan-glow)] scale-[1.01]"
                                : "border-line bg-surface hover:-translate-y-0.5 hover:border-brand-cyan/50 hover:bg-surface-2/70 active:scale-[0.99]"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
                              <span className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-xl sm:text-2xl transition-transform duration-200 group-hover:scale-105">
                                {m.icon}
                              </span>
                              <div className="min-w-0">
                                <p className="text-[14.5px] sm:text-[15px] font-semibold text-fg transition-colors group-hover:text-brand-cyan">
                                  {m.label}
                                </p>
                                <p className="mt-0.5 font-mono text-[11px] sm:text-xs text-muted">{m.tag}</p>
                              </div>
                            </div>

                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                                active
                                  ? "scale-110 border-brand-cyan bg-brand-cyan text-white dark:text-[#02131a]"
                                  : "border-line-strong group-hover:border-brand-cyan"
                              }`}
                            >
                              {active ? <IconCheck className="h-3 w-3" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Step 1: Current Bio Setup */}
                {step === 1 ? (
                  <div key="step-1" className="animate-step-enter pt-4 sm:pt-5">
                    <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                      QUESTION 02 · CURRENT FUNNEL
                    </p>
                    <h3 className="mt-1 text-xl sm:text-[26px] font-bold tracking-tight text-fg">
                      What is in your bio link right now?
                    </h3>

                    <div className="mt-4 sm:mt-6 grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                      {CURRENT_SETUPS.map((s, idx) => {
                        const active = setup === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => chooseSetup(s.id)}
                            style={{ animationDelay: `${idx * 40}ms` }}
                            className={`animate-ticket-item group flex items-center justify-between gap-3 rounded-2xl border p-3.5 sm:p-4.5 text-left transition-all duration-200 cursor-pointer ${
                              active
                                ? "border-brand-cyan bg-brand-cyan/12 shadow-[0_0_0_3px_var(--brand-cyan-glow)] scale-[1.01]"
                                : "border-line bg-surface hover:-translate-y-0.5 hover:border-brand-cyan/50 hover:bg-surface-2/70 active:scale-[0.99]"
                            }`}
                          >
                            <div>
                              <p className="text-[14.5px] sm:text-[15px] font-semibold text-fg transition-colors group-hover:text-brand-cyan">
                                {s.label}
                              </p>
                              <p className="mt-0.5 sm:mt-1 font-mono text-[11px] sm:text-xs text-muted">{s.tag}</p>
                            </div>

                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                                active
                                  ? "scale-110 border-brand-cyan bg-brand-cyan text-white dark:text-[#02131a]"
                                  : "border-line-strong group-hover:border-brand-cyan"
                              }`}
                            >
                              {active ? <IconCheck className="h-3 w-3" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 sm:mt-6 flex justify-start">
                      <button
                        type="button"
                        onClick={() => jumpToStep(0)}
                        className="py-1 text-xs font-semibold text-muted transition hover:text-fg cursor-pointer"
                      >
                        ← Back to step 1
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Step 2: Monthly Target */}
                {step === 2 ? (
                  <div key="step-2" className="animate-step-enter pt-4 sm:pt-5">
                    <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                      QUESTION 03 · MONTHLY TARGET
                    </p>
                    <h3 className="mt-1 text-xl sm:text-[26px] font-bold tracking-tight text-fg">
                      What is your monthly new client goal?
                    </h3>

                    <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3">
                      {INTAKE_GOALS.map((g, idx) => {
                        const active = goal === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => chooseGoal(g.id)}
                            style={{ animationDelay: `${idx * 40}ms` }}
                            className={`animate-ticket-item group flex w-full items-center justify-between gap-2 rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4 text-left transition-all duration-200 cursor-pointer ${
                              active
                                ? "border-brand-cyan bg-brand-cyan/12 shadow-[0_0_0_3px_var(--brand-cyan-glow)] scale-[1.01]"
                                : "border-line bg-surface hover:-translate-y-0.5 hover:border-brand-cyan/50 hover:bg-surface-2/70 active:scale-[0.99]"
                            }`}
                          >
                            <div>
                              <p className="text-[14.5px] sm:text-[15.5px] font-semibold text-fg transition-colors group-hover:text-brand-cyan">
                                {g.label}
                              </p>
                              <p className="mt-0.5 text-xs text-muted">{g.sub}</p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                              <span className="rounded-full bg-brand-cyan/15 px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs font-bold text-brand-cyan">
                                {g.revenue}
                              </span>
                              <span
                                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                                  active
                                    ? "scale-110 border-brand-cyan bg-brand-cyan text-white dark:text-[#02131a]"
                                    : "border-line-strong group-hover:border-brand-cyan"
                                }`}
                              >
                                {active ? <IconCheck className="h-3 w-3" /> : null}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 sm:mt-6 flex justify-start">
                      <button
                        type="button"
                        onClick={() => jumpToStep(1)}
                        className="py-1 text-xs font-semibold text-muted transition hover:text-fg cursor-pointer"
                      >
                        ← Back to step 2
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Analyzing Phase */}
                {step === "analyzing" ? (
                  <div key="step-analyzing" className="animate-step-enter relative overflow-hidden py-10 sm:py-14 text-center">
                    <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-brand-cyan/35 bg-brand-cyan/12 text-brand-cyan shadow-[0_0_30px_var(--brand-cyan-glow)]">
                      <span className="animate-ping-soft absolute h-10 w-10 rounded-full bg-brand-cyan/30" />
                      <IconSparkle className="h-7 w-7 animate-spin-slow" />
                    </div>
                    <p className="mt-5 sm:mt-6 text-base sm:text-lg font-bold tracking-tight text-fg">
                      Generating your custom tool blueprint…
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Configuring <span className="font-semibold text-fg">{finalModel.toolConcept}</span>
                    </p>
                    <div className="mx-auto mt-5 sm:mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-surface-2">
                      <div className="animate-loader-bar h-full rounded-full bg-linear-to-r from-brand-deep via-brand to-brand-cyan" />
                    </div>
                  </div>
                ) : null}

                {/* Result: Sleek Architectural Blueprint Card */}
                {step === "result" ? (
                  <div key="step-result" className="animate-ticket-reveal">
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-brand-cyan/30 bg-linear-to-br from-brand-cyan/[0.08] via-surface-2/80 to-surface-2">
                      <div className="grid md:grid-cols-[1fr_196px]">
                        {/* Left Main Blueprint Body */}
                        <div className="relative p-4.5 sm:p-8">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-cyan/15 px-2.5 sm:px-3 py-1 font-mono text-[10px] sm:text-[11px] font-bold text-brand-cyan">
                              <IconSparkle className="h-3.5 w-3.5" />
                              <span>BLUEPRINT READY · SPOT #04</span>
                            </div>
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] sm:text-[10.5px] font-bold text-emerald-400">
                              98% FIT MATCH
                            </span>
                          </div>

                          <h3 className="mt-3.5 sm:mt-4 text-lg sm:text-2xl font-extrabold tracking-tight text-fg">
                            {finalModel.toolConcept}
                          </h3>
                          <p className="mt-1 text-xs text-muted">
                            Tailored for <strong className="text-fg">{finalModel.label}</strong> · Projected lift{" "}
                            <strong className="font-mono text-brand-cyan">{finalGoal.revenue}</strong>
                          </p>

                          <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                            {INCLUDED_PILLS.map((pill, idx) => (
                              <span
                                key={pill}
                                style={{ animationDelay: `${120 + idx * 45}ms` }}
                                className="animate-ticket-item inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-2.5 sm:px-3 py-1 text-[11px] sm:text-[11.5px] font-medium text-fg"
                              >
                                <IconCheck className="h-3 w-3 text-brand-cyan" />
                                {pill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Early Access Rate Summary (Horizontal Row on Mobile, Vertical Column on Desktop) */}
                        <div className="flex flex-row items-center justify-between border-t border-line bg-surface/60 px-4.5 py-4 md:flex-col md:justify-center md:border-l md:border-t-0 md:p-6 md:text-center">
                          <div className="text-left md:text-center">
                            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                              EARLY ACCESS
                            </p>
                            <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[9.5px] font-bold text-emerald-400 md:hidden">
                              SAVE £401 · £0/MO
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2 md:mt-1.5 md:flex-col md:items-center md:gap-0">
                            <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-fg">
                              £99
                            </p>
                            <p className="md:mt-0.5 font-mono text-xs text-muted-soft line-through">
                              £500 std
                            </p>
                          </div>
                          <span className="mt-3 hidden rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 md:inline-block">
                            SAVE £401 · £0/MO
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Primary Instagram DM CTA */}
                    <div className="mt-5 sm:mt-6 text-center">
                      <a
                        id="claim-ig-dm-btn"
                        href={INSTAGRAM_DM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full py-3.5 sm:py-4 text-[14.5px] sm:text-[15px] font-semibold shadow-lg shadow-brand-cyan/25 active:scale-[0.99] cursor-pointer"
                      >
                        <IconInstagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        <span>Claim £99 Spot on Instagram</span>
                        <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-black/15 dark:bg-[#02131a]/20 transition-transform duration-300 group-hover:scale-105">
                          <IconArrowRight className="h-3.5 w-3.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5 group-hover:opacity-0" />
                          <IconArrowRight className="absolute h-3.5 w-3.5 -translate-x-5 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                      </a>

                      <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-2 text-xs text-muted">
                        <span>
                          Opens <strong className="text-fg">@qualfiapp</strong> DM — tap the{" "}
                          <strong className="text-brand-cyan">Early Access FAQ button</strong> inside to send.
                        </span>
                        <button
                          type="button"
                          onClick={restart}
                          className="py-1 font-medium text-muted-soft transition hover:text-fg cursor-pointer"
                        >
                          ↺ Reconfigure
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
