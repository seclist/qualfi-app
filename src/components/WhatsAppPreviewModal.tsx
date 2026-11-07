"use client";

import { motion, AnimatePresence } from "framer-motion";
import { EASING, playSensoryFeedback } from "@/lib/design-system";

export interface WhatsAppLeadData {
  name: string;
  contact: string;
  goalLabel: string;
  struggleLabel: string;
  age: number;
  weight: number;
  days: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  split: string;
  score: number;
  hot: boolean;
  ping: string;
}

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WhatsAppLeadData;
}

export function WhatsAppPreviewModal({
  isOpen,
  onClose,
  data,
}: WhatsAppPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 16, opacity: 0 }}
          transition={{ duration: 0.22, ease: EASING.naturalOut }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[400px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b141a] text-[#e9edef] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#202c33] bg-[#1f2c34] px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#25d366]" />
              <span className="font-semibold text-xs tracking-wide text-white">
                WhatsApp · qualfi
              </span>
            </div>
            <button
              onClick={() => {
                playSensoryFeedback("tap");
                onClose();
              }}
              className="text-xs text-stone-400 hover:text-white transition-colors"
            >
              ✕ Close
            </button>
          </div>

          {/* Incoming Message Container */}
          <div className="p-5 font-sans">
            {/* The Incoming WhatsApp Message Bubble */}
            <div className="rounded-2xl rounded-tl-sm bg-[#202c33] p-4 text-xs shadow-md border-l-4 border-[#25d366] text-[#e9edef] space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-[11px] text-[#25d366]">
                  qualfi LEAD ALERT
                </span>
                <span className="text-[10px] text-stone-400">under 2s</span>
              </div>

              {/* Lead Name & Contact */}
              <div className="rounded-xl bg-[#111b21] p-3 border border-white/5 space-y-1">
                <div>
                  <span className="text-stone-400">Lead Name:</span>{" "}
                  <b className="text-white text-[13px]">{data.name}</b>
                </div>
                <div>
                  <span className="text-stone-400">WhatsApp or Phone:</span>{" "}
                  <b className="text-[#25d366] font-mono text-[12px]">{data.contact}</b>
                </div>
              </div>

              {/* Funnel Options & Choices */}
              <div className="space-y-1.5 text-[11.5px] leading-snug">
                <div>
                  <span className="text-stone-400">Primary Goal:</span>{" "}
                  <span className="font-semibold text-white">{data.goalLabel}</span>
                </div>
                <div>
                  <span className="text-stone-400">Age and Weight:</span>{" "}
                  <span className="font-semibold text-white">{data.age} years old, {data.weight} kg</span>
                </div>
                <div>
                  <span className="text-stone-400">Availability:</span>{" "}
                  <span className="font-semibold text-white">{data.days} days per week</span>
                </div>
                <div>
                  <span className="text-stone-400">Primary Struggle:</span>{" "}
                  <span className="font-semibold text-[#ffd279]">{data.struggleLabel}</span>
                </div>
              </div>

              {/* Calculated Plan & Fuel Targets */}
              <div className="rounded-xl bg-[#111b21] p-3 border border-white/5 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#25d366]">
                  Calculated Nutrition Blueprint
                </div>
                <div className="font-mono text-base font-bold text-white">
                  {data.calories} kcal <span className="text-xs text-stone-400 font-normal">daily</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  <span className="text-[#e8a87c] font-semibold">{data.protein}g Protein</span>,{" "}
                  <span className="text-[#cfd6bf] font-semibold">{data.carbs}g Carbs</span>,{" "}
                  <span className="text-[#d58a6e] font-semibold">{data.fat}g Fat</span>
                </div>
                <div className="text-[11px] text-stone-300 pt-0.5">
                  Split: <b className="text-white">{data.split}</b>
                </div>
              </div>

              {/* Intent Score */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
                <span className="text-stone-400">Purchase Intent:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    data.hot
                      ? "bg-[#25d366]/20 text-[#25d366] ring-1 ring-[#25d366]/40"
                      : "bg-[#ffd279]/20 text-[#ffd279]"
                  }`}
                >
                  {data.score}/100 Hot Lead
                </span>
              </div>

              {/* Timestamp & read receipts */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 pt-1">
                <span>Just now</span>
                <span className="text-[#53bdeb]">✓✓</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
