import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID ||
  "1rHKepeU7-MqlbRDQmrWeRrM6qIFGFlf5MuKDxjtseeM";
const SHEET_RANGE = "Inbound!A:N";

const enquiryPayloadSchema = z.object({
  specialty: z.enum(["fatloss", "strength", "hyrox", "busy_pros"]),
  clientGoal: z.enum(["3to5", "5to10", "10plus"]),
  bottleneck: z.enum(["linktree", "cold_dms", "dm_ready"]),
  handle: z.string().trim().min(2).max(30),
  name: z.string().trim().min(2).max(60),
  whatsapp: z.string().trim().min(7).max(20),
  device: z.enum(["Mobile", "Desktop"]).optional(),
});

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
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Google OAuth token exchange failed: ${errText}`);
  }

  const tokenJson = (await tokenRes.json()) as { access_token: string };
  return tokenJson.access_token;
}

async function appendRowWithSheetsApi(
  accessToken: string,
  rowValues: string[]
): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    SPREADSHEET_ID
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
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Sheets append failed: ${errText}`);
  }
}

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();
    const parsed = enquiryPayloadSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid form data",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const cleanHandle = data.handle.replace(/^@+/, "").trim();
    const formattedHandle = `@${cleanHandle}`;
    const coachName = data.name.trim();
    const rawPhone = data.whatsapp.trim();
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
      `Hey ${coachName}, saw your application for Qualfi! We've reserved qualfi.com/@${cleanHandle} and started building your custom bio funnel.`
    );
    const whatsappFormula = `=HYPERLINK("https://wa.me/${phoneDigits}?text=${waText}", "Open WhatsApp ↗")`;
    const coachingFocus = SPECIALTY_LABELS[data.specialty];
    const monthlyGoal = GOAL_LABELS[data.clientGoal];
    const bottleneckLabel = BOTTLENECK_LABELS[data.bottleneck];
    const assignedBioUrl = `qualfi.com/@${cleanHandle}`;

    // 14 columns (A through N) matching the Inbound sheet schema
    const rowValues: string[] = [
      timestamp, // A: Timestamp
      status, // B: Status
      intentScore, // C: Intent Score
      coachName, // D: Coach Name
      formattedHandle, // E: Instagram Handle
      instagramFormula, // F: Instagram Profile
      `'${rawPhone}`, // G: WhatsApp / Phone (prefixed with ' so +44 is stored as text)
      whatsappFormula, // H: 1-Click WhatsApp Chat
      coachingFocus, // I: Coaching Focus
      monthlyGoal, // J: Monthly Client Target
      bottleneckLabel, // K: Primary Bottleneck
      assignedBioUrl, // L: Assigned Bio URL
      detectedDevice, // M: Device
      "", // N: Notes / Conversation
    ];

    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbzNN90r0GRXqycq8Y_LJ55R8vAC3XIiNUROeV2lghFJKdm_WZO0LwXHDuBChMshhjIAZA/exec";
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const servicePrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (webhookUrl) {
      const hookRes = await fetch(webhookUrl, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          spreadsheetId: SPREADSHEET_ID,
          sheetName: "Inbound",
          row: rowValues,
          lead: {
            timestamp,
            status,
            intentScore,
            coachName,
            handle: formattedHandle,
            whatsapp: rawPhone,
            coachingFocus,
            monthlyGoal,
            bottleneck: bottleneckLabel,
            assignedBioUrl,
            device: detectedDevice,
          },
        }),
      });

      if (!hookRes.ok) {
        const errText = await hookRes.text();
        throw new Error(`Google Sheets webhook error: ${errText}`);
      }
    } else if (serviceEmail && servicePrivateKey) {
      const accessToken = await getServiceAccountAccessToken(
        serviceEmail,
        servicePrivateKey
      );
      await appendRowWithSheetsApi(accessToken, rowValues);
    } else {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Google Sheets credentials are not configured yet on the server.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      lead: {
        timestamp,
        intentScore,
        handle: formattedHandle,
        assignedBioUrl,
      },
    });
  } catch (error) {
    console.error("[POST /api/enquiry] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save your enquiry right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
