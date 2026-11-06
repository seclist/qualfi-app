"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { playWhatsAppPing, simulateLeadDispatch } from "@/lib/audio";
import {
  SEX_OPTIONS,
  TOTAL_DIAGNOSTIC_STEPS,
  TRAINING_DAYS,
  TYPING_DOT_DELAYS,
  WEEK_DAYS,
  type Days,
  type Phase,
  type Sex,
} from "@/lib/constants";
import { useScrollReveal } from "@/lib/gsap";
import {
  BlurCrossfadeIcon,
  EASE_IN_OUT,
  listContainerVariants,
  listRowVariants,
  OverlapTransitionStage,
  settleContainerVariants,
  settleItemVariants,
  SHARED_LAYOUT_TRANSITION,
} from "@/lib/wabi-motion";
import {
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconClock,
  IconLock,
  IconSparkle,
  IconVolume,
  IconVolumeMute,
  IconWhatsApp,
} from "./icons";
import { Slider } from "./Slider";

/* ───────────────────────── Config ───────────────────────── */

type Goal = "lose" | "build" | "recomp" | "perform";

const GOALS: readonly { id: Goal; label: string; desc: string; tag: string }[] = [
  { id: "lose", label: "Lose fat", desc: "Lean out & preserve muscle mass", tag: "20% Deficit" },
  { id: "build", label: "Build muscle", desc: "Add lean size & progressive strength", tag: "10% Surplus" },
  { id: "recomp", label: "Body recomp", desc: "Drop body fat while adding tone", tag: "Targeted Macro" },
  { id: "perform", label: "Performance", desc: "Peak conditioning for sport or event", tag: "High Output" },
];

const STRUGGLES: readonly { id: string; label: string; weight: number }[] = [
  { id: "results", label: "Not seeing results", weight: 15 },
  { id: "lost", label: "Don’t know what to do", weight: 15 },
  { id: "consistency", label: "Staying consistent", weight: 10 },
  { id: "nutrition", label: "Nutrition & cravings", weight: 10 },
  { id: "time", label: "Short on time", weight: 5 },
];

const GOAL_LABEL_MAP = new Map<Goal, string>(GOALS.map((g) => [g.id, g.label]));
const STRUGGLE_WEIGHT_MAP = new Map<string, number>(STRUGGLES.map((s) => [s.id, s.weight]));

const SPLITS: Record<Days, { name: string; days: readonly string[] }> = {
  2: { name: "Full Body A/B", days: ["Full A", "", "", "Full B", "", "", ""] },
  3: { name: "Full Body ×3", days: ["Full A", "", "Full B", "", "Full C", "", ""] },
  4: { name: "Upper / Lower", days: ["Upper", "Lower", "", "Upper", "Lower", "", ""] },
  5: { name: "Upper / Lower + PPL", days: ["Upper", "Lower", "", "Push", "Pull", "Legs", ""] },
  6: { name: "Push / Pull / Legs ×2", days: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", ""] },
};

const EXERCISES: Record<string, readonly string[]> = {
  Full: ["Back squat — 3×8", "Bench press — 3×8", "Seated row — 3×10", "Romanian deadlift — 3×10", "Plank — 3×45s"],
  Upper: ["Bench press — 4×6–8", "Bent-over row — 4×8", "Overhead press — 3×8–10", "Lat pulldown — 3×10–12", "Lateral raise — 3×12–15"],
  Lower: ["Back squat — 4×6–8", "Romanian deadlift — 3×8–10", "Walking lunge — 3×10/leg", "Leg curl — 3×12", "Calf raise — 4×12–15"],
  Push: ["Bench press — 4×6–8", "Incline DB press — 3×10", "Overhead press — 3×8", "Lateral raise — 3×15", "Triceps pushdown — 3×12"],
  Pull: ["Deadlift — 3×5", "Pull-ups — 4×max", "Chest-supported row — 3×10", "Face pull — 3×15", "Hammer curl — 3×12"],
  Legs: ["Back squat — 4×6–8", "Leg press — 3×10", "Romanian deadlift — 3×8–10", "Leg curl — 3×12", "Calf raise — 4×12–15"],
};

const ACTIVITY: Record<Days, number> = { 2: 1.375, 3: 1.45, 4: 1.55, 5: 1.65, 6: 1.725 };
const GOAL_FACTOR: Record<Goal, number> = { lose: 0.8, build: 1.1, recomp: 0.95, perform: 1.05 };
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;

/* ───────────────────────── Logic ───────────────────────── */

function calculatePlan(sex: Sex, age: number, weight: number, height: number, days: Days, goal: Goal) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === "male" ? 5 : -161);
  const calories = Math.round((bmr * ACTIVITY[days] * GOAL_FACTOR[goal]) / 10) * 10;
  const protein = Math.round(weight * (goal === "lose" ? 2.2 : 2.0));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, fat, carbs, split: SPLITS[days] };
}

