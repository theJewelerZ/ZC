import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "This legacy email-only endpoint has been retired. Use the secure consultation form.",
    },
    { status: 410 },
  );
}
