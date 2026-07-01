"use client";

import { SprintsCompactDetailsForDashboard } from "@/lib/types";
import { Card } from "@heroui/react";

export default function SprintDetailsCard({
  sprintsDetails,
}: {
  sprintsDetails: SprintsCompactDetailsForDashboard[];
}) {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-3 sm:p-5 w-full h-full flex flex-col">
      <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
        <Card.Title className="text-[#7c6fa0] text-sm sm:text-md font-semibold uppercase tracking-wide">
          Sprint Progress
        </Card.Title>
      </Card.Header>

      <Card.Content className="flex-1 min-h-0 overflow-y-auto">
        {sprintsDetails.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-lg sm:text-2xl font-bold text-[#b8aed4]">
              No sprint activity!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sprintsDetails.map((sprint) => (
              <div key={sprint.id} className="flex flex-col gap-2">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="text-sm text-[#e8e4f0] truncate">
                      {sprint.title}
                    </span>

                    <span className="text-white/40 shrink-0">•</span>

                    <span className="text-xs sm:text-sm text-[#7c6fa0] truncate">
                      {sprint.project}
                    </span>
                  </div>

                  <span
                    className={`self-start sm:self-auto text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      sprint.daysLeft <= 0
                        ? "bg-[#2d0f0f] text-[#f87171]"
                        : sprint.daysLeft <= 3
                          ? "bg-[#3a1f07] text-[#fb923c]"
                          : "bg-[#14301e] text-[#4ade80]"
                    }`}
                  >
                    {sprint.daysLeft <= 0
                      ? "Overdue"
                      : `${sprint.daysLeft}d left`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#2a2040] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-[#8b5cf6] transition-all duration-300"
                    style={{ width: `${sprint.percent}%` }}
                  />
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-[#7c6fa0] truncate">
                    {sprint.completed} / {sprint.total} tasks completed
                  </span>

                  <span className="text-xs sm:text-sm text-[#c4a8f5] shrink-0">
                    {sprint.percent}%
                  </span>
                </div>

                <div className="border-t border-zinc-700 pt-2" />
              </div>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
