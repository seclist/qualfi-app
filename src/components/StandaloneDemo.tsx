"use client";

import { useState, useMemo } from "react";

type Sex = "male" | "female";
type UnitSystem = "metric" | "imperial";
type GoalId = "cut" | "recomp" | "build";
type ActivityId = "sedentary" | "light" | "moderate" | "high";
type TrainingDays = 3 | 4 | 5;
type CoachingIntent = "yes" | "maybe" | "macros-only";

const GOALS: {
  id: GoalId;
  title: string;
  desc: string;
  delta: number;
  proteinFactor: number;
}[] = [
  {
    id: "cut",
    title: "Fat Loss",
    desc: "Sustainable calorie deficit while preserving lean muscle.",
    delta: -450,
    proteinFactor: 2.2,
  },
  {
    id: "recomp",
    title: "Body Recomposition",
    desc: "Gradually reduce body fat while improving strength and tone.",
    delta: -150,
    proteinFactor: 2.1,
  },
  {
    id: "build",
    title: "Lean Muscle",
    desc: "Controlled surplus for strength and hypertrophy.",
    delta: 280,
    proteinFactor: 2.0,
  },
];

const ACTIVITIES: {
  id: ActivityId;
  title: string;
  desc: string;
  mult: number;
}[] = [
  {
    id: "sedentary",
    title: "Mostly Seated",
    desc: "Desk work, under 5,000 steps per day",
    mult: 1.28,
  },
  {
    id: "light",
    title: "Lightly Active",
    desc: "6,000–8,000 steps per day",
    mult: 1.45,
  },
  {
    id: "moderate",
    title: "Moderately Active",
    desc: "8,000–11,000 steps per day",
    mult: 1.62,
  },
  {
    id: "high",
    title: "Very Active",
    desc: "Physical job or 12,000+ steps per day",
    mult: 1.78,
  },
];

