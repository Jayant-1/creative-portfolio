import { ImageResponse } from "next/og";
import { author } from "@/lib/site";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fdfdfb",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <line x1="80" y1="0" x2="80" y2="630" stroke="#f05a5b" strokeWidth="2" strokeOpacity="0.35" />
          <line x1="84" y1="0" x2="84" y2="630" stroke="#f05a5b" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="0" y1="70" x2="1200" y2="70" stroke="#2b57d6" strokeWidth="2" strokeOpacity="0.25" />
        </svg>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "#2b57d6",
            }}
          />
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#191510",
            }}
          >
            {author.role} • {author.location}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            border: "4px solid #191510",
            backgroundColor: "#f7c948",
            padding: "16px 48px",
            boxShadow: "10px 10px 0 #191510",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              color: "#191510",
            }}
          >
            {author.name.toUpperCase()}
          </span>
        </div>

        <p
          style={{
            fontSize: "32px",
            color: "#191510",
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Expressive interfaces and production-ready web products, built in Pune.
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
