"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { EASING, playSensoryFeedback, triggerMobileHaptic } from "@/lib/design-system";
import { SectionEyebrow } from "@/components/SectionEyebrow";

/**
 * ============================================================================
 * ZOD VALIDATION SCHEMA
 * ============================================================================
 */
const enquirySchema = z.object({
  specialty: z.enum(["fatloss", "strength", "hyrox", "busy_pros"]),
  clientGoal: z.enum(["3to5", "5to10", "10plus"]),
  bottleneck: z.enum(["linktree", "cold_dms", "dm_ready"]),
  handle: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters for your handle")
    .max(30, "Handle must be under 30 characters")
    .regex(/^[a-zA-Z0-9._]+$/, "Use letters, numbers, periods, or underscores"),
  name: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters)")
    .max(60, "Name must be under 60 characters"),
  whatsapp: z
    .string()
    .trim()
    .min(7, "Enter a valid WhatsApp or mobile number")
    .max(20, "Number is too long")
    .regex(/^[+\d\s()-]{7,20}$/, "Enter a valid number (e.g. +44 7911 123456)")
    .refine(
      (v) => {
        const digits = v.replace(/[^0-9]/g, "");
        return digits.length >= 7 && digits.length <= 15;
      },
      { message: "Phone number must contain between 7 and 15 digits" }
    ),
  consent: z.boolean().refine((val) => val === true, {
    message: "Please tick to consent to us processing your details and sending your preview",
  }),
  website: z.string().max(100).optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

const STEP_QUESTIONS: readonly string[] = [
  "What do you coach?",
  "How many new clients do you want a month?",
  "What is holding your bio link back?",
  "Where should we send your custom preview?",
];

const SPECIALTIES = [
  {
    id: "fatloss" as const,
    label: "Fat loss & body recomp",
    note: "Drop body fat and keep lean muscle",
  },
  {
    id: "strength" as const,
    label: "Strength & muscle",
    note: "Build size, power, and progressive lifts",
  },
  {
    id: "hyrox" as const,
    label: "Hyrox & hybrid performance",
    note: "Engine, conditioning, and functional strength",
  },
  {
    id: "busy_pros" as const,
    label: "Busy professionals",
    note: "Time-efficient workouts and sustainable habits",
  },
];

const CLIENT_GOALS = [
  {
    id: "3to5" as const,
    label: "3 to 5 new clients a month",
    note: "High-touch 1-on-1 coaching",
  },
  {
    id: "5to10" as const,
    label: "5 to 10 new clients a month",
    note: "Consistent weekly pipeline of buyers",
  },
  {
    id: "10plus" as const,
    label: "10+ new clients a month",
    note: "Scaling online coaching roster",
  },
];

const BOTTLENECKS = [
  {
    id: "linktree" as const,
    label: "Dead Linktree or static form",
    note: "Followers click my bio link but leave without applying",
  },
  {
    id: "cold_dms" as const,
    label: "Time-wasters in my DMs",
    note: "Spending hours chatting to people who never buy",
  },
  {
    id: "dm_ready" as const,
    label: "Relying on 'DM me READY'",
    note: "Missing warm followers who want instant value first",
  },
];

const stepSlideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 24 : -24,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: EASING.naturalOut,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -24 : 24,
    scale: 0.98,
    transition: {
      duration: 0.18,
      ease: EASING.naturalInOut,
    },
  }),
};