export function StandaloneDemo() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(28);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(82);

  const [goal, setGoal] = useState<GoalId>("cut");
  const [trainingDays, setTrainingDays] = useState<TrainingDays>(4);
  const [activity, setActivity] = useState<ActivityId>("light");

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [intent, setIntent] = useState<CoachingIntent>("yes");
  const [error, setError] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const selectedGoal = useMemo(
    () => GOALS.find((g) => g.id === goal) ?? GOALS[0],
    [goal]
  );
  const selectedActivity = useMemo(
    () => ACTIVITIES.find((a) => a.id === activity) ?? ACTIVITIES[1],
    [activity]
  );

  const results = useMemo(() => {
    const bmr =
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const tdee = Math.round(bmr * selectedActivity.mult);
    const calories = Math.max(1350, tdee + selectedGoal.delta);

    const protein = Math.round(weightKg * selectedGoal.proteinFactor);
    const fats = Math.max(45, Math.round(weightKg * 0.85));
    const remainingCal = Math.max(120, calories - protein * 4 - fats * 9);
    const carbs = Math.round(remainingCal / 4);

    return {
      tdee,
      calories,
      protein,
      carbs,
      fats,
      waterLiters: (weightKg * 0.038).toFixed(1),
    };
  }, [sex, weightKg, heightCm, age, selectedActivity, selectedGoal]);

  const formatWeight = (kg: number) =>
    unit === "metric" ? `${kg} kg` : `${Math.round(kg * 2.20462)} lbs`;

  const formatHeight = (cm: number) => {
    if (unit === "metric") return `${cm} cm`;
    const inches = Math.round(cm / 2.54);
    return `${Math.floor(inches / 12)}'${inches % 12}"`;
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid WhatsApp number.");
      return;
    }
    setError("");
    setStep(5);
  };

  const whatsappSummary = `Hi, I just completed the nutrition & training assessment.

Name: ${name.trim() || "Client"}
Stats: ${age}y, ${formatHeight(heightCm)}, ${formatWeight(weightKg)}
Goal: ${selectedGoal.title} (${trainingDays} days/week)
Targets: ${results.calories.toLocaleString()} kcal (${results.protein}g P / ${results.carbs}g C / ${results.fats}g F)
1:1 Coaching: ${
    intent === "yes"
      ? "Interested in 1:1 coaching"
      : intent === "maybe"
        ? "Open to learning more"
        : "Macros only for now"
  }`;

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F4F5] font-sans antialiased flex flex-col justify-between px-4 py-8 sm:py-14">
      <div className="w-full max-w-[460px] mx-auto">
        {/* Minimal Brand Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs tracking-tight">
                1:1
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">
                Performance & Nutrition Assessment
              </span>
            </div>
            {step < 5 && (
              <span className="text-xs font-medium text-zinc-500 tabular-nums">
                {step} / 4
              </span>
            )}
          </div>

          {/* Clean Hairline Progress Bar */}
          {step < 5 && (
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          )}
        </header>

        {/* Main Card */}
        <div className="rounded-2xl bg-[#121214] border border-white/[0.07] p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {/* STEP 1: STATS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                    Your starting metrics
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Used to calculate your resting expenditure and daily intake.
                  </p>
                </div>

                {/* Metric / Imperial toggle */}
                <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-white/[0.06] shrink-0">
                  {(["metric", "imperial"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        unit === u
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {u === "metric" ? "kg / cm" : "lbs / ft"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sex Toggle */}
              <div className="grid grid-cols-2 gap-2.5">
                {(["male", "female"] as const).map((s) => {
                  const active = sex === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium capitalize transition-all cursor-pointer ${
                        active
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900/60 text-zinc-300 border-white/[0.07] hover:border-white/20"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400 font-medium">Age</span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {age} yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={65}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400 font-medium">Height</span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {formatHeight(heightCm)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={148}
                    max={205}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400 font-medium">
                      Current Weight
                    </span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {formatWeight(weightKg)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={140}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-colors cursor-pointer"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: GOAL & TRAINING */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                  Primary goal & training
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Select the outcome you want to focus on for the next 12 weeks.
                </p>
              </div>

              <div className="space-y-2.5">
                {GOALS.map((g) => {
                  const active = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? "bg-zinc-800/90 border-white text-white"
                          : "bg-zinc-900/40 border-white/[0.07] text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">
                          {g.title}
                        </span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            active ? "border-white bg-white" : "border-zinc-600"
                          }`}
                        >
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{g.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Training sessions per week
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 4, 5] as const).map((d) => {
                    const active = trainingDays === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setTrainingDays(d)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? "bg-white text-black border-white"
                            : "bg-zinc-900/50 text-zinc-300 border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        {d} {d === 5 ? "+ days" : "days"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DAILY ACTIVITY */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                  Daily activity level
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Your movement outside of structured gym sessions.
                </p>
              </div>

              <div className="space-y-2.5">
                {ACTIVITIES.map((a) => {
                  const active = activity === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActivity(a.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? "bg-zinc-800/90 border-white text-white"
                          : "bg-zinc-900/40 border-white/[0.07] text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">
                          {a.title}
                        </span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            active ? "border-white bg-white" : "border-zinc-600"
                          }`}
                        >
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{a.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-colors cursor-pointer"
                >
                  Calculate Targets
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: UNLOCK TARGETS */}
          {step === 4 && (
            <form onSubmit={handleUnlock} className="space-y-5">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                  Your targets are ready
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Enter your details below to view your daily calorie and macro
                  breakdown.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Alex"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full px-3.5 py-3 rounded-xl bg-zinc-900/80 border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7700 900077"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full px-3.5 py-3 rounded-xl bg-zinc-900/80 border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Would you like details on 1:1 coaching?
                </label>
                <div className="space-y-2">
                  {(
                    [
                      {
                        id: "yes",
                        label: "Yes, I'm interested in 1:1 coaching",
                      },
                      {
                        id: "maybe",
                        label: "Possibly, send me more information",
                      },
                      {
                        id: "macros-only",
                        label: "No thanks, just my macro targets",
                      },
                    ] as const
                  ).map((item) => {
                    const active = intent === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIntent(item.id)}
                        className={`w-full py-3 px-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
                          active
                            ? "bg-zinc-800 border-white text-white"
                            : "bg-zinc-900/40 border-white/[0.07] text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            active ? "border-white bg-white" : "border-zinc-600"
                          }`}
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

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-colors cursor-pointer"
                >
                  View Results
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: RESULTS */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                <div>
                  <span className="text-xs text-zinc-400">
                    Prepared for {name.trim() || "You"}
                  </span>
                  <h2 className="text-lg font-semibold text-white mt-0.5">
                    Daily Nutrition & Training Plan
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Primary Calorie Readout */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/[0.06] flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Daily Target</div>
                  <div className="text-3xl font-bold tracking-tight text-white tabular-nums mt-0.5">
                    {results.calories.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-zinc-400">
                      kcal
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Maintenance</div>
                  <div className="text-sm font-medium text-zinc-300 tabular-nums mt-0.5">
                    {results.tdee.toLocaleString()} kcal
                  </div>
                </div>
              </div>

              {/* Clean 3-Column Macro Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.06]">
                  <div className="text-xs text-zinc-400">Protein</div>
                  <div className="text-xl font-semibold text-white tabular-nums mt-1">
                    {results.protein}g
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {results.protein * 4} kcal
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.06]">
                  <div className="text-xs text-zinc-400">Carbs</div>
                  <div className="text-xl font-semibold text-white tabular-nums mt-1">
                    {results.carbs}g
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {results.carbs * 4} kcal
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.06]">
                  <div className="text-xs text-zinc-400">Fats</div>
                  <div className="text-xl font-semibold text-white tabular-nums mt-1">
                    {results.fats}g
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {results.fats * 9} kcal
                  </div>
                </div>
              </div>

              {/* Guidelines Summary */}
              <div className="space-y-2 text-xs border-t border-white/[0.07] pt-4">
                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-400">Goal Focus</span>
                  <span className="font-medium text-white">
                    {selectedGoal.title}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-400">Recommended Split</span>
                  <span className="font-medium text-white">
                    {trainingDays === 3
                      ? "3-Day Full Body"
                      : trainingDays === 4
                        ? "4-Day Upper / Lower"
                        : "5-Day Push / Pull / Legs"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-400">Daily Hydration</span>
                  <span className="font-medium text-white tabular-nums">
                    {results.waterLiters} Litres
                  </span>
                </div>
              </div>

              {/* Next Step / WhatsApp Handoff */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-colors cursor-pointer"
                >
                  Send Plan to Coaching WhatsApp
                </button>
                <p className="text-[11px] text-center text-zinc-500">
                  Sends a copy of your targets to start your consultation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle WhatsApp Preview Drawer/Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#141416] border border-white/10 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">
                WhatsApp Message Preview
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-xs text-zinc-500 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/[0.06] text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-mono">
              {whatsappSummary}
            </div>

            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <footer className="mt-8 text-center text-[11px] text-zinc-600">
        1:1 Online Coaching & Nutrition Assessment
      </footer>
    </div>
  );
}
