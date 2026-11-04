"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import gsap from "gsap";
import { playWhatsAppPing } from "@/lib/audio";

type ViewMode = "funnel" | "whatsapp" | "split";
type AccentKey = "amber" | "emerald" | "cyan" | "rose";
type Sex = "male" | "female";
type UnitSystem = "metric" | "imperial";
type GoalId = "cut" | "recomp" | "build";
type ActivityId = "sedentary" | "light" | "moderate" | "high";
type TrainingDays = 3 | 4 | 5;
type TrainingStyle = "hypertrophy" | "hybrid" | "minimal";
type BottleneckId = "overload" | "consistency" | "plateau" | "accountability";
type CoachingIntent = "ready" | "curious" | "blueprint";
type StepNum = 1 | 2 | 3 | 4 | 5;
type BotDispatchState = "waiting" | "processing" | "dispatched";

const ACCENTS: Record<
  AccentKey,
  {
    name: string;
    hex: string;
    softBg: string;
    border: string;
    text: string;
    glow: string;
  }
> = {
  amber: {
    name: "Performance Gold",
    hex: "#F59E0B",
    softBg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.45)",
    text: "#FBBF24",
    glow: "rgba(245, 158, 11, 0.24)",
  },
  emerald: {
    name: "Athletic Emerald",
    hex: "#10B981",
    softBg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.45)",
    text: "#34D399",
    glow: "rgba(16, 185, 129, 0.24)",
  },
  cyan: {
    name: "Studio Cyan",
    hex: "#06B6D4",
    softBg: "rgba(6, 182, 212, 0.12)",
    border: "rgba(6, 182, 212, 0.45)",
    text: "#22D3EE",
    glow: "rgba(6, 182, 212, 0.24)",
  },
  rose: {
    name: "Apex Crimson",
    hex: "#F43F5E",
    softBg: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.45)",
    text: "#FB7185",
    glow: "rgba(244, 63, 94, 0.24)",
  },
};

const GOALS: {
  id: GoalId;
  title: string;
  tag: string;
  desc: string;
  deltaPct: number;
  proteinPerKg: number;
  weeklyRateKg: number;
}[] = [
  {
    id: "cut",
    title: "Fat Loss & Definition",
    tag: "-20% Deficit",
    desc: "Drop body fat steadily while preserving lean muscle & strength.",
    deltaPct: -0.2,
    proteinPerKg: 2.25,
    weeklyRateKg: 0.6,
  },
  {
    id: "recomp",
    title: "Lean Body Recomposition",
    tag: "-8% Micro-Deficit",
    desc: "Simultaneously reduce body fat and build dense muscle.",
    deltaPct: -0.08,
    proteinPerKg: 2.2,
    weeklyRateKg: 0.35,
  },
  {
    id: "build",
    title: "Hypertrophy & Lean Mass",
    tag: "+12% Surplus",
    desc: "Fuel progressive overload and lean growth with minimal fat gain.",
    deltaPct: 0.12,
    proteinPerKg: 2.0,
    weeklyRateKg: 0.3,
  },
];

const TRAINING_STYLES: {
  id: TrainingStyle;
  title: string;
  sub: string;
}[] = [
  {
    id: "hypertrophy",
    title: "Full Gym",
    sub: "Barbells & machines",
  },
  {
    id: "hybrid",
    title: "Hybrid Athlete",
    sub: "Lift + conditioning",
  },
  {
    id: "minimal",
    title: "Home / Dumbbells",
    sub: "Minimal equipment",
  },
];

const ACTIVITIES: {
  id: ActivityId;
  title: string;
  steps: string;
  desc: string;
  mult: number;
}[] = [
  {
    id: "sedentary",
    title: "Desk-Based",
    steps: "< 5,000 steps",
    desc: "Mostly seated workday",
    mult: 1.3,
  },
  {
    id: "light",
    title: "Lightly Active",
    steps: "6,000–8,500 steps",
    desc: "Desk work + daily walks",
    mult: 1.46,
  },
  {
    id: "moderate",
    title: "Moderately Active",
    steps: "9,000–11,500 steps",
    desc: "On your feet regularly",
    mult: 1.62,
  },
  {
    id: "high",
    title: "High Output",
    steps: "12,000+ steps",
    desc: "Active job or high conditioning",
    mult: 1.78,
  },
];

const BOTTLENECKS: {
  id: BottleneckId;
  title: string;
  desc: string;
}[] = [
  {
    id: "consistency",
    title: "Weekend Consistency",
    desc: "Hitting macros when life gets busy",
  },
  {
    id: "overload",
    title: "Training Structure",
    desc: "Following a periodized lifting split",
  },
  {
    id: "plateau",
    title: "Breaking a Plateau",
    desc: "Training hard but physique stalled",
  },
  {
    id: "accountability",
    title: "Weekly Check-Ins",
    desc: "Expert accountability & adjustments",
  },
];

