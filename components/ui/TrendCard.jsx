"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";

export default function TrendCard({ trend }) {
  return (
    <Card className="bg-[#0A0E1A] border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* Trend color dot */}
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: trend.color || "#34D399" }}
          ></span>

          {trend.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-white/70 mb-2">
          {trend.description}
        </p>
      </CardContent>

      <CardFooter>
        <p className="text-white/40 text-xs">
          Source: {trend.source}
        </p>
      </CardFooter>
    </Card>
  );
}
