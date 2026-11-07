"use client";

import { useCallback, useMemo, useState } from "react";

/* ---------- motion tokens (shared language, re-skinned per site) ---------- */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // entrances
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const; // moves
export const DUR_ENTER = 0.2; // dropdowns / swaps: 150-250ms
export const DUR_EXIT = 0.16; // exits are 20% shorter
export const STAGGER = 0.03; // list rows: 30ms

/* ---------- the 60-second diagnostic ---------- */
export type Goal = "lose" | "build" | "recomp";
export type Timing = "now" | "month" | "browsing";
export type Struggle = "diet" | "plateau" | "time" | "metabolism";

export interface Answers {
  goal?: Goal;
  age?: number;
  weight: number;
  days?: 2 | 3 | 4 | 5 | 6;
  struggle?: Struggle;
  timing?: Timing;
  name?: string;
  contact?: string;
}

export const GOALS = [
  { id: "lose", label: "Lean out and energize", note: "Drop body fat and increase daily energy" },
  { id: "build", label: "Build lasting strength", note: "Add lean muscle and physical power" },
  { id: "recomp", label: "Body recomposition", note: "Build muscle and drop fat together" },
] as const;

export const STRUGGLES = [
  { id: "diet", label: "Diet consistency", note: "Struggling to stay on track with food" },
  { id: "plateau", label: "Progress plateau", note: "Working hard without seeing new changes" },
  { id: "time", label: "Busy schedule", note: "Need efficient 45 minute workouts" },
  { id: "metabolism", label: "Slow metabolism", note: "Fat loss has stalled out completely" },
] as const;

export const TIMINGS = [
  { id: "now", label: "This week", note: "Ready to start immediately" },
  { id: "month", label: "This month", note: "Building sustainable long term habits" },
  { id: "browsing", label: "Just looking", note: "Finding my personal daily numbers" },
] as const;

export const DAYS = [2, 3, 4, 5, 6] as const;

export const QUESTIONS = [
  "What is your primary goal?",
  "Bodyweight and age",
  "How many days can you train?",
  "What is your biggest obstacle?",
  "Unlock your custom blueprint",
] as const;

const SPLITS: Record<number, string> = {
  2: "Full Body Protocol",
  3: "Push Pull Legs Split",
  4: "Upper / Lower Split",
  5: "Push Pull Legs Upper Lower",
  6: "Push Pull Legs Split x2",
};

export interface Result {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  split: string;
  score: number;
  hot: boolean;
  ping: string;
  goalLabel: string;
  struggleLabel: string;
  name: string;
  contact: string;
}

export function compute(a: Answers): Result {
  const weight = a.weight || 70;
  const age = a.age || 28;
  const daysVal = a.days ?? 4;

  // Calibrated Mifflin-St Jeor TDEE calculation
  const bmr = 10 * weight + 6.25 * 174 - 5 * age + 5;
  const activityMult = daysVal === 2 ? 1.35 : daysVal === 3 ? 1.45 : daysVal === 4 ? 1.55 : daysVal === 5 ? 1.65 : 1.75;
  const tdee = Math.round(bmr * activityMult);

  const delta = a.goal === "lose" ? -450 : a.goal === "build" ? 250 : -100;
  const calories = Math.round((tdee + delta) / 10) * 10;

  // Higher protein target if diet adherence or metabolic recomp is primary struggle
  const proteinFactor = a.struggle === "diet" || a.goal === "recomp" ? 2.2 : 2.0;
  const protein = Math.round(weight * proteinFactor);
  const fat = Math.round(weight * 0.85);
  const carbs = Math.max(45, Math.round((calories - protein * 4 - fat * 9) / 4));

  // Algorithmic intent scoring (0 to 100)
  const strugglePts = a.struggle === "plateau" || a.struggle === "metabolism" ? 35 : 28;
  const availabilityPts = (daysVal - 1) * 7; // up to 35 pts
  const contactPts = 25; // submitted verified name and WhatsApp/IG
  const score = Math.min(100, strugglePts + availabilityPts + contactPts);

  const struggleMatch = STRUGGLES.find((s) => s.id === a.struggle)?.label ?? "Progress plateau";

  return {
    calories,
    protein,
    carbs,
    fat,
    split: SPLITS[daysVal] ?? "Push Pull Legs Split",
    score,
    hot: score >= 70,
    ping: (1.8 - (score / 100) * 0.6).toFixed(1),
    goalLabel: GOALS.find((g) => g.id === a.goal)?.label ?? "Build lasting strength",
    struggleLabel: struggleMatch,
    name: a.name?.trim() || "Alex Morgan",
    contact: a.contact?.trim() || "+44 7911 123456",
  };
}