const INTENTS: {
  id: CoachingIntent;
  title: string;
  sub: string;
  tag: string;
}[] = [
  {
    id: "ready",
    title: "I'm ready to start 1:1 coaching",
    sub: "Looking for a structured training & nutrition program now",
    tag: "PRIORITY",
  },
  {
    id: "curious",
    title: "Interested — I'd like to see how 1:1 works",
    sub: "Open to discussing coaching options after seeing my plan",
    tag: "WARM",
  },
  {
    id: "blueprint",
    title: "Just unlocking my free blueprint for now",
    sub: "Calculate my training & macro targets only",
    tag: "SELF-GUIDED",
  },
];

export function StandaloneDemo() {
  // Top Studio Bar state
  const [viewMode, setViewMode] = useState<ViewMode>("funnel");
  const [accentKey, setAccentKey] = useState<AccentKey>("amber");

  // Funnel state
  const [step, setStep] = useState<StepNum>(1);
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(28);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(83);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(75);

  const [goal, setGoal] = useState<GoalId>("cut");
  const [trainingDays, setTrainingDays] = useState<TrainingDays>(4);
  const [trainingStyle, setTrainingStyle] =
    useState<TrainingStyle>("hypertrophy");

  const [activity, setActivity] = useState<ActivityId>("light");
  const [bottleneck, setBottleneck] = useState<BottleneckId>("consistency");

  const [firstName, setFirstName] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [intent, setIntent] = useState<CoachingIntent>("ready");
  const [formError, setFormError] = useState<string>("");

  // Backend -> WhatsApp Bot dispatch state
  const [botState, setBotState] = useState<BotDispatchState>("waiting");
  const [unreadBotAlert, setUnreadBotAlert] = useState<boolean>(false);
  const [showBotBanner, setShowBotBanner] = useState<boolean>(false);
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);

  const stepStageRef = useRef<HTMLDivElement>(null);
  const viewStageRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  const accent = ACCENTS[accentKey];

  const clearTimers = () => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Trigger the Backend -> WhatsApp Bot -> PT pipeline simulation
  const triggerBackendBotDispatch = () => {
    clearTimers();
    setBotState("processing");
    setShowBotBanner(false);

    const t1 = window.setTimeout(() => {
      setBotState("dispatched");
      playWhatsAppPing();
      if (viewMode === "funnel") {
        setUnreadBotAlert(true);
        setShowBotBanner(true);
      }
    }, 550);

    const t2 = window.setTimeout(() => {
      setShowBotBanner(false);
    }, 6500);

    timersRef.current.push(t1, t2);
  };

  // Silky GSAP staggered cascade when changing steps
  useEffect(() => {
    const stage = stepStageRef.current;
    if (!stage) return;

    const items = stage.querySelectorAll(".gsap-step-item");
    gsap.killTweensOf(items);
    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.46,
        stagger: 0.045,
        ease: "expo.out",
        clearProps: "transform",
      }
    );
  }, [step]);

  // Silky GSAP reveal when switching top bar views
  useEffect(() => {
    const el = viewStageRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "expo.out",
        clearProps: "transform",
      }
    );
  }, [viewMode]);

  const goToStep = (next: StepNum) => {
    setFormError("");
    setStep(next);
    if (next === 5 && botState === "waiting") {
      triggerBackendBotDispatch();
    }
  };

  const selectedGoal = useMemo(
    () => GOALS.find((g) => g.id === goal) ?? GOALS[0],
    [goal]
  );
  const selectedStyle = useMemo(
    () =>
      TRAINING_STYLES.find((s) => s.id === trainingStyle) ?? TRAINING_STYLES[0],
    [trainingStyle]
  );
  const selectedActivity = useMemo(
    () => ACTIVITIES.find((a) => a.id === activity) ?? ACTIVITIES[1],
    [activity]
  );
  const selectedBottleneck = useMemo(
    () => BOTTLENECKS.find((b) => b.id === bottleneck) ?? BOTTLENECKS[0],
    [bottleneck]
  );
  const selectedIntent = useMemo(
    () => INTENTS.find((i) => i.id === intent) ?? INTENTS[0],
    [intent]
  );

  // Physiological & Training Calculations
  const metrics = useMemo(() => {
    const bmr = Math.round(
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    );
    const tdee = Math.round(bmr * selectedActivity.mult);
    const targetCalories = Math.max(
      1350,
      Math.round(tdee * (1 + selectedGoal.deltaPct))
    );

    const trainingDayCalories = targetCalories + 160;
    const restDayCalories = Math.max(1300, targetCalories - 140);

    const proteinG = Math.round(weightKg * selectedGoal.proteinPerKg);
    const fatG = Math.max(48, Math.round(weightKg * 0.85));
    const remainingCal = Math.max(
      140,
      targetCalories - proteinG * 4 - fatG * 9
    );
    const carbsG = Math.round(remainingCal / 4);

    const totalCal = proteinG * 4 + carbsG * 4 + fatG * 9;
    const proteinPct = Math.round(((proteinG * 4) / totalCal) * 100);
    const carbsPct = Math.round(((carbsG * 4) / totalCal) * 100);
    const fatPct = Math.max(12, 100 - proteinPct - carbsPct);

    const weightDiffKg = Math.abs(weightKg - targetWeightKg);
    const estWeeks = Math.max(
      4,
      Math.min(
        24,
        Math.round(weightDiffKg / selectedGoal.weeklyRateKg) || 8
      )
    );

    const splitName =
      trainingDays === 3
        ? "3-Day Full-Body Split"
        : trainingDays === 4
          ? "4-Day Upper / Lower Split"
          : "5-Day PPL + Upper / Lower";

    const schedule =
      trainingDays === 3
        ? [
            { day: "Mon", focus: "Full Body A (Strength)" },
            { day: "Tue", focus: "Rest & Steps" },
            { day: "Wed", focus: "Full Body B (Hypertrophy)" },
            { day: "Thu", focus: "Rest & Steps" },
            { day: "Fri", focus: "Full Body C (Metabolic)" },
          ]
        : trainingDays === 4
          ? [
              { day: "Mon", focus: "Upper Body (Strength)" },
              { day: "Tue", focus: "Lower Body (Quad Focus)" },
              { day: "Wed", focus: "Active Recovery / Steps" },
              { day: "Thu", focus: "Upper Body (Hypertrophy)" },
              { day: "Fri", focus: "Lower Body (Posterior)" },
            ]
          : [
              { day: "Mon", focus: "Push (Chest / Shoulders / Tri)" },
              { day: "Tue", focus: "Pull (Back / Rear Delts / Bi)" },
              { day: "Wed", focus: "Legs (Primary Lower)" },
              { day: "Thu", focus: "Rest & Mobility" },
              { day: "Fri", focus: "Upper + Lower Pump" },
            ];

    return {
      bmr,
      tdee,
      targetCalories,
      trainingDayCalories,
      restDayCalories,
      proteinG,
      carbsG,
      fatG,
      proteinPct,
      carbsPct,
      fatPct,
      estWeeks,
      splitName,
      schedule,
      waterLiters: (weightKg * 0.04).toFixed(1),
      stepTarget:
        goal === "cut" ? "9,500" : goal === "recomp" ? "8,500" : "7,500",
    };
  }, [
    sex,
    weightKg,
    heightCm,
    age,
    targetWeightKg,
    selectedActivity,
    selectedGoal,
    trainingDays,
    goal,
  ]);

  const formatWeight = (kg: number) =>
    unit === "metric" ? `${kg} kg` : `${Math.round(kg * 2.20462)} lbs`;

  const formatHeight = (cm: number) => {
    if (unit === "metric") return `${cm} cm`;
    const totalIn = Math.round(cm / 2.54);
    return `${Math.floor(totalIn / 12)}'${totalIn % 12}"`;
  };

  const pct = (val: number, min: number, max: number) =>
    `${Math.round(((val - min) / (max - min)) * 100)}%`;

  const handlePrimaryAction = () => {
    if (step < 4) {
      goToStep((step + 1) as StepNum);
      return;
    }
    if (step === 4) {
      if (!firstName.trim()) {
        setFormError("Enter your first name to unlock your blueprint.");
        return;
      }
      if (whatsapp.replace(/\D/g, "").length < 7) {
        setFormError("Enter a valid WhatsApp number to unlock your results.");
        return;
      }
      setFormError("");
      setStep(5);
      triggerBackendBotDispatch();
    }
  };

  const clientDisplayName = firstName.trim() || "Jordan";
  const clientDisplayPhone = whatsapp.trim() || "+44 7700 900077";

  const botMessageToPT = `⚡ *NEW QUALIFIED PT LEAD — ${selectedIntent.tag}*

*Client Details:*
• Name: ${clientDisplayName}
• WhatsApp: ${clientDisplayPhone}
• Intent: ${selectedIntent.title}

*Physique & Training Profile:*
• Stats: ${age}y ${sex === "male" ? "Male" : "Female"} · ${formatHeight(heightCm)} · ${formatWeight(weightKg)} → ${formatWeight(targetWeightKg)}
• Phase: ${selectedGoal.title} (~${metrics.estWeeks} wks)
• Split: ${metrics.splitName} (${selectedStyle.title})
• #1 Bottleneck: ${selectedBottleneck.title}

*Blueprint Generated for Client:*
• Daily Avg: ${metrics.targetCalories.toLocaleString()} kcal (${metrics.proteinG}g P / ${metrics.carbsG}g C / ${metrics.fatG}g F)
• Lift Days: ${metrics.trainingDayCalories.toLocaleString()} kcal | Rest Days: ${metrics.restDayCalories.toLocaleString()} kcal`;

  const handleCopyBrief = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(botMessageToPT);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    }
  };

  // Unified, Fixed-Architecture PT Funnel Card (Zero Layout Jump)
  const renderFunnel = () => (
    <div className="w-full max-w-[540px] mx-auto">
      <div className="rounded-3xl bg-[#111318] border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between relative">
        {/* Subtle Ambient Accent Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-700"
          style={{ backgroundColor: accent.hex }}
        />

        {/* ── Card Top Telemetry & Progress Header (Always Fixed at Top) ── */}
        <div className="relative z-10 border-b border-white/[0.07] bg-[#14171E]/80 px-4 sm:px-6 pt-4 pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
              <span
                className="w-2 h-2 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: accent.hex,
                  boxShadow: `0 0 10px ${accent.hex}`,
                }}
              />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-zinc-200">
                1:1 Performance & Physique
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/[0.06] text-[11px] font-medium text-zinc-300 tabular-nums">
                TDEE: {metrics.tdee.toLocaleString()} kcal
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tabular-nums transition-colors duration-500"
                style={{
                  backgroundColor: accent.softBg,
                  color: accent.text,
                  border: `1px solid ${accent.border}`,
                }}
              >
                {step === 5 ? "UNLOCKED" : `0${step} / 04`}
              </span>
            </div>
          </div>

          {/* Step Tabs / Progress Line */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-3.5">
            {[
              { n: 1, label: "01 Metrics" },
              { n: 2, label: "02 Training" },
              { n: 3, label: "03 Lifestyle" },
              { n: 4, label: "04 Blueprint" },
            ].map((item) => {
              const isCurrent = step === item.n;
              const isDone = step > item.n;
              return (
                <button
                  key={item.n}
                  type="button"
                  onClick={() => goToStep(item.n as StepNum)}
                  className="text-left group cursor-pointer"
                >
                  <div className="h-1 w-full rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        width: isCurrent || isDone ? "100%" : "0%",
                        backgroundColor: isCurrent
                          ? accent.hex
                          : isDone
                            ? `${accent.hex}99`
                            : "transparent",
                      }}
                    />
                  </div>
                  <span
                    className={`block text-[10px] font-medium mt-1.5 truncate transition-colors duration-300 ${
                      isCurrent
                        ? "text-white font-semibold"
                        : isDone
                          ? "text-zinc-400 group-hover:text-white"
                          : "text-zinc-600 group-hover:text-zinc-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Consistent-Height Step Stage (GSAP Staggered Cascade, Zero Height Jump) ── */}
        <div
          ref={stepStageRef}
          className="relative z-10 min-h-[430px] sm:min-h-[450px] p-4 sm:p-6 flex flex-col justify-between"
        >
          {/* STEP 1: BIOMETRICS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="gsap-step-item flex items-start justify-between gap-3">
                <div>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-500"
                    style={{ color: accent.text }}
                  >
                    Step 01 · Biometric Baseline
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    Dial in your starting stats
                  </h2>
                </div>

                {/* Unit Switch */}
                <div className="inline-flex rounded-xl bg-black/50 p-1 border border-white/[0.07] shrink-0">
                  {(["metric", "imperial"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                        unit === u
                          ? "bg-white text-black shadow-xs"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {u === "metric" ? "KG / CM" : "LBS / FT"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Biological Sex */}
              <div className="gsap-step-item grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: "male", label: "Male", sub: "Mifflin-St Jeor Male" },
                    {
                      id: "female",
                      label: "Female",
                      sub: "Mifflin-St Jeor Female",
                    },
                  ] as const
                ).map((g) => {
                  const active = sex === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSex(g.id)}
                      style={
                        active
                          ? {
                              borderColor: accent.border,
                              backgroundColor: accent.softBg,
                            }
                          : undefined
                      }
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        active
                          ? "text-white"
                          : "bg-[#0B0D11] border-white/[0.07] text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          {g.label}
                        </span>
                        <span
                          className="w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200"
                          style={
                            active
                              ? {
                                  borderColor: accent.hex,
                                  backgroundColor: accent.hex,
                                }
                              : { borderColor: "rgba(255,255,255,0.25)" }
                          }
                        >
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {g.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Filled Sliders (2x2 Grid) */}
              <div className="gsap-step-item grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-400">
                      Age
                    </span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {age} yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={65}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, ${accent.hex} 0%, ${accent.hex} ${pct(age, 18, 65)}, rgba(255,255,255,0.1) ${pct(age, 18, 65)})`,
                    }}
                    className="demo-range"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-400">
                      Height
                    </span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatHeight(heightCm)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={148}
                    max={205}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, ${accent.hex} 0%, ${accent.hex} ${pct(heightCm, 148, 205)}, rgba(255,255,255,0.1) ${pct(heightCm, 148, 205)})`,
                    }}
                    className="demo-range"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-400">
                      Current Weight
                    </span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatWeight(weightKg)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={140}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, ${accent.hex} 0%, ${accent.hex} ${pct(weightKg, 45, 140)}, rgba(255,255,255,0.1) ${pct(weightKg, 45, 140)})`,
                    }}
                    className="demo-range"
                  />
                </div>

                <div
                  className="p-3.5 rounded-2xl bg-[#0B0D11] border transition-colors duration-500"
                  style={{ borderColor: accent.border }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-semibold transition-colors duration-500"
                      style={{ color: accent.text }}
                    >
                      Target Weight
                    </span>
                    <span
                      className="text-sm font-bold tabular-nums transition-colors duration-500"
                      style={{ color: accent.text }}
                    >
                      {formatWeight(targetWeightKg)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={130}
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, ${accent.hex} 0%, ${accent.hex} ${pct(targetWeightKg, 45, 130)}, rgba(255,255,255,0.1) ${pct(targetWeightKg, 45, 130)})`,
                    }}
                    className="demo-range"
                  />
                </div>
              </div>

              {/* Live BMR / Timeline Strip */}
              <div className="gsap-step-item rounded-2xl bg-black/35 border border-white/[0.05] px-4 py-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400">
                  Resting BMR:{" "}
                  <strong className="text-white tabular-nums">
                    {metrics.bmr.toLocaleString()} kcal
                  </strong>
                </span>
                <span
                  className="font-semibold tabular-nums transition-colors duration-500"
                  style={{ color: accent.text }}
                >
                  Est. Horizon: ~{metrics.estWeeks} Weeks
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: TRAINING ARCHITECTURE & GOAL */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="gsap-step-item flex items-end justify-between gap-2">
                <div>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-500"
                    style={{ color: accent.text }}
                  >
                    Step 02 · Training & Phase
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    Plan around your training split
                  </h2>
                </div>
                <span
                  className="text-[11px] font-semibold transition-colors duration-500 hidden sm:inline"
                  style={{ color: accent.text }}
                >
                  {metrics.splitName}
                </span>
              </div>

              {/* Goal Cards */}
              <div className="gsap-step-item space-y-2">
                {GOALS.map((g) => {
                  const active = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      style={
                        active
                          ? {
                              borderColor: accent.border,
                              backgroundColor: accent.softBg,
                            }
                          : undefined
                      }
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        active
                          ? "text-white"
                          : "bg-[#0B0D11] border-white/[0.07] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">
                          {g.title}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors duration-200 shrink-0"
                          style={
                            active
                              ? {
                                  backgroundColor: accent.hex,
                                  color: "#000",
                                }
                              : {
                                  backgroundColor: "rgba(255,255,255,0.06)",
                                  color: "rgba(255,255,255,0.6)",
                                }
                          }
                        >
                          {g.tag}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{g.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Compact Training Days + Equipment Grid */}
              <div className="gsap-step-item grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Lifting Days / Week
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { d: 3, label: "3 Days" },
                        { d: 4, label: "4 Days" },
                        { d: 5, label: "5 Days" },
                      ] as const
                    ).map((item) => {
                      const active = trainingDays === item.d;
                      return (
                        <button
                          key={item.d}
                          type="button"
                          onClick={() => setTrainingDays(item.d)}
                          style={
                            active
                              ? {
                                  borderColor: accent.border,
                                  backgroundColor: accent.softBg,
                                }
                              : undefined
                          }
                          className={`py-2.5 px-2 rounded-xl border text-center text-xs font-bold transition-all duration-200 cursor-pointer ${
                            active
                              ? "text-white"
                              : "bg-[#0B0D11] border-white/[0.07] text-zinc-400 hover:border-white/20"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Training Setup
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TRAINING_STYLES.map((s) => {
                      const active = trainingStyle === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setTrainingStyle(s.id)}
                          style={
                            active
                              ? {
                                  borderColor: accent.border,
                                  backgroundColor: accent.softBg,
                                }
                              : undefined
                          }
                          className={`py-2.5 px-2 rounded-xl border text-center text-[11px] font-bold truncate transition-all duration-200 cursor-pointer ${
                            active
                              ? "text-white"
                              : "bg-[#0B0D11] border-white/[0.07] text-zinc-400 hover:border-white/20"
                          }`}
                        >
                          {s.title.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DAILY ACTIVITY & COACHING BOTTLENECK */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="gsap-step-item">
                <span
                  className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-500"
                  style={{ color: accent.text }}
                >
                  Step 03 · Expenditure & Focus
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  Daily movement & #1 coaching focus
                </h2>
              </div>

              {/* Activity Level (2x2 Grid) */}
              <div className="gsap-step-item">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Daily Steps Outside the Gym (NEAT)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIVITIES.map((a) => {
                    const active = activity === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setActivity(a.id)}
                        style={
                          active
                            ? {
                                borderColor: accent.border,
                                backgroundColor: accent.softBg,
                              }
                            : undefined
                        }
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold text-white">
                          {a.title}
                        </div>
                        <div
                          className="text-[11px] font-semibold mt-0.5 transition-colors duration-300"
                          style={{ color: active ? accent.text : "#A1A1AA" }}
                        >
                          {a.steps}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">
                          {a.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coaching Bottleneck (2x2 Grid) */}
              <div className="gsap-step-item">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Primary Focus for 1:1 Coaching
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BOTTLENECKS.map((b) => {
                    const active = bottleneck === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBottleneck(b.id)}
                        style={
                          active
                            ? {
                                borderColor: accent.border,
                                backgroundColor: accent.softBg,
                              }
                            : undefined
                        }
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold text-white">
                          {b.title}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 line-clamp-2">
                          {b.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DATA-BACKED BLUEPRINT GATE */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Locked Data Preview Banner */}
              <div
                className="gsap-step-item rounded-2xl p-3.5 border bg-[#0B0D11] transition-colors duration-500"
                style={{ borderColor: accent.border }}
              >
                <div className="flex items-center justify-between text-[11px] mb-2.5 gap-2">
                  <span
                    className="font-bold uppercase tracking-wider transition-colors duration-500"
                    style={{ color: accent.text }}
                  >
                    ✓ Diagnostic Complete
                  </span>
                  <span className="text-zinc-400 font-medium truncate">
                    {metrics.splitName}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] sm:text-[10px] uppercase text-zinc-500">
                      Training Day
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5 blur-[4px] select-none">
                      {metrics.trainingDayCalories} kcal
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] sm:text-[10px] uppercase text-zinc-500">
                      Daily Protein
                    </div>
                    <div
                      className="text-xs sm:text-sm font-bold mt-0.5 blur-[4px] select-none transition-colors duration-500"
                      style={{ color: accent.text }}
                    >
                      {metrics.proteinG}g / day
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] sm:text-[10px] uppercase text-zinc-500">
                      Goal Horizon
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                      ~{metrics.estWeeks} Weeks
                    </div>
                  </div>
                </div>
              </div>

              <div className="gsap-step-item grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (formError) setFormError("");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/[0.1] text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7700 900077"
                    value={whatsapp}
                    onChange={(e) => {
                      setWhatsapp(e.target.value);
                      if (formError) setFormError("");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/[0.1] text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              {/* Coaching Qualification */}
              <div className="gsap-step-item">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  1:1 PT Coaching Interest
                </label>
                <div className="space-y-1.5">
                  {INTENTS.map((item) => {
                    const active = intent === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIntent(item.id)}
                        style={
                          active
                            ? {
                                borderColor: accent.border,
                                backgroundColor: accent.softBg,
                              }
                            : undefined
                        }
                        className={`w-full py-2.5 px-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {item.title}
                            </span>
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                              style={
                                active
                                  ? {
                                      backgroundColor: accent.hex,
                                      color: "#000",
                                    }
                                  : {
                                      backgroundColor:
                                        "rgba(255,255,255,0.06)",
                                      color: "rgba(255,255,255,0.5)",
                                    }
                              }
                            >
                              {item.tag}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500 truncate">
                            {item.sub}
                          </div>
                        </div>
                        <span
                          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                          style={
                            active
                              ? {
                                  borderColor: accent.hex,
                                  backgroundColor: accent.hex,
                                }
                              : { borderColor: "rgba(255,255,255,0.25)" }
                          }
                        >
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2">
                  {formError}
                </p>
              )}
            </div>
          )}

          {/* STEP 5: UNLOCKED DATA-BACKED PT BLUEPRINT */}
          {step === 5 && (
            <div className="space-y-3.5">
              {/* Automated Backend Dispatch Confirmation Pill */}
              <div className="gsap-step-item rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 truncate">
                    {botState === "processing"
                      ? "Syncing your blueprint to your coach's WhatsApp..."
                      : `Sent to coach via WhatsApp Bot · They'll message ${clientDisplayName} shortly`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-[11px] font-semibold text-zinc-400 hover:text-white underline underline-offset-2 cursor-pointer shrink-0"
                >
                  Edit
                </button>
              </div>

              {/* Calorie Cycling & Goal Projection */}
              <div className="gsap-step-item grid grid-cols-3 gap-2">
                <div
                  className="p-3 rounded-2xl border bg-[#0B0D11] transition-colors duration-500"
                  style={{ borderColor: accent.border }}
                >
                  <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Daily Avg
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-white tabular-nums mt-0.5">
                    {metrics.targetCalories.toLocaleString()}
                  </div>
                  <div
                    className="text-[10px] font-medium mt-0.5 transition-colors duration-500 truncate"
                    style={{ color: accent.text }}
                  >
                    {selectedGoal.tag}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B0D11] border border-white/[0.07]">
                  <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Lift Days ({trainingDays}x)
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-white tabular-nums mt-0.5">
                    {metrics.trainingDayCalories.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 truncate">
                    High-carb fuel
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B0D11] border border-white/[0.07]">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400">
                    Rest Days ({7 - trainingDays}x)
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-white tabular-nums mt-0.5">
                    {metrics.restDayCalories.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 truncate">
                    Recovery kcal
                  </div>
                </div>
              </div>

              {/* Macro Split Ratio Bar + 3 Columns */}
              <div className="gsap-step-item p-3.5 rounded-2xl bg-[#0B0D11] border border-white/[0.07] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    Daily Macro Allocation
                  </span>
                  <span className="text-zinc-400 tabular-nums">
                    {metrics.proteinPct}% P · {metrics.carbsPct}% C ·{" "}
                    {metrics.fatPct}% F
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex gap-1">
                  <div
                    style={{
                      width: `${metrics.proteinPct}%`,
                      backgroundColor: accent.hex,
                    }}
                    className="h-full rounded-l-full transition-all duration-500"
                  />
                  <div
                    style={{ width: `${metrics.carbsPct}%` }}
                    className="h-full bg-white/85 transition-all duration-500"
                  />
                  <div
                    style={{ width: `${metrics.fatPct}%` }}
                    className="h-full rounded-r-full bg-zinc-500 transition-all duration-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-[10px] text-zinc-400">Protein</div>
                    <div className="text-base sm:text-lg font-bold text-white tabular-nums">
                      {metrics.proteinG}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-[10px] text-zinc-400">Carbs</div>
                    <div className="text-base sm:text-lg font-bold text-white tabular-nums">
                      {metrics.carbsG}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-[10px] text-zinc-400">Fats</div>
                    <div className="text-base sm:text-lg font-bold text-white tabular-nums">
                      {metrics.fatG}g
                    </div>
                  </div>
                </div>
              </div>

              {/* Planned Weekly PT Training Architecture */}
              <div className="gsap-step-item p-3.5 rounded-2xl bg-[#0B0D11] border border-white/[0.07] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">
                    {metrics.splitName}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors duration-500"
                    style={{
                      backgroundColor: accent.softBg,
                      color: accent.text,
                    }}
                  >
                    {metrics.stepTarget} steps/day
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
                  {metrics.schedule.map((slot) => (
                    <div
                      key={slot.day}
                      className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] flex sm:block items-center justify-between gap-2"
                    >
                      <div
                        className="text-[10px] font-bold uppercase transition-colors duration-500 shrink-0"
                        style={{ color: accent.text }}
                      >
                        {slot.day}
                      </div>
                      <div className="text-[10px] font-medium text-zinc-300 sm:mt-0.5 leading-tight text-right sm:text-left">
                        {slot.focus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Pinned Bottom Footer Action Bar (Anchored in Place — Never Jumps!) ── */}
        <div className="relative z-10 border-t border-white/[0.07] bg-[#14171E]/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={() => goToStep((step - 1) as StepNum)}
              className="px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              ← Back
            </button>
          ) : (
            <div className="text-xs text-zinc-400">
              <span className="hidden sm:inline">Target Intake: </span>
              <strong className="text-white tabular-nums">
                {metrics.targetCalories.toLocaleString()} kcal/day
              </strong>
            </div>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handlePrimaryAction}
              style={{
                backgroundColor: accent.hex,
                boxShadow: `0 10px 28px ${accent.glow}`,
              }}
              className="px-5 py-3 rounded-xl text-black font-bold text-xs sm:text-sm tracking-tight hover:brightness-105 active:scale-[0.99] transition-all duration-300 cursor-pointer ml-auto"
            >
              {step === 4 ? "Submit & Unlock Blueprint →" : "Continue →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setUnreadBotAlert(false);
                setShowBotBanner(false);
                setViewMode("whatsapp");
              }}
              className="px-4 sm:px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#2be06f] active:scale-[0.99] text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_10px_28px_rgba(37,211,102,0.28)] transition-all cursor-pointer ml-auto"
            >
              <span>View What the PT Receives on WhatsApp</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render the Automated Backend -> WhatsApp Bot -> PT View
  const renderWhatsAppDemo = () => (
    <div className="w-full max-w-[520px] mx-auto space-y-3">
      {/* Backend -> WhatsApp Bot Telemetry Pipeline Strip */}
      <div className="rounded-2xl bg-[#11151C] border border-white/[0.08] p-3.5 flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span className="font-semibold text-zinc-200">
            1. Client Submits Funnel
          </span>
        </div>
        <span className="text-zinc-600">→</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span className="font-semibold text-zinc-200">
            2. Backend Scores Lead
          </span>
        </div>
        <span className="text-zinc-600">→</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="font-bold text-[#25D366]">3. Bot Alerts PT</span>
        </div>
      </div>

      {/* PT's Phone — Chat with Qualfi WhatsApp Lead Bot */}
      <div className="rounded-3xl bg-[#0F171A] border border-white/10 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
        {/* WhatsApp Bot Header */}
        <div className="bg-[#182329] px-4 sm:px-5 py-4 border-b border-white/[0.08] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-black font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(37,211,102,0.35)]">
              BOT
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-white truncate">
                  Qualfi WhatsApp Bot
                </span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366]">
                  OFFICIAL BOT ✓
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                Automated Backend Lead Dispatch → PT’s Phone
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyBrief}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-zinc-200 transition-colors cursor-pointer shrink-0"
          >
            {copiedBrief ? "✓ Copied" : "Copy Dossier"}
          </button>
        </div>

        {/* WhatsApp Message Thread */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-[#0B1215]">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.05] text-[10px] sm:text-[11px] text-zinc-400">
              Triggered automatically via backend when client submits Step 04
            </span>
          </div>

          {/* Incoming Bot Alert Bubble to the PT */}
          <div className="rounded-2xl rounded-tl-sm bg-[#1B272E] border border-white/[0.08] p-4 text-xs sm:text-[13px] text-zinc-100 whitespace-pre-line leading-relaxed shadow-md">
            {botMessageToPT}
            <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-3 pt-2 border-t border-white/[0.06]">
              <span>Dispatched via Qualfi API</span>
              <span className="text-[#25D366] font-semibold">
                Delivered in 0.6s ✓✓
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F4F4F6] font-sans antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Custom range slider styles */}
      <style>{`
        .demo-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 7px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          touch-action: pan-y;
          transition: background 0.25s ease;
        }
        .demo-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #ffffff;
          border: 2px solid #0B0D11;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .demo-range::-webkit-slider-thumb:active {
          transform: scale(1.12);
        }
        .demo-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #ffffff;
          border: 2px solid #0B0D11;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
          transition: transform 0.15s ease;
        }
      `}</style>

      {/* Live Slide-Down Bot Dispatch Notification Toast (when submitting Step 4 in Funnel View) */}
      {showBotBanner && viewMode === "funnel" && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md rounded-2xl bg-[#142026]/95 border border-[#25D366]/50 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-black font-black text-[11px] flex items-center justify-center shrink-0">
              BOT
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                WhatsApp Bot Dispatched to PT ✓
              </div>
              <div className="text-[11px] text-zinc-300 truncate">
                {clientDisplayName}’s lead dossier just landed on the PT’s phone
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowBotBanner(false);
              setUnreadBotAlert(false);
              setViewMode("whatsapp");
            }}
            className="px-3 py-1.5 rounded-xl bg-[#25D366] text-black font-bold text-xs shrink-0 cursor-pointer"
          >
            View Bot →
          </button>
        </div>
      )}

      {/* TOP DEMO SWITCHER BAR — Optimized for Mobile & Desktop */}
      <div className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0D12]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          {/* Left: View Switcher Tabs + Early Access Beta Pill */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
            <div className="grid grid-cols-2 md:inline-flex flex-1 sm:flex-initial items-center rounded-xl bg-black/60 p-1 border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setViewMode("funnel")}
                className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  viewMode === "funnel"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                1. Client Funnel
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnreadBotAlert(false);
                  setShowBotBanner(false);
                  setViewMode("whatsapp");
                }}
                className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer relative ${
                  viewMode === "whatsapp"
                    ? "bg-[#25D366] text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    unreadBotAlert
                      ? "bg-[#25D366] animate-ping"
                      : "bg-current"
                  }`}
                />
                <span>2. PT WhatsApp Bot</span>
                {unreadBotAlert && viewMode !== "whatsapp" && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#25D366] text-black text-[9px] font-black">
                    NEW
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnreadBotAlert(false);
                  setShowBotBanner(false);
                  setViewMode("split");
                }}
                className={`hidden md:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  viewMode === "split"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Split View
              </button>
            </div>

            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Early Access Demo · Beta
            </span>
          </div>

          {/* Second Row on Mobile: Accent Theme Dots + Step Quick Jump */}
          <div className="flex items-center justify-between sm:justify-end gap-3 px-0.5 sm:px-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">Accent:</span>
              {(Object.keys(ACCENTS) as AccentKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-label={ACCENTS[k].name}
                  title={ACCENTS[k].name}
                  onClick={() => setAccentKey(k)}
                  className={`w-5 h-5 rounded-full transition-all duration-300 cursor-pointer ${
                    accentKey === k
                      ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0B0D12]"
                      : "opacity-55 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{ backgroundColor: ACCENTS[k].hex }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (viewMode === "whatsapp") setViewMode("funnel");
                goToStep(step === 5 ? 1 : 5);
              }}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] active:scale-[0.98] text-zinc-200 transition-all cursor-pointer"
            >
              {step === 5 ? "Reset to Step 1" : "Simulate Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-4 py-5 sm:py-10">
        {/* Early Access / Beta Notice Pill above the Demo */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/20 text-[11px] text-amber-200/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>Early Access Demo</strong> · Currently in beta &amp;
              active development
            </span>
          </div>
        </div>

        <div ref={viewStageRef}>
          {viewMode === "funnel" && renderFunnel()}
          {viewMode === "whatsapp" && renderWhatsAppDemo()}
          {viewMode === "split" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">{renderFunnel()}</div>
              <div className="lg:col-span-5 lg:sticky lg:top-20">
                {renderWhatsAppDemo()}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-[11px] text-zinc-500 space-y-1">
        <p className="font-semibold text-zinc-400">
          Early Access Demo · Beta Build (In Active Development)
        </p>
        <p className="text-zinc-600">
          1:1 Performance &amp; Nutrition Diagnostic Preview
        </p>
      </footer>
    </div>
  );
}
