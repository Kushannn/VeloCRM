"use client";

import { Card } from "@heroui/react";

export default function RecentActivityCardSkeleton() {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
      <Card.Header>
        <div className="h-3 w-28 rounded bg-[#2a2040] animate-pulse" />
      </Card.Header>

      <Card.Content>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item}>
              <div className="flex items-start gap-3 animate-pulse">
                {/* avatar */}
                <div className="w-7 h-7 rounded-full bg-[#2d1d5e] shrink-0" />

                {/* text */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-[#2a2040]" />
                  <div className="h-3 w-1/3 rounded bg-[#1e1830]" />
                </div>

                {/* icon */}
                <div className="h-7 w-7 rounded-lg bg-[#2d1d5e] shrink-0" />
              </div>

              <div className="w-full border-t border-zinc-700 mt-3"></div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
