"use client";

import { useState, useMemo, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const Flame = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const Dumbbell = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
    <path d="m21.5 21.5-1.4-1.4" />
    <path d="M3.9 3.9 2.5 2.5" />
    <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
  </svg>
);

const Target = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const CheckCircle2 = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ArrowRight = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ArrowLeft = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const ShieldCheck = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const Sparkles = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const MessageCircle = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

const Trophy = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const Clock = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Zap = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ChevronRight = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const Star = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Activity = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  </svg>
);

const Utensils = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

const Lock = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Eye = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const X = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const RotateCcw = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

type Sex = "male" | "female";
type UnitSystem = "metric" | "imperial";
type GoalId = "shred" | "recomp" | "bulk";
type ActivityId = "desk" | "moderate" | "active" | "athlete";
type TrainingDays = 3 | 4 | 5;
type StruggleId = "consistency" | "nutrition" | "plateau" | "time";
type CoachingIntent = "ready" | "curious" | "free";

const GOALS: {
  id: GoalId;
  title: string;
  subtitle: string;
  tag: string;
  delta: number;
  proteinPerKg: number;
  rateLabel: string;
  icon: typeof Flame;
}[] = [
  {
    id: "shred",
    title: "Lean Out & Shred",
    subtitle: "Strip stubborn body fat while keeping muscle fullness & strength.",
    tag: "-500 kcal deficit",
    delta: -500,
    proteinPerKg: 2.3,
    rateLabel: "-0.5 kg / week",
    icon: Flame,
  },
  {
    id: "recomp",
    title: "Body Recomposition",
    subtitle: "Drop body fat and build lean muscle at the same time.",
    tag: "-200 kcal slight deficit",
    delta: -200,
    proteinPerKg: 2.2,
    rateLabel: "Lean & tighten",
    icon: Target,
  },
  {
    id: "bulk",
    title: "Lean Muscle Gain",
    subtitle: "Add quality size and strength without unwanted fat gain.",
    tag: "+300 kcal surplus",
    delta: 300,
    proteinPerKg: 2.0,
    rateLabel: "+0.25 kg / week",
    icon: Dumbbell,
  },
];

const ACTIVITIES: {
  id: ActivityId;
  label: string;
  desc: string;
  steps: string;
  mult: number;
}[] = [
  {
    id: "desk",
    label: "Desk Job / Low Movement",
    desc: "Mostly seated during the day",
    steps: "< 5,000 steps/day",
    mult: 1.3,
  },
  {
    id: "moderate",
    label: "Moderately Active",
    desc: "On your feet parts of the day + regular walks",
    steps: "6,000 – 9,000 steps/day",
    mult: 1.5,
  },
  {
    id: "active",
    label: "Very Active Lifestyle",
    desc: "Active job or high daily step count",
    steps: "10,000+ steps/day",
    mult: 1.7,
  },
  {
    id: "athlete",
    label: "High Output / 2-a-Days",
    desc: "Manual labor or intense daily conditioning",
    steps: "14,000+ steps/day",
    mult: 1.88,
  },
];

const STRUGGLES: { id: StruggleId; label: string; desc: string }[] = [
  {
    id: "nutrition",
    label: "Dieting & Weekends",
    desc: "Good Monday–Thursday, then cravings or weekends undo progress",
  },
  {
    id: "plateau",
    label: "Stuck at a Plateau",
    desc: "Training hard in the gym but my physique looks the same",
  },
  {
    id: "consistency",
    label: "Accountability & Structure",
    desc: "Need a clear plan and someone in my corner keeping me on track",
  },
  {
    id: "time",
    label: "Busy Work Schedule",
    desc: "Need simple meals and efficient 45-min workouts that fit my life",
  },
];

