"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { playWhatsAppPing } from "@/lib/audio";
import {
  BlurCrossfadeIcon,
  EASE_IN_OUT,
  listContainerVariants,
  listRowVariants,
  OverlapTransitionStage,
  RubberBandSurface,
  settleContainerVariants,
  settleItemVariants,
  SHARED_LAYOUT_TRANSITION,
  TriggerPopover,
} from "@/lib/wabi-motion";

type ViewMode = "funnel" | "whatsapp" | "split";
type AccentKey = "terracotta" | "moss" | "ochre" | "indigo";
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
    sub: string;
    hex: string;
    softBg: string;
    border: string;
    text: string;
    glow: string;
  }
> = {
  terracotta: {
    name: "Kiln Terracotta",
    sub: "Fired raw clay",
    hex: "#D27652",
    softBg: "rgba(210, 118, 82, 0.13)",
    border: "rgba(210, 118, 82, 0.45)",
    text: "#E08A68",
    glow: "rgba(210, 118, 82, 0.25)",
  },
  moss: {
    name: "Matcha Moss",
    sub: "Forest lichen",
    hex: "#688F71",
    softBg: "rgba(104, 143, 113, 0.14)",
    border: "rgba(104, 143, 113, 0.45)",
    text: "#84AB8D",
    glow: "rgba(104, 143, 113, 0.25)",
  },
  ochre: {
    name: "Raw Ochre",
    sub: "Kintsugi brass",
    hex: "#C89D54",
    softBg: "rgba(200, 157, 84, 0.13)",
    border: "rgba(200, 157, 84, 0.45)",
    text: "#DAB36E",
    glow: "rgba(200, 157, 84, 0.24)",
  },
  indigo: {
    name: "Aizome Clay",
    sub: "Weathered slate",
    hex: "#7C92A6",
    softBg: "rgba(124, 146, 166, 0.14)",
    border: "rgba(124, 146, 166, 0.45)",
    text: "#9BB0C2",
    glow: "rgba(124, 146, 166, 0.24)",
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

/**
 * Custom Wabi Sabi Range Slider for `/demo`
 * - Rule 5: Stretch moving knobs by 12% (`scaleX: 1.12, scaleY: 0.92`) while held/moving.
 * - Rule 14: Do not tween while an item is held (`transition: "none"` during active drag).
 * - Rule 19: Allow elements to rubber band past their bounds when pulled past min/max.
 */
function DemoRangeControl({
  label,
  displayValue,
  min,
  max,
  value,
  onChange,
  accentHex,
  accentBorder,
  accentText,
  highlighted = false,
}: {
  label: string;
  displayValue: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  accentHex: string;
  accentBorder?: string;
  accentText?: string;
  highlighted?: boolean;
}) {
  const [isHeld, setIsHeld] = useState(false);
  const [rubberX, setRubberX] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pct = `${Math.round(((value - min) / (max - min)) * 100)}%`;

  const handlePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    if (!isHeld || !inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    if (e.clientX < rect.left) {
      setRubberX(-Math.log1p((rect.left - e.clientX) * 0.35) * 6);
    } else if (e.clientX > rect.right) {
      setRubberX(Math.log1p((e.clientX - rect.right) * 0.35) * 6);
    } else if (rubberX !== 0) {
      setRubberX(0);
    }
  };

  const releaseHold = () => {
    setIsHeld(false);
    setRubberX(0);
  };

  return (
    <div
      className="p-3.5 rounded-2xl bg-[#14120F] border"
      style={{
        borderColor: highlighted && accentBorder ? accentBorder : "rgba(237, 231, 221, 0.08)",
        transform: `translate3d(${rubberX}px, 0, 0)`,
        /* Rule 14: Do not tween while held; Rule 9: ease-in-out return on release */
        transition: isHeld
          ? "none"
          : "transform 0.24s cubic-bezier(0.65, 0, 0.35, 1), border-color 0.25s ease",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium"
          style={{ color: highlighted && accentText ? accentText : "#9E9489" }}
        >
          {label}
        </span>
        <span
          className="text-sm font-bold tabular-nums inline-block"
          style={{
            color: highlighted && accentText ? accentText : "#EDE7DD",
            /* Rule 5: Stretch moving readout/knob companion by 12% while dragging */
            transform: isHeld ? "scaleX(1.12) scaleY(0.92)" : "scaleX(1) scaleY(1)",
            transition: isHeld
              ? "none"
              : "transform 0.16s cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {displayValue}
        </span>
      </div>
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        value={value}
        onPointerDown={() => setIsHeld(true)}
        onPointerMove={handlePointerMove}
        onPointerUp={releaseHold}
        onPointerCancel={releaseHold}
        onBlur={releaseHold}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, ${accentHex} 0%, ${accentHex} ${pct}, rgba(237,231,221,0.12) ${pct})`,
          transition: isHeld ? "none" : "background 0.2s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
        className="demo-range"
      />
    </div>
  );
}

export function StandaloneDemo() {
  // Top Studio Bar state
  const [viewMode, setViewMode] = useState<ViewMode>("funnel");
  const [accentKey, setAccentKey] = useState<AccentKey>("terracotta");
  const [accentMenuOpen, setAccentMenuOpen] = useState<boolean>(false);

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

*Client Submitted via Funnel:*
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

  // Unified, Fixed-Architecture Wabi Sabi PT Funnel Card
  const renderFunnel = () => (
    <div className="w-full max-w-[540px] mx-auto">
      <div className="rounded-[28px_22px_30px_24px/24px_29px_22px_27px] bg-[#191714] border border-[#EDE7DD]/[0.09] shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between relative">
        {/* Subtle Ambient Wabi Sabi Clay Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-500"
          style={{ backgroundColor: accent.hex }}
        />

        {/* ── Card Top Telemetry & Progress Header (Always Fixed at Top) ── */}
        <div className="relative z-10 border-b border-[#EDE7DD]/[0.08] bg-[#201D19]/85 px-4 sm:px-6 pt-4 pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EDE7DD]/[0.05] border border-[#EDE7DD]/[0.08]">
              <span
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: accent.hex,
                  boxShadow: `0 0 10px ${accent.hex}`,
                }}
              />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#EDE7DD]">
                1:1 Performance &amp; Physique
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#12110F]/60 border border-[#EDE7DD]/[0.07] text-[11px] font-medium text-[#9E9489] tabular-nums">
                TDEE: {metrics.tdee.toLocaleString()} kcal
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tabular-nums transition-colors duration-300"
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

          {/* Step Tabs / Progress Line — Rule 9: ease-in-out */}
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
                  className="text-left group cursor-pointer active:scale-[0.97] transition-transform"
                >
                  <div className="h-1 w-full rounded-full bg-[#EDE7DD]/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
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
                    className={`block text-[10px] font-medium mt-1.5 truncate transition-colors duration-200 ${
                      isCurrent
                        ? "text-[#EDE7DD] font-semibold"
                        : isDone
                          ? "text-[#9E9489] group-hover:text-[#EDE7DD]"
                          : "text-[#6E655C] group-hover:text-[#9E9489]"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Rules 1, 15, 16: Consistent-Height Step Stage with OverlapTransitionStage ── */}
        <div className="relative z-10 min-h-[430px] sm:min-h-[450px] p-4 sm:p-6 flex flex-col justify-between">
          <OverlapTransitionStage activeKey={`demo-step-${step}`} enterDuration={0.28}>
            {/* STEP 1: BIOMETRICS */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300"
                      style={{ color: accent.text }}
                    >
                      Step 01 · Biometric Baseline
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#EDE7DD] mt-0.5">
                      Dial in your starting stats
                    </h2>
                  </div>

                  {/* Rule 20: Shared layoutId across Unit Switch */}
                  <div className="inline-flex rounded-xl bg-[#12110F] p-1 border border-[#EDE7DD]/[0.08] shrink-0">
                    {(["metric", "imperial"] as const).map((u) => {
                      const active = unit === u;
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setUnit(u)}
                          className={`relative z-10 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors duration-200 cursor-pointer active:scale-[0.97] ${
                            active
                              ? "text-[#12110F]"
                              : "text-[#9E9489] hover:text-[#EDE7DD]"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="demo-unit-pill"
                              transition={SHARED_LAYOUT_TRANSITION}
                              className="-z-10 absolute inset-0 rounded-lg bg-[#EDE7DD] shadow-xs"
                            />
                          )}
                          {u === "metric" ? "KG / CM" : "LBS / FT"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rule 20: Biological Sex with shared layoutId */}
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
                        className={`relative z-10 p-3.5 rounded-2xl border text-left transition-colors duration-200 cursor-pointer active:scale-[0.97] ${
                          active
                            ? "text-[#EDE7DD]"
                            : "bg-[#14120F] border-[#EDE7DD]/[0.07] text-[#9E9489] hover:border-[#EDE7DD]/20"
                        }`}
                        style={active ? { borderColor: accent.border } : undefined}
                      >
                        {active && (
                          <motion.span
                            layoutId="demo-sex-card-pill"
                            transition={SHARED_LAYOUT_TRANSITION}
                            className="-z-10 absolute inset-0 rounded-2xl"
                            style={{ backgroundColor: accent.softBg }}
                          />
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#EDE7DD]">
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
                                : { borderColor: "rgba(237,231,221,0.25)" }
                            }
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#12110F]" />
                            )}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#9E9489] mt-0.5">
                          {g.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Rules 5, 14, 19: Custom Sliders with 12% knob stretch, 0ms hold tween, and rubber-banding */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <DemoRangeControl
                    label="Age"
                    displayValue={`${age} yrs`}
                    min={18}
                    max={65}
                    value={age}
                    onChange={setAge}
                    accentHex={accent.hex}
                  />
                  <DemoRangeControl
                    label="Height"
                    displayValue={formatHeight(heightCm)}
                    min={148}
                    max={205}
                    value={heightCm}
                    onChange={setHeightCm}
                    accentHex={accent.hex}
                  />
                  <DemoRangeControl
                    label="Current Weight"
                    displayValue={formatWeight(weightKg)}
                    min={45}
                    max={140}
                    value={weightKg}
                    onChange={setWeightKg}
                    accentHex={accent.hex}
                  />
                  <DemoRangeControl
                    label="Target Weight"
                    displayValue={formatWeight(targetWeightKg)}
                    min={45}
                    max={130}
                    value={targetWeightKg}
                    onChange={setTargetWeightKg}
                    accentHex={accent.hex}
                    accentBorder={accent.border}
                    accentText={accent.text}
                    highlighted
                  />
                </div>

                {/* Live BMR / Timeline Strip */}
                <div className="rounded-2xl bg-[#12110F]/60 border border-[#EDE7DD]/[0.06] px-4 py-3 flex items-center justify-between text-xs">
                  <span className="text-[#9E9489]">
                    Resting BMR:{" "}
                    <strong className="text-[#EDE7DD] tabular-nums">
                      {metrics.bmr.toLocaleString()} kcal
                    </strong>
                  </span>
                  <span
                    className="font-semibold tabular-nums transition-colors duration-300"
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
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300"
                      style={{ color: accent.text }}
                    >
                      Step 02 · Training &amp; Phase
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#EDE7DD] mt-0.5">
                      Plan around your training split
                    </h2>
                  </div>
                  <span
                    className="text-[11px] font-semibold transition-colors duration-300 hidden sm:inline"
                    style={{ color: accent.text }}
                  >
                    {metrics.splitName}
                  </span>
                </div>

                {/* Rule 3: Goal Cards staggered by 30ms */}
                <motion.div
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {GOALS.map((g) => {
                    const active = goal === g.id;
                    return (
                      <motion.button
                        variants={listRowVariants}
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
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                          active
                            ? "text-[#EDE7DD]"
                            : "bg-[#14120F] border-[#EDE7DD]/[0.07] hover:border-[#EDE7DD]/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#EDE7DD]">
                            {g.title}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors duration-200 shrink-0"
                            style={
                              active
                                ? {
                                    backgroundColor: accent.hex,
                                    color: "#12110F",
                                  }
                                : {
                                    backgroundColor: "rgba(237,231,221,0.06)",
                                    color: "rgba(237,231,221,0.65)",
                                  }
                            }
                          >
                            {g.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#9E9489] mt-0.5">{g.desc}</p>
                      </motion.button>
                    );
                  })}
                </motion.div>

                {/* Rule 20: Compact Training Days + Equipment Grid with shared layoutId */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9E9489] mb-1.5">
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
                            style={active ? { borderColor: accent.border } : undefined}
                            className={`relative z-10 py-2.5 px-2 rounded-xl border text-center text-xs font-bold transition-colors duration-200 cursor-pointer active:scale-[0.97] ${
                              active
                                ? "text-[#EDE7DD]"
                                : "bg-[#14120F] border-[#EDE7DD]/[0.07] text-[#9E9489] hover:border-[#EDE7DD]/20"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="demo-days-pill"
                                transition={SHARED_LAYOUT_TRANSITION}
                                className="-z-10 absolute inset-0 rounded-xl"
                                style={{ backgroundColor: accent.softBg }}
                              />
                            )}
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9E9489] mb-1.5">
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
                            style={active ? { borderColor: accent.border } : undefined}
                            className={`relative z-10 py-2.5 px-2 rounded-xl border text-center text-[11px] font-bold truncate transition-colors duration-200 cursor-pointer active:scale-[0.97] ${
                              active
                                ? "text-[#EDE7DD]"
                                : "bg-[#14120F] border-[#EDE7DD]/[0.07] text-[#9E9489] hover:border-[#EDE7DD]/20"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="demo-style-pill"
                                transition={SHARED_LAYOUT_TRANSITION}
                                className="-z-10 absolute inset-0 rounded-xl"
                                style={{ backgroundColor: accent.softBg }}
                              />
                            )}
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
                <div>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300"
                    style={{ color: accent.text }}
                  >
                    Step 03 · Expenditure &amp; Focus
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#EDE7DD] mt-0.5">
                    Daily movement &amp; #1 coaching focus
                  </h2>
                </div>

                {/* Rule 3: Activity Level (30ms stagger) */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9E9489] mb-2">
                    Daily Steps Outside the Gym (NEAT)
                  </label>
                  <motion.div
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 gap-2"
                  >
                    {ACTIVITIES.map((a) => {
                      const active = activity === a.id;
                      return (
                        <motion.button
                          variants={listRowVariants}
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
                          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                            active
                              ? "text-[#EDE7DD]"
                              : "bg-[#14120F] border-[#EDE7DD]/[0.07] hover:border-[#EDE7DD]/20"
                          }`}
                        >
                          <div className="text-xs sm:text-sm font-bold text-[#EDE7DD]">
                            {a.title}
                          </div>
                          <div
                            className="text-[11px] font-semibold mt-0.5 transition-colors duration-200"
                            style={{ color: active ? accent.text : "#9E9489" }}
                          >
                            {a.steps}
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-[#6E655C] mt-0.5 truncate">
                            {a.desc}
                          </p>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Rule 3: Coaching Bottleneck (30ms stagger) */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9E9489] mb-2">
                    Primary Focus for 1:1 Coaching
                  </label>
                  <motion.div
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 gap-2"
                  >
                    {BOTTLENECKS.map((b) => {
                      const active = bottleneck === b.id;
                      return (
                        <motion.button
                          variants={listRowVariants}
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
                          className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                            active
                              ? "text-[#EDE7DD]"
                              : "bg-[#14120F] border-[#EDE7DD]/[0.07] hover:border-[#EDE7DD]/20"
                          }`}
                        >
                          <div className="text-xs sm:text-sm font-bold text-[#EDE7DD]">
                            {b.title}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-[#9E9489] mt-0.5 line-clamp-2">
                            {b.desc}
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            )}

            {/* STEP 4: DATA-BACKED BLUEPRINT GATE */}
            {step === 4 && (
              <div className="space-y-4">
                {/* Locked Data Preview Banner */}
                <div
                  className="rounded-2xl p-3.5 border bg-[#14120F] transition-colors duration-300"
                  style={{ borderColor: accent.border }}
                >
                  <div className="flex items-center justify-between text-[11px] mb-2.5 gap-2">
                    <span
                      className="font-bold uppercase tracking-wider transition-colors duration-300"
                      style={{ color: accent.text }}
                    >
                      ✓ Diagnostic Complete
                    </span>
                    <span className="text-[#9E9489] font-medium truncate">
                      {metrics.splitName}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#EDE7DD]/[0.03] border border-[#EDE7DD]/[0.06]">
                      <div className="text-[9px] sm:text-[10px] uppercase text-[#9E9489]">
                        Training Day
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#EDE7DD] mt-0.5 blur-[4px] select-none">
                        {metrics.trainingDayCalories} kcal
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#EDE7DD]/[0.03] border border-[#EDE7DD]/[0.06]">
                      <div className="text-[9px] sm:text-[10px] uppercase text-[#9E9489]">
                        Daily Protein
                      </div>
                      <div
                        className="text-xs sm:text-sm font-bold mt-0.5 blur-[4px] select-none transition-colors duration-300"
                        style={{ color: accent.text }}
                      >
                        {metrics.proteinG}g / day
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#EDE7DD]/[0.03] border border-[#EDE7DD]/[0.06]">
                      <div className="text-[9px] sm:text-[10px] uppercase text-[#9E9489]">
                        Goal Horizon
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#EDE7DD] mt-0.5">
                        ~{metrics.estWeeks} Weeks
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9E9489] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120F] border border-[#EDE7DD]/[0.12] text-base sm:text-sm text-[#EDE7DD] placeholder:text-[#6E655C] focus:outline-none focus:border-[#EDE7DD]/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9E9489] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120F] border border-[#EDE7DD]/[0.12] text-base sm:text-sm text-[#EDE7DD] placeholder:text-[#6E655C] focus:outline-none focus:border-[#EDE7DD]/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Rule 3: Coaching Qualification staggered by 30ms */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9E9489] mb-1.5">
                    1:1 PT Coaching Interest
                  </label>
                  <motion.div
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-1.5"
                  >
                    {INTENTS.map((item) => {
                      const active = intent === item.id;
                      return (
                        <motion.button
                          variants={listRowVariants}
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
                          className={`w-full py-2.5 px-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                            active
                              ? "text-[#EDE7DD]"
                              : "bg-[#14120F] border-[#EDE7DD]/[0.07] hover:border-[#EDE7DD]/20"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-[#EDE7DD] truncate">
                                {item.title}
                              </span>
                              <span
                                className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                style={
                                  active
                                    ? {
                                        backgroundColor: accent.hex,
                                        color: "#12110F",
                                      }
                                    : {
                                        backgroundColor: "rgba(237,231,221,0.06)",
                                        color: "rgba(237,231,221,0.55)",
                                      }
                                }
                              >
                                {item.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#9E9489] truncate">
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
                                : { borderColor: "rgba(237,231,221,0.25)" }
                            }
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#12110F]" />
                            )}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>

                {formError && (
                  <p className="text-xs text-[#E08A68] bg-[#D27652]/12 border border-[#D27652]/30 rounded-xl px-3.5 py-2">
                    {formError}
                  </p>
                )}
              </div>
            )}

            {/* STEP 5: UNLOCKED DATA-BACKED PT BLUEPRINT — Rules 6, 8, 17 */}
            {step === 5 && (
              <motion.div
                variants={settleContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3.5 mask-wipe-reveal"
              >
                {/* Automated Backend Dispatch Confirmation Pill */}
                <motion.div
                  variants={settleItemVariants}
                  className="rounded-2xl bg-[#688F71]/15 border border-[#688F71]/35 px-3.5 py-2.5 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#688F71] animate-pulse shrink-0" />
                    <span className="text-[11px] sm:text-xs font-semibold text-[#EDE7DD] truncate">
                      {botState === "processing"
                        ? "Routing submission through Qualfi backend to WhatsApp Bot..."
                        : `Dispatched via Qualfi WhatsApp Bot · PT notified with ${clientDisplayName}'s dossier`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="text-[11px] font-semibold text-[#9E9489] hover:text-[#EDE7DD] underline underline-offset-2 cursor-pointer shrink-0 active:scale-[0.97]"
                  >
                    Edit
                  </button>
                </motion.div>

                {/* Calorie Cycling & Goal Projection — Rule 8: Pulse Daily Avg card on unlock */}
                <motion.div variants={settleItemVariants} className="grid grid-cols-3 gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.035, 1],
                      boxShadow: [
                        `0 0 0 0px rgba(210,118,82,0)`,
                        `0 0 0 8px ${accent.glow}`,
                        `0 0 0 0px rgba(210,118,82,0)`,
                      ],
                    }}
                    transition={{ duration: 0.44, ease: EASE_IN_OUT }}
                    className="p-3 rounded-2xl border bg-[#14120F] transition-colors duration-300"
                    style={{ borderColor: accent.border }}
                  >
                    <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#9E9489]">
                      Daily Avg
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-[#EDE7DD] tabular-nums mt-0.5">
                      {metrics.targetCalories.toLocaleString()}
                    </div>
                    <div
                      className="text-[10px] font-medium mt-0.5 transition-colors duration-300 truncate"
                      style={{ color: accent.text }}
                    >
                      {selectedGoal.tag}
                    </div>
                  </motion.div>

                  <div className="p-3 rounded-2xl bg-[#14120F] border border-[#EDE7DD]/[0.07]">
                    <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#9E9489]">
                      Lift Days ({trainingDays}x)
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-[#EDE7DD] tabular-nums mt-0.5">
                      {metrics.trainingDayCalories.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#9E9489] mt-0.5 truncate">
                      High-carb fuel
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#14120F] border border-[#EDE7DD]/[0.07]">
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9E9489]">
                      Rest Days ({7 - trainingDays}x)
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-[#EDE7DD] tabular-nums mt-0.5">
                      {metrics.restDayCalories.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#9E9489] mt-0.5 truncate">
                      Recovery kcal
                    </div>
                  </div>
                </motion.div>

                {/* Macro Split Ratio Bar + 3 Columns */}
                <motion.div
                  variants={settleItemVariants}
                  className="p-3.5 rounded-2xl bg-[#14120F] border border-[#EDE7DD]/[0.07] space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#EDE7DD]">
                      Daily Macro Allocation
                    </span>
                    <span className="text-[#9E9489] tabular-nums">
                      {metrics.proteinPct}% P · {metrics.carbsPct}% C ·{" "}
                      {metrics.fatPct}% F
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-[#24211D] overflow-hidden flex gap-1">
                    <div
                      style={{
                        width: `${metrics.proteinPct}%`,
                        backgroundColor: accent.hex,
                      }}
                      className="h-full rounded-l-full transition-all duration-350 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    />
                    <div
                      style={{ width: `${metrics.carbsPct}%` }}
                      className="h-full bg-[#EDE7DD]/85 transition-all duration-350 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    />
                    <div
                      style={{ width: `${metrics.fatPct}%` }}
                      className="h-full rounded-r-full bg-[#6E655C] transition-all duration-350 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#EDE7DD]/[0.03] border border-[#EDE7DD]/[0.05]">
                      <div className="text-[10px] text-[#9E9489]">Protein</div>
                      <div className="text-base sm:text-lg font-bold text-[#EDE7DD] tabular-nums">
                        {metrics.proteinG}g
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EDE7DD]/[0.03] border border-[#EDE7DD]/[0.05]">
                      <div className="text-[10px] text-[#9E9489]">Carbs</div>
                      <div className="text-base sm:text-lg font-bold text-[#EDE7DD] tabular-nums">
                        {metrics.carbsG}g
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EDE7DD]/[0.03] border border-[#EDE7DD]/[0.05]">
                      <div className="text-[10px] text-[#9E9489]">Fats</div>
                      <div className="text-base sm:text-lg font-bold text-[#EDE7DD] tabular-nums">
                        {metrics.fatG}g
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Planned Weekly PT Training Architecture */}
                <motion.div
                  variants={settleItemVariants}
                  className="p-3.5 rounded-2xl bg-[#14120F] border border-[#EDE7DD]/[0.07] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#EDE7DD]">
                      {metrics.splitName}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors duration-300"
                      style={{
                        backgroundColor: accent.softBg,
                        color: accent.text,
                      }}
                    >
                      {metrics.stepTarget} steps/day
                    </span>
                  </div>

                  {/* Rule 3: Stagger schedule items by 30ms */}
                  <motion.div
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-5 gap-1.5"
                  >
                    {metrics.schedule.map((slot) => (
                      <motion.div
                        variants={listRowVariants}
                        key={slot.day}
                        className="p-2 rounded-xl bg-[#EDE7DD]/[0.03] border border-[#EDE7DD]/[0.05] flex sm:block items-center justify-between gap-2"
                      >
                        <div
                          className="text-[10px] font-bold uppercase transition-colors duration-300 shrink-0"
                          style={{ color: accent.text }}
                        >
                          {slot.day}
                        </div>
                        <div className="text-[10px] font-medium text-[#EDE7DD]/85 sm:mt-0.5 leading-tight text-right sm:text-left">
                          {slot.focus}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </OverlapTransitionStage>
        </div>

        {/* ── Pinned Bottom Footer Action Bar (Anchored in Place) ── */}
        <div className="relative z-10 border-t border-[#EDE7DD]/[0.08] bg-[#201D19]/85 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={() => goToStep((step - 1) as StepNum)}
              /* Rule 4: Scale interactive elements to 0.97 on press */
              className="px-4 py-3 rounded-xl bg-[#EDE7DD]/[0.06] hover:bg-[#EDE7DD]/[0.1] text-[#EDE7DD] font-semibold text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.97]"
            >
              ← Back
            </button>
          ) : (
            <div className="text-xs text-[#9E9489]">
              <span className="hidden sm:inline">Target Intake: </span>
              <strong className="text-[#EDE7DD] tabular-nums">
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
              /* Rule 4: Scale interactive elements to 0.97 on press */
              className="px-5 py-3 rounded-xl text-[#12110F] font-bold text-xs sm:text-sm tracking-tight hover:brightness-105 active:scale-[0.97] transition-all duration-200 cursor-pointer ml-auto"
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
              /* Rule 4: Scale interactive elements to 0.97 on press */
              className="px-4 sm:px-5 py-3 rounded-xl bg-[#688F71] hover:brightness-110 active:scale-[0.97] text-[#12110F] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_10px_28px_rgba(104,143,113,0.3)] transition-all cursor-pointer ml-auto"
            >
              <span>View What the PT Receives via WhatsApp Bot</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render the Automated Backend -> WhatsApp Bot -> PT View (No "Tap to Message")
  const renderWhatsAppDemo = () => (
    <div className="w-full max-w-[520px] mx-auto space-y-3">
      {/* Rule 7: Backend -> WhatsApp Bot Telemetry Pipeline Strip with Parabolic Arc Packet */}
      <div className="relative overflow-hidden rounded-2xl bg-[#191714] border border-[#EDE7DD]/[0.09] p-3.5 flex items-center justify-between gap-2 text-[11px]">
        <div className="pointer-events-none absolute left-[10%] right-[10%] top-1/2 hidden sm:block h-px bg-[#EDE7DD]/10">
          <span className="animate-travel-x absolute top-0 h-2 w-12 rounded-full bg-linear-to-r from-transparent via-[#688F71] to-[#FAF6F0]" />
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#688F71]" />
          <span className="font-semibold text-[#EDE7DD]">
            1. Client Submits
          </span>
        </div>
        <span className="text-[#6E655C]">→</span>
        <div className="relative z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#688F71]" />
          <span className="font-semibold text-[#EDE7DD]">
            2. Backend Scores
          </span>
        </div>
        <span className="text-[#6E655C]">→</span>
        <div className="relative z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#688F71] animate-pulse" />
          <span className="font-bold text-[#84AB8D]">3. Bot Alerts PT</span>
        </div>
      </div>

      {/* Rule 19: PT's Phone — Chat with Qualfi WhatsApp Lead Bot wrapped in RubberBandSurface */}
      <RubberBandSurface className="rounded-[28px_22px_30px_24px/24px_29px_22px_27px] bg-[#161916] border border-[#EDE7DD]/10 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
        {/* WhatsApp Bot Header */}
        <div className="bg-[#1E241E] px-4 sm:px-5 py-4 border-b border-[#EDE7DD]/[0.08] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#688F71] text-[#12110F] font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(104,143,113,0.35)]">
              BOT
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-[#EDE7DD] truncate">
                  Qualfi WhatsApp Bot
                </span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#688F71]/20 text-[#84AB8D]">
                  BACKEND RELAY ✓
                </span>
              </div>
              <div className="text-[11px] text-[#9E9489] mt-0.5 truncate">
                Client Submit → Qualfi Backend → WhatsApp Bot → PT
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyBrief}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#EDE7DD]/[0.08] hover:bg-[#EDE7DD]/[0.14] text-[#EDE7DD] transition-all cursor-pointer shrink-0 active:scale-[0.97]"
          >
            {/* Rule 18: Crossfade icons and apply a blur effect */}
            <BlurCrossfadeIcon iconKey={copiedBrief ? "copied" : "copy"}>
              <span>{copiedBrief ? "✓ Copied" : "Copy Dossier"}</span>
            </BlurCrossfadeIcon>
          </button>
        </div>

        {/* WhatsApp Message Thread */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-[#121512]">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EDE7DD]/[0.05] text-[10px] sm:text-[11px] text-[#9E9489]">
              Automatically pushed by Qualfi’s backend when client submits Step 04
            </span>
          </div>

          {/* Rule 8: Pulse Incoming Bot Alert Bubble to confirm success */}
          <motion.div
            key={botState}
            animate={
              botState === "dispatched"
                ? {
                    scale: [1, 1.025, 1],
                    boxShadow: [
                      "0 0 0 0px rgba(104,143,113,0)",
                      "0 0 0 8px rgba(104,143,113,0.22)",
                      "0 0 0 0px rgba(104,143,113,0)",
                    ],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 0.44, ease: EASE_IN_OUT }}
            className="rounded-2xl rounded-tl-sm bg-[#1D241E] border border-[#688F71]/30 p-4 text-xs sm:text-[13px] text-[#EDE7DD] whitespace-pre-line leading-relaxed shadow-md"
          >
            {botMessageToPT}
            <div className="flex items-center justify-between text-[10px] text-[#9E9489] mt-3 pt-2 border-t border-[#EDE7DD]/[0.07]">
              <span>Qualfi Backend → WhatsApp Bot</span>
              <span className="text-[#84AB8D] font-semibold">
                Delivered to PT in 0.6s ✓✓
              </span>
            </div>
          </motion.div>

          {/* Bot Utility Actions (No "Tap to Message" — Copy Dossier + Re-simulate Dispatch only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyBrief}
              className="py-3 px-4 rounded-xl bg-[#688F71] hover:brightness-110 text-[#12110F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-[0.97]"
            >
              <BlurCrossfadeIcon iconKey={copiedBrief ? "copied-btn" : "copy-btn"}>
                <span>{copiedBrief ? "✓ Lead Dossier Copied" : "📋 Copy PT Lead Dossier"}</span>
              </BlurCrossfadeIcon>
            </button>
            <button
              type="button"
              onClick={triggerBackendBotDispatch}
              className="py-3 px-4 rounded-xl bg-[#1D241E] hover:bg-[#252E26] border border-[#EDE7DD]/[0.09] text-[#EDE7DD] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
            >
              <span>↻ Simulate Bot Dispatch</span>
            </button>
          </div>
        </div>
      </RubberBandSurface>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#12110F] text-[#EDE7DD] font-sans antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Custom range slider styles with Rule 5 (12% knob stretch on active) */}
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
        }
        .demo-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #FAF6F0;
          border: 2px solid #14120F;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
          transition: transform 0.16s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.16s cubic-bezier(0.65, 0, 0.35, 1);
        }
        /* Rule 5: Stretch moving knobs by 12% */
        .demo-range:active::-webkit-slider-thumb {
          transform: scaleX(1.12) scaleY(0.92);
        }
        .demo-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #FAF6F0;
          border: 2px solid #14120F;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
          transition: transform 0.16s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .demo-range:active::-moz-range-thumb {
          transform: scaleX(1.12) scaleY(0.92);
        }
      `}</style>

      {/* Live Slide-Up Bot Dispatch Notification Toast (when submitting Step 4 in Funnel View) */}
      {showBotBanner && viewMode === "funnel" && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md rounded-2xl bg-[#1D241E]/95 border border-[#688F71]/50 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#688F71] text-[#12110F] font-black text-[11px] flex items-center justify-center shrink-0">
              BOT
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#EDE7DD] truncate">
                WhatsApp Bot Dispatched to PT ✓
              </div>
              <div className="text-[11px] text-[#9E9489] truncate">
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
            className="px-3 py-1.5 rounded-xl bg-[#688F71] text-[#12110F] font-bold text-xs shrink-0 cursor-pointer active:scale-[0.97]"
          >
            View Bot →
          </button>
        </div>
      )}

      {/* TOP DEMO SWITCHER BAR — Wabi Sabi Studio Bar */}
      <div className="sticky top-0 z-40 border-b border-[#EDE7DD]/[0.08] bg-[#161411]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          {/* Left: View Switcher Tabs (Rule 20: Shared layoutId) + Early Access Beta Pill */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
            <div className="grid grid-cols-2 md:inline-flex flex-1 sm:flex-initial items-center rounded-xl bg-[#12110F] p-1 border border-[#EDE7DD]/[0.08]">
              {(
                [
                  { id: "funnel", label: "1. Client Funnel", mobile: true },
                  { id: "whatsapp", label: "2. PT WhatsApp Bot", mobile: true },
                  { id: "split", label: "Split View", mobile: false },
                ] as const
              ).map((tab) => {
                const active = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (tab.id !== "funnel") {
                        setUnreadBotAlert(false);
                        setShowBotBanner(false);
                      }
                      setViewMode(tab.id);
                    }}
                    className={`${
                      tab.mobile ? "inline-flex" : "hidden md:inline-flex"
                    } relative z-10 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer active:scale-[0.97] ${
                      active
                        ? "text-[#12110F]"
                        : "text-[#9E9489] hover:text-[#EDE7DD]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="demo-view-tab-pill"
                        transition={SHARED_LAYOUT_TRANSITION}
                        className="-z-10 absolute inset-0 rounded-lg shadow-xs"
                        style={{
                          backgroundColor:
                            tab.id === "whatsapp" ? "#688F71" : "#EDE7DD",
                        }}
                      />
                    )}
                    {tab.id === "whatsapp" && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          unreadBotAlert
                            ? "bg-[#688F71] animate-ping"
                            : "bg-current"
                        }`}
                      />
                    )}
                    <span>{tab.label}</span>
                    {tab.id === "whatsapp" &&
                      unreadBotAlert &&
                      viewMode !== "whatsapp" && (
                        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#688F71] text-[#12110F] text-[9px] font-black">
                          NEW
                        </span>
                      )}
                  </button>
                );
              })}
            </div>

            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C89D54]/12 border border-[#C89D54]/30 text-[10px] font-bold uppercase tracking-wider text-[#DAB36E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DAB36E] animate-pulse" />
              Early Access Demo · Beta
            </span>
          </div>

          {/* Right: Wabi Sabi Accent Dropdown (Rules 2, 10, 11, 12, 15) + Quick Simulate */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 px-0.5 sm:px-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccentMenuOpen((v) => !v)}
                aria-expanded={accentMenuOpen}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12110F] border border-[#EDE7DD]/[0.1] text-xs font-medium text-[#EDE7DD] hover:border-[#EDE7DD]/25 transition-all cursor-pointer active:scale-[0.97]"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: accent.hex }}
                />
                <span>{accent.name}</span>
                <span className="text-[10px] text-[#9E9489]">▾</span>
              </button>

              {/* Rules 2, 10, 11, 12, 15: Dropdown timed 150-250ms (200ms enter / 160ms exit), starts at 0.95 scale, enters from & exits to top-right trigger */}
              <TriggerPopover
                open={accentMenuOpen}
                origin="top right"
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#EDE7DD]/12 bg-[#1C1916] p-1.5 shadow-2xl z-50"
              >
                <motion.div
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-1"
                >
                  {(Object.keys(ACCENTS) as AccentKey[]).map((k) => {
                    const item = ACCENTS[k];
                    const selected = accentKey === k;
                    return (
                      <motion.button
                        variants={listRowVariants}
                        key={k}
                        type="button"
                        onClick={() => {
                          setAccentKey(k);
                          setAccentMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer active:scale-[0.97] ${
                          selected
                            ? "bg-[#EDE7DD]/10 text-[#EDE7DD] font-semibold"
                            : "text-[#9E9489] hover:bg-[#EDE7DD]/[0.05] hover:text-[#EDE7DD]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span>
                            <span className="block text-[#EDE7DD]">{item.name}</span>
                            <span className="block text-[10px] text-[#9E9489]">
                              {item.sub}
                            </span>
                          </span>
                        </span>
                        <BlurCrossfadeIcon iconKey={selected ? "sel" : "unsel"}>
                          {selected ? (
                            <span style={{ color: item.text }}>✓</span>
                          ) : (
                            <span className="w-3" />
                          )}
                        </BlurCrossfadeIcon>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </TriggerPopover>
            </div>

            <button
              type="button"
              onClick={() => {
                if (viewMode === "whatsapp") setViewMode("funnel");
                goToStep(step === 5 ? 1 : 5);
              }}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-[#EDE7DD]/[0.07] hover:bg-[#EDE7DD]/[0.13] active:scale-[0.97] text-[#EDE7DD] transition-all cursor-pointer"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C89D54]/[0.1] border border-[#C89D54]/25 text-[11px] text-[#EDE7DD]/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DAB36E] animate-pulse" />
            <span>
              <strong>Early Access Demo</strong> · Still in beta &amp; active
              development
            </span>
          </div>
        </div>

        {/* Rule 16 & Rule 15: Overlap old and new views during transitions */}
        <OverlapTransitionStage activeKey={`demo-view-${viewMode}`} enterDuration={0.28}>
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
        </OverlapTransitionStage>
      </main>

      <footer className="py-6 text-center text-[11px] text-[#9E9489] space-y-1">
        <p className="font-semibold text-[#EDE7DD]/80">
          Early Access Demo · Beta Build (In Active Development)
        </p>
        <p className="text-[#6E655C]">
          1:1 Performance &amp; Nutrition Diagnostic Preview · Wabi Sabi Edition
        </p>
      </footer>
    </div>
  );
}
