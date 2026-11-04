"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";

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
    desc: "Drop body fat steadily while preserving lean tissue and gym strength.",
    deltaPct: -0.2,
    proteinPerKg: 2.25,
    weeklyRateKg: 0.6,
  },
  {
    id: "recomp",
    title: "Lean Body Recomposition",
    tag: "-8% Micro-Deficit",
    desc: "Simultaneously reduce body fat percentage and build dense muscle.",
    deltaPct: -0.08,
    proteinPerKg: 2.2,
    weeklyRateKg: 0.35,
  },
  {
    id: "build",
    title: "Hypertrophy & Lean Mass",
    tag: "+12% Surplus",
    desc: "Fuel progressive overload and lean muscle growth with minimal fat gain.",
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
    title: "Full Gym · Hypertrophy & Strength",
    sub: "Barbells, cables & machines",
  },
  {
    id: "hybrid",
    title: "Hybrid · Lift + Conditioning",
    sub: "Strength blocks + engine work",
  },
  {
    id: "minimal",
    title: "Home / Dumbbells Only",
    sub: "High-efficiency minimal kit",
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
    title: "Desk-Based Lifestyle",
    steps: "< 5,000 steps/day",
    desc: "Mostly seated workday with minimal daily walking",
    mult: 1.3,
  },
  {
    id: "light",
    title: "Light Daily Movement",
    steps: "6,000–8,500 steps/day",
    desc: "Desk work plus intentional daily walks",
    mult: 1.46,
  },
  {
    id: "moderate",
    title: "Active Lifestyle",
    steps: "9,000–11,500 steps/day",
    desc: "On your feet regularly throughout the day",
    mult: 1.62,
  },
  {
    id: "high",
    title: "High Physical Output",
    steps: "12,000+ steps/day",
    desc: "Demanding physical schedule or high daily step volume",
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
    title: "Nutrition & Weekend Consistency",
    desc: "Staying on track with calories and protein when life gets busy",
  },
  {
    id: "overload",
    title: "Structured Training & Progression",
    desc: "Following a periodized training split instead of random workouts",
  },
  {
    id: "plateau",
    title: "Breaking a Physique Plateau",
    desc: "Training consistently but body composition has stalled",
  },
  {
    id: "accountability",
    title: "Weekly Coaching Accountability",
    desc: "Having expert check-ins and adjustments every single week",
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
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);
  const [replySent, setReplySent] = useState<boolean>(false);

  // Smooth Step Stage Height Measurement (eliminates height snap jumps)
  const stepRefs = useRef<Record<StepNum, HTMLDivElement | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [stageHeight, setStageHeight] = useState<number | undefined>(undefined);

  const updateStageHeight = useCallback(() => {
    const activeEl = stepRefs.current[step];
    if (activeEl) {
      setStageHeight(activeEl.offsetHeight);
    }
  }, [step]);

  useEffect(() => {
    updateStageHeight();
    const activeEl = stepRefs.current[step];
    if (!activeEl || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setStageHeight(activeEl.offsetHeight);
    });
    observer.observe(activeEl);
    return () => observer.disconnect();
  }, [step, viewMode, formError, updateStageHeight]);

  const accent = ACCENTS[accentKey];

  const goToStep = (next: StepNum) => {
    setFormError("");
    setStep(next);
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
        ? "3-Day Full-Body Progressive Split"
        : trainingDays === 4
          ? "4-Day Upper / Lower Hypertrophy Split"
          : "5-Day Push / Pull / Legs + Upper / Lower";

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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setFormError("Enter your first name to generate your training blueprint.");
      return;
    }
    if (whatsapp.replace(/\D/g, "").length < 7) {
      setFormError("Enter a valid WhatsApp number to unlock your results.");
      return;
    }
    setFormError("");
    goToStep(5);
  };

  const whatsappPayload = `Hi! I just completed the 12-Week Training & Nutrition Diagnostic.

*Client Profile:*
• Name: ${firstName.trim() || "Alex"}
• Baseline: ${age}y ${sex === "male" ? "Male" : "Female"} · ${formatHeight(heightCm)} · ${formatWeight(weightKg)} → Goal: ${formatWeight(targetWeightKg)}
• Phase: ${selectedGoal.title} (~${metrics.estWeeks} weeks)

*Training Plan:*
• Split: ${metrics.splitName} (${trainingDays}x/wk)
• Setup: ${selectedStyle.title}
• Primary Focus: ${selectedBottleneck.title}

*Calculated Nutrition:*
• Daily Avg: ${metrics.targetCalories.toLocaleString()} kcal (${metrics.proteinG}g P / ${metrics.carbsG}g C / ${metrics.fatG}g F)
• Training Days: ${metrics.trainingDayCalories.toLocaleString()} kcal | Rest Days: ${metrics.restDayCalories.toLocaleString()} kcal
• 1:1 Coaching Status: ${selectedIntent.title}`;

  const handleCopyBrief = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(whatsappPayload);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    }
  };

  // Helper class for each persistent step layer so transitions glide with zero DOM mount jump
  const getStepLayerClass = (panelStep: StepNum) => {
    const isActive = step === panelStep;
    const isPast = panelStep < step;
    return [
      "w-full transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity]",
      isActive
        ? "relative z-10 opacity-100 translate-x-0 scale-100 pointer-events-auto"
        : isPast
          ? "absolute inset-x-0 top-0 z-0 opacity-0 -translate-x-7 scale-[0.985] pointer-events-none select-none"
          : "absolute inset-x-0 top-0 z-0 opacity-0 translate-x-7 scale-[0.985] pointer-events-none select-none",
    ].join(" ");
  };

  // Render the PT Funnel Card
  const renderFunnel = () => (
    <div className="w-full max-w-[520px] mx-auto">
      {/* Editorial PT Header Card */}
      <div className="rounded-3xl bg-[#111318]/95 border border-white/[0.08] p-4 sm:p-6 mb-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative overflow-hidden transition-all duration-500">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-25 transition-colors duration-700"
          style={{ backgroundColor: accent.hex }}
        />

        <div className="relative flex items-center justify-between gap-2 mb-3">
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
          <span className="text-[11px] font-medium text-zinc-400 tabular-nums shrink-0">
            60-Sec Diagnostic
          </span>
        </div>

        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug">
          Custom Training Split & Macro Calculator
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
          Calibrate your exact training-day calories, protein targets, and
          weekly lifting split based on your body metrics and schedule.
        </p>

        {/* Live Data Telemetry Strip */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.07] grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-black/40 border border-white/[0.05] py-2 px-1.5">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              Est. BMR
            </div>
            <div className="text-xs sm:text-sm font-bold text-white tabular-nums mt-0.5">
              {metrics.bmr.toLocaleString()} kcal
            </div>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/[0.05] py-2 px-1.5">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              Maintenance
            </div>
            <div className="text-xs sm:text-sm font-bold text-white tabular-nums mt-0.5">
              {metrics.tdee.toLocaleString()} kcal
            </div>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/[0.05] py-2 px-1.5">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              Est. Timeline
            </div>
            <div
              className="text-xs sm:text-sm font-bold tabular-nums mt-0.5 transition-colors duration-500"
              style={{ color: accent.text }}
            >
              ~{metrics.estWeeks} Weeks
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress Bar — Smooth Collapsible Wrapper */}
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] px-1 ${
          step < 5
            ? "grid-rows-[1fr] opacity-100 mb-4"
            : "grid-rows-[0fr] opacity-0 mb-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
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
                  disabled={item.n > step}
                  onClick={() => {
                    if (item.n < step) goToStep(item.n as StepNum);
                  }}
                  className={`text-left group py-1 transition-opacity ${
                    item.n < step ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        width: isCurrent || isDone ? "100%" : "0%",
                        backgroundColor: isCurrent
                          ? accent.hex
                          : isDone
                            ? `${accent.hex}99`
                            : "transparent",
                        boxShadow: isCurrent
                          ? `0 0 12px ${accent.glow}`
                          : "none",
                      }}
                    />
                  </div>
                  <span
                    className={`block text-[10px] sm:text-[11px] font-medium mt-1.5 truncate transition-colors duration-300 ${
                      isCurrent
                        ? "text-white font-semibold"
                        : isDone
                          ? "text-zinc-300 group-hover:text-white"
                          : "text-zinc-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Card with Smooth Height Morphing & Layered Cross-Glide */}
      <div className="rounded-3xl bg-[#111318]/95 border border-white/[0.08] p-4 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] overflow-hidden">
        <div
          className="relative transition-[height] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[height]"
          style={{
            height: stageHeight ? `${stageHeight}px` : undefined,
          }}
        >
          {/* STEP 1: BIOMETRICS */}
          <div
            ref={(el) => {
              stepRefs.current[1] = el;
            }}
            aria-hidden={step !== 1}
            className={getStepLayerClass(1)}
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-500"
                    style={{ color: accent.text }}
                  >
                    Step 01 · Body Metrics
                  </span>
                  <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">
                    Your current baseline & goal weight
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
              <div className="grid grid-cols-2 gap-2.5">
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
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 active:scale-[0.98] cursor-pointer ${
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
                          className="w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300"
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

              {/* Custom Filled Sliders */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2.5">
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
                    <div className="flex items-center justify-between mb-2.5">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2.5">
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
                    <div className="flex items-center justify-between mb-2.5">
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
                      onChange={(e) =>
                        setTargetWeightKg(Number(e.target.value))
                      }
                      style={{
                        background: `linear-gradient(to right, ${accent.hex} 0%, ${accent.hex} ${pct(targetWeightKg, 45, 130)}, rgba(255,255,255,0.1) ${pct(targetWeightKg, 45, 130)})`,
                      }}
                      className="demo-range"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToStep(2)}
                style={{
                  backgroundColor: accent.hex,
                  boxShadow: `0 12px 32px ${accent.glow}`,
                }}
                className="w-full py-4 px-5 rounded-2xl text-black font-bold text-sm tracking-tight hover:brightness-105 active:scale-[0.99] transition-all duration-300 cursor-pointer"
              >
                Continue to Training Setup →
              </button>
            </div>
          </div>

          {/* STEP 2: TRAINING ARCHITECTURE & GOAL */}
          <div
            ref={(el) => {
              stepRefs.current[2] = el;
            }}
            aria-hidden={step !== 2}
            className={getStepLayerClass(2)}
          >
            <div className="space-y-5">
              <div>
                <span
                  className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-500"
                  style={{ color: accent.text }}
                >
                  Step 02 · Training & Phase
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">
                  Plan around your training schedule
                </h2>
              </div>

              {/* Goal Cards */}
              <div className="space-y-2.5">
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
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 active:scale-[0.99] cursor-pointer ${
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
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors duration-300 shrink-0"
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
                      <p className="text-xs text-zinc-400 mt-1">{g.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Training Days Per Week */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    Weekly Training Frequency
                  </label>
                  <span
                    className="text-[11px] font-semibold truncate transition-colors duration-500"
                    style={{ color: accent.text }}
                  >
                    {metrics.splitName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { d: 3, label: "3 Days / wk", sub: "Full Body" },
                      { d: 4, label: "4 Days / wk", sub: "Upper / Lower" },
                      { d: 5, label: "5 Days / wk", sub: "PPL + Hybrid" },
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
                        className={`p-3 rounded-2xl border text-center transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] text-zinc-400 hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold text-white">
                          {item.label}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">
                          {item.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Training Style / Equipment */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Training Style & Equipment Access
                </label>
                <div className="space-y-2">
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
                        className={`w-full py-3 px-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-300 active:scale-[0.99] cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] text-zinc-300 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-white">
                            {s.title}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {s.sub}
                          </div>
                        </div>
                        <span
                          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
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

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-4 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  style={{
                    backgroundColor: accent.hex,
                    boxShadow: `0 12px 32px ${accent.glow}`,
                  }}
                  className="flex-1 py-4 px-5 rounded-2xl text-black font-bold text-sm tracking-tight hover:brightness-105 active:scale-[0.99] transition-all duration-300 cursor-pointer"
                >
                  Continue to Lifestyle →
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: DAILY ACTIVITY & COACHING BOTTLENECK */}
          <div
            ref={(el) => {
              stepRefs.current[3] = el;
            }}
            aria-hidden={step !== 3}
            className={getStepLayerClass(3)}
          >
            <div className="space-y-5">
              <div>
                <span
                  className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-500"
                  style={{ color: accent.text }}
                >
                  Step 03 · Expenditure & Focus
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">
                  Daily movement & primary bottleneck
                </h2>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Daily Activity Outside Training (NEAT)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {a.title}
                          </span>
                        </div>
                        <div
                          className="text-[11px] font-semibold mt-0.5 transition-colors duration-300"
                          style={{ color: active ? accent.text : "#A1A1AA" }}
                        >
                          {a.steps}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          {a.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coaching Bottleneck */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Where would 1:1 coaching make the biggest difference?
                </label>
                <div className="space-y-2">
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
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-300 active:scale-[0.99] cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white">
                            {b.title}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {b.desc}
                          </div>
                        </div>
                        <span
                          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
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

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-4 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  style={{
                    backgroundColor: accent.hex,
                    boxShadow: `0 12px 32px ${accent.glow}`,
                  }}
                  className="flex-1 py-4 px-5 rounded-2xl text-black font-bold text-sm tracking-tight hover:brightness-105 active:scale-[0.99] transition-all duration-300 cursor-pointer"
                >
                  Generate My 12-Week Blueprint →
                </button>
              </div>
            </div>
          </div>

          {/* STEP 4: DATA-BACKED BLUEPRINT GATE */}
          <div
            ref={(el) => {
              stepRefs.current[4] = el;
            }}
            aria-hidden={step !== 4}
            className={getStepLayerClass(4)}
          >
            <form onSubmit={handleUnlock} className="space-y-5">
              {/* Locked Data Preview Banner */}
              <div
                className="rounded-2xl p-3.5 sm:p-4 border bg-[#0B0D11] transition-colors duration-500"
                style={{ borderColor: accent.border }}
              >
                <div className="flex items-center justify-between text-[11px] mb-3 gap-2">
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
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] sm:text-[10px] uppercase text-zinc-500">
                      Training Day
                    </div>
                    <div className="text-xs sm:text-base font-bold text-white mt-0.5 blur-[4px] select-none">
                      {metrics.trainingDayCalories} kcal
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] sm:text-[10px] uppercase text-zinc-500">
                      Daily Protein
                    </div>
                    <div
                      className="text-xs sm:text-base font-bold mt-0.5 blur-[4px] select-none transition-colors duration-500"
                      style={{ color: accent.text }}
                    >
                      {metrics.proteinG}g / day
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] sm:text-[10px] uppercase text-zinc-500">
                      Goal Horizon
                    </div>
                    <div className="text-xs sm:text-base font-bold text-white mt-0.5">
                      ~{metrics.estWeeks} Weeks
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-xl font-bold text-white">
                  Unlock your training & nutrition blueprint
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  View your complete calorie cycling, macro split, and weekly
                  training schedule immediately.
                </p>
              </div>

              {/* 16px text-base on mobile prevents iOS Safari auto-zoom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
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
                    className="w-full px-3.5 py-3 rounded-xl bg-[#0B0D11] border border-white/[0.1] text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
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
                    className="w-full px-3.5 py-3 rounded-xl bg-[#0B0D11] border border-white/[0.1] text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              {/* Coaching Qualification */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  1:1 PT Coaching Interest
                </label>
                <div className="space-y-2">
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
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-300 active:scale-[0.99] cursor-pointer ${
                          active
                            ? "text-white"
                            : "bg-[#0B0D11] border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {item.title}
                            </span>
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300"
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
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {item.sub}
                          </div>
                        </div>
                        <span
                          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
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
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5 animate-fade-in-up">
                  {formError}
                </p>
              )}

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-4 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: accent.hex,
                    boxShadow: `0 12px 32px ${accent.glow}`,
                  }}
                  className="flex-1 py-4 px-5 rounded-2xl text-black font-bold text-sm tracking-tight hover:brightness-105 active:scale-[0.99] transition-all duration-300 cursor-pointer"
                >
                  Unlock Full 12-Week Blueprint →
                </button>
              </div>
            </form>
          </div>

          {/* STEP 5: UNLOCKED DATA-BACKED PT BLUEPRINT */}
          <div
            ref={(el) => {
              stepRefs.current[5] = el;
            }}
            aria-hidden={step !== 5}
            className={getStepLayerClass(5)}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4 gap-2">
                <div>
                  <span
                    className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors duration-500"
                    style={{ color: accent.text }}
                  >
                    Custom 12-Week Blueprint · {firstName.trim() || "Client"}
                  </span>
                  <h2 className="text-base sm:text-xl font-bold text-white mt-0.5">
                    {selectedGoal.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors cursor-pointer shrink-0"
                >
                  Recalculate
                </button>
              </div>

              {/* Calorie Cycling & Goal Projection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div
                  className="p-4 rounded-2xl border bg-[#0B0D11] transition-colors duration-500"
                  style={{ borderColor: accent.border }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Daily Average
                  </div>
                  <div className="text-2xl font-extrabold text-white tabular-nums mt-1">
                    {metrics.targetCalories.toLocaleString()}{" "}
                    <span className="text-xs font-medium text-zinc-400">
                      kcal
                    </span>
                  </div>
                  <div
                    className="text-[11px] font-medium mt-1 transition-colors duration-500"
                    style={{ color: accent.text }}
                  >
                    {selectedGoal.tag} from TDEE
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:contents gap-2.5">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B0D11] border border-white/[0.07]">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Lift Days ({trainingDays}x)
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white tabular-nums mt-1">
                      {metrics.trainingDayCalories.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-zinc-400">
                        kcal
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      High-carb fuel
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B0D11] border border-white/[0.07]">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Rest Days ({7 - trainingDays}x)
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white tabular-nums mt-1">
                      {metrics.restDayCalories.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-zinc-400">
                        kcal
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Recovery baseline
                    </div>
                  </div>
                </div>
              </div>

              {/* Macro Split Ratio Bar + 3 Columns */}
              <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/[0.07] space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    Daily Macro Allocation
                  </span>
                  <span className="text-zinc-400 tabular-nums">
                    {metrics.proteinPct}% P · {metrics.carbsPct}% C ·{" "}
                    {metrics.fatPct}% F
                  </span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-zinc-900 overflow-hidden flex gap-1">
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

                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: accent.hex }}
                      />
                      <span className="text-[11px] font-semibold text-zinc-300">
                        Protein
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white tabular-nums mt-1">
                      {metrics.proteinG}g
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      ~{Math.round(metrics.proteinG / 4)}g × 4 meals
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white/85" />
                      <span className="text-[11px] font-semibold text-zinc-300">
                        Carbs
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white tabular-nums mt-1">
                      {metrics.carbsG}g
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      Peri-workout
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-zinc-500" />
                      <span className="text-[11px] font-semibold text-zinc-300">
                        Fats
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white tabular-nums mt-1">
                      {metrics.fatG}g
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      Hormone floor
                    </div>
                  </div>
                </div>
              </div>

              {/* Planned Weekly PT Training Architecture */}
              <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/[0.07] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Recommended Training Split
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                      {metrics.splitName}
                    </h3>
                  </div>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 transition-colors duration-500"
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
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex sm:block items-center justify-between gap-2"
                    >
                      <div
                        className="text-[10px] font-bold uppercase transition-colors duration-500 shrink-0"
                        style={{ color: accent.text }}
                      >
                        {slot.day}
                      </div>
                      <div className="text-[11px] font-medium text-zinc-200 sm:mt-0.5 leading-snug text-right sm:text-left">
                        {slot.focus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Consultation Handoff */}
              <div className="pt-1 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setViewMode("whatsapp")}
                  className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#2be06f] active:scale-[0.99] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_12px_30px_rgba(37,211,102,0.28)] transition-all cursor-pointer"
                >
                  <span>Send Blueprint to Coach on WhatsApp</span>
                  <span>→</span>
                </button>
                <p className="text-[11px] text-center text-zinc-500">
                  Opens WhatsApp with your calculated macros & training split
                  ready to send.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the Coach WhatsApp Lead Cockpit View
  const renderWhatsAppDemo = () => (
    <div className="w-full max-w-[500px] mx-auto">
      <div className="rounded-3xl bg-[#0F171A] border border-white/10 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
        {/* Coach Lead Intelligence Header */}
        <div className="bg-[#182329] px-4 sm:px-5 py-4 border-b border-white/[0.08] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-black font-extrabold text-sm flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(37,211,102,0.35)]">
              {(firstName.trim()?.[0] || "A").toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white truncate">
                  {firstName.trim() || "Alex"} · Bio-Link Lead
                </span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366]">
                  {selectedIntent.tag}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                {whatsapp.trim() || "+44 7700 900077"} · Verified via Funnel
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyBrief}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-zinc-200 transition-colors cursor-pointer shrink-0"
          >
            {copiedBrief ? "✓ Copied" : "Copy Brief"}
          </button>
        </div>

        {/* Structured Lead Telemetry Bar for the PT */}
        <div className="grid grid-cols-3 gap-2 p-3 sm:p-3.5 bg-[#121B20] border-b border-white/[0.06] text-center">
          <div className="p-2 rounded-xl bg-black/30">
            <div className="text-[9px] sm:text-[10px] uppercase text-zinc-400">
              Goal
            </div>
            <div className="text-xs font-bold text-white truncate mt-0.5">
              {selectedGoal.title.split(" ")[0]}{" "}
              {selectedGoal.title.split(" ")[1]}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-black/30">
            <div className="text-[9px] sm:text-[10px] uppercase text-zinc-400">
              Split
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {trainingDays} Days / Wk
            </div>
          </div>
          <div className="p-2 rounded-xl bg-black/30">
            <div className="text-[9px] sm:text-[10px] uppercase text-zinc-400">
              Target
            </div>
            <div className="text-xs font-bold text-[#25D366] tabular-nums mt-0.5">
              {metrics.targetCalories.toLocaleString()} kcal
            </div>
          </div>
        </div>

        {/* WhatsApp Message Thread */}
        <div className="p-4 sm:p-5 space-y-4 bg-[#0B1215]">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.05] text-[10px] sm:text-[11px] text-zinc-400">
              Auto-populated when client taps &ldquo;Send Blueprint&rdquo;
            </span>
          </div>

          {/* Incoming Client Message Bubble */}
          <div
            className="rounded-2xl rounded-tl-sm bg-[#1B272E] border border-white/[0.07] p-3.5 sm:p-4 text-xs sm:text-[13px] text-zinc-100 whitespace-pre-line leading-relaxed shadow-md animate-ticket-item"
            style={{ animationDelay: "50ms" }}
          >
            {whatsappPayload}
            <div className="text-[10px] text-zinc-400 text-right mt-2">
              Just now · Delivered
            </div>
          </div>

          {/* Example 1-Tap Coach Reply */}
          <div
            className="rounded-2xl rounded-tr-sm bg-[#005C4B] p-3.5 sm:p-4 text-xs sm:text-[13px] text-white leading-relaxed ml-4 sm:ml-8 shadow-md animate-ticket-item"
            style={{ animationDelay: "140ms" }}
          >
            Hey {firstName.trim() || "Alex"}! Just reviewed your{" "}
            {metrics.targetCalories.toLocaleString()} kcal blueprint and{" "}
            {trainingDays}-day split. Since your main focus is{" "}
            {selectedBottleneck.title.toLowerCase()}, I have 2 spots open this
            week to build your full 12-week program—are you free for a quick
            10-min chat today?
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-emerald-200/80">
              <span>Suggested 1-Tap PT Reply</span>
              <button
                type="button"
                onClick={() => setReplySent((prev) => !prev)}
                className="font-bold underline underline-offset-2 cursor-pointer"
              >
                {replySent ? "Sent ✓✓" : "Simulate Send →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F4F4F6] font-sans antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Scoped smooth animations & custom range slider styles */}
      <style>{`
        @keyframes demoViewSwitch {
          from {
            opacity: 0;
            transform: translate3d(0, 8px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .demo-view-transition {
          animation: demoViewSwitch 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
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

      {/* TOP DEMO SWITCHER BAR — Optimized for Mobile & Desktop */}
      <div className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0D12]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          {/* Top Row on Mobile: View Switcher Tabs */}
          <div className="grid grid-cols-2 md:inline-flex items-center rounded-xl bg-black/60 p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode("funnel")}
              className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === "funnel"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              PT Funnel Demo
            </button>
            <button
              type="button"
              onClick={() => setViewMode("whatsapp")}
              className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                viewMode === "whatsapp"
                  ? "bg-[#25D366] text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              WhatsApp Demo
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden md:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === "split"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Split View
            </button>
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
              {step === 5 ? "Reset to Step 1" : "Preview Unlocked Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA with Animated View Switch */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-4 py-5 sm:py-10">
        <div key={viewMode} className="demo-view-transition">
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

      <footer className="py-6 text-center text-[11px] text-zinc-600">
        1:1 Performance & Nutrition Diagnostic · Interactive Demo
      </footer>
    </div>
  );
}
