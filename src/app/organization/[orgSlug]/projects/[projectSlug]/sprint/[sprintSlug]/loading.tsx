"use client";

import { Skeleton } from "@heroui/react";

export default function SprintBoardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <div className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-55">
          <Skeleton className="h-4 w-24 rounded-lg mb-3" />

          <Skeleton className="h-9 w-64 rounded-lg" />

          <Skeleton className="h-4 w-full rounded-lg mt-3" />
          <Skeleton className="h-4 w-2/3 rounded-lg mt-2" />
        </div>

        <div className="rounded-xl border border-zinc-800 p-3 bg-[#1a1232] flex flex-wrap gap-6">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>

        <Skeleton className="h-10 w-32 rounded-lg ml-auto" />
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3 h-full min-h-0">
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-lg" />
              </div>

              <Skeleton className="h-6 w-8 rounded-full" />
            </div>

            {/* Column Body */}
            <div className="bg-[#0e0c17] border border-gray-800 rounded-xl p-3 flex flex-col gap-3 min-h-125">
              {Array.from({ length: 5 }).map((_, taskIndex) => (
                <div
                  key={taskIndex}
                  className="rounded-lg px-4 py-3 bg-[#161125] border border-[#2a2040] space-y-3"
                >
                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>

                  {/* Task Title + Avatar */}
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
