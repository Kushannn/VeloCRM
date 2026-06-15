"use client";

import { SprintsCompactDetailsForDashboard } from "@/lib/types";
import { Card } from "@heroui/react";

export default function SprintDetailsCard({
  sprintsDetails,
}: {
  sprintsDetails: SprintsCompactDetailsForDashboard[];
}) {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
      <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
        <Card.Title className="text-[#7c6fa0] text-md font-semibold uppercase tracking-wide">
          Sprint Progress
        </Card.Title>
      </Card.Header>

      <Card.Content>
        {sprintsDetails.length === 0 ? (
          <>
            <div className="flex h-full items-center justify-center">
              <p className="text-[#b8aed4] text-2xl font-bold">
                No recent activity!
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex flex-col gap-3">
                {sprintsDetails.map((sprint) => (
                  <div key={sprint.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#e8e4f0]">
                          {sprint.title}
                        </span>

                        <span className="text-white/40">•</span>
                        <span className="text-sm text-[#7c6fa0]">
                          {sprint.project}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
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

                    {/* progress bar */}
                    <div className="w-full bg-[#2a2040] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-[#8b5cf6] transition-all duration-300"
                        style={{ width: `${sprint.percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7c6fa0]">
                        {sprint.completed} / {sprint.total} tasks completed
                      </span>
                      <span className="text-sm text-[#c4a8f5]">
                        {sprint.percent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="w-full border-t border-zinc-600 mt-4"></div> */}
            </div>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
