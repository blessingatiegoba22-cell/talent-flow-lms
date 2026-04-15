import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    message: "Authentication endpoint is ready.",
  });
}