const INTENT_OPTIONS: {
  id: CoachingIntent;
  label: string;
  sub: string;
  badge?: string;
}[] = [
  {
    id: "ready",
    label: "Yes — I want 1:1 coaching to hit my goal",
    sub: "Priority review · Ready to invest in a guaranteed gameplan",
    badge: "PRIORITY",
  },
  {
    id: "curious",
    label: "Maybe — I'd like to hear how 1:1 coaching works",
    sub: "Open to chatting if the program fits my lifestyle",
  },
  {
    id: "free",
    label: "Just grab my free macro gameplan for now",
    sub: "Send my targets only",
  },
];

export function StandaloneDemo() {
  // Assessment state
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(29);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(84);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(76);

  const [goal, setGoal] = useState<GoalId>("shred");
  const [trainingDays, setTrainingDays] = useState<TrainingDays>(4);

  const [activity, setActivity] = useState<ActivityId>("moderate");
  const [struggle, setStruggle] = useState<StruggleId>("nutrition");

  // Lead capture
  const [firstName, setFirstName] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [intent, setIntent] = useState<CoachingIntent>("ready");
  const [formError, setFormError] = useState<string>("");

  // Optional WhatsApp preview drawer so the user can show what the PT receives
  const [showCoachPreview, setShowCoachPreview] = useState<boolean>(false);

  const selectedGoal = useMemo(
    () => GOALS.find((g) => g.id === goal) ?? GOALS[0],
    [goal]
  );
  const selectedActivity = useMemo(
    () => ACTIVITIES.find((a) => a.id === activity) ?? ACTIVITIES[1],
    [activity]
  );
  const selectedStruggle = useMemo(
    () => STRUGGLES.find((s) => s.id === struggle) ?? STRUGGLES[0],
    [struggle]
  );
  const selectedIntent = useMemo(
    () => INTENT_OPTIONS.find((i) => i.id === intent) ?? INTENT_OPTIONS[0],
    [intent]
  );

  // Calculations (Mifflin-St Jeor)
  const results = useMemo(() => {
    const bmr =
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    const tdee = Math.round(bmr * selectedActivity.mult);
    const targetCalories = Math.max(1350, tdee + selectedGoal.delta);

    const proteinG = Math.round(weightKg * selectedGoal.proteinPerKg);
    const proteinCal = proteinG * 4;

    const fatG = Math.max(45, Math.round(weightKg * 0.85));
    const fatCal = fatG * 9;

    const carbCal = Math.max(120, targetCalories - proteinCal - fatCal);
    const carbsG = Math.round(carbCal / 4);

    const totalMacroCal = proteinCal + fatCal + carbsG * 4;
    const proteinPct = Math.round((proteinCal / totalMacroCal) * 100);
    const carbsPct = Math.round(((carbsG * 4) / totalMacroCal) * 100);
    const fatPct = Math.max(10, 100 - proteinPct - carbsPct);

    const weightDiff = Math.abs(weightKg - targetWeightKg);
    const weeklyRateKg = goal === "shred" ? 0.6 : goal === "bulk" ? 0.25 : 0.35;
    const estWeeks = Math.max(
      4,
      Math.min(24, Math.round(weightDiff / weeklyRateKg) || 8)
    );

    const waterLiters = (weightKg * 0.04).toFixed(1);
    const stepTarget =
      goal === "shred" ? "9,500" : goal === "recomp" ? "8,500" : "7,500";

    const splitRecommendation =
      trainingDays === 3
        ? "3-Day Full Body Hypertrophy (M / W / F)"
        : trainingDays === 4
          ? "4-Day Upper / Lower Performance Split"
          : "5-Day Push / Pull / Legs + Upper / Lower";

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      proteinG,
      carbsG,
      fatG,
      proteinPct,
      carbsPct,
      fatPct,
      estWeeks,
      waterLiters,
      stepTarget,
      splitRecommendation,
    };
  }, [
    sex,
    weightKg,
    heightCm,
    age,
    targetWeightKg,
    selectedActivity,
    selectedGoal,
    goal,
    trainingDays,
  ]);

  // Display helpers for Metric vs Imperial
  const displayWeight = (kg: number) =>
    unit === "metric" ? `${kg} kg` : `${Math.round(kg * 2.20462)} lbs`;

  const displayHeight = (cm: number) => {
    if (unit === "metric") return `${cm} cm`;
    const totalInches = Math.round(cm / 2.54);
    const ft = Math.floor(totalInches / 12);
    const inch = totalInches % 12;
    return `${ft}'${inch}"`;
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setFormError("Enter your first name so we can personalize your plan.");
      return;
    }
    if (whatsapp.replace(/\D/g, "").length < 7) {
      setFormError("Enter a valid WhatsApp number to unlock your blueprint.");
      return;
    }
    setFormError("");
    setStep(5);
  };

  const resetDemo = () => {
    setStep(1);
    setFirstName("");
    setWhatsapp("");
    setFormError("");
  };

  const whatsappMessage = `Hey Marcus! 👋 I just completed the 60-Second Physique Assessment.

*My Stats & Goal:*
• Name: ${firstName.trim() || "Alex"}
• Stats: ${age}yo ${sex === "male" ? "Male" : "Female"}, ${displayHeight(heightCm)}, ${displayWeight(weightKg)} → Target: ${displayWeight(targetWeightKg)}
• Goal: ${selectedGoal.title} (${trainingDays}x/wk training)
• Main Roadblock: ${selectedStruggle.label}

*My Calculated Targets:*
• ${results.targetCalories.toLocaleString()} kcal/day (${results.proteinG}g P / ${results.carbsG}g C / ${results.fatG}g F)
• 1:1 Coaching Interest: ${selectedIntent.label}`;

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F5F5F3] selection:bg-[#D4FF00] selection:text-black font-sans antialiased relative overflow-x-hidden">
      {/* Subtle athletic grid + top ambient lime/amber glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[680px] h-[380px] rounded-full blur-[130px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, #D4FF00 0%, #FF5500 55%, transparent 75%)",
        }}
      />

      {/* Top Availability Banner — Real PT Scarcity Bar */}
      <div className="relative z-10 border-b border-white/[0.08] bg-[#111317]/90 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 font-medium text-white/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4FF00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4FF00]" />
            </span>
            <span className="uppercase tracking-wider font-semibold text-[#D4FF00]">
              1:1 Intake Open
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white/75">3 Coaching Spots Left</span>
          </div>
          <span className="text-[11px] font-medium text-white/50 hidden sm:inline">
            @marcusvance.fit
          </span>
        </div>
      </div>

      {/* Main Centered Bio-Link Container */}
      <main className="relative z-10 max-w-xl mx-auto px-4 pt-6 pb-20 sm:pt-9">
        {/* PT Profile Header Card */}
        <header className="rounded-3xl bg-gradient-to-b from-[#17191E] to-[#121317] border border-white/[0.09] p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.65)] mb-5">
          <div className="flex items-center gap-4">
            {/* Coach Avatar with Live Ring */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-gradient-to-br from-[#272B33] via-[#181A20] to-[#0E1014] p-0.5 ring-2 ring-[#D4FF00]/80 shadow-[0_0_25px_rgba(212,255,0,0.18)]">
                <div className="w-full h-full rounded-[14px] bg-[#13151A] flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Stylized Athletic Monogram */}
                  <span className="text-lg sm:text-xl font-black tracking-tighter text-white leading-none">
                    MV
                  </span>
                  <span className="text-[8px] font-bold tracking-[0.2em] text-[#D4FF00] uppercase mt-0.5">
                    COACH
                  </span>
                </div>
              </div>
              <div
                title="Verified Coach"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4FF00] text-black flex items-center justify-center ring-2 ring-[#121317]"
              >
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Coach Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Marcus Vance
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/[0.07] text-white/80 border border-white/[0.08]">
                  Online Physique Coach
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-white/65 mt-1 leading-snug">
                Helping busy men & women drop 8–15kg of body fat & build an
                athletic physique without giving up their social life.
              </p>

              {/* Social proof pills */}
              <div className="flex items-center gap-3 mt-2.5 text-[11px] text-white/75 flex-wrap">
                <span className="inline-flex items-center gap-1 font-semibold text-[#D4FF00]">
                  <Star className="w-3.5 h-3.5 fill-[#D4FF00] text-[#D4FF00]" />
                  4.9 (420+ Clients)
                </span>
                <span className="text-white/25">•</span>
                <span className="inline-flex items-center gap-1 text-white/70">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  NASM & Precision Nutrition
                </span>
              </div>
            </div>
          </div>

          {/* Hook Banner inside Header */}
          {step < 5 && (
            <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4FF00]">
                  <Zap className="w-3.5 h-3.5 fill-[#D4FF00]" />
                  Free 60-Second Custom Assessment
                </div>
                <p className="text-xs text-white/60 mt-0.5">
                  Get my exact calorie, macro & training split formula for your
                  body.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-block px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[11px] font-bold text-white/85">
                  Step {step} of 4
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Progress Track (Steps 1-4) */}
        {step < 5 && (
          <div className="mb-5">
            <div className="grid grid-cols-4 gap-2">
              {[
                { num: 1, label: "Your Stats" },
                { num: 2, label: "Physique Goal" },
                { num: 3, label: "Lifestyle" },
                { num: 4, label: "Unlock Plan" },
              ].map((item) => {
                const active = step === item.num;
                const done = step > item.num;
                return (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => {
                      if (item.num < step) setStep(item.num as 1 | 2 | 3 | 4);
                    }}
                    disabled={item.num > step}
                    className={`text-left group transition-all ${
                      item.num < step ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        active
                          ? "bg-[#D4FF00] shadow-[0_0_12px_rgba(212,255,0,0.6)]"
                          : done
                            ? "bg-[#D4FF00]/60"
                            : "bg-white/[0.09]"
                      }`}
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold tracking-tight ${
                          active
                            ? "text-white"
                            : done
                              ? "text-[#D4FF00]/80"
                              : "text-white/35"
                        }`}
                      >
                        {item.num}. {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: BODY METRICS & STARTING POINT */}
        {step === 1 && (
          <section className="rounded-3xl bg-[#14161B] border border-white/[0.09] p-5 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.6)] space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4FF00]">
                  Part 01 · Baseline Metrics
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5">
                  Where are you starting from?
                </h2>
              </div>

              {/* Unit Switcher */}
              <div className="inline-flex rounded-xl bg-[#0C0D10] p-1 border border-white/[0.08] shrink-0">
                {(["metric", "imperial"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                      unit === u
                        ? "bg-[#D4FF00] text-black"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {u === "metric" ? "KG / CM" : "LBS / FT"}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2.5">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { id: "male", label: "Male", sub: "Standard male BMR" },
                    {
                      id: "female",
                      label: "Female",
                      sub: "Standard female BMR",
                    },
                  ] as const
                ).map((g) => {
                  const selected = sex === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSex(g.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        selected
                          ? "bg-[#D4FF00]/[0.1] border-[#D4FF00] text-white shadow-[0_0_24px_rgba(212,255,0,0.12)]"
                          : "bg-[#0E1014] border-white/[0.08] text-white/70 hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-extrabold">{g.label}</div>
                        <div className="text-[11px] text-white/45 mt-0.5">
                          {g.sub}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selected
                            ? "border-[#D4FF00] bg-[#D4FF00] text-black"
                            : "border-white/25"
                        }`}
                      >
                        {selected && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders for Age, Height, Current Weight, Goal Weight */}
            <div className="space-y-4">
              {/* Age */}
              <div className="p-4 rounded-2xl bg-[#0E1014] border border-white/[0.07]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Age
                  </span>
                  <span className="text-lg font-black text-white">
                    {age}{" "}
                    <span className="text-xs font-semibold text-white/45">
                      years
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={65}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-[#D4FF00] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Height */}
              <div className="p-4 rounded-2xl bg-[#0E1014] border border-white/[0.07]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Height
                  </span>
                  <span className="text-lg font-black text-white">
                    {displayHeight(heightCm)}
                  </span>
                </div>
                <input
                  type="range"
                  min={148}
                  max={205}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-[#D4FF00] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Current Weight & Goal Weight side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#0E1014] border border-white/[0.07]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                      Current Weight
                    </span>
                    <span className="text-lg font-black text-white">
                      {displayWeight(weightKg)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={140}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-[#D4FF00] h-2 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#0E1014] border border-[#D4FF00]/25">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4FF00]">
                      Goal Weight
                    </span>
                    <span className="text-lg font-black text-[#D4FF00]">
                      {displayWeight(targetWeightKg)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={130}
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                    className="w-full accent-[#D4FF00] h-2 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-4 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#defc35] active:scale-[0.99] text-black font-extrabold text-sm sm:text-base tracking-tight flex items-center justify-center gap-2 shadow-[0_12px_35px_rgba(212,255,0,0.25)] transition-all cursor-pointer"
            >
              <span>Next: Choose Your Physique Goal</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </section>
        )}

        {/* STEP 2: PHYSIQUE GOAL & TRAINING FREQUENCY */}
        {step === 2 && (
          <section className="rounded-3xl bg-[#14161B] border border-white/[0.09] p-5 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.6)] space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4FF00]">
                Part 02 · Training & Outcome
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5">
                What’s your #1 physique priority?
              </h2>
              <p className="text-xs sm:text-sm text-white/55 mt-1">
                We’ll calibrate your calorie delta and protein ratio around this
                target.
              </p>
            </div>

            {/* Goal Cards */}
            <div className="space-y-3">
              {GOALS.map((g) => {
                const Icon = g.icon;
                const selected = goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                      selected
                        ? "bg-[#D4FF00]/[0.09] border-[#D4FF00] shadow-[0_0_28px_rgba(212,255,0,0.12)]"
                        : "bg-[#0E1014] border-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        selected
                          ? "bg-[#D4FF00] text-black"
                          : "bg-white/[0.06] text-white/70"
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-base font-extrabold text-white">
                          {g.title}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            selected
                              ? "bg-[#D4FF00] text-black"
                              : "bg-white/[0.06] text-white/60"
                          }`}
                        >
                          {g.rateLabel}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">
                        {g.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Training Days Per Week */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5">
                How many days per week can you lift?
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { days: 3, label: "3 Days / wk", sub: "Full Body" },
                    { days: 4, label: "4 Days / wk", sub: "Upper / Lower" },
                    { days: 5, label: "5 Days / wk", sub: "Push Pull Legs" },
                  ] as const
                ).map((item) => {
                  const selected = trainingDays === item.days;
                  return (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setTrainingDays(item.days)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        selected
                          ? "bg-[#D4FF00]/[0.12] border-[#D4FF00] text-white"
                          : "bg-[#0E1014] border-white/[0.08] text-white/70 hover:border-white/20"
                      }`}
                    >
                      <div className="text-sm font-extrabold">{item.label}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          selected ? "text-[#D4FF00] font-semibold" : "text-white/45"
                        }`}
                      >
                        {item.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#defc35] text-black font-extrabold text-sm sm:text-base tracking-tight flex items-center justify-center gap-2 shadow-[0_12px_35px_rgba(212,255,0,0.25)] transition-all cursor-pointer"
              >
                <span>Next: Daily Lifestyle</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: ACTIVITY & BIGGEST ROADBLOCK */}
        {step === 3 && (
          <section className="rounded-3xl bg-[#14161B] border border-white/[0.09] p-5 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.6)] space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4FF00]">
                Part 03 · Lifestyle & Bottleneck
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5">
                Your daily activity & #1 struggle
              </h2>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5">
                Daily Movement Outside the Gym
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ACTIVITIES.map((a) => {
                  const selected = activity === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActivity(a.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selected
                          ? "bg-[#D4FF00]/[0.1] border-[#D4FF00] text-white"
                          : "bg-[#0E1014] border-white/[0.08] text-white/75 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-extrabold">
                          {a.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selected
                              ? "bg-[#D4FF00] text-black"
                              : "bg-white/[0.06] text-white/55"
                          }`}
                        >
                          {a.steps}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-1">{a.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Biggest Struggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5">
                What has held you back most in the past?
              </label>
              <div className="space-y-2.5">
                {STRUGGLES.map((s) => {
                  const selected = struggle === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStruggle(s.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selected
                          ? "bg-[#D4FF00]/[0.1] border-[#D4FF00]"
                          : "bg-[#0E1014] border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-white">
                          {s.label}
                        </div>
                        <div className="text-[11px] text-white/55 mt-0.5">
                          {s.desc}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          selected
                            ? "border-[#D4FF00] bg-[#D4FF00] text-black"
                            : "border-white/25"
                        }`}
                      >
                        {selected && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#defc35] text-black font-extrabold text-sm sm:text-base tracking-tight flex items-center justify-center gap-2 shadow-[0_12px_35px_rgba(212,255,0,0.25)] transition-all cursor-pointer"
              >
                <span>Calculate My Custom Plan</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: LEAD CAPTURE & COACHING QUALIFICATION GATE */}
        {step === 4 && (
          <section className="rounded-3xl bg-[#14161B] border border-white/[0.09] p-5 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.6)] space-y-6">
            {/* Teaser of Calculated Plan (Locked Preview) */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1C2029] to-[#101217] border border-[#D4FF00]/30 p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#D4FF00]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Calculation Complete
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/60">
                  <Lock className="w-3 h-3 text-[#D4FF00]" />
                  Ready to Unlock
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-white/45 font-bold">
                    Daily Intake
                  </div>
                  <div className="text-base sm:text-lg font-black text-white mt-0.5 select-none blur-[4px]">
                    {results.targetCalories} kcal
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-white/45 font-bold">
                    Protein Goal
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#D4FF00] mt-0.5 select-none blur-[4px]">
                    {results.proteinG}g / day
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-white/45 font-bold">
                    Est. Timeline
                  </div>
                  <div className="text-base sm:text-lg font-black text-white mt-0.5">
                    ~{results.estWeeks} Weeks
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Where should Marcus send your 12-Week Gameplan?
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Unlock your exact macro split immediately on-screen and get a
                copy on WhatsApp.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    Your First Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (formError) setFormError("");
                    }}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0C0E12] border border-white/[0.1] text-white placeholder:text-white/30 text-sm font-semibold focus:outline-none focus:border-[#D4FF00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
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
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0C0E12] border border-white/[0.1] text-white placeholder:text-white/30 text-sm font-semibold focus:outline-none focus:border-[#D4FF00]"
                  />
                </div>
              </div>

              {/* 1:1 Coaching Qualification Question */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2">
                  Are you interested in 1:1 Online Coaching with Marcus?
                </label>
                <div className="space-y-2">
                  {INTENT_OPTIONS.map((opt) => {
                    const selected = intent === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIntent(opt.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          selected
                            ? "bg-[#D4FF00]/[0.1] border-[#D4FF00]"
                            : "bg-[#0C0E12] border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-extrabold text-white">
                              {opt.label}
                            </span>
                            {opt.badge && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D4FF00] text-black">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-white/50 mt-0.5">
                            {opt.sub}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            selected
                              ? "border-[#D4FF00] bg-[#D4FF00] text-black"
                              : "border-white/25"
                          }`}
                        >
                          {selected && (
                            <div className="w-2 h-2 rounded-full bg-black" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">
                  {formError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#D4FF00] hover:bg-[#defc35] text-black font-extrabold text-sm sm:text-base tracking-tight flex items-center justify-center gap-2 shadow-[0_12px_35px_rgba(212,255,0,0.28)] transition-all cursor-pointer"
                >
                  <span>Unlock My Custom Blueprint</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* STEP 5: UNLOCKED CLIENT BLUEPRINT (REAL PT DELIVERABLE) */}
        {step === 5 && (
          <section className="space-y-5 animate-in fade-in duration-300">
            {/* Hero Macro Card */}
            <div className="rounded-3xl bg-gradient-to-b from-[#191C24] to-[#12141A] border border-[#D4FF00]/40 p-5 sm:p-7 shadow-[0_24px_70px_rgba(0,0,0,0.75)] relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4FF00]/15 border border-[#D4FF00]/40 text-[#D4FF00] text-[11px] font-extrabold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prepared for {firstName.trim() || "You"}
                </span>
                <span className="text-xs font-bold text-white/55">
                  Goal: {selectedGoal.title}
                </span>
              </div>

              {/* Daily Calorie Target & Timeline */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-white/[0.08]">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white/55">
                    Your Daily Calorie Target
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                      {results.targetCalories.toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-[#D4FF00]">
                      kcal / day
                    </span>
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Maintenance TDEE: {results.tdee.toLocaleString()} kcal ·{" "}
                    {selectedGoal.tag}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0C0E12] border border-white/[0.08] px-4 py-3 sm:text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                    Projected Goal Timeline
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#D4FF00] mt-0.5">
                    {displayWeight(weightKg)} → {displayWeight(targetWeightKg)}{" "}
                    in ~{results.estWeeks} wks
                  </div>
                </div>
              </div>

              {/* Stacked Macro Ratio Bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-[11px] font-bold text-white/60 mb-2">
                  <span>DAILY MACRO SPLIT</span>
                  <span>
                    {results.proteinPct}% P · {results.carbsPct}% C ·{" "}
                    {results.fatPct}% F
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-black/50 overflow-hidden flex p-0.5 gap-1 border border-white/[0.07]">
                  <div
                    style={{ width: `${results.proteinPct}%` }}
                    className="h-full rounded-l-full bg-[#D4FF00]"
                  />
                  <div
                    style={{ width: `${results.carbsPct}%` }}
                    className="h-full bg-[#FF6B2C]"
                  />
                  <div
                    style={{ width: `${results.fatPct}%` }}
                    className="h-full rounded-r-full bg-[#38BDF8]"
                  />
                </div>
              </div>

              {/* 3 Macro Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 mt-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0D0F14] border border-[#D4FF00]/30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/65">
                      Protein
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {results.proteinG}g
                  </div>
                  <div className="text-[11px] text-white/45 mt-0.5">
                    ~{Math.round(results.proteinG / 4)}g × 4 meals
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0D0F14] border border-white/[0.08]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/65">
                      Carbs
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {results.carbsG}g
                  </div>
                  <div className="text-[11px] text-white/45 mt-0.5">
                    Pre & post-workout
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0D0F14] border border-white/[0.08]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/65">
                      Fats
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {results.fatG}g
                  </div>
                  <div className="text-[11px] text-white/45 mt-0.5">
                    Hormone health
                  </div>
                </div>
              </div>

              {/* Training & Daily Protocol Prescription */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-white/[0.07]">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                  <Dumbbell className="w-4 h-4 text-[#D4FF00] shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-white/45">
                      Recommended Split
                    </div>
                    <div className="text-xs font-bold text-white">
                      {results.splitRecommendation}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                  <Activity className="w-4 h-4 text-[#D4FF00] shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-white/45">
                      Daily Step Target
                    </div>
                    <div className="text-xs font-bold text-white">
                      {results.stepTarget} steps / day
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                  <Utensils className="w-4 h-4 text-[#D4FF00] shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-white/45">
                      Hydration Target
                    </div>
                    <div className="text-xs font-bold text-white">
                      {results.waterLiters}L water / day
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Marcus 1:1 WhatsApp Direct Apply Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#162219] via-[#131817] to-[#121418] border border-[#25D366]/35 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1A2026] border border-[#D4FF00]/60 flex items-center justify-center font-black text-sm text-white shrink-0">
                  MV
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#25D366]">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    Personal Note from Marcus
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                    “{firstName.trim() || "Mate"}, numbers are only 20% of the
                    transformation.”
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white/70 mt-1.5 leading-relaxed">
                    Knowing you need{" "}
                    <strong className="text-white">
                      {results.targetCalories.toLocaleString()} kcal
                    </strong>{" "}
                    and{" "}
                    <strong className="text-white">
                      {results.proteinG}g protein
                    </strong>{" "}
                    is step one. Sticking to it when work gets busy or{" "}
                    <span className="text-white/90">
                      {selectedStruggle.label.toLowerCase()}
                    </span>{" "}
                    kicks in is where my 1:1 coaching comes in. Tap below to
                    send your blueprint straight to my personal WhatsApp and
                    let’s map out your next 12 weeks.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowCoachPreview(true)}
                  className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#2be06f] active:scale-[0.99] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_12px_35px_rgba(37,211,102,0.3)] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-black stroke-black" />
                  <span>Send My Blueprint to Marcus on WhatsApp</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="flex items-center justify-between pt-2 text-[11px] text-white/45">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4FF00]" />
                    Typical reply time: Under 15 mins
                  </span>
                  <button
                    type="button"
                    onClick={resetDemo}
                    className="inline-flex items-center gap-1 text-white/55 hover:text-white font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Recalculate
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Real PT Social Proof / Client Results Strip */}
        <section className="mt-6 rounded-3xl bg-[#121419] border border-white/[0.07] p-5">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Recent 12-Week Client Wins
            </span>
            <span className="text-[11px] font-bold text-[#D4FF00]">
              Vance Performance 1:1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0C0E12] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white">
                  Callum R. · 32
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#D4FF00]/15 text-[#D4FF00]">
                  -11.4 KG IN 12 WKS
                </span>
              </div>
              <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                “Started from this exact macro calculator. Dropped 4 inches off
                my waist while still eating out on Fridays.”
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0C0E12] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white">
                  danielle_k · 28
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#D4FF00]/15 text-[#D4FF00]">
                  BODY RECOMP
                </span>
              </div>
              <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                “Finally stopped guessing my protein and training split. Best
                investment I’ve made in my confidence.”
              </p>
            </div>
          </div>
        </section>

        {/* Minimal PT Copyright Footer (No Links to Qualfi Home) */}
        <footer className="mt-8 text-center text-[11px] text-white/35 space-y-1">
          <p className="font-semibold text-white/50">
            VANCE PERFORMANCE COACHING LTD
          </p>
          <p>
            Custom Macro & Training Diagnostics · For Educational & Coaching
            Purposes
          </p>
        </footer>
      </main>

      {/* Discreet Floating Button to Preview What the PT Receives on WhatsApp */}
      <button
        type="button"
        onClick={() => setShowCoachPreview(true)}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2 rounded-full bg-[#181B22]/95 hover:bg-[#222630] border border-white/15 text-[11px] font-bold text-white/80 flex items-center gap-1.5 shadow-2xl backdrop-blur-md cursor-pointer transition-all"
      >
        <Eye className="w-3.5 h-3.5 text-[#25D366]" />
        <span>Preview Coach WhatsApp</span>
      </button>

      {/* Coach Incoming WhatsApp Lead Modal */}
      {showCoachPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#111B21] border border-white/15 overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,0.85)]">
            {/* WhatsApp Header */}
            <div className="bg-[#202C33] px-4 py-3.5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-black font-black text-xs flex items-center justify-center">
                  {(firstName.trim()?.[0] || "A").toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{firstName.trim() || "Alex"} (New Bio Lead)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-extrabold">
                      {intent === "ready"
                        ? "HOT LEAD"
                        : intent === "curious"
                          ? "WARM LEAD"
                          : "MACRO LEAD"}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/55">
                    {whatsapp.trim() || "+44 7700 900077"} · Just now
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCoachPreview(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 bg-[#0B141A]">
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-lg bg-[#182229] text-[11px] text-white/60">
                  Pre-filled message sent from Marcus’s Bio-Link Calculator
                </span>
              </div>

              <div className="rounded-2xl rounded-tl-sm bg-[#202C33] p-3.5 text-xs text-white/90 whitespace-pre-line leading-relaxed border border-white/[0.06]">
                {whatsappMessage}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCoachPreview(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#D4FF00] text-black font-extrabold text-xs cursor-pointer"
                >
                  Back to PT Bio-Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
