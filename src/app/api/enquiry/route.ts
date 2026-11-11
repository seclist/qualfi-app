import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const SHEET_RANGE = "Inbound!A:N";
const MAX_PAYLOAD_BYTES = 8192; // 8KB hard ceiling

const ALLOWED_ORIGINS = new Set([
  "https://www.qualfi.app",
  "https://qualfi.app",
  "https://qualfi-app.vercel.app",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
]);

// 1. Edge-Aware Trusted Client IP Resolution
function getTrustedClientIp(request: Request): string {
  // On Vercel, x-real-ip is guaranteed to be set by the edge routing layer
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp && xRealIp.trim().length > 0) {
    return xRealIp.trim();
  }

  // Vercel proxy forwarded IP
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    const first = vercelForwardedFor.split(",")[0].trim();
    if (first) return first;
  }

  // Fallback for standard reverse proxies: take the rightmost hop to prevent client header spoofing
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  return "unknown";
}

// 2. Rate Limiting: Distributed Upstash Redis (if configured) with Fallback to Edge In-Memory
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_TRACKED_IPS = 2000;
const ipRequestLog = new Map<string, number[]>();

async function checkDistributedRateLimit(ip: string): Promise<boolean> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken && ip !== "unknown") {
    try {
      const key = `qualfi:ratelimit:${ip}`;
      const now = Date.now();
      const windowStart = now - RATE_LIMIT_WINDOW_MS;

      // Atomic sliding window using Redis REST API
      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["ZREMRANGEBYSCORE", key, "0", windowStart.toString()],
          ["ZCARD", key],
          ["ZADD", key, now.toString(), `${now}-${Math.random()}`],
          ["PEXPIRE", key, RATE_LIMIT_WINDOW_MS.toString()],
        ]),
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = (await res.json()) as Array<{ result?: unknown }>;
        const count = typeof data[1]?.result === "number" ? data[1].result : 0;
        if (count >= RATE_LIMIT_MAX_REQUESTS) {
          return true; // Rate limited
        }
        return false;
      }
    } catch {
      // Fall through to in-memory limiter on network failure
    }
  }

  // Bounded in-memory fallback
  if (ip === "unknown") return false;

  const now = Date.now();
  if (!ipRequestLog.has(ip) && ipRequestLog.size >= MAX_TRACKED_IPS) {
    const oldestKey = ipRequestLog.keys().next().value;
    if (oldestKey) ipRequestLog.delete(oldestKey);
  }

  const timestamps = (ipRequestLog.get(ip) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequestLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  return false;
}

// 3. Origin & Anti-CSRF Validation
function isOriginAllowed(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (
    secFetchSite &&
    secFetchSite !== "same-origin" &&
    secFetchSite !== "same-site"
  ) {
    return false;
  }

  const origin = request.headers.get("origin");

  // In production, require Origin or validate Referer
  if (!origin) {
    if (process.env.NODE_ENV === "production") {
      const referer = request.headers.get("referer");
      if (!referer) return false;
      try {
        const refOrigin = new URL(referer).origin;
        return ALLOWED_ORIGINS.has(refOrigin);
      } catch {
        return false;
      }
    }
    return true;
  }

  if (ALLOWED_ORIGINS.has(origin)) {
    return true;
  }

  // Allow verified Vercel preview URLs for this project
  if (origin.startsWith("https://qualfi-") && origin.endsWith(".vercel.app")) {
    return true;
  }

  return false;
}

// 4. Robust Formula Injection Neutralization
function sanitizeSheetText(value: string): string {
  // Strip control characters, zero-width spaces, BOM, and direction overrides
  const cleaned = value
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF\u202A-\u202E]/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .trim();

  // Neutralize formula start characters in Sheets, Excel, Calc (=, +, -, @, |, %)
  if (/^[=+\-@|%]/.test(cleaned)) {
    return `'${cleaned}`;
  }
  return cleaned;
}

// 5. Phone Normalization (E.164 helper for UK & International)
function normalizePhoneForWhatsApp(input: string): { e164Digits: string; displayPhone: string } {
  let digits = input.replace(/[^0-9]/g, "");
  // If UK domestic number starting with 07... convert to 447...
  if (digits.startsWith("07") && digits.length === 11) {
    digits = `44${digits.slice(1)}`;
  }
  return {
    e164Digits: digits,
    displayPhone: input.trim(),
  };
}

