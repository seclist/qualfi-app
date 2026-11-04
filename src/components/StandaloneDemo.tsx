"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconClock,
  IconLock,
  IconSmartphone,
  IconSparkle,
  IconVolume,
  IconVolumeMute,
  IconWhatsApp,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";

type Goal = "lose" | "muscle" | "recomp" | "athletic";
type Sex = "male" | "female";
type Days = 2 | 3 | 4 | 5 | 6;
type ViewMode = "bio" | "split";

type BrandPreset = {
  id: string;
  label: string;
  cyan: string;
  brand: string;
  deep: string;
  glow: string;
};

const BRAND_PRESETS: BrandPreset[] = [
  {
    id: "cyan",
    label: "Qualfi Cyan",
    cyan: "#00d2dc",
    brand: "#10afd2",
    deep: "#0b86b4",
    glow: "rgba(0, 210, 220, 0.28)",
  },
  {
    id: "emerald",
    label: "Emerald Pro",
    cyan: "#10b981",
    brand: "#059669",
    deep: "#047857",
    glow: "rgba(16, 185, 129, 0.28)",
  },
  {
    id: "amber",
    label: "Gold Apex",
    cyan: "#f59e0b",
    brand: "#d97706",
    deep: "#b45309",
    glow: "rgba(245, 158, 11, 0.28)",
  },
  {
    id: "rose",
    label: "Crimson Lift",
    cyan: "#f43f5e",
    brand: "#e11d48",
    deep: "#be123c",
    glow: "rgba(244, 63, 94, 0.28)",
  },
];

const GOALS: { id: Goal; label: string; desc: string; tag: string; delta: number }[] = [
  { id: "lose", label: "Drop body fat", desc: "Sustainable deficit · keep muscle", tag: "-0.5 kg/wk", delta: -450 },
  { id: "muscle", label: "Build lean muscle", desc: "Controlled surplus · progressive overload", tag: "+0.25 kg/wk", delta: 280 },
  { id: "recomp", label: "Body recomposition", desc: "Lose fat & build muscle at maintenance", tag: "Recomp", delta: -100 },
  { id: "athletic", label: "Strength & conditioning", desc: "Performance-led fuelling & recovery", tag: "Performance", delta: 150 },
];

const STRUGGLES: { id: string; label: string; weight: number }[] = [
  { id: "consistency", label: "Staying consistent past week 3", weight: 25 },
  { id: "nutrition", label: "Hitting protein & calorie targets", weight: 20 },
  { id: "plateau", label: "Training hard but physique looks the same", weight: 25 },
  { id: "accountability", label: "Need weekly check-ins & accountability", weight: 30 },
  { id: "time", label: "Busy schedule — need < 45 min sessions", weight: 15 },
];

const SPLITS: Record<Days, { name: string; days: string[] }> = {
  2: { name: "Full Body × 2", days: ["Full A", "", "", "Full B", "", "", ""] },
  3: { name: "Full Body × 3", days: ["Full A", "", "Full B", "", "Full C", "", ""] },
  4: { name: "Upper / Lower", days: ["Upper", "Lower", "", "Upper", "Lower", "", ""] },
  5: { name: "Upper / Lower + Push Pull Legs", days: ["Upper", "Lower", "", "Push", "Pull", "Legs", ""] },
  6: { name: "Push / Pull / Legs × 2", days: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", ""] },
};

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

const ACTIVITY_FACTOR: Record<Days, number> = {
  2: 1.35,
  3: 1.45,
  4: 1.55,
  5: 1.65,
  6: 1.72,
};

function exercisesFor(dayLabel: string): string[] {
  if (dayLabel.startsWith("Upper") || dayLabel === "Push") {
    return [
      "Barbell Bench Press — 4 × 6–8 (RPE 8)",
      "Seated Cable Row — 3 × 8–10",
      "Incline DB Press — 3 × 10–12",
      "Lat Pulldown — 3 × 10–12",
      "Lateral Raise Superset — 3 × 15",
    ];
  }
  return [
    "Trap-Bar Deadlift — 4 × 5",
    "Incline DB Bench — 3 × 8–10",
    "Bulgarian Split Squat — 3 × 10 / leg",
    "Chest-Supported Row — 3 × 10–12",
    "Hanging Knee Raise — 3 × 12–15",
  ];
}

function playWhatsAppPing() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.11, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.14);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.11);
    gain2.gain.setValueAtTime(0.14, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.11);
    osc2.stop(now + 0.36);
  } catch {
    // Ignore audio errors if blocked
  }
}

