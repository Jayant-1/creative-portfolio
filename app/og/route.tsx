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
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 33px, rgba(25, 21, 16, 0.15) 33px, rgba(25, 21, 16, 0.15) 34px)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
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
