<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Qualfi Core Business Context & System Knowledge
> **MANDATORY CONTEXT**: The AI assistant MUST read, internalize, and strictly adhere to this business context before answering any prompt, generating UI designs, writing copy, or writing code in this repository.

---

## 1. Business Overview & Mission
Qualfi builds bespoke branded diagnostic micro-tools for coaches and service providers. 

Traditional websites and landing pages fail because they force prospects to read walls of text and fill out boring, static "Contact Us" forms, only to wait hours or days for an email reply. By the time the business responds, the prospect has cooled down or forgotten the offer.

**The Qualfi Solution:**
* **Immediate, Personalized Value Exchange**: Instead of a boring contact form, prospects complete a 60-second interactive diagnostic that calculates real, customized numbers and recommendations on the spot. In exchange for this immediate high-value deliverable, prospects submit their contact details (name, WhatsApp/phone, Instagram handle).
* **Algorithmic Lead Pre-Qualification**: Qualfi micro-tools automatically score each lead from 0 to 100 on purchase intent based on their timeline, frequency, goals, and struggles. Low-quality tire-kickers are separated from serious buyers automatically so coaches never waste time chasing cold leads.
* **Frictionless Business Integration**: Qualfi tools operate either as ultra-fast standalone bio links (replacing dead Linktree, Stan Store, or Beacons bios on Instagram and TikTok) OR as frictionless embeds directly inside an existing website or client portal.
* **Instant Lead Notification (< 2 Seconds)**: High-quality leads trigger an encrypted webhook dispatch to the client's personal WhatsApp or SMS within 2 seconds of completion. The coach can initiate a warm conversation while the prospect is still actively looking at their phone and in peak buying motivation.

---

## 2. Primary Target Niche: Fitness Coaches & Personal Trainers

### A. The 60-Second Macro & Training Split Diagnostic
1. **Inputs Collected**:
   * Goal (Fat Loss / Lean Muscle / Metabolic Recomposition)
   * Current Bodyweight & Age
   * Training Availability (2 to 6 sessions/week)
   * Primary Struggles (Diet adherence, plateau, time constraints, metabolic slowdown)
   * Commitment Timeline (Immediate / This Month / Exploring)
2. **Instant Deliverables Calculated**:
   * Precise Daily Caloric Targets (TDEE / BMR calibrated)
   * Macronutrient Breakdown (Protein, Carbohydrates, Fats in grams)
   * Optimal Workout Split (Push·Pull·Legs, Upper/Lower, Full Body)
3. **Contact Gate**:
   * To unlock and receive the full personalized nutrition & training blueprint, prospects submit their name and WhatsApp/mobile number (or Instagram handle).
4. **Why It Converts**:
   * Completely replaces dead Linktrees, static Google Forms, and the passive phrase *"DM me READY"*.
   * Fully customizable: question logic, macro formulas, styling, typography, and brand voice are calibrated to match each coach's unique methodology.

---

## 3. Product Rules & Design Directives for AI
Whenever generating landing pages, micro-tools, funnels, copy, or UI components for Qualfi:
* **The Problem**: Kill the Linktree, kill the static contact form, kill "DM me READY".
* **The Funnel Arc**:
  1. *Curiosity Hook*: Tap bio link on social media.
  2. *Interactive Value*: 4–5 quick diagnostic questions in ~60 seconds.
  3. *Contact Gate*: Enter Name & WhatsApp/Phone to unlock the custom targets.
  4. *Instant Handshake*: Deliver personalized calories/macros/split to user + dispatch verified hot lead (0–100 score) to coach's WhatsApp in <2 seconds.
* **Tone & Aesthetics**: Wabi-Sabi organic earthiness (clay, kiln terracotta, sage, stone, deep charcoal), Swiss typographic hierarchy, high tactile feedback, Doherty threshold speed (<400ms responses).