function Slider({
  id,
  label,
  unit,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  return (
    <div className="rounded-2xl border border-line bg-surface-2/50 p-3.5 sm:p-4">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
        <span className="font-mono text-lg font-bold tabular-nums text-fg">
          {value}
          <span className="ml-1 text-xs font-normal text-muted">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3"
        style={{ ["--pct" as string]: `${pct}%` }}
      />
    </div>
  );
}

export function StandaloneDemo() {
  const [viewMode, setViewMode] = useState<ViewMode>("bio");
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [coachName, setCoachName] = useState("Coach Alex");
  const [brandId, setBrandId] = useState("cyan");

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>("lose");
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(168);
  const [days, setDays] = useState<Days>(4);
  const [struggles, setStruggles] = useState<string[]>(["consistency", "accountability"]);
  const [name, setName] = useState("Sophie");
  const [contact, setContact] = useState("@sophie.trains");
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const [deliveredIn, setDeliveredIn] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBioToast, setShowBioToast] = useState(false);

  const TOTAL_STEPS = 4;
  const activeBrand = BRAND_PRESETS.find((b) => b.id === brandId) ?? BRAND_PRESETS[0];

  const brandStyles = {
    "--brand-cyan": activeBrand.cyan,
    "--brand": activeBrand.brand,
    "--brand-deep": activeBrand.deep,
    "--brand-cyan-glow": activeBrand.glow,
  } as CSSProperties;

  const plan = useMemo(() => {
    const s = sex === "male" ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    const tdee = bmr * ACTIVITY_FACTOR[days];
    const delta = GOALS.find((g) => g.id === goal)?.delta ?? 0;
    const calories = Math.round((tdee + delta) / 10) * 10;

    const proteinPerKg = goal === "lose" || goal === "recomp" ? 2.1 : 1.9;
    const protein = Math.round((weight * proteinPerKg) / 5) * 5;
    const fat = Math.max(45, Math.round(((calories * 0.27) / 9) / 5) * 5);
    const carbs = Math.max(60, Math.round((calories - protein * 4 - fat * 9) / 4 / 5) * 5);

    return { calories, protein, carbs, fat, split: SPLITS[days] };
  }, [sex, weight, height, age, days, goal]);

  const score = useMemo(() => {
    const base = 32;
    const strugglePts = struggles.reduce(
      (sum, id) => sum + (STRUGGLES.find((s) => s.id === id)?.weight ?? 0),
      0,
    );
    const freqPts = days >= 4 ? 14 : 8;
    const contactPts = contact.trim().length > 2 ? 10 : 0;
    const total = Math.min(99, base + strugglePts + freqPts + contactPts);
    const tier = total >= 80 ? "Hot" : total >= 60 ? "Warm" : "Nurture";

    return {
      total,
      tier,
      breakdown: [
        { label: "Profile fit", value: base },
        { label: "Training commitment", value: freqPts },
        { label: "Pain-point urgency", value: Math.min(45, strugglePts) },
        { label: "Verified handle", value: contactPts },
      ],
    };
  }, [struggles, days, contact]);

  const toggleStruggle = (id: string) => {
    setStruggles((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const canContinue =
    (step === 0 && goal !== null) ||
    step === 1 ||
    step === 2 ||
    (step === 3 && struggles.length > 0);

  const isResults = step === TOTAL_STEPS;
  const firstTrainingDay = plan.split.days.find((d) => d) ?? "Full A";
  const goalLabel = GOALS.find((g) => g.id === goal)?.label ?? "Recomp";
  const struggleLabels = struggles
    .map((id) => STRUGGLES.find((s) => s.id === id)?.label)
    .filter(Boolean);

  const reset = () => {
    setStep(0);
    setPhase("idle");
    setDeliveredIn(null);
    setShowBioToast(false);
  };

  const triggerUnlock = () => {
    if (!name.trim() || !contact.trim() || phase !== "idle") return;
    setPhase("sending");
    const start = performance.now();
    const delay = 700 + Math.random() * 350;
    window.setTimeout(() => {
      setDeliveredIn(((performance.now() - start) / 1000).toFixed(1));
      setPhase("sent");
      setShowBioToast(true);
      if (soundEnabled) {
        playWhatsAppPing();
      }
    }, delay);
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
        ? "bg-amber-400/15 text-amber-400 border-amber-400/35"
        : "bg-surface-2 text-muted border-line";

  const coachInitial = (coachName.replace(/^Coach\s+/i, "").trim()[0] || "A").toUpperCase();

  return (
    <div style={brandStyles} className="relative min-h-screen overflow-x-clip bg-bg text-fg">
      {/* Ambient Backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 0%, ${activeBrand.glow}, transparent 70%)`,
        }}
      />
      <div className="grid-bg pointer-events-none fixed inset-0" />

      {/* ───────────── Slide-Down WhatsApp Notification Banner (In Bio-Link View) ───────────── */}
      {viewMode === "bio" && showBioToast ? (
        <div className="animate-fade-in-up fixed inset-x-4 top-16 z-50 mx-auto max-w-md rounded-2xl border border-whatsapp/40 bg-[#101c24]/95 p-3.5 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                <IconWhatsApp className="h-4.5 w-4.5" />
              </span>
              <div className="text-xs leading-snug">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-whatsapp">
                    WhatsApp Alert Sent to {coachName} ({deliveredIn}s)
                  </span>
                </div>
                <p className="mt-0.5 text-white/85">
                  🔥 <strong>{name}</strong> ({contact}) · Score <strong>{score.total}/100</strong> ·{" "}
                  {plan.calories.toLocaleString("en-GB")} kcal ({goalLabel})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBioToast(false)}
              className="rounded-lg px-2 py-0.5 font-mono text-[10px] text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}

      {/* ───────────── Collapsible Demo Studio Toolbar (No Homepage Links) ───────────── */}
      {controlsCollapsed ? (
        <button
          type="button"
          onClick={() => setControlsCollapsed(false)}
          className="glass fixed right-3 top-3 z-50 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10.5px] font-bold text-brand-cyan shadow-lg transition hover:border-brand-cyan/50 cursor-pointer"
          title="Open Demo Controls"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
          <span>STUDIO</span>
        </button>
      ) : (
        <header className="relative z-40 mx-auto max-w-6xl px-3 pt-3 sm:px-6 sm:pt-4">
          <div className="glass flex flex-wrap items-center justify-between gap-2.5 rounded-2xl sm:rounded-full border px-3 py-2 sm:px-4">
            {/* Left: View Switcher (Bio-Link vs Split View) */}
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface-2/70 p-1">
              <button
                type="button"
                onClick={() => setViewMode("bio")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === "bio"
                    ? "bg-brand-cyan text-white dark:text-[#02131a] shadow-xs"
                    : "text-muted hover:text-fg"
                }`}
              >
                <IconSmartphone className="h-3.5 w-3.5" />
                <span>Bio-Link View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === "split"
                    ? "bg-brand-cyan text-white dark:text-[#02131a] shadow-xs"
                    : "text-muted hover:text-fg"
                }`}
              >
                <IconWhatsApp className="h-3.5 w-3.5" />
                <span>Split View</span>
              </button>
            </div>

            {/* Center: Coach Name & Brand Color Swatches */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-3 py-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Brand:
                </span>
                <input
                  type="text"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  aria-label="Coach brand name"
                  className="w-28 bg-transparent text-xs font-semibold text-fg outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-2.5 py-1">
                {BRAND_PRESETS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBrandId(b.id)}
                    title={b.label}
                    aria-label={b.label}
                    className={`h-4 w-4 rounded-full transition-transform cursor-pointer ${
                      brandId === b.id ? "scale-125 ring-2 ring-fg" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: b.cyan }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Theme Toggle & Hide Bar for Recording */}
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setControlsCollapsed(true)}
                className="btn-ghost rounded-full px-3 py-1.5 font-mono text-[10.5px] font-semibold text-muted hover:text-fg cursor-pointer"
                title="Hide toolbar for clean screen recording"
              >
                Hide Bar
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ───────────── Main Standalone Demo Stage ───────────── */}
      <main
        className={`relative z-10 mx-auto px-4 pb-16 pt-6 sm:px-6 sm:pt-10 ${
          viewMode === "bio" ? "max-w-[540px]" : "max-w-6xl"
        }`}
      >
        <div
          className={
            viewMode === "split"
              ? "grid gap-6 lg:grid-cols-12 lg:items-stretch"
              : "flex flex-col"
          }
        >
          {/* ───────────── Client Bio-Link Micro Tool Card ───────────── */}
          <div
            className={`card flex flex-col justify-between overflow-hidden p-0 ${
              viewMode === "split" ? "lg:col-span-7" : "w-full shadow-2xl"
            }`}
          >
            <div>
              {/* Coach Brand Header */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line bg-surface-2/40 px-4 py-3.5 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-linear-to-br from-brand-cyan to-brand-deep text-xs sm:text-sm font-bold text-[#02131a] shadow-xs">
                    {coachInitial}
                  </span>
                  <div className="leading-tight">
                    <p className="text-[14px] font-semibold text-fg">{coachName || "Coach Alex"}</p>
                    <p className="text-[11px] sm:text-[11.5px] text-muted">
                      60-second custom macro &amp; split diagnostic
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-muted sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    {plan.calories.toLocaleString("en-GB")} kcal
                  </span>
                  <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2.5 sm:px-3 py-1 font-mono text-[10.5px] sm:text-[11px] font-bold text-brand-cyan tabular-nums">
                    {isResults ? "UNLOCKED" : `0${step + 1} / 0${TOTAL_STEPS}`}
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="h-[3px] bg-line">
                <div
                  className="h-full bg-linear-to-r from-brand-deep via-brand to-brand-cyan transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: `${(Math.min(step + 1, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
                />
              </div>

              {/* Step Body */}
              <div className="relative z-10 min-h-[370px] sm:min-h-[430px] p-4 sm:p-6 md:p-8">
                {/* Step 0 — Goal */}
                {step === 0 ? (
                  <div key="s0" className="animate-step-enter">
                    <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                      STEP 01 · PRIMARY OBJECTIVE
                    </p>
                    <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                      What’s your main physique goal?
                    </h2>
                    <p className="mt-1 text-xs sm:text-[13.5px] text-muted">
                      Select one — your daily calorie &amp; protein targets calibrate immediately.
                    </p>
                    <div className="mt-4 sm:mt-6 grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                      {GOALS.map((g) => {
                        const active = goal === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setGoal(g.id);
                              setTimeout(() => setStep(1), 180);
                            }}
                            className={`group rounded-2xl border p-3.5 sm:p-4.5 text-left transition-all duration-200 cursor-pointer ${
                              active
                                ? "border-brand-cyan bg-brand-cyan/12 shadow-[0_0_0_3px_var(--brand-cyan-glow)]"
                                : "border-line bg-surface-2/40 hover:-translate-y-0.5 hover:border-brand-cyan/45 hover:bg-surface-2 active:scale-[0.99]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-brand-cyan">
                                {g.tag}
                              </span>
                              <span
                                className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                                  active
                                    ? "border-brand-cyan bg-brand-cyan text-white dark:text-[#02131a]"
                                    : "border-line-strong"
                                }`}
                              >
                                {active ? <IconCheck className="h-3 w-3" /> : null}
                              </span>
                            </div>
                            <p className="mt-2 sm:mt-3 text-[15px] sm:text-[15.5px] font-semibold text-fg">
                              {g.label}
                            </p>
                            <p className="mt-0.5 text-xs sm:text-[12.5px] text-muted">{g.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Step 1 — Biometrics */}
                {step === 1 ? (
                  <div key="s1" className="animate-step-enter">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                          STEP 02 · BIOMETRIC INPUTS
                        </p>
                        <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                          Dial in your current stats
                        </h2>
                      </div>

                      <div className="inline-flex rounded-full border border-line bg-surface-2 p-1">
                        {(["female", "male"] as Sex[]).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSex(s)}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                              sex === s
                                ? "bg-brand-cyan text-white dark:text-[#02131a] shadow-xs"
                                : "text-muted hover:text-fg"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-3.5">
                      <Slider id="standalone-age" label="Age" unit="yrs" min={16} max={70} value={age} onChange={setAge} />
                      <Slider id="standalone-weight" label="Weight" unit="kg" min={40} max={160} value={weight} onChange={setWeight} />
                      <Slider id="standalone-height" label="Height" unit="cm" min={140} max={210} value={height} onChange={setHeight} />
                    </div>
                  </div>
                ) : null}

                {/* Step 2 — Weekly Split */}
                {step === 2 ? (
                  <div key="s2" className="animate-step-enter">
                    <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                      STEP 03 · TRAINING FREQUENCY
                    </p>
                    <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                      How many days a week can you train?
                    </h2>
                    <p className="mt-1 text-xs sm:text-[13.5px] text-muted">
                      Your split architecture and activity multiplier adjust automatically.
                    </p>

                    <div className="mt-5 sm:mt-6 grid grid-cols-5 gap-2 sm:gap-2.5">
                      {([2, 3, 4, 5, 6] as Days[]).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDays(d)}
                          className={`rounded-2xl border py-3.5 sm:py-4 text-center transition-all cursor-pointer active:scale-[0.98] ${
                            days === d
                              ? "border-brand-cyan bg-brand-cyan/12 shadow-[0_0_0_3px_var(--brand-cyan-glow)]"
                              : "border-line bg-surface-2/40 hover:border-line-strong hover:bg-surface-2"
                          }`}
                        >
                          <p className="font-mono text-xl sm:text-2xl font-bold tabular-nums text-fg">{d}</p>
                          <p className="text-[10.5px] sm:text-[11px] font-medium text-muted">days</p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 sm:mt-5 rounded-2xl border border-line bg-surface-2/50 p-3.5 sm:p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted">Recommended Split</p>
                        <p className="font-mono text-xs font-bold text-brand-cyan">{plan.split.name}</p>
                      </div>
                      <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-1.5">
                        {plan.split.days.map((d, i) => (
                          <div key={i} className="min-w-0 text-center">
                            <p className="text-[10px] font-medium text-muted">{WEEK[i]}</p>
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
                  <div key="s3" className="animate-step-enter">
                    <p className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                      STEP 04 · BOTTLENECK DIAGNOSTIC
                    </p>
                    <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                      What’s held you back most?
                    </h2>
                    <p className="mt-1 text-xs sm:text-[13.5px] text-muted">
                      Select all that apply so {coachName || "your coach"} can tailor your blueprint:
                    </p>

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-2.5">
                      {STRUGGLES.map((s) => {
                        const active = struggles.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleStruggle(s.id)}
                            className={`inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 rounded-2xl sm:rounded-full border px-4 py-3 sm:py-2.5 text-[13px] sm:text-[13.5px] font-medium transition-all cursor-pointer active:scale-[0.99] ${
                              active
                                ? "border-brand-cyan bg-brand-cyan/15 text-fg shadow-xs ring-1 ring-brand-cyan/30"
                                : "border-line bg-surface-2/50 text-muted hover:border-line-strong hover:text-fg"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {active ? <IconCheck className="h-3.5 w-3.5 shrink-0 text-brand-cyan" /> : null}
                              <span>{s.label}</span>
                            </span>
                            <span className="font-mono text-[10px] font-bold text-brand-cyan">+{s.weight}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Step 4 — Results & Instant Lead Dispatch */}
                {isResults ? (
                  <div key="results" className="animate-step-enter">
                    <div className="grid gap-3 sm:gap-3.5 sm:grid-cols-[1fr_1.2fr]">
                      <div className="rounded-2xl border border-brand-cyan/30 bg-brand-cyan/[0.08] p-4 sm:p-4.5 shadow-xs">
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
                      </div>

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
                    </div>

                    {/* Gated 4-Week Workout Blueprint */}
                    <div
                      className={`relative mt-4 overflow-hidden rounded-2xl border border-line bg-surface-2/50 p-5 ${
                        phase !== "sent" ? "min-h-[275px] sm:min-h-[185px]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                          Day 1 · {firstTrainingDay} Session
                        </p>
                        <span className="font-mono text-[11px] text-brand-cyan">4-Week Progression</span>
                      </div>

                      <ul
                        className={`mt-3 space-y-1.5 text-[13.5px] text-fg transition-all duration-700 ${
                          phase === "sent" ? "" : "select-none blur-[6px]"
                        }`}
                        aria-hidden={phase !== "sent"}
                      >
                        {exercisesFor(firstTrainingDay).map((ex) => (
                          <li key={ex} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                            {ex}
                          </li>
                        ))}
                      </ul>

                      {phase !== "sent" ? (
                        <div className="absolute inset-0 flex flex-col justify-center bg-surface/92 p-4 sm:p-5 backdrop-blur-[4px]">
                          <div className="flex items-center justify-between">
                            <p className="flex items-center gap-2 text-sm sm:text-[15px] font-bold text-fg">
                              <IconLock className="h-4 w-4 shrink-0 text-brand-cyan" />
                              <span>Unlock full 4-week plan &amp; notify {coachName}</span>
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            Enter your name &amp; Instagram handle to unlock your workout split:
                          </p>
                          <form onSubmit={handleUnlock} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                            <input
                              className="field py-2.5 text-base sm:text-xs"
                              placeholder="First name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                            <input
                              className="field py-2.5 text-base sm:text-xs"
                              placeholder="@instagram or WhatsApp"
                              value={contact}
                              onChange={(e) => setContact(e.target.value)}
                              required
                            />
                            <button
                              type="submit"
                              disabled={phase === "sending"}
                              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer active:scale-[0.98]"
                            >
                              {phase === "sending" ? "Unlocking…" : "Unlock Plan"}
                              {phase === "sending" ? null : <IconArrowRight className="h-3.5 w-3.5" />}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-cyan">
                          <IconCheck className="h-4 w-4" />
                          4-week plan unlocked &amp; sent to {coachName} in {deliveredIn}s
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Tool Footer Controls */}
            <div className="relative z-10 flex items-center justify-between border-t border-line bg-surface-2/40 px-4 py-3.5 sm:px-6 sm:py-4">
              {isResults ? (
                <button
                  type="button"
                  onClick={reset}
                  className="py-1.5 text-xs font-semibold text-muted transition hover:text-fg cursor-pointer"
                >
                  ↺ Restart diagnostic
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className={`py-1.5 text-xs font-semibold text-muted transition hover:text-fg cursor-pointer ${
                    step === 0 ? "invisible" : ""
                  }`}
                >
                  ← Previous
                </button>
              )}

              {isResults ? (
                <span className="font-mono text-[10px] sm:text-[11px] text-muted-soft">
                  POWERED BY QUALFI ENGINE
                </span>
              ) : (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((s) => s + 1)}
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer active:scale-[0.98]"
                >
                  <span>{step === TOTAL_STEPS - 1 ? "Calculate My Plan" : "Next Step"}</span>
                  <IconArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ───────────── Coach's Live WhatsApp Cockpit (Visible in Split View) ───────────── */}
          {viewMode === "split" ? (
            <div className="card flex flex-col justify-between overflow-hidden border-slate-300/60 bg-[#060b11] p-0 text-white shadow-2xl lg:col-span-5 dark:border-white/10">
              <div className="flex items-center justify-between border-b border-white/8 bg-[#0b131c] px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-whatsapp text-white shadow-xs">
                    <IconWhatsApp className="h-5 w-5" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[14px] font-semibold text-white">{coachName}’s Lead Cockpit</p>
                    <p className="text-[11px] text-white/50">Live WhatsApp &amp; intent scoring feed</p>
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
                    className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white cursor-pointer"
                    title={soundEnabled ? "Sound chime: On" : "Sound chime: Muted"}
                    aria-label="Toggle notification sound"
                  >
                    {soundEnabled ? (
                      <IconVolume className="h-3.5 w-3.5 text-whatsapp" />
                    ) : (
                      <IconVolumeMute className="h-3.5 w-3.5 text-white/40" />
                    )}
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

              <div className="flex flex-1 flex-col justify-between gap-3.5 sm:gap-4 p-4 sm:p-5 [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconSparkle className="h-3.5 w-3.5 text-brand-cyan" />
                      <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-white/70">
                        LIVE INTENT SCORING
                      </span>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${tierStyle}`}>
                      {score.tier.toUpperCase()} · {score.total}/100
                    </span>
                  </div>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-brand-deep via-brand-cyan to-whatsapp transition-all duration-500"
                      style={{ width: `${score.total}%` }}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    {score.breakdown.map((b) => (
                      <div
                        key={b.label}
                        className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-1.5"
                      >
                        <span className="text-white/55">{b.label}</span>
                        <span className="font-mono font-bold text-brand-cyan">+{b.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-auto flex flex-col justify-end">
                  {phase === "idle" ? (
                    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-6 text-center">
                      <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
                        <span className="animate-radar pointer-events-none absolute inset-0 rounded-full border border-brand-cyan/40" />
                        <IconBolt className="h-5 w-5" />
                      </div>
                      <p className="mt-3.5 text-sm font-semibold text-white">
                        {isResults
                          ? `Visitor is viewing their ${plan.calories.toLocaleString("en-GB")} kcal plan…`
                          : `Tracking visitor on Step ${step + 1} of ${TOTAL_STEPS}…`}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(TOTAL_STEPS);
                          setTimeout(() => triggerUnlock(), 120);
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-whatsapp/40 bg-whatsapp/15 px-4 py-2 text-xs font-semibold text-whatsapp transition hover:bg-whatsapp/25 cursor-pointer"
                      >
                        <IconWhatsApp className="h-3.5 w-3.5" />
                        <span>Simulate Instant WhatsApp Alert</span>
                      </button>
                    </div>
                  ) : null}

                  {phase === "sending" ? (
                    <div className="animate-pop-in inline-flex w-fit items-center gap-2 rounded-2xl rounded-tl-sm bg-[#1f2c33] px-4 py-3 text-xs text-white/80 shadow-md">
                      <span className="font-mono text-[11px] text-whatsapp">Encrypting lead dossier</span>
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-whatsapp"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  ) : null}

                  {phase === "sent" ? (
                    <div className="animate-pop-in rounded-2xl rounded-tl-sm border border-whatsapp/30 bg-[#18252d] p-4 text-[12.5px] leading-relaxed text-white/90 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <p className="font-bold text-whatsapp">
                          🔥 {score.tier.toUpperCase()} LEAD · {score.total}/100
                        </p>
                        <span className="inline-flex items-center gap-1 font-mono text-[10.5px] text-whatsapp">
                          <IconClock className="h-3 w-3" /> {deliveredIn}s
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1 text-xs">
                        <p>
                          <span className="text-white/50">Prospect:</span>{" "}
                          <strong className="text-white">{name.trim()}</strong> ({sex === "male" ? "M" : "F"}, {age}y · {weight}kg · {height}cm)
                        </p>
                        <p>
                          <span className="text-white/50">Contact:</span>{" "}
                          <span className="font-mono font-semibold text-brand-cyan">{contact.trim()}</span>
                        </p>
                        <p>
                          <span className="text-white/50">Goal &amp; Split:</span> {goalLabel} · {days}d/wk ({plan.split.name})
                        </p>
                        <p>
                          <span className="text-white/50">Pain Points:</span> {struggleLabels.join(", ")}
                        </p>
                        <p>
                          <span className="text-white/50">Plan Generated:</span>{" "}
                          <span className="font-mono text-white">
                            {plan.calories.toLocaleString("en-GB")} kcal · P{plan.protein}g C{plan.carbs}g F{plan.fat}g
                          </span>
                        </p>
                      </div>

                      <p className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2 text-[11px] font-medium text-whatsapp">
                        <span>👉 Reply while they’re looking at their plan</span>
                        <span className="text-white/40">just now ✓✓</span>
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

