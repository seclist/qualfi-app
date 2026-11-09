import { ImageResponse } from "next/og";

export const alt =
  "qualfi — 60-Second Bio Funnel & Lead Qualification Micro-Tools for Fitness Coaches";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf7f2",
          color: "#121316",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top Row: Brand & Live Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "22px",
                backgroundColor: "#121316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#faf7f2",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              q
            </div>
            <span
              style={{
                fontSize: "34px",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#121316",
              }}
            >
              qualfi
            </span>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "5px",
                backgroundColor: "#d9532f",
                marginTop: "6px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#ffffff",
              border: "1px solid #e7e2da",
              borderRadius: "999px",
              padding: "10px 22px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#047857",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "5px",
                backgroundColor: "#10b981",
              }}
            />
            LIVE IN YOUR BIO IN 72 HOURS
          </div>
        </div>

        {/* Center Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#d9532f",
            }}
          >
            KILL THE LINKTREE · KILL &ldquo;DM ME READY&rdquo;
          </div>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 400,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: "#121316",
            }}
          >
            Turn passive followers into pre-qualified coaching buyers in 60 seconds.
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "#52555f",
              maxWidth: "860px",
            }}
          >
            Custom macro &amp; training split diagnostic micro-tools with 0–100 buyer intent scoring and &lt;2s WhatsApp lead routing.
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e5e0d8",
            paddingTop: "28px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#52555f",
                }}
              >
                Diagnostic Speed
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#121316",
                }}
              >
                60 Seconds
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#52555f",
                }}
              >
                Lead Pre-Qualification
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#d9532f",
                }}
              >
                0–100 Intent Score
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#52555f",
                }}
              >
                WhatsApp Dispatch
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#121316",
                }}
              >
                &lt; 2 Seconds
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#121316",
              backgroundColor: "#f0ebe1",
              padding: "12px 24px",
              borderRadius: "14px",
            }}
          >
            qualfi.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
