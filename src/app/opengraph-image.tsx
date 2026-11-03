import { ImageResponse } from "next/og";

export const alt = "Qualfi — Interactive Micro Tools That Turn Followers Into Pre-Qualified Coaching Clients";
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#04070d",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(0, 210, 220, 0.22), transparent 50%), radial-gradient(circle at 20% 80%, rgba(11, 134, 180, 0.18), transparent 50%)",
          padding: "64px 72px",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #00D2DC 0%, #0B86B4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 800,
                color: "#04070d",
              }}
            >
              Q
            </div>
            <span style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.03em" }}>
              Qualfi
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 22px",
              borderRadius: "9999px",
              backgroundColor: "rgba(0, 210, 220, 0.14)",
              border: "1px solid rgba(0, 210, 220, 0.35)",
              color: "#00D2DC",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Early Access Cohort · £99 Setup
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "960px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Turn bio scrollers into</span>
            <span style={{ color: "#00D2DC" }}>pre-qualified coaching clients.</span>
          </div>
          <p
            style={{
              marginTop: "24px",
              fontSize: "25px",
              lineHeight: 1.45,
              color: "#94a3b8",
              maxWidth: "840px",
            }}
          >
            60-second custom macro &amp; split diagnostics that give instant value, score buyer intent 0–100, and ping hot leads to your WhatsApp in &lt; 2 seconds.
          </p>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "48px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "28px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "34px", fontWeight: 800, color: "#00D2DC" }}>5.2x</span>
            <span style={{ fontSize: "16px", color: "#94a3b8" }}>Higher opt-in vs Linktree</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "34px", fontWeight: 800, color: "#25D366" }}>&lt; 2s</span>
            <span style={{ fontSize: "16px", color: "#94a3b8" }}>WhatsApp lead dispatch</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "34px", fontWeight: 800, color: "#ffffff" }}>100%</span>
            <span style={{ fontSize: "16px", color: "#94a3b8" }}>Pre-scored on budget &amp; intent</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

