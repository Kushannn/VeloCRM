"use client";

import { TaskStats } from "@/lib/types";
import { formatDueDate } from "@/lib/utils/formatDatesForDashboardTask";
import { Card } from "@heroui/react";

export default function TasksDueSoonCard({
  dueTasks,
}: {
  dueTasks: TaskStats;
}) {
  const upcomingTasks = [
    ...dueTasks.dueTodayTasks,
    ...dueTasks.dueSoonTasks,
  ].slice(0, 6);

  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
      <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
        <Card.Title className="text-[#7c6fa0] text-md font-semibold uppercase tracking-wide">
          Tasks due soon
        </Card.Title>
      </Card.Header>

      <Card.Content className="overflow-y-auto min-h-0">
        {upcomingTasks.length == 0 ? (
          <>
            <div className="flex h-full items-center justify-center">
              <p className="text-[#b8aed4] text-2xl font-bold">
                No tasks due soon
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-5">
              {upcomingTasks.map((t) => {
                const { label, color } = formatDueDate(t.dueDate);

                return (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="font-medium text-white truncate">
                          {t.title}
                        </p>
                        <span className="text-white/40">•</span>
                        <p className="text-white/40 shrink-0">
                          {t.sprint.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="rounded-full border border-zinc-700 bg-[#2d1d5e] px-2.5 py-1 text-xs font-medium"
                          style={{ color }}
                        >
                          {label}
                        </span>

                        <div className="relative group">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              t.priority === "HIGH"
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : t.priority === "MEDIUM"
                                  ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                  : "border-green-500/20 bg-green-500/10 text-green-400"
                            }`}
                          >
                            {t.priority}
                          </span>

                          <div className="absolute bottom-full mb-1 right-0 bg-[#1a1232] border border-[#2a2040] text-[#d1cbe1] text-sm px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Assigned priority
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-500">{t.project?.name}</p>

                    <div className="w-full border-t border-zinc-600 mt-4"></div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
