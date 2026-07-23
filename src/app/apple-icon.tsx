import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0B1F33",
          color: "#F7F9FB",
          display: "flex",
          fontSize: 108,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        Z
        <span
          style={{
            background: "#F26A21",
            bottom: 22,
            height: 10,
            left: 24,
            position: "absolute",
            width: 60,
          }}
        />
      </div>
    ),
    size,
  );
}

