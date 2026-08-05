import { ImageResponse } from "next/og";

export const alt =
  "Zarka Construction — Golf Simulator Construction Specialist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#0B1F33",
          color: "#F7F9FB",
          display: "flex",
          height: "100%",
          padding: "72px 82px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(247,249,251,.22)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 58px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: "0.16em",
              }}
            >
              ZARKA
            </span>
            <span
              style={{
                color: "#B9C3CC",
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "0.32em",
                marginTop: 10,
              }}
            >
              CONSTRUCTION
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 760,
            }}
          >
            <span
              style={{
                fontSize: 58,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
              }}
            >
              We Build the Room
              <br />
              Around the Game.
            </span>
            <span
              style={{
                color: "#B9C3CC",
                fontSize: 24,
                marginTop: 24,
              }}
            >
              Premium simulator environments built around the space and the game
            </span>
          </div>
        </div>
        <div
          style={{
            background: "#F26A21",
            height: 8,
            position: "absolute",
            right: 82,
            top: 72,
            width: 180,
          }}
        />
      </div>
    ),
    size,
  );
}

