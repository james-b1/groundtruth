import { NextResponse } from "next/server";
import { refreshTrends } from "@/lib/refreshTrends";

export const dynamic = "force-dynamic";

// Convenience trigger so the brief can be refreshed without a terminal (handy
// during a demo). Local-only project, so no auth guard is needed.
export async function POST() {
  try {
    const result = await refreshTrends();
    return NextResponse.json({
      asOf: result.asOf,
      count: result.trends.length,
      live: result.trends.filter((t) => t.live).map((t) => ({ id: t.id, metric: t.metric })),
      errors: result.errors,
    });
  } catch (err) {
    console.error("POST /api/refresh failed:", err);
    return NextResponse.json({ error: "Refresh failed." }, { status: 500 });
  }
}
