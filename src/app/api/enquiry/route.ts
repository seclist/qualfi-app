import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const SHEET_RANGE = "Inbound!A:N";

const ALLOWED_ORIGINS = new Set([
  "https://www.qualfi.app",
  "https://qualfi.app",
  "https://qualfi-app.vercel.app",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
]);

// Bounded in-memory rate limiter (5 requests per 10 minutes per IP, max 2,000 tracked IPs)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_TRACKED_IPS = 2000;
const ipRequestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (!ipRequestLog.has(ip) && ipRequestLog.size >= MAX_TRACKED_IPS) {
    const oldestKey = ipRequestLog.keys().next().value;
    if (oldestKey) {
      ipRequestLog.delete(oldestKey);
    }
  }

  const recent = (ipRequestLog.get(ip) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequestLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipRequestLog.set(ip, recent);
  return false;
}

function isOriginAllowed(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (
    secFetchSite &&
    secFetchSite !== "same-origin" &&
    secFetchSite !== "same-site" &&
    secFetchSite !== "none"
  ) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    // Allow same-origin server/CLI requests in development or when Origin is omitted by same-origin fetch
    return true;
  }

  if (ALLOWED_ORIGINS.has(origin)) {
    return true;
  }

  // Allow Vercel preview deployment URLs belonging to this project
  if (
    origin.endsWith("-owens-projects-0cc993eb.vercel.app") &&
    origin.startsWith("https://qualfi-")
  ) {
    return true;
  }

  return false;
}

/**
 * Neutralize spreadsheet formula injection (=, +, -, @, tab, CR/LF)
 */
