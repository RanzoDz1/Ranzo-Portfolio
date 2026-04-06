import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ranzo | #1 Landing Page Designer & Webflow Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f1c",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image — dark premium workspace */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&fm=jpg&fit=crop"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.20) saturate(1.2)",
          }}
          alt=""
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(10,15,28,0.9) 0%, rgba(10,15,28,0.6) 50%, rgba(10,15,28,0.9) 100%)",
            display: "flex",
          }}
        />

        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.15) 50%, transparent 80%)",
            filter: "blur(50px)",
            display: "flex",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
              padding: "8px 20px",
              borderRadius: 999,
              border: "1px solid rgba(59,130,246,0.4)",
              background: "rgba(59,130,246,0.1)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(147,197,253,0.9)", letterSpacing: "2.5px", textTransform: "uppercase" }}>
              ✦ &nbsp; Premium Web Design &amp; Development
            </span>
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: "-3px",
              lineHeight: 1,
              marginBottom: 16,
              background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 45%, #a78bfa 100%)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            Ranzo
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: "rgba(240,244,255,0.55)",
              letterSpacing: "0.5px",
              marginBottom: 52,
              display: "flex",
            }}
          >
            Landing Pages&nbsp;·&nbsp;
            <span style={{ color: "rgba(147,197,253,0.8)", fontWeight: 500 }}>Webflow</span>
            &nbsp;·&nbsp;B2B Websites&nbsp;·&nbsp;CRO
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {[
              { value: "300+", label: "Projects" },
              { value: "50%", label: "Off First Project" },
              { value: "4.9★", label: "Rating" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "12px 40px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #93c5fd, #a78bfa)",
                      backgroundClip: "text",
                      color: "transparent",
                      lineHeight: 1,
                      marginBottom: 4,
                      display: "flex",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(240,244,255,0.3)", letterSpacing: "2.5px", textTransform: "uppercase", display: "flex" }}>
                    {stat.label}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.08)", display: "flex" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(240,244,255,0.2)", letterSpacing: "1px" }}>
            ranzo.dev
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
