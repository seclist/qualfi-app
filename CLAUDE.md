# CLAUDE.md — Project Guide for Claude Code & Fable

## Project Summary
Qualfi develops bespoke, branded diagnostic micro-tools for coaches and service providers (primarily fitness coaches and personal trainers). It replaces passive link-in-bio tools (Linktree) and static contact forms with an interactive 60-second diagnostic providing immediate personalized targets (calories, macros, workout split) and instant (<2s) qualified lead delivery directly to the coach's WhatsApp.

---

## Commands & Workflow
- **Development Server**: `npm run dev` (starts on `http://localhost:3000`)
- **Production Build**: `npm run build`
- **Start Production**: `npm run start`
- **Lint**: `npm run lint`

---

## Tech Stack & Architecture
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, CSS Modules / Globals (`src/app/globals.css`)
- **Animation**: Framer Motion 14
- **Forms & Validation**: React Hook Form, Zod, @hookform/resolvers
- **PDF Generation**: jsPDF

### Key Directories
- `src/app`: App Router pages and API routes (`/api/enquiry`, `/api/admin/retention`, privacy, terms)
- `src/components`: UI components (`GetYourFunnel.tsx`, `HowItWorks.tsx`, `SectionEyebrow.tsx`, `RealisticPhone.tsx`, `WhatsAppPreviewModal.tsx`, etc.)
- `src/components/desktop` & `src/components/mobile`: Responsive layout implementations
- `src/lib`: Core utilities (`diagnostic.ts`, `design-system.ts`, `generatePdf.ts`)

---

## Product Directives & Brand Aesthetics
- **Core Mission**: Kill the Linktree, kill the static contact form, kill "DM me READY".
- **Funnel Arc**:
  1. *Curiosity Hook*: Tap bio link on social media.
  2. *Interactive Value*: 4–5 quick diagnostic questions in ~60 seconds.
  3. *Contact Gate*: Enter Name & WhatsApp/Phone to unlock custom targets.
  4. *Instant Handshake*: Deliver personalized calories/macros/split + dispatch scored lead (0–100) to coach's WhatsApp in <2s.
- **Tone & Aesthetics**:
  - Porcelain Canvas (page background): `#FAF7F2`
  - Paper White (cards, alternating sections): `#FFFFFF`
  - Lava Terracotta (primary accent, CTAs): `#D9532F` (hover `#B83E1D`)
  - Carbon Ink (headings, dark buttons): `#121316`
  - Muted Slate (body copy): `#52555F`
  - Pulse Emerald (live/success states): `#10B981` (text on light: `#047857`)
  - WhatsApp Green (mock chat UI only): `#25D366`
  - Domain: `qualfi.app` (coach links are `qualfi.app/@handle`)
  - Typography: `Fraunces` (Editorial serif) + `Plus Jakarta Sans` (Body/UI)
  - Style: Wabi-Sabi organic naturalism elevated with contemporary Awwwards editorial restraint, Doherty threshold speed (<400ms interactions).
