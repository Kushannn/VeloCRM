"use client";

import { Card } from "@heroui/react";

export default function SprintDetailsCardSkeleton() {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
      <Card.Header>
        <div className="h-3 w-28 rounded bg-[#2a2040] animate-pulse" />
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex flex-col gap-3 animate-pulse">
              {/* top row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 rounded bg-[#2a2040]" />
                  <div className="h-1 w-1 rounded-full bg-[#3b2d5f]" />
                  <div className="h-4 w-20 rounded bg-[#1e1830]" />
                </div>

                <div className="h-6 w-16 rounded-full bg-[#2d1d5e]" />
              </div>

              {/* progress bar */}
              <div className="w-full bg-[#2a2040] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#3d2d6b]"
                  style={{ width: `${40 + item * 10}%` }}
                />
              </div>

              {/* bottom row */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-36 rounded bg-[#1e1830]" />
                <div className="h-3 w-10 rounded bg-[#2d1d5e]" />
              </div>
            </div>
          ))}

          <div className="w-full border-t border-zinc-700 pt-2"></div>
        </div>
      </Card.Content>
    </Card>
  );
}