function sanitizeSheetText(value: string): string {
  const cleaned = value.replace(/[\r\n\t]+/g, " ").trim();
  if (/^[=+\-@']/.test(cleaned)) {
    return `'${cleaned}`;
  }
  return cleaned;
}

const enquiryPayloadSchema = z
  .object({
    specialty: z.enum(["fatloss", "strength", "hyrox", "busy_pros"]),
    clientGoal: z.enum(["3to5", "5to10", "10plus"]),
    bottleneck: z.enum(["linktree", "cold_dms", "dm_ready"]),
    handle: z
      .string()
      .trim()
      .transform((v) => v.replace(/^@+/, "").trim())
      .refine(
        (v) => v.length >= 2 && v.length <= 30 && /^[a-zA-Z0-9._]+$/.test(v),
        {
          message:
            "Handle must be 2–30 characters using letters, numbers, periods, or underscores",
        }
      ),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name must be under 60 characters"),
    whatsapp: z
      .string()
      .trim()
      .min(7, "Enter a valid WhatsApp or mobile number")
      .max(20, "Number is too long")
      .regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone number")
      .refine(
        (v) => {
          const digits = v.replace(/[^0-9]/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        { message: "Phone number must contain between 7 and 15 digits" }
      ),
    consent: z.literal(true, {
      message: "Explicit data processing consent is required.",
    }),
    website: z.string().max(100).optional(), // Honeypot field
    device: z.enum(["Mobile", "Desktop"]).optional(),
  })
  .strict();

const SPECIALTY_LABELS: Record<
  z.infer<typeof enquiryPayloadSchema>["specialty"],
  string
> = {
  fatloss: "Fat loss & body recomp",
  strength: "Strength & muscle",
  hyrox: "Hyrox & hybrid performance",
  busy_pros: "Busy professionals",
};

const GOAL_LABELS: Record<
  z.infer<typeof enquiryPayloadSchema>["clientGoal"],
  string
> = {
  "3to5": "3 to 5 clients / mo",
  "5to10": "5 to 10 clients / mo",
  "10plus": "10+ clients / mo",
};

const BOTTLENECK_LABELS: Record<
  z.infer<typeof enquiryPayloadSchema>["bottleneck"],
  string
> = {
  linktree: "Dead Linktree or static form",
  cold_dms: "Time-wasters in DMs",
  dm_ready: "Relying on 'DM me READY'",
};

function computeIntentScore(
  clientGoal: z.infer<typeof enquiryPayloadSchema>["clientGoal"],
  bottleneck: z.infer<typeof enquiryPayloadSchema>["bottleneck"]
): string {
  const goalPts =
    clientGoal === "10plus" ? 50 : clientGoal === "5to10" ? 42 : 34;
  const bottleneckPts =
    bottleneck === "cold_dms" ? 45 : bottleneck === "linktree" ? 43 : 39;
  const total = goalPts + bottleneckPts;

  if (total >= 90) return `${total} (Hot 🔥)`;
  if (total >= 80) return `${total} (High ⚡)`;
  return `${total} (Warm)`;
}

function formatUtcTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

async function getServiceAccountAccessToken(
  clientEmail: string,
  privateKeyRaw: string
): Promise<string> {
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const claimSet = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  ).toString("base64url");

  const unsignedToken = `${header}.${claimSet}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey, "base64url");
  const jwt = `${unsignedToken}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!tokenRes.ok) {
    throw new Error("Google OAuth token exchange failed");
  }

  const tokenJson = (await tokenRes.json()) as { access_token: string };
  return tokenJson.access_token;
}

async function appendRowWithSheetsApi(
  spreadsheetId: string,
  accessToken: string,
  rowValues: string[]
): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}/values/${encodeURIComponent(
    SHEET_RANGE
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      majorDimension: "ROWS",
      values: [rowValues],
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets API append failed (${response.status})`);
  }
}

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

export async function POST(request: Request) {
  try {
    // 1. Zero-Trust Origin & CSRF Validation
    if (!isOriginAllowed(request)) {
      return NextResponse.json(
        { ok: false, error: "Forbidden origin." },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    // 2. Enforce JSON Content-Type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Content-Type must be application/json." },
        { status: 415, headers: NO_STORE_HEADERS }
      );
    }

    // 3. Guard payload size (max 8KB)
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 8192) {
      return NextResponse.json(
        { ok: false, error: "Request payload is too large." },
        { status: 413, headers: NO_STORE_HEADERS }
      );
    }

    // 4. Bounded Per-IP Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "unknown";
    if (clientIp !== "unknown" && isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Too many requests submitted recently. Please wait a few minutes and try again.",
        },
        { status: 429, headers: NO_STORE_HEADERS }
      );
    }

    const rawBody: unknown = await request.json();

    // 5. Honeypot bot check (silently accept and drop automated spam bots)
    if (
      typeof rawBody === "object" &&
      rawBody !== null &&
      "website" in rawBody &&
      typeof (rawBody as { website?: unknown }).website === "string" &&
      (rawBody as { website: string }).website.trim().length > 0
    ) {
      return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });
    }

    // 6. Positive Security Model (Strict Zod Allowlist Schema)
    const parsed = enquiryPayloadSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid form data";
      return NextResponse.json(
        {
          ok: false,
          error: firstIssue,
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const data = parsed.data;
    const cleanHandle = data.handle; // Strictly validated /^[a-zA-Z0-9._]{2,30}$/
    const formattedHandle = `@${cleanHandle}`;
    const safeCoachName = sanitizeSheetText(data.name);
    const rawPhone = data.whatsapp.replace(/[\r\n\t]+/g, " ").trim();
    const phoneDigits = rawPhone.replace(/[^0-9]/g, "");

    const userAgent = request.headers.get("user-agent") || "";
    const detectedDevice =
      data.device ||
      (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)
        ? "Mobile"
        : "Desktop");

    const timestamp = formatUtcTimestamp(new Date());
    const status = "New Lead";
    const intentScore = computeIntentScore(data.clientGoal, data.bottleneck);
    const instagramFormula = `=HYPERLINK("https://instagram.com/${cleanHandle}", "View Profile ↗")`;
    const waText = encodeURIComponent(
      `Hey ${data.name.trim()}, saw your application for Qualfi! We've reserved qualfi.com/@${cleanHandle} and started building your custom bio funnel.`
    );
    const whatsappFormula = `=HYPERLINK("https://wa.me/${phoneDigits}?text=${waText}", "Open WhatsApp ↗")`;
    const coachingFocus = SPECIALTY_LABELS[data.specialty];
    const monthlyGoal = GOAL_LABELS[data.clientGoal];
    const bottleneckLabel = BOTTLENECK_LABELS[data.bottleneck];
    const assignedBioUrl = `qualfi.com/@${cleanHandle}`;
    const consentAuditNote = `GDPR Opt-In Verified (${timestamp} UTC)`;

    // 14 columns (A through N) matching the Inbound sheet schema
    const rowValues: string[] = [
      timestamp, // A: Timestamp
      status, // B: Status
      intentScore, // C: Intent Score
      safeCoachName, // D: Coach Name (sanitized against formula injection)
      `'${formattedHandle}`, // E: Instagram Handle (prefixed with ' so @ isn't parsed as formula)
      instagramFormula, // F: Instagram Profile
      `'${rawPhone}`, // G: WhatsApp / Phone (prefixed with ' so +44 is stored as text)
      whatsappFormula, // H: 1-Click WhatsApp Chat
      coachingFocus, // I: Coaching Focus
      monthlyGoal, // J: Monthly Client Target
      bottleneckLabel, // K: Primary Bottleneck
      assignedBioUrl, // L: Assigned Bio URL
      detectedDevice, // M: Device
      consentAuditNote, // N: Notes / Conversation (stores GDPR opt-in audit record)
    ];

    // 7. Absolute Secret Isolation: Loaded exclusively from encrypted environment variables
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const servicePrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (webhookUrl) {
      const hookRes = await fetch(webhookUrl, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          spreadsheetId:
            spreadsheetId || "1I2ug5RMnZ1H8PoJ5Ejf7fyt5lXYWv78oC5JdzO7ChVY",
          sheetName: "Inbound",
          row: rowValues,
        }),
        signal: AbortSignal.timeout(10000),
      });

      const respText = await hookRes.text();
      if (!hookRes.ok || respText.includes("<!DOCTYPE html>")) {
        console.error("[POST /api/enquiry] Upstream webhook error:", {
          status: hookRes.status,
        });
        throw new Error("Upstream webhook error");
      }
    } else if (spreadsheetId && serviceEmail && servicePrivateKey) {
      const accessToken = await getServiceAccountAccessToken(
        serviceEmail,
        servicePrivateKey
      );
      await appendRowWithSheetsApi(spreadsheetId, accessToken, rowValues);
    } else {
      console.error(
        "[POST /api/enquiry] Missing GOOGLE_SHEETS_WEBHOOK_URL configuration"
      );
      return NextResponse.json(
        {
          ok: false,
          error: "Lead capture service is temporarily unavailable.",
        },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        lead: {
          timestamp,
          intentScore,
          handle: formattedHandle,
          assignedBioUrl,
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    // 8. Fail Securely & Scrub PII from logs
    console.error("[POST /api/enquiry] Request failed:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unable to save your enquiry right now. Please check your connection and try again.",
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
