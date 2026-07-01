"use client";

import { Card } from "@heroui/react";

export default function LeadPipelineChartSkeleton() {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
      {/* Header */}
      <div className="h-3 w-32 rounded bg-[#2a2040] animate-pulse mb-6" />

      {/* Chart area */}
      <div className="h-75 flex items-end justify-between gap-3 animate-pulse">
        {[40, 65, 90, 55, 75, 120, 50].map((height, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-end h-full flex-1"
          >
            {/* bar */}
            <div
              className="w-full max-w-9.5 rounded-t-md bg-[#2d1d5e]"
              style={{ height: `${height}px` }}
            />

            {/* label */}
            <div className="h-3 w-10 rounded bg-[#1e1830] mt-3" />
          </div>
        ))}
      </div>
    </Card>
  );
}
