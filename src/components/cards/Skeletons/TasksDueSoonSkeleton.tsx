"use client";

import { Card } from "@heroui/react";

export default function TasksDueSoonCardSkeleton() {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
      <Card.Header>
        <div className="h-3 w-32 rounded bg-[#2a2040] animate-pulse" />
      </Card.Header>

      <Card.Content>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex flex-col gap-2 animate-pulse">
              {/* top row */}
              <div className="flex items-center justify-between gap-4">
                {/* title + sprint */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="h-4 w-32 rounded bg-[#2a2040]" />
                  <div className="h-1 w-1 rounded-full bg-[#3b2d5f]" />
                  <div className="h-4 w-20 rounded bg-[#1e1830]" />
                </div>

                {/* badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="h-7 w-16 rounded-full bg-[#2d1d5e]" />
                  <div className="h-7 w-20 rounded-full bg-[#2d1d5e]" />
                </div>
              </div>

              {/* project */}
              <div className="h-3 w-24 rounded bg-[#1e1830]" />

              {/* divider */}
              <div className="w-full border-t border-zinc-700 mt-3"></div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
