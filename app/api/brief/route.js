import { NextResponse } from "next/server";
import { getBrief } from "@/lib/brief";

// Always run on the server at request time (the brief has a daily in-memory cache).
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brief = await getBrief();
    return NextResponse.json(brief);
  } catch (err) {
    console.error("GET /api/brief failed:", err);
    return NextResponse.json({ error: "Could not build today's brief." }, { status: 500 });
  }
}