function scoreLead(days: Days, goal: Goal, struggles: readonly string[], hasPhone: boolean) {
  const availability = days >= 4 ? 15 : days === 3 ? 10 : 4;
  const intent = goal === "recomp" || goal === "perform" ? 8 : 6;
  const pain = Math.min(
    25,
    struggles.reduce((sum, id) => sum + (STRUGGLE_WEIGHT_MAP.get(id) ?? 0), 0),
  );
  const contact = hasPhone ? 10 : 6;
  const total = Math.min(99, 40 + availability + intent + pain + contact);
  const tier = total >= 75 ? "Hot" : total >= 55 ? "Warm" : "Cold";
  return {
    total,
    tier,
    breakdown: [
      { label: "Training commitment", value: availability },
      { label: "Goal specificity", value: intent },
      { label: "Pain-point urgency", value: pain },
      { label: "Direct contact", value: contact },
    ],
  };
}

function exercisesFor(dayLabel: string) {
  const key = dayLabel.startsWith("Full") ? "Full" : dayLabel;
  return EXERCISES[key] ?? EXERCISES.Full;
}

/* ───────────────────────── Component ───────────────────────── */

export function MacroDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const cockpitRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>("lose");
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(168);
  const [days, setDays] = useState<Days>(4);
  const [struggles, setStruggles] = useState<string[]>(["consistency", "results"]);
  const [name, setName] = useState("Sophie");
  const [contact, setContact] = useState("@sophie.trains");
  const [phase, setPhase] = useState<Phase>("idle");
  const [deliveredIn, setDeliveredIn] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const clearTimers = () => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  };

  const scheduleTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useScrollReveal(sectionRef, ".gsap-demo-reveal", "top 80%");

  const activeGoal = goal ?? "lose";
  const plan = useMemo(
    () => calculatePlan(sex, age, weight, height, days, activeGoal),
    [sex, age, weight, height, days, activeGoal],
  );
  const hasPhone = PHONE_RE.test(contact.trim());
  const score = useMemo(
    () => scoreLead(days, activeGoal, struggles, hasPhone),
    [days, activeGoal, struggles, hasPhone],
  );
  const firstTrainingDay = plan.split.days.find(Boolean) ?? "Full A";
  const isResults = step >= TOTAL_DIAGNOSTIC_STEPS;
  const canContinue = step === 0 ? goal !== null : step === 3 ? struggles.length > 0 : true;
  const goalLabel = GOAL_LABEL_MAP.get(activeGoal) ?? "";
  const struggleLabels = useMemo(() => {
    const activeSet = new Set(struggles);
    return STRUGGLES.filter((s) => activeSet.has(s.id)).map((s) => s.label);
  }, [struggles]);

  const toggleStruggle = (id: string) =>
    setStruggles((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const reset = () => {
    clearTimers();
    setStep(0);
    setPhase("idle");
    setDeliveredIn(null);
  };

  const triggerUnlock = () => {
    if (!name.trim() || !contact.trim() || phase !== "idle") return;
    setPhase("sending");
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      scheduleTimer(() => {
        cockpitRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 150);
    }
    const id = simulateLeadDispatch(750, 450, (elapsed) => {
      setDeliveredIn(elapsed);
      setPhase("sent");
      if (soundEnabled) {
        playWhatsAppPing();
      }
    });
    timersRef.current.push(id);
  };

  const handleUnlock = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerUnlock();
  };

  const macroTotal = plan.protein * 4 + plan.carbs * 4 + plan.fat * 9 || 1;
  const macros = [
    { label: "Protein", grams: plan.protein, kcal: plan.protein * 4, color: "bg-brand-cyan" },
    { label: "Carbs", grams: plan.carbs, kcal: plan.carbs * 4, color: "bg-brand" },
    { label: "Fat", grams: plan.fat, kcal: plan.fat * 9, color: "bg-brand-deep" },
  ];

  const tierStyle =
    score.tier === "Hot"
      ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/35"
      : score.tier === "Warm"
        ? "bg-[#C89D54]/15 text-[#D4AC66] border-[#C89D54]/35"
        : "bg-surface-2 text-muted border-line";

  return (
    <section ref={sectionRef} id="demo" className="relative py-16 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 -top-36 h-[640px] bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,var(--glow-1),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* ───────────── Architectural Section Header ───────────── */}
        <div className="gsap-demo-reveal flex flex-col justify-between gap-4 sm:gap-6 border-b border-line pb-6 sm:pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-brand-cyan">
                02 / INTERACTIVE SANDBOX
              </span>
              <span className="h-3.5 w-px bg-line-strong" />
              <span className="font-mono text-[11px] sm:text-xs text-muted">CLIENT VIEW + COACH VIEW</span>
            </div>
            <h2 className="mt-2.5 sm:mt-3 text-[30px] font-semibold leading-[1.06] sm:leading-[1.04] tracking-[-0.035em] text-fg sm:text-5xl">
              Experience both sides{" "}
              <span className="serif text-shimmer font-normal italic">in real time.</span>
            </h2>
          </div>

          <p className="max-w-md text-[13.5px] sm:text-sm leading-relaxed text-muted">
            Tap through the 60-second diagnostic as a follower, and watch the live algorithmic lead
            radar and WhatsApp alert fire on the coach&apos;s phone.
          </p>
        </div>

        {/* ───────────── Asymmetric Dual-Cockpit Grid (Fukinsei) ───────────── */}
        <div className="gsap-demo-reveal relative mt-8 sm:mt-12 grid gap-5 sm:gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* ───────────── Left 7 Cols: Client's Micro Tool ───────────── */}
          <div className="card flex flex-col justify-between overflow-hidden p-0 lg:col-span-7">
            {/* Tool Top Telemetry Bar */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-line bg-surface-2/40 px-4 py-3.5 sm:px-6 sm:py-4 md:px-8">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-linear-to-br from-brand-cyan to-brand-deep text-xs sm:text-sm font-bold text-[#FAF6F0] shadow-xs">
                    A
                  </span>
                  <div className="leading-tight">
                    <p className="text-[13.5px] sm:text-[14px] font-semibold text-fg">Coach Alex</p>
                    <p className="text-[11px] sm:text-[11.5px] text-muted">60-second macro &amp; split diagnostic</p>
                  </div>
                </div>

                {/* Live Calorie Telemetry Pill */}
                <div className="flex items-center gap-2">
                  <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-muted sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    {plan.calories.toLocaleString("en-GB")} kcal
                  </span>
                  <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2.5 sm:px-3 py-1 font-mono text-[10.5px] sm:text-[11px] font-bold text-brand-cyan tabular-nums">
                    {isResults ? "UNLOCKED" : `0${step + 1} / 0${TOTAL_DIAGNOSTIC_STEPS}`}
                  </span>
                </div>
              </div>

              {/* Rule 9: Progress Line using ease-in-out for general moves */}
              <div className="h-[3px] bg-line">
                <div
                  className="h-full bg-linear-to-r from-brand-deep via-brand to-brand-cyan transition-all duration-350 ease-[cubic-bezier(0.65,0,0.35,1)]"
                  style={{ width: `${(Math.min(step + 1, TOTAL_DIAGNOSTIC_STEPS) / TOTAL_DIAGNOSTIC_STEPS) * 100}%` }}
                />
              </div>

              {/* Rule 16, 15, 1: Interactive Step Body overlapping old & new states with 20% shorter exit */}
              <div className="relative z-10 min-h-[370px] sm:min-h-[430px] p-4 sm:p-6 md:p-8">
                <OverlapTransitionStage activeKey={`macro-step-${step}`} enterDuration={0.28}>
                  {/* Step 0 — Goal */}
                  {step === 0 ? (
                    <div>
                      <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                        STEP 01 · PRIMARY OBJECTIVE
                      </p>
                      <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                        What’s your main physique goal?
                      </h3>
                      <p className="mt-1 text-xs sm:text-[13.5px] text-muted">
                        Select one — your daily calorie &amp; protein targets calibrate immediately.
                      </p>
                      {/* Rule 3: Stagger list rows by 30ms */}
                      <motion.div
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-4 sm:mt-6 grid gap-2.5 sm:gap-3 sm:grid-cols-2"
                      >
                        {GOALS.map((g) => {
                          const active = goal === g.id;
                          return (
                            <motion.button
                              variants={listRowVariants}
                              key={g.id}
                              id={`demo-goal-${g.id}`}
                              type="button"
                              onClick={() => {
                                setGoal(g.id);
                                clearTimers();
                                scheduleTimer(() => setStep(1), 160);
                              }}
                              /* Rule 4: Scale interactive elements to 0.97 on press */
                              className={`group rounded-2xl border p-3.5 sm:p-4.5 text-left transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                                active
                                  ? "border-brand-cyan bg-brand-cyan/12 shadow-[0_0_0_3px_var(--brand-cyan-glow)]"
                                  : "border-line bg-surface-2/40 hover:-translate-y-0.5 hover:border-brand-cyan/45 hover:bg-surface-2"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-brand-cyan">
                                  {g.tag}
                                </span>
                                <span
                                  className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                                    active
                                      ? "border-brand-cyan bg-brand-cyan text-[#FAF6F0] dark:text-[#12110F]"
                                      : "border-line-strong"
                                  }`}
                                >
                                  <BlurCrossfadeIcon iconKey={active ? "checked" : "empty"}>
                                    {active ? <IconCheck className="h-3 w-3" /> : <span className="h-3 w-3" />}
                                  </BlurCrossfadeIcon>
                                </span>
                              </div>
                              <p className="mt-2 sm:mt-3 text-[15px] sm:text-[15.5px] font-semibold text-fg">{g.label}</p>
                              <p className="mt-0.5 text-xs sm:text-[12.5px] text-muted">{g.desc}</p>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>
                  ) : null}

                  {/* Step 1 — Biometrics */}
                  {step === 1 ? (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                            STEP 02 · BIOMETRIC INPUTS
                          </p>
                          <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                            Dial in your current stats
                          </h3>
                        </div>

                        {/* Rule 20: Shared layoutId across sex toggle states */}
                        <div className="inline-flex rounded-full border border-line bg-surface-2 p-1">
                          {SEX_OPTIONS.map((s) => {
                            const active = sex === s;
                            return (
                              <button
                                key={s}
                                id={`demo-sex-${s}`}
                                type="button"
                                onClick={() => setSex(s)}
                                className={`relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer active:scale-[0.97] ${
                                  active
                                    ? "text-[#FAF6F0] dark:text-[#12110F]"
                                    : "text-muted hover:text-fg"
                                }`}
                              >
                                {active && (
                                  <motion.span
                                    layoutId="macrodemo-sex-pill"
                                    transition={SHARED_LAYOUT_TRANSITION}
                                    className="-z-10 absolute inset-0 rounded-full bg-brand-cyan shadow-xs"
                                  />
                                )}
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-3.5">
                        <Slider id="demo-age" label="Age" unit="yrs" min={16} max={70} value={age} onChange={setAge} />
                        <Slider id="demo-weight" label="Weight" unit="kg" min={40} max={160} value={weight} onChange={setWeight} />
                        <Slider id="demo-height" label="Height" unit="cm" min={140} max={210} value={height} onChange={setHeight} />
                      </div>
                    </div>
                  ) : null}

                  {/* Step 2 — Weekly Split */}
                  {step === 2 ? (
                    <div>
                      <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                        STEP 03 · TRAINING FREQUENCY
                      </p>
                      <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                        How many days a week can you train?
                      </h3>
                      <p className="mt-1 text-xs sm:text-[13.5px] text-muted">
                        Your split architecture and activity multiplier adjust automatically.
                      </p>

                      {/* Rule 20: Shared layoutId across training days */}
                      <div className="mt-5 sm:mt-6 grid grid-cols-5 gap-2 sm:gap-2.5">
                        {TRAINING_DAYS.map((d) => {
                          const active = days === d;
                          return (
                            <button
                              key={d}
                              id={`demo-days-${d}`}
                              type="button"
                              onClick={() => setDays(d)}
                              className={`relative z-10 rounded-2xl border py-3.5 sm:py-4 text-center transition-colors cursor-pointer active:scale-[0.97] ${
                                active
                                  ? "border-brand-cyan text-fg"
                                  : "border-line bg-surface-2/40 hover:border-line-strong hover:bg-surface-2"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="macrodemo-days-pill"
                                  transition={SHARED_LAYOUT_TRANSITION}
                                  className="-z-10 absolute inset-0 rounded-2xl bg-brand-cyan/14 shadow-[0_0_0_3px_var(--brand-cyan-glow)]"
                                />
                              )}
                              <p className="font-mono text-xl sm:text-2xl font-bold tabular-nums text-fg">{d}</p>
                              <p className="text-[10.5px] sm:text-[11px] font-medium text-muted">days</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 sm:mt-5 rounded-2xl border border-line bg-surface-2/50 p-3.5 sm:p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-muted">Recommended Split</p>
                          <p className="font-mono text-xs font-bold text-brand-cyan">{plan.split.name}</p>
                        </div>
                        <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-1.5">
                          {plan.split.days.map((d, i) => (
                            <div key={i} className="min-w-0 text-center">
                              <p className="text-[10px] font-medium text-muted">{WEEK_DAYS[i]}</p>
                              <div
                                className={`mt-1 grid h-8 place-items-center rounded-lg px-0.5 font-mono text-[8.5px] sm:text-[9.5px] font-bold truncate transition ${
                                  d
                                    ? "bg-brand-cyan/20 text-brand-cyan ring-1 ring-brand-cyan/40"
                                    : "bg-line/40 text-muted-soft"
                                }`}
                              >
                                {d || "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Step 3 — Struggles */}
                  {step === 3 ? (
                    <div>
                      <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                        STEP 04 · BOTTLENECK DIAGNOSTIC
                      </p>
                      <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                        What’s held you back most?
                      </h3>
                      <p className="mt-1 text-xs sm:text-[13.5px] text-muted">
                        Watch the coach’s live Intent Score jump as you select pain points:
                      </p>

                      {/* Rule 3: Stagger list rows by 30ms */}
                      <motion.div
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-2.5"
                      >
                        {STRUGGLES.map((s) => {
                          const active = struggles.includes(s.id);
                          return (
                            <motion.button
                              variants={listRowVariants}
                              key={s.id}
                              id={`demo-struggle-${s.id}`}
                              type="button"
                              onClick={() => toggleStruggle(s.id)}
                              /* Rule 4: Scale interactive elements to 0.97 on press */
                              className={`inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 rounded-2xl sm:rounded-full border px-4 py-3 sm:py-2.5 text-[13px] sm:text-[13.5px] font-medium transition-all cursor-pointer active:scale-[0.97] ${
                                active
                                  ? "border-brand-cyan bg-brand-cyan/15 text-fg shadow-xs ring-1 ring-brand-cyan/30"
                                  : "border-line bg-surface-2/50 text-muted hover:border-line-strong hover:text-fg"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <BlurCrossfadeIcon iconKey={active ? "on" : "off"}>
                                  {active ? (
                                    <IconCheck className="h-3.5 w-3.5 shrink-0 text-brand-cyan" />
                                  ) : (
                                    <span className="h-1.5 w-1.5 rounded-full bg-muted-soft" />
                                  )}
                                </BlurCrossfadeIcon>
                                <span>{s.label}</span>
                              </span>
                              <span className="font-mono text-[10px] font-bold text-brand-cyan">+{s.weight}</span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>
                  ) : null}

                  {/* Step 4 — Results & Instant Lead Dispatch */}
                  {isResults ? (
                    /* Rule 6: Stagger items as details settle */
                    <motion.div
                      variants={settleContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div
                        variants={settleItemVariants}
                        className="grid gap-3 sm:gap-3.5 sm:grid-cols-[1fr_1.2fr]"
                      >
                        {/* Rule 8: Pulse element to confirm success when unlocked */}
                        <motion.div
                          animate={
                            phase === "sent"
                              ? {
                                  scale: [1, 1.035, 1],
                                  boxShadow: [
                                    "0 0 0 0px rgba(184, 93, 59, 0)",
                                    "0 0 0 8px rgba(184, 93, 59, 0.22)",
                                    "0 0 0 0px rgba(184, 93, 59, 0)",
                                  ],
                                }
                              : { scale: 1 }
                          }
                          transition={{ duration: 0.44, ease: EASE_IN_OUT }}
                          className="rounded-2xl border border-brand-cyan/30 bg-brand-cyan/[0.08] p-4 sm:p-4.5 shadow-xs"
                        >
                          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-cyan">
                            Daily Target
                          </p>
                          <p className="mt-1 text-[34px] sm:text-[40px] font-bold leading-none tracking-[-0.04em] tabular-nums text-fg">
                            {plan.calories.toLocaleString("en-GB")}
                            <span className="ml-1 text-sm font-medium text-muted">kcal</span>
                          </p>
                          <p className="mt-1.5 sm:mt-2 text-xs text-muted font-medium">
                            {goalLabel} · {days}d/wk · {plan.split.name}
                          </p>
                        </motion.div>

                        <div className="space-y-2.5 rounded-2xl border border-line bg-surface-2/50 p-4 sm:p-4.5">
                          {macros.map((m) => (
                            <div key={m.label}>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted font-medium">{m.label}</span>
                                <span className="font-mono font-bold tabular-nums text-fg">{m.grams}g</span>
                              </div>
                              <div className="mt-1 h-1.5 rounded-full bg-line">
                                <div
                                  className={`animate-bar h-full rounded-full ${m.color}`}
                                  style={{ width: `${(m.kcal / macroTotal) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Gated 4-Week Workout Blueprint — Rule 17: Mask reveal on unlock */}
                      <motion.div
                        variants={settleItemVariants}
                        className={`relative mt-4 overflow-hidden rounded-2xl border border-line bg-surface-2/50 p-5 ${
                          phase !== "sent" ? "min-h-[275px] sm:min-h-[185px]" : "mask-wipe-reveal"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                            Day 1 · {firstTrainingDay} Session
                          </p>
                          <span className="font-mono text-[11px] text-brand-cyan">4-Week Progression</span>
                        </div>

                        {/* Rule 3: Stagger exercise rows by 30ms */}
                        <motion.ul
                          variants={listContainerVariants}
                          initial="hidden"
                          animate="visible"
                          className={`mt-3 space-y-1.5 text-[13.5px] text-fg transition-all duration-500 ${
                            phase === "sent" ? "" : "select-none blur-[6px]"
                          }`}
                          aria-hidden={phase !== "sent"}
                        >
                          {exercisesFor(firstTrainingDay).map((ex) => (
                            <motion.li
                              variants={listRowVariants}
                              key={ex}
                              className="flex items-center gap-2"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                              {ex}
                            </motion.li>
                          ))}
                        </motion.ul>

                        {phase !== "sent" ? (
                          <div className="absolute inset-0 flex flex-col justify-center bg-surface/92 p-4 sm:p-5 backdrop-blur-[4px]">
                            <div className="flex items-center justify-between">
                              <p className="flex items-center gap-2 text-sm sm:text-[15px] font-bold text-fg">
                                <IconLock className="h-4 w-4 shrink-0 text-brand-cyan" />
                                <span>Unlock full 4-week plan &amp; fire coach alert</span>
                              </p>
                              <span className="hidden rounded-full bg-brand-cyan/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-brand-cyan sm:inline-block">
                                PRE-FILLED DEMO
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted">
                              Tap <strong>Send Plan &amp; Ping Coach</strong> below to watch the WhatsApp lead alert land:
                            </p>
                            <form onSubmit={handleUnlock} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                              <input
                                id="demo-name"
                                className="field py-2.5 text-base sm:text-xs"
                                placeholder="First name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                              <input
                                id="demo-contact"
                                className="field py-2.5 text-base sm:text-xs"
                                placeholder="@instagram or phone"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                required
                              />
                              <button
                                id="demo-unlock"
                                type="submit"
                                disabled={phase === "sending"}
                                className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer active:scale-[0.97]"
                              >
                                {phase === "sending" ? "Dispatching…" : "Send Plan & Ping Coach"}
                                {phase === "sending" ? null : <IconArrowRight className="h-3.5 w-3.5" />}
                              </button>
                            </form>
                          </div>
                        ) : (
                          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-cyan">
                            <IconCheck className="h-4 w-4" />
                            4-week plan unlocked &amp; lead dispatched to Coach Alex in {deliveredIn}s
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  ) : null}
                </OverlapTransitionStage>
              </div>
            </div>

            {/* Tool Footer Controls */}
            <div className="relative z-10 flex items-center justify-between border-t border-line bg-surface-2/40 px-4 py-3.5 sm:px-6 sm:py-4 md:px-8">
              {isResults ? (
                <button
                  id="demo-restart"
                  type="button"
                  onClick={reset}
                  className="py-1.5 text-xs font-semibold text-muted transition hover:text-fg cursor-pointer active:scale-[0.97]"
                >
                  ↺ Replay diagnostic
                </button>
              ) : (
                <button
                  id="demo-back"
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className={`py-1.5 text-xs font-semibold text-muted transition hover:text-fg cursor-pointer active:scale-[0.97] ${
                    step === 0 ? "invisible" : ""
                  }`}
                >
                  ← Previous
                </button>
              )}

              {isResults ? (
                <span className="font-mono text-[10px] sm:text-[11px] text-muted-soft">POWERED BY QUALFI ENGINE</span>
              ) : (
                <button
                  id="demo-next"
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((s) => s + 1)}
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer active:scale-[0.97]"
                >
                  <span>{step === TOTAL_DIAGNOSTIC_STEPS - 1 ? "Calculate My Plan" : "Next Step"}</span>
                  <IconArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ───────────── Right 5 Cols: Coach's Live WhatsApp & Scoring Cockpit ───────────── */}
          <div
            ref={cockpitRef}
            className="card flex flex-col justify-between overflow-hidden border-[#D5CBB8]/60 bg-[#151310] p-0 text-[#EDE7DD] shadow-2xl lg:col-span-5 dark:border-[#EDE7DD]/10"
          >
            {/* Top Cockpit Header */}
            <div className="flex items-center justify-between border-b border-[#EDE7DD]/8 bg-[#1E1B17] px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-whatsapp text-[#FAF6F0] shadow-xs">
                  <IconWhatsApp className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold text-[#EDE7DD]">Qualfi Lead Cockpit</p>
                  <p className="text-[11px] text-[#EDE7DD]/55">Coach’s live WhatsApp &amp; scoring feed</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playWhatsAppPing();
                  }}
                  /* Rule 4: Scale interactive elements to 0.97 on press */
                  className="grid h-7 w-7 place-items-center rounded-full bg-[#EDE7DD]/10 text-[#EDE7DD]/70 transition hover:bg-[#EDE7DD]/20 hover:text-[#EDE7DD] cursor-pointer active:scale-[0.97]"
                  title={soundEnabled ? "Sound chime: On" : "Sound chime: Muted"}
                  aria-label={soundEnabled ? "Mute notification sound" : "Enable notification sound"}
                >
                  {/* Rule 18: Crossfade icons and apply a blur effect */}
                  <BlurCrossfadeIcon iconKey={soundEnabled ? "sound-on" : "sound-off"}>
                    {soundEnabled ? (
                      <IconVolume className="h-3.5 w-3.5 text-whatsapp" />
                    ) : (
                      <IconVolumeMute className="h-3.5 w-3.5 text-[#EDE7DD]/40" />
                    )}
                  </BlurCrossfadeIcon>
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp/15 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-whatsapp">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-whatsapp" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-whatsapp" />
                  </span>
                  LIVE SYNC
                </span>
              </div>
            </div>

            {/* Cockpit Body */}
            <div className="flex flex-1 flex-col justify-between gap-3.5 sm:gap-4 p-4 sm:p-5 [background-image:radial-gradient(rgba(237,231,221,0.045)_1px,transparent_1px)] [background-size:16px_16px]">
              {/* Real-Time Algorithmic Intent Radar */}
              <div className="rounded-2xl border border-[#EDE7DD]/10 bg-[#EDE7DD]/[0.03] p-3.5 sm:p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconSparkle className="h-3.5 w-3.5 text-brand-cyan" />
                    <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#EDE7DD]/70">
                      LIVE INTENT SCORING
                    </span>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${tierStyle}`}>
                    {score.tier.toUpperCase()} · {score.total}/100
                  </span>
                </div>

                {/* Live Score Bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#EDE7DD]/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-brand-deep via-brand-cyan to-whatsapp transition-all duration-350 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ width: `${score.total}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  {score.breakdown.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center justify-between rounded-lg bg-[#EDE7DD]/[0.03] px-2.5 py-1.5"
                    >
                      <span className="text-[#EDE7DD]/55">{b.label}</span>
                      <span className="font-mono font-bold text-brand-cyan">+{b.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Message Stream — Rule 16: Overlap old & new states during transitions */}
              <div className="my-auto flex flex-col justify-end">
                <OverlapTransitionStage activeKey={`cockpit-phase-${phase}`} enterDuration={0.28}>
                  {phase === "idle" ? (
                    <div className="rounded-2xl border border-dashed border-[#EDE7DD]/12 bg-[#EDE7DD]/[0.02] p-6 text-center">
                      <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
                        <span className="animate-radar pointer-events-none absolute inset-0 rounded-full border border-brand-cyan/40" />
                        <IconBolt className="h-5 w-5" />
                      </div>
                      <p className="mt-3.5 text-sm font-semibold text-[#EDE7DD]">
                        {isResults
                          ? `Visitor is viewing their ${plan.calories.toLocaleString("en-GB")} kcal plan…`
                          : `Tracking visitor on Step ${step + 1} of ${TOTAL_DIAGNOSTIC_STEPS}…`}
                      </p>
                      <p className="mx-auto mt-1 max-w-[250px] text-xs leading-relaxed text-[#EDE7DD]/55">
                        {isResults
                          ? "Click “Send Plan & Ping Coach” on the left to fire the instant WhatsApp alert."
                          : "Or jump straight to the WhatsApp alert simulation below:"}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(TOTAL_DIAGNOSTIC_STEPS);
                          clearTimers();
                          scheduleTimer(() => triggerUnlock(), 120);
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-whatsapp/40 bg-whatsapp/15 px-4 py-2 text-xs font-semibold text-whatsapp transition hover:bg-whatsapp/25 cursor-pointer active:scale-[0.97]"
                      >
                        <IconWhatsApp className="h-3.5 w-3.5" />
                        <span>Simulate Instant WhatsApp Alert Now</span>
                      </button>
                    </div>
                  ) : null}

                  {phase === "sending" ? (
                    <div className="inline-flex w-fit items-center gap-2 rounded-2xl rounded-tl-sm bg-[#25211D] px-4 py-3 text-xs text-[#EDE7DD]/85 shadow-md">
                      <span className="font-mono text-[11px] text-whatsapp">Encrypting lead dossier</span>
                      {TYPING_DOT_DELAYS.map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-whatsapp"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  ) : null}

                  {phase === "sent" ? (
                    <div className="space-y-3">
                      {/* Rule 8: Pulse elements to confirm success */}
                      <motion.div
                        initial={{ scale: 0.98 }}
                        animate={{
                          scale: [1, 1.03, 1],
                          boxShadow: [
                            "0 0 0 0px rgba(104, 143, 113, 0)",
                            "0 0 0 8px rgba(104, 143, 113, 0.25)",
                            "0 0 0 0px rgba(104, 143, 113, 0)",
                          ],
                        }}
                        transition={{ duration: 0.44, ease: EASE_IN_OUT }}
                        className="rounded-2xl rounded-tl-sm border border-whatsapp/35 bg-[#202620] p-4 text-[12.5px] leading-relaxed text-[#EDE7DD]/90 shadow-xl"
                      >
                        <div className="flex items-center justify-between border-b border-[#EDE7DD]/10 pb-2">
                          <p className="font-bold text-whatsapp">
                            🔥 {score.tier.toUpperCase()} LEAD · {score.total}/100
                          </p>
                          <span className="inline-flex items-center gap-1 font-mono text-[10.5px] text-whatsapp">
                            <IconClock className="h-3 w-3" /> {deliveredIn}s
                          </span>
                        </div>

                        <div className="mt-2.5 space-y-1 text-xs">
                          <p>
                            <span className="text-[#EDE7DD]/50">Prospect:</span>{" "}
                            <strong className="text-[#EDE7DD]">{name.trim()}</strong> ({sex === "male" ? "M" : "F"}, {age}y · {weight}kg · {height}cm)
                          </p>
                          <p>
                            <span className="text-[#EDE7DD]/50">Contact:</span>{" "}
                            <span className="font-mono font-semibold text-brand-cyan">{contact.trim()}</span>
                          </p>
                          <p>
                            <span className="text-[#EDE7DD]/50">Goal &amp; Split:</span> {goalLabel} · {days}d/wk ({plan.split.name})
                          </p>
                          <p>
                            <span className="text-[#EDE7DD]/50">Pain Points:</span> {struggleLabels.join(", ")}
                          </p>
                          <p>
                            <span className="text-[#EDE7DD]/50">Plan Generated:</span>{" "}
                            <span className="font-mono text-[#EDE7DD]">
                              {plan.calories.toLocaleString("en-GB")} kcal · P{plan.protein}g C{plan.carbs}g F{plan.fat}g
                            </span>
                          </p>
                        </div>

                        <p className="mt-2.5 flex items-center justify-between border-t border-[#EDE7DD]/10 pt-2 text-[11px] font-medium text-whatsapp">
                          <span>👉 Reply while they’re looking at their plan</span>
                          <span className="text-[#EDE7DD]/40">just now ✓✓</span>
                        </p>
                      </motion.div>

                      <a
                        id="demo-claim-spot-btn"
                        href="#claim"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp py-3 text-xs font-semibold text-[#FAF6F0] shadow-lg shadow-whatsapp/20 transition hover:brightness-110 cursor-pointer active:scale-[0.97]"
                      >
                        <span>Build this tool for my coaching brand</span>
                        <IconArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ) : null}
                </OverlapTransitionStage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
