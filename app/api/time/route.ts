import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  const date = now.toLocaleDateString("en-CA", {
    timeZone: "Asia/Makassar",
  });

  const time = now.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const label = now.toLocaleDateString("id-ID", {
    timeZone: "Asia/Makassar",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return NextResponse.json({
    date,
    time,
    label,
  });
}