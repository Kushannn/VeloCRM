"use client";

import { useMemo } from "react";
import { TaskType } from "@/lib/types";
import { Card, Label, ProgressBar } from "@heroui/react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssignedTasksSummary({ tasks }: { tasks: TaskType[] }) {
  const counts = useMemo(() => {
    return {
      pending: tasks.filter((t) => t.status === "PENDING").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      completed: tasks.filter((t) => t.status === "COMPLETED").length,
    };
  }, [tasks]);

  const chartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [counts.pending, counts.inProgress, counts.completed],
        backgroundColor: ["#facc15", "#60a5fa", "#4ade80"],
        borderColor: "#110f1a",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1c1730",
        titleColor: "#e8e4f0",
        bodyColor: "#b8aed4",
        borderColor: "#2a2040",
        borderWidth: 1,
      },
    },
    maintainAspectRatio: false,
  };

  const total = counts.pending + counts.inProgress + counts.completed;

  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-3 sm:p-5 w-full h-full flex flex-col">
      <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
        <Card.Title className="text-[#7c6fa0] text-sm sm:text-md font-semibold uppercase tracking-wide">
          My Tasks
        </Card.Title>
      </Card.Header>

      <Card.Content className="flex-1 flex flex-col gap-4">
        {tasks.length === 0 ? (
          <div className="flex w-full items-center justify-center flex-1">
            <p className="text-center text-lg font-medium text-[#b8aed4]">
              No tasks assigned
            </p>
          </div>
        ) : (
          <>
            {/* Equal split: stat cards left, chart right */}
            <div className="grid grid-cols-2 gap-4 items-center mb-4">
              {/* Stat cards column */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "Pending",
                    count: counts.pending,
                    color: "bg-yellow-400",
                  },
                  {
                    label: "In Progress",
                    count: counts.inProgress,
                    color: "bg-blue-400",
                  },
                  {
                    label: "Completed",
                    count: counts.completed,
                    color: "bg-green-400",
                  },
                ].map(({ label, count, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-[#2a2040] bg-[#151120] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm text-[#8b7db0]">{label}</p>
                      <p className="text-2xl font-bold text-[#e8e4f0]">
                        {count}
                      </p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${color}`} />
                  </div>
                ))}
              </div>

              {/* Chart column */}
              <div className="flex items-center justify-center">
                <div className="relative h-36 w-36 sm:h-36 sm:w-36">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-bold text-[#e8e4f0]">{total}</p>
                    <p className="text-xs text-[#8b7db0]">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <ProgressBar
              value={total > 0 ? (counts.completed / total) * 100 : 0}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-[#8b7db0]">
                  Overall Progress
                </Label>
              </div>
              <ProgressBar.Track className="w-full h-2.5 rounded-full bg-[#1c1730] overflow-hidden">
                <ProgressBar.Fill className="h-full rounded-full bg-linear-to-r from-[#8b5cf6] to-[#4ade80] transition-all duration-500" />
              </ProgressBar.Track>
              <p className="text-xs text-[#8b7db0] mt-1.5">
                {counts.completed} of {total} tasks completed
              </p>
            </ProgressBar>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
