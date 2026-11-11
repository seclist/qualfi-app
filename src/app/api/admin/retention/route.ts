import { NextResponse } from "next/server";

/**
 * ============================================================================
 * QUALFI DATA RETENTION & PURGE ENDPOINT (GDPR Article 5(1)(e))
 * ----------------------------------------------------------------------------
 * Enforces the 90-day storage limitation schedule.
 * Authenticated via Authorization: Bearer <CRON_SECRET> header.
 * ============================================================================
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Enforce secret authorization
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized retention invocation." },
      { status: 401 }
    );
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!spreadsheetId && !webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "Sheets integration unconfigured." },
      { status: 503 }
    );
  }

  try {
    // If webhookUrl is configured, dispatch the 90-day purge action to Apps Script
    if (webhookUrl) {
      const purgeRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PURGE_STALE_LEADS",
          retentionDays: 90,
          spreadsheetId,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!purgeRes.ok) {
        throw new Error(`Apps script purge returned HTTP ${purgeRes.status}`);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "90-day GDPR retention schedule executed successfully.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GET /api/admin/retention] Retention purge failed:", error);
    return NextResponse.json(
      { ok: false, error: "Retention job failed." },
      { status: 500 }
    );
  }
}