export function GetYourFunnel({
  sectionId = "funnel",
  idPrefix = sectionId.startsWith("mobile") ? "m" : "d",
}: {
  sectionId?: string;
  idPrefix?: string;
} = {}) {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    mode: "onChange",
    defaultValues: {
      specialty: "fatloss",
      clientGoal: "5to10",
      bottleneck: "linktree",
      handle: "",
      name: "",
      whatsapp: "",
      consent: false,
      website: "",
    },
  });

  const watchedValues = watch();
  const cleanHandle = watchedValues.handle.replace(/^@+/, "").trim() || "yourname";

  const selectedSpecialtyObj =
    SPECIALTIES.find((s) => s.id === watchedValues.specialty) || SPECIALTIES[0];
  const selectedGoalObj =
    CLIENT_GOALS.find((g) => g.id === watchedValues.clientGoal) || CLIENT_GOALS[1];

  const progressPercent =
    step === 0 ? 25 : step === 1 ? 50 : step === 2 ? 75 : 100;

  const goToStep = (target: 0 | 1 | 2 | 3 | 4) => {
    setDirection(target > step ? 1 : -1);
    setHoveredId(null);
    setSubmitError(null);
    setStep(target);
  };

  const pickSpecialty = (val: EnquiryFormValues["specialty"]) => {
    playSensoryFeedback("tap");
    triggerMobileHaptic("light");
    setValue("specialty", val, { shouldValidate: true });
    goToStep(1);
  };

  const pickClientGoal = (val: EnquiryFormValues["clientGoal"]) => {
    playSensoryFeedback("tap");
    triggerMobileHaptic("light");
    setValue("clientGoal", val, { shouldValidate: true });
    goToStep(2);
  };

  const pickBottleneck = (val: EnquiryFormValues["bottleneck"]) => {
    playSensoryFeedback("tap");
    triggerMobileHaptic("light");
    setValue("bottleneck", val, { shouldValidate: true });
    goToStep(3);
  };

  const onSubmit = async (values: EnquiryFormValues) => {
    if (isCalculating) return;
    playSensoryFeedback("success");
    triggerMobileHaptic("success");
    setSubmitError(null);
    setIsCalculating(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          device: idPrefix === "m" ? "Mobile" : "Desktop",
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "Unable to submit right now. Please try again."
        );
      }

      setIsCalculating(false);
      goToStep(4);
    } catch (err) {
      setIsCalculating(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Unable to submit right now. Please try again."
      );
    }
  };

  const isFieldValid = (fieldName: "handle" | "name" | "whatsapp") => {
    const val = watchedValues[fieldName];
    return Boolean(val && val.trim().length >= 2 && !errors[fieldName] && dirtyFields[fieldName]);
  };

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-[#faf7f2] px-4 py-20 sm:px-6 sm:py-28 scroll-mt-14 text-[#121316]"
    >
      {/* Legacy & mobile anchor aliases scoped to avoid duplicate DOM IDs */}
      {sectionId === "funnel" ? (
        <>
          <div id="build" className="absolute -top-12 left-0 h-0 w-0 pointer-events-none" />
          <div id="enquire" className="absolute -top-12 left-0 h-0 w-0 pointer-events-none" />
          <div id="pricing" className="absolute -top-12 left-0 h-0 w-0 pointer-events-none" />
        </>
      ) : (
        <>
          <div id="mobile-build" className="absolute -top-12 left-0 h-0 w-0 pointer-events-none" />
          <div id="mobile-enquire" className="absolute -top-12 left-0 h-0 w-0 pointer-events-none" />
          <div id="mobile-pricing" className="absolute -top-12 left-0 h-0 w-0 pointer-events-none" />
        </>
      )}

      {/* Precision Background Layer 1: Atmospheric Ambient Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,83,47,0.09),transparent_70%)] blur-2xl" />
        <div className="absolute top-1/2 left-4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,83,47,0.06),transparent_65%)] blur-3xl" />
        <div className="absolute top-1/3 right-4 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06),transparent_65%)] blur-3xl" />
      </div>

      {/* Athletic Topographic Elevation Vector Contours (Lines & Dotted Lines) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full z-0 opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-80 160 C 260 80, 520 270, 860 180 C 1140 110, 1340 220, 1560 150"
          fill="none"
          stroke="#121316"
          strokeWidth="1"
          strokeDasharray="4 8"
          className="opacity-30"
        />
        <path
          d="M-80 320 C 320 200, 640 380, 980 270 C 1220 190, 1380 300, 1560 250"
          fill="none"
          stroke="#d9532f"
          strokeWidth="1.2"
          className="opacity-35"
        />
        <path
          d="M-80 470 C 240 370, 580 530, 890 430 C 1180 340, 1360 450, 1560 400"
          fill="none"
          stroke="#121316"
          strokeWidth="1"
          className="opacity-20"
        />
        <path
          d="M-80 630 C 360 530, 720 670, 1070 570 C 1290 500, 1440 590, 1560 540"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="6 10"
          className="opacity-30"
        />
      </svg>

      {/* Single-Column Container */}
      <div className="relative z-10 mx-auto max-w-lg">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: EASING.naturalOut }}
          className="text-left sm:text-center"
        >
          <SectionEyebrow index="03">Founding Partner Cohort</SectionEyebrow>

          <h2 className="mt-3 font-serif text-4xl font-light tracking-tight text-[#121316] sm:text-5xl leading-[1.04]">
            Get your custom <span className="italic font-normal text-[#d9532f]">bio funnel.</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#52555f] leading-relaxed font-sans max-w-md mx-auto">
            Answer 4 quick steps below. We design, brand, and build your custom diagnostic for £0 upfront—only pay the £99 founding rate once you approve your live preview.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          id="funnel-form"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASING.naturalOut }}
          className="mt-8 rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-8 shadow-[0_20px_50px_rgba(18,19,22,0.06)]"
        >
          {/* Card Header */}
          <div className="mb-4 flex items-center justify-between border-b border-stone-200/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-stone-200/90 shadow-xs bg-[#121316]">
                <Image
                  src="/logos/qualfi-monogram-dark.svg"
                  alt="qualfi — custom 60-second bio diagnostic funnel for fitness coaches"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-xs leading-tight">
                <div className="flex items-center gap-1">
                  <b className="font-sans text-base font-black tracking-tight text-[#121316]">
                    qualfi
                  </b>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9532f]" />
                </div>
                <span className="text-[#52555f]">Custom Bio Funnel</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10b981]/15 px-2.5 py-1 text-[10px] font-bold text-[#047857]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              LIVE IN 72H
            </span>
          </div>

          {/* Integrated Founding Partner Offer Banner */}
          <div className="mb-5 rounded-2xl border border-stone-200/90 bg-[#faf7f2]/90 p-3.5 sm:p-4 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/70 pb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d9532f]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#d9532f]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d9532f]" />
                Founding Partner Offer
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#047857]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Pay £0 Today → £99 On Handover (£0/mo)
              </span>
            </div>

            <p className="mt-2 text-xs text-[#52555f] leading-snug">
              Complete the 4 steps below. We design, brand, and text your working preview to WhatsApp in 72h. Only pay the £99 founding rate once you approve it. <b className="text-[#121316]">Zero monthly subscriptions.</b>
            </p>
          </div>

          {/* Interactive Segmented Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#52555f] mb-1.5">
              <span>
                {step < 4 ? `Step ${step + 1} of 4` : "Preview Locked"}
              </span>
              <motion.span
                key={progressPercent}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-bold text-[#d9532f]"
              >
                {progressPercent}%
              </motion.span>
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => {
                const isActiveOrDone = step >= i;
                const canClickBack = i < step && step < 4;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!canClickBack}
                    onClick={() => {
                      if (canClickBack) {
                        playSensoryFeedback("tap");
                        goToStep(i as 0 | 1 | 2 | 3);
                      }
                    }}
                    className={`h-1.5 flex-1 rounded-full bg-stone-200 overflow-hidden transition-opacity ${
                      canClickBack ? "cursor-pointer hover:opacity-80" : "cursor-default"
                    }`}
                    aria-label={`Step ${i + 1}`}
                  >
                    <motion.span
                      className="block h-full rounded-full bg-[#d9532f]"
                      initial={false}
                      animate={{ width: isActiveOrDone ? "100%" : "0%" }}
                      transition={{ duration: 0.35, ease: EASING.naturalOut }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {/* Calculation Shimmer State */}
              {isCalculating ? (
                <motion.div
                  key="calculating"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="h-12 w-12 rounded-full border-3 border-[#d9532f] border-t-transparent animate-spin" />
                  <p className="font-serif text-xl italic text-[#121316]">
                    Setting up qualfi.app/@{cleanHandle}…
                  </p>
                  <p className="text-xs text-[#52555f]">
                    Preparing your 72-hour custom preview
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Step Question Title */}
                  {step < 4 && (
                    <h3 className="font-serif text-xl sm:text-2xl font-light text-[#121316] mb-4">
                      {STEP_QUESTIONS[step]}
                    </h3>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 0: WHAT DO YOU COACH?                               */}
                  {/* ======================================================== */}
                  {step === 0 && (
                    <div
                      className="flex flex-col gap-2.5"
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {SPECIALTIES.map((item, idx) => {
                        const isHovered = hoveredId === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.22, delay: idx * 0.04, ease: EASING.naturalOut }}
                            onHoverStart={() => setHoveredId(item.id)}
                            onFocus={() => setHoveredId(item.id)}
                            onBlur={() => setHoveredId(null)}
                            onHoverEnd={() => setHoveredId(null)}
                            whileHover={{ scale: 1.015, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => pickSpecialty(item.id)}
                            className={`group relative flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left shadow-xs transition-colors duration-150 ${
                              isHovered
                                ? "border-[#d9532f] bg-[#d9532f] text-white"
                                : "border-stone-200/90 bg-white text-[#121316] hover:border-[#d9532f]"
                            }`}
                          >
                            <div className="relative z-10 pr-2">
                              <span
                                className={`block font-serif text-base font-normal leading-tight transition-colors ${
                                  isHovered ? "text-white" : "text-[#121316]"
                                }`}
                              >
                                {item.label}
                              </span>
                              <span
                                className={`mt-0.5 block text-xs leading-tight transition-colors ${
                                  isHovered ? "text-white/85" : "text-[#52555f]"
                                }`}
                              >
                                {item.note}
                              </span>
                            </div>

                            <motion.span
                              animate={{ x: isHovered ? 3 : 0 }}
                              className={`relative z-10 text-sm font-bold transition-colors ${
                                isHovered ? "text-white" : "text-[#d9532f]"
                              }`}
                            >
                              →
                            </motion.span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 1: MONTHLY CLIENT GOAL                              */}
                  {/* ======================================================== */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div
                        className="flex flex-col gap-2.5"
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {CLIENT_GOALS.map((goal, idx) => {
                          const isHovered = hoveredId === goal.id;
                          return (
                            <motion.button
                              key={goal.id}
                              type="button"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.22, delay: idx * 0.04, ease: EASING.naturalOut }}
                              onHoverStart={() => setHoveredId(goal.id)}
                              onFocus={() => setHoveredId(goal.id)}
                              onBlur={() => setHoveredId(null)}
                              onHoverEnd={() => setHoveredId(null)}
                              whileHover={{ scale: 1.015, y: -1 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => pickClientGoal(goal.id)}
                              className={`group relative flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left shadow-xs transition-colors duration-150 ${
                                isHovered
                                  ? "border-[#d9532f] bg-[#d9532f] text-white"
                                  : "border-stone-200/90 bg-white text-[#121316] hover:border-[#d9532f]"
                              }`}
                            >
                              <div className="relative z-10 pr-2">
                                <span
                                  className={`block font-serif text-base font-normal leading-tight transition-colors ${
                                    isHovered ? "text-white" : "text-[#121316]"
                                  }`}
                                >
                                  {goal.label}
                                </span>
                                <span
                                  className={`mt-0.5 block text-xs leading-tight transition-colors ${
                                    isHovered ? "text-white/85" : "text-[#52555f]"
                                  }`}
                                >
                                  {goal.note}
                                </span>
                              </div>

                              <motion.span
                                animate={{ x: isHovered ? 3 : 0 }}
                                className={`relative z-10 text-sm font-bold transition-colors ${
                                  isHovered ? "text-white" : "text-[#d9532f]"
                                }`}
                              >
                                →
                              </motion.span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            playSensoryFeedback("tap");
                            goToStep(0);
                          }}
                          className="flex min-h-[44px] items-center text-xs font-semibold text-[#52555f] hover:text-[#121316] py-1.5 px-2 transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-[#d9532f]"
                          aria-label="Return to previous step"
                        >
                          ← Back
                        </button>
                        <span className="text-[11px] text-[#52555f]">Tap an option to continue</span>
                      </div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 2: BIGGEST BOTTLENECK                               */}
                  {/* ======================================================== */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div
                        className="flex flex-col gap-2.5"
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {BOTTLENECKS.map((b, idx) => {
                          const isHovered = hoveredId === b.id;
                          return (
                            <motion.button
                              key={b.id}
                              type="button"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.22, delay: idx * 0.04, ease: EASING.naturalOut }}
                              onHoverStart={() => setHoveredId(b.id)}
                              onFocus={() => setHoveredId(b.id)}
                              onBlur={() => setHoveredId(null)}
                              onHoverEnd={() => setHoveredId(null)}
                              whileHover={{ scale: 1.015, y: -1 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => pickBottleneck(b.id)}
                              className={`group relative flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left shadow-xs transition-colors duration-150 ${
                                isHovered
                                  ? "border-[#d9532f] bg-[#d9532f] text-white"
                                  : "border-stone-200/90 bg-white text-[#121316] hover:border-[#d9532f]"
                              }`}
                            >
                              <div className="relative z-10 pr-2">
                                <span
                                  className={`block font-serif text-base font-normal leading-tight transition-colors ${
                                    isHovered ? "text-white" : "text-[#121316]"
                                  }`}
                                >
                                  {b.label}
                                </span>
                                <span
                                  className={`mt-0.5 block text-xs leading-tight transition-colors ${
                                    isHovered ? "text-white/85" : "text-[#52555f]"
                                  }`}
                                >
                                  {b.note}
                                </span>
                              </div>

                              <motion.span
                                animate={{ x: isHovered ? 3 : 0 }}
                                className={`relative z-10 text-sm font-bold transition-colors ${
                                  isHovered ? "text-white" : "text-[#d9532f]"
                                }`}
                              >
                                →
                              </motion.span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            playSensoryFeedback("tap");
                            goToStep(1);
                          }}
                          className="flex min-h-[44px] items-center text-xs font-semibold text-[#52555f] hover:text-[#121316] py-1.5 px-2 transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-[#d9532f]"
                          aria-label="Return to previous step"
                        >
                          ← Back
                        </button>
                        <span className="text-[11px] text-[#52555f]">Tap an option to continue</span>
                      </div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 3: CONTACT DETAILS (Single-Column + Inline Check)   */}
                  {/* ======================================================== */}
                  {step === 3 && (
                    <div className="flex flex-col space-y-4">
                      {/* Selected Calibration Pill */}
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between rounded-2xl border border-stone-200 bg-[#faf7f2] px-3.5 py-2.5 text-xs"
                      >
                        <span className="font-medium text-[#121316] truncate pr-2">
                          ✓ {selectedSpecialtyObj.label} · {selectedGoalObj.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            playSensoryFeedback("tap");
                            goToStep(0);
                          }}
                          className="shrink-0 font-bold text-[#d9532f] hover:underline underline-offset-2"
                        >
                          Change
                        </button>
                      </motion.div>

                      {/* FIELD 1: INSTAGRAM HANDLE */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor={`${idPrefix}-enquire-handle`}
                            className="block text-xs font-bold uppercase tracking-wider text-[#121316]"
                          >
                            Instagram Handle
                          </label>
                          <span className="font-mono text-[11px] font-semibold text-[#d9532f]">
                            qualfi.app/@{cleanHandle}
                          </span>
                        </div>

                        <div
                          className={`relative flex min-h-[52px] items-center rounded-2xl border bg-[#faf7f2]/60 px-4 transition-all ${
                            errors.handle
                              ? "border-rose-500 bg-rose-50/50"
                              : isFieldValid("handle")
                              ? "border-[#10b981] bg-[#10b981]/5"
                              : "border-stone-300 focus-within:border-[#d9532f] focus-within:bg-white focus-within:shadow-xs"
                          }`}
                        >
                          <span className="font-mono text-base font-bold text-[#52555f] select-none mr-1">
                            @
                          </span>
                          <input
                            id={`${idPrefix}-enquire-handle`}
                            type="text"
                            inputMode="text"
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            enterKeyHint="next"
                            placeholder="coachmaya"
                            aria-invalid={Boolean(errors.handle)}
                            aria-describedby={errors.handle ? `${idPrefix}-enquire-handle-error` : undefined}
                            {...register("handle", {
                              onChange: (e) => {
                                let v = String(e.target.value || "");
                                // If user pasted a full Instagram profile URL, extract the handle
                                v = v
                                  .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
                                  .split(/[/?#]/)[0];
                                // Strip @ symbols, whitespace (e.g. iOS period+space), and lowercase
                                v = v.replace(/[@\s]+/g, "").toLowerCase();
                                e.target.value = v;
                              },
                            })}
                            className="w-full bg-transparent py-3 text-base font-medium text-[#121316] outline-none placeholder:text-stone-400"
                          />

                          <AnimatePresence mode="wait">
                            {isFieldValid("handle") && (
                              <motion.span
                                key="handle-valid"
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                                className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-xs font-bold text-white"
                              >
                                ✓
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        <AnimatePresence mode="wait">
                          {errors.handle ? (
                            <motion.p
                              id={`${idPrefix}-enquire-handle-error`}
                              role="alert"
                              key="handle-error"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1 text-xs font-medium text-rose-600"
                            >
                              {errors.handle.message}
                            </motion.p>
                          ) : isFieldValid("handle") ? (
                            <motion.p
                              key="handle-ok"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1 text-xs font-semibold text-[#047857]"
                            >
                              ✓ qualfi.app/@{cleanHandle} is available
                            </motion.p>
                          ) : null}
                        </AnimatePresence>
                      </motion.div>

                      {/* FIELD 2: YOUR NAME */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                      >
                        <label
                          htmlFor={`${idPrefix}-enquire-name`}
                          className="block text-xs font-bold uppercase tracking-wider text-[#121316] mb-1.5"
                        >
                          Your Name
                        </label>
                        <div
                          className={`relative flex min-h-[52px] items-center rounded-2xl border bg-[#faf7f2]/60 px-4 transition-all ${
                            errors.name
                              ? "border-rose-500 bg-rose-50/50"
                              : isFieldValid("name")
                              ? "border-[#10b981] bg-[#10b981]/5"
                              : "border-stone-300 focus-within:border-[#d9532f] focus-within:bg-white focus-within:shadow-xs"
                          }`}
                        >
                          <input
                            id={`${idPrefix}-enquire-name`}
                            type="text"
                            autoComplete="name"
                            autoCapitalize="words"
                            autoCorrect="off"
                            spellCheck={false}
                            enterKeyHint="next"
                            placeholder="Maya Lin"
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? `${idPrefix}-enquire-name-error` : undefined}
                            {...register("name")}
                            className="w-full bg-transparent py-3 text-base font-medium text-[#121316] outline-none placeholder:text-stone-400"
                          />

                          <AnimatePresence mode="wait">
                            {isFieldValid("name") && (
                              <motion.span
                                key="name-valid"
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                                className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-xs font-bold text-white"
                              >
                                ✓
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        <AnimatePresence mode="wait">
                          {errors.name && (
                            <motion.p
                              id={`${idPrefix}-enquire-name-error`}
                              role="alert"
                              key="name-error"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1 text-xs font-medium text-rose-600"
                            >
                              {errors.name.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* FIELD 3: WHATSAPP NUMBER */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                      >
                        <label
                          htmlFor={`${idPrefix}-enquire-whatsapp`}
                          className="block text-xs font-bold uppercase tracking-wider text-[#121316] mb-1.5"
                        >
                          WhatsApp Number
                        </label>
                        <div
                          className={`relative flex min-h-[52px] items-center rounded-2xl border bg-[#faf7f2]/60 px-4 transition-all ${
                            errors.whatsapp
                              ? "border-rose-500 bg-rose-50/50"
                              : isFieldValid("whatsapp")
                              ? "border-[#10b981] bg-[#10b981]/5"
                              : "border-stone-300 focus-within:border-[#d9532f] focus-within:bg-white focus-within:shadow-xs"
                          }`}
                        >
                          <input
                            id={`${idPrefix}-enquire-whatsapp`}
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            enterKeyHint="done"
                            placeholder="+44 7911 123456"
                            aria-invalid={Boolean(errors.whatsapp)}
                            aria-describedby={errors.whatsapp ? `${idPrefix}-enquire-whatsapp-error` : undefined}
                            {...register("whatsapp", {
                              onChange: (e) => {
                                // Strip invisible iOS Contacts/WhatsApp directional Unicode markers & normalize spaces
                                e.target.value = String(e.target.value || "")
                                  .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, "")
                                  .replace(/\u00A0/g, " ");
                              },
                            })}
                            className="w-full bg-transparent py-3 text-base font-medium text-[#121316] outline-none placeholder:text-stone-400"
                          />

                          <AnimatePresence mode="wait">
                            {isFieldValid("whatsapp") && (
                              <motion.span
                                key="whatsapp-valid"
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                                className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-xs font-bold text-white"
                              >
                                ✓
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        <AnimatePresence mode="wait">
                          {errors.whatsapp && (
                            <motion.p
                              id={`${idPrefix}-enquire-whatsapp-error`}
                              role="alert"
                              key="whatsapp-error"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1 text-xs font-medium text-rose-600"
                            >
                              {errors.whatsapp.message}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Anxiety-Reducing Microcopy */}
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#52555f]">
                          <span>
                            We only use this to text your working preview link in 72h. Zero spam.
                          </span>
                        </p>
                      </motion.div>

                      {/* Honeypot Anti-Bot Field (Stealthily hidden from users, autofill-safe, a11y-clean) */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-9999px",
                          top: "-9999px",
                          width: "1px",
                          height: "1px",
                          overflow: "hidden",
                          opacity: 0,
                          pointerEvents: "none",
                        }}
                        aria-hidden="true"
                        role="presentation"
                      >
                        <label htmlFor={`${idPrefix}-verification-field`}>
                          Do not fill this field
                        </label>
                        <input
                          id={`${idPrefix}-verification-field`}
                          type="text"
                          tabIndex={-1}
                          autoComplete="new-password"
                          aria-hidden="true"
                          {...register("website")}
                        />
                      </div>

                      {/* Explicit GDPR / PECR Data Opt-In Checkbox */}
                      <div className="pt-1">
                        <label
                          htmlFor={`${idPrefix}-enquire-consent`}
                          className={`flex min-h-[48px] cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-all ${
                            errors.consent
                              ? "border-rose-500 bg-rose-50/50"
                              : watchedValues.consent
                              ? "border-[#10b981] bg-[#10b981]/5"
                              : "border-stone-200/90 bg-[#faf7f2]/70 hover:border-stone-300"
                          }`}
                        >
                          <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                            <input
                              id={`${idPrefix}-enquire-consent`}
                              type="checkbox"
                              aria-invalid={Boolean(errors.consent)}
                              aria-describedby={
                                errors.consent
                                  ? `${idPrefix}-enquire-consent-error`
                                  : undefined
                              }
                              {...register("consent")}
                              onChange={(e) => {
                                playSensoryFeedback("tap");
                                triggerMobileHaptic("light");
                                setValue("consent", e.target.checked, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                              className="peer sr-only"
                            />
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs font-bold transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#d9532f] ${
                                watchedValues.consent
                                  ? "border-[#d9532f] bg-[#d9532f] text-white"
                                  : errors.consent
                                  ? "border-rose-500 bg-white text-transparent"
                                  : "border-stone-300 bg-white text-transparent"
                              }`}
                            >
                              ✓
                            </span>
                          </div>

                          <span className="text-[11px] leading-relaxed text-[#52555f]">
                            I opt in and consent to <b className="text-[#121316]">qualfi</b> storing and processing my details to build my custom bio preview and send it to my WhatsApp/phone. Read our{" "}
                            <Link
                              href="/privacy"
                              className="font-medium text-[#121316] underline underline-offset-2 hover:text-[#d9532f] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Privacy Policy
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/terms"
                              className="font-medium text-[#121316] underline underline-offset-2 hover:text-[#d9532f] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Terms of Service
                            </Link>
                            .
                          </span>
                        </label>

                        <AnimatePresence mode="wait">
                          {errors.consent && (
                            <motion.p
                              id={`${idPrefix}-enquire-consent-error`}
                              role="alert"
                              key="consent-error"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1.5 text-xs font-medium text-rose-600"
                            >
                              {errors.consent.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Submit CTA & Back Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 }}
                        className="pt-2"
                      >
                        {/* Founding Rate Locked Banner */}
                        <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-[#121316]">
                          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5">
                            <span className="font-bold flex items-center gap-1.5 text-[#047857]">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Founding Partner Setup Locked
                            </span>
                            <span className="font-mono font-bold text-[#047857]">
                              £0 Due Today
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#52555f]">
                            <span>We text your preview in 72h</span>
                            <span>Only £99 once approved · <b className="text-[#121316]">£0/mo forever</b></span>
                          </div>
                        </div>

                        <AnimatePresence mode="wait">
                          {submitError && (
                            <motion.div
                              key="submit-error"
                              role="alert"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
                            >
                              {submitError}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.button
                          type="submit"
                          disabled={isCalculating}
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#d9532f] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#b83e1d] transition-colors focus-visible:ring-2 focus-visible:ring-[#121316] disabled:opacity-60"
                        >
                          <span>
                            {isCalculating
                              ? "Reserving Your Founding Spot..."
                              : "Build My Custom Preview (£0 Today)"}
                          </span>
                          <span>→</span>
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => {
                            playSensoryFeedback("tap");
                            goToStep(2);
                          }}
                          className="mt-2 flex min-h-[44px] w-full items-center justify-center text-center text-xs font-semibold text-[#52555f] hover:text-[#121316] transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-[#d9532f]"
                          aria-label="Return to previous step"
                        >
                          ← Back
                        </button>
                      </motion.div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 4: UNLOCKED PREVIEW CONFIRMATION                    */}
                  {/* ======================================================== */}
                  {step === 4 && (
                    <div className="flex flex-col space-y-5 text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: EASING.naturalOut }}
                        className="rounded-2xl border border-[#d9532f]/25 bg-gradient-to-br from-[#faf7f2] to-white p-5 shadow-xs"
                      >
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#047857]">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Application Received
                        </span>
                        <div className="mt-2 font-serif text-xl sm:text-2xl font-light leading-snug text-[#121316]">
                          It&apos;ll be ready within 72 hours and we will be in touch soon.
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.06, ease: EASING.naturalOut }}
                        className="flex flex-col space-y-2 rounded-2xl border border-stone-200 bg-[#faf7f2]/70 p-4 text-xs"
                      >
                        <div className="flex justify-between py-1 border-b border-stone-200/70">
                          <span className="text-[#52555f]">Coaching Focus</span>
                          <span className="font-bold text-[#121316]">{selectedSpecialtyObj.label}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200/70">
                          <span className="text-[#52555f]">Monthly Goal</span>
                          <span className="font-bold text-[#121316]">{selectedGoalObj.label}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200/70">
                          <span className="text-[#52555f]">Founding Rate</span>
                          <span className="font-bold text-[#047857]">£0 today → £99 on handover (£0/mo)</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#52555f]">Preview Sent To</span>
                          <span className="font-bold text-[#047857]">{watchedValues.whatsapp}</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.12, ease: EASING.naturalOut }}
                        className="flex flex-col space-y-2.5"
                      >
                        <motion.a
                          href="https://www.instagram.com/qualfiapp/"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => playSensoryFeedback("tap")}
                          className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#121316] px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#d9532f] transition-colors"
                        >
                          <span>Message Us On Instagram @qualfiapp</span>
                          <span>↗</span>
                        </motion.a>

                        <button
                          type="button"
                          onClick={() => {
                            playSensoryFeedback("tap");
                            goToStep(3);
                          }}
                          className="min-h-[44px] w-full rounded-full border border-stone-200 bg-[#faf7f2] py-2.5 text-xs font-semibold text-[#52555f] hover:text-[#121316] transition-colors"
                        >
                          Edit My Details
                        </button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