// 6. Schema Definition (with explicit character sets and honeypot)
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
        (v) =>
          v.length >= 2 &&
          v.length <= 30 &&
          /^[a-zA-Z0-9._]+$/.test(v) &&
          !v.startsWith(".") &&
          !v.endsWith(".") &&
          !v.includes(".."),
        {
          message:
            "Handle must be 2–30 characters using letters, numbers, periods, or underscores",
        }
      ),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name must be under 60 characters")
      .regex(
        /^[\p{L}\p{M}'\s-]+$/u,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
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
    website: z.string().max(100).optional(), // Honeypot
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

// 7. Cached Service Account OAuth Token (prevents Google OAuth quota exhaustion)
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getServiceAccountAccessToken(
  clientEmail: string,
  privateKeyRaw: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && cachedToken.expiresAt > now + 300) {
    return cachedToken.accessToken;
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
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

  const tokenJson = (await tokenRes.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    accessToken: tokenJson.access_token,
    expiresAt: now + (tokenJson.expires_in || 3600),
  };

  return cachedToken.accessToken;
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
    // 1. Origin & Anti-CSRF Validation
    if (!isOriginAllowed(request)) {
      return NextResponse.json(
        { ok: false, error: "Forbidden origin." },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    // 2. Strict Content-Type Enforcement
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Content-Type must be application/json." },
        { status: 415, headers: NO_STORE_HEADERS }
      );
    }

    // 3. Payload Size Guard (handles chunked streams and oversized bodies)
    const rawText = await request.text();
    if (rawText.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Request payload is too large." },
        { status: 413, headers: NO_STORE_HEADERS }
      );
    }

    // 4. Rate Limiting with Trusted Edge IP
    const clientIp = getTrustedClientIp(request);
    const rateLimited = await checkDistributedRateLimit(clientIp);
    if (rateLimited) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Too many requests submitted recently. Please wait a few minutes and try again.",
        },
        { status: 429, headers: NO_STORE_HEADERS }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Malformed JSON payload." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 5. Silent Honeypot Drop (drops automated bots while returning ok)
    if (
      typeof rawBody === "object" &&
      rawBody !== null &&
      "website" in rawBody &&
      typeof (rawBody as { website?: unknown }).website === "string" &&
      (rawBody as { website: string }).website.trim().length > 0
    ) {
      return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });
    }

    // 6. Strict Schema Validation
    const parsed = enquiryPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid form data";
      return NextResponse.json(
        { ok: false, error: firstIssue },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const data = parsed.data;
    const cleanHandle = data.handle;
    const formattedHandle = `@${cleanHandle}`;
    const safeCoachName = sanitizeSheetText(data.name);
    const { e164Digits, displayPhone } = normalizePhoneForWhatsApp(data.whatsapp);
    const safePhone = sanitizeSheetText(displayPhone);

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
      `Hey ${data.name.trim()}, saw your application for Qualfi! We've reserved qualfi.app/@${cleanHandle} and started building your custom bio funnel.`
    );
    const whatsappFormula = `=HYPERLINK("https://wa.me/${e164Digits}?text=${waText}", "Open WhatsApp ↗")`;
    const coachingFocus = SPECIALTY_LABELS[data.specialty];
    const monthlyGoal = GOAL_LABELS[data.clientGoal];
    const bottleneckLabel = BOTTLENECK_LABELS[data.bottleneck];
    const assignedBioUrl = `qualfi.app/@${cleanHandle}`;
    const consentAuditNote = `GDPR Opt-In Verified (${timestamp} UTC)`;

    const rowValues: string[] = [
      timestamp,
      status,
      intentScore,
      safeCoachName,
      `'${formattedHandle}`,
      instagramFormula,
      `'${safePhone.replace(/^'+/, "")}`,
      whatsappFormula,
      coachingFocus,
      monthlyGoal,
      bottleneckLabel,
      assignedBioUrl,
      detectedDevice,
      consentAuditNote,
    ];

    // 7. Fail-Closed Secrets Handling (NO hardcoded fallback spreadsheet IDs)
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const servicePrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!spreadsheetId) {
      console.error("[POST /api/enquiry] Missing GOOGLE_SPREADSHEET_ID configuration");
      return NextResponse.json(
        { ok: false, error: "Lead capture service is temporarily unavailable." },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    if (webhookUrl) {
      const hookRes = await fetch(webhookUrl, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          spreadsheetId,
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
        throw new Error("Upstream webhook failure");
      }
    } else if (serviceEmail && servicePrivateKey) {
      const accessToken = await getServiceAccountAccessToken(
        serviceEmail,
        servicePrivateKey
      );
      await appendRowWithSheetsApi(spreadsheetId, accessToken, rowValues);
    } else {
      console.error(
        "[POST /api/enquiry] Incomplete Google Sheets integration configuration"
      );
      return NextResponse.json(
        {
          ok: false,
          error: "Lead capture service is temporarily unavailable.",
        },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    // 8. Sanitize response (do not leak internal qualification scoring to public clients)
    return NextResponse.json(
      {
        ok: true,
        lead: {
          timestamp,
          handle: formattedHandle,
          assignedBioUrl,
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[POST /api/enquiry] Request processing error:", {
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
