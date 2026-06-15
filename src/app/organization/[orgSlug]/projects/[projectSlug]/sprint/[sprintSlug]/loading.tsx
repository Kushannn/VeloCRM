"use client";

import { Skeleton } from "@heroui/react";

export function TaskBoardSkeleton() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
      {[1, 2, 3].map((column) => (
        <div
          key={column}
          className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-4"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-28 rounded-lg" />
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((card) => (
              <div
                key={card}
                className="bg-[#1a1232] border border-[#2d1d5e] rounded-xl p-4"
              >
                <Skeleton className="h-5 w-3/4 rounded-lg" />

                <Skeleton className="h-4 w-full rounded-lg mt-3" />
                <Skeleton className="h-4 w-2/3 rounded-lg mt-2" />

                <div className="flex items-center justify-between mt-4">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
