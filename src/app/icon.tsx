import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0B1F33",
          color: "#F7F9FB",
          display: "flex",
          fontSize: 21,
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
            bottom: 3,
            height: 3,
            left: 3,
            position: "absolute",
            width: 11,
          }}
        />
      </div>
    ),
    size,
  );
}

