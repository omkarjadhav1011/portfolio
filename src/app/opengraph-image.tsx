import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const runtime = "edge";
export const alt = `${profile.name} — Developer Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d1117",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Grid pattern decoration (simplified) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(48,54,61,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(48,54,61,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />

        {/* Branch indicator */}
        <div
          style={{
            color: "#00ff88",
            fontSize: 20,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>⑂</span>
          <span>{profile.handle}</span>
          <span style={{ color: "#484f58" }}>/</span>
          <span style={{ color: "#58a6ff" }}>main</span>
        </div>

        {/* Name */}
        <div
          style={{
            color: "#e6edf3",
            fontSize: 72,
            fontWeight: 700,
            marginBottom: 20,
            lineHeight: 1.1,
          }}
        >
          {profile.name}
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#8b949e",
            fontSize: 28,
            marginBottom: 40,
            maxWidth: 800,
          }}
        >
          {profile.headline}
        </div>

        {/* Status badge */}
        {profile.availableForWork && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: 24,
              padding: "10px 20px",
              color: "#00ff88",
              fontSize: 18,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#00ff88",
              }}
            />
            {profile.currentStatus}
          </div>
        )}

        {/* Bottom watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            color: "#484f58",
            fontSize: 14,
          }}
        >
          {profile.handle}.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
