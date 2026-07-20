import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "JUZ LEGAL — Giải pháp pháp lý toàn diện";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060d18",
          color: "#ffffff",
          padding: "72px 82px",
          fontFamily: "serif",
        }}
      >
        <div style={{ width: 90, height: 4, background: "#c9a227" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#c9a227",
              fontSize: 22,
              letterSpacing: "0.22em",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              maxWidth: 980,
              fontSize: 68,
              lineHeight: 1.08,
              fontWeight: 400,
            }}
          >
            Giải pháp pháp lý toàn diện cho doanh nghiệp và cá nhân
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#a8b0bd" }}>
          {siteConfig.phoneDisplay} · {siteConfig.email}
        </div>
      </div>
    ),
    size
  );
}