export function useDiagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    goal: "build",
    age: 28,
    weight: 70,
    days: 4,
    struggle: "plateau",
    timing: "now",
    name: "Alex Morgan",
    contact: "+44 7911 123456",
  });

  const result = useMemo(
    () => (step >= 5 ? compute(answers) : null),
    [step, answers],
  );

  const pick = useCallback(
    <K extends "goal" | "days" | "struggle" | "timing">(key: K, value: Answers[K]) => {
      setAnswers((p) => ({ ...p, [key]: value }));
      setStep((s) => Math.min(5, s + 1));
    },
    [],
  );
  const setWeight = useCallback((weight: number) => setAnswers((p) => ({ ...p, weight })), []);
  const setAge = useCallback((age: number) => setAnswers((p) => ({ ...p, age })), []);
  const setDays = useCallback((days: 2 | 3 | 4 | 5 | 6) => setAnswers((p) => ({ ...p, days })), []);
  const setContact = useCallback((name: string, contact: string) => {
    setAnswers((p) => ({ ...p, name, contact }));
  }, []);
  const next = useCallback(() => setStep((s) => Math.min(5, s + 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const goTo = useCallback((i: number) => setStep(i), []);
  const reset = useCallback(() => {
    setStep(0);
    setAnswers({
      goal: "build",
      age: 28,
      weight: 70,
      days: 4,
      struggle: "plateau",
      timing: "now",
      name: "Alex Morgan",
      contact: "+44 7911 123456",
    });
  }, []);

  return { step, answers, result, pick, setWeight, setAge, setDays, setContact, next, back, goTo, reset };
}

/* ---------- tool builder & enquiry form (front-end only; wire to your CRM/API) ---------- */
export type ToolTheme = "terracotta" | "lime" | "mint" | "sand";

export interface ToolBuilderValues {
  name: string;
  handle: string;
  whatsapp: string;
  niche: string;
  focus: string;
  theme: ToolTheme;
  deliverables: string[];
}

export function useEnquiry() {
  const [values, setValues] = useState<ToolBuilderValues>({
    name: "",
    handle: "",
    whatsapp: "",
    niche: "",
    focus: "Hypertrophy & Strength",
    theme: "terracotta",
    deliverables: [
      "Daily Caloric Target (BMR/TDEE)",
      "Macronutrient Split (P/C/F grams)",
      "Optimal Training Split",
      "0 to 100 Intent Scoring",
      "<2s Encrypted WhatsApp Routing",
      "Downloadable Custom PDF Blueprint",
    ],
  });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [phase, setPhase] = useState(0);

  const set =
    (key: keyof ToolBuilderValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const setField = useCallback(<K extends keyof ToolBuilderValues>(key: K, val: ToolBuilderValues[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
  }, []);

  const toggleDeliverable = useCallback((item: string) => {
    setValues((v) => ({
      ...v,
      deliverables: v.deliverables.includes(item)
        ? v.deliverables.filter((d) => d !== item)
        : [...v.deliverables, item],
    }));
  }, []);

  const submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setState("sending");
    setPhase(1);
    setTimeout(() => setPhase(2), 450);
    setTimeout(() => setPhase(3), 900);
    setTimeout(() => {
      setState("sent");
    }, 1400);
  };

  const reset = () => {
    setState("idle");
    setPhase(0);
  };

  return { values, state, phase, set, setField, toggleDeliverable, submit, reset };
}

