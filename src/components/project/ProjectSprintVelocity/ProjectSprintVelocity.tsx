"use client";

import { SprintType } from "@/lib/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Activity } from "lucide-react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function ProjectSprintVelocity({
  sprints,
}: {
  sprints?: SprintType[] | null;
}) {
  const data = {
    labels: sprints?.map((sprint) => sprint.title),
    datasets: [
      {
        data: sprints?.map(
          (sprint) =>
            sprint.tasks?.filter((task) => task.status == "COMPLETED").length ??
            0,
        ),
        backgroundColor: "#8b5cf6",
        hoverBackgroundColor: "#a78bfa",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: import("chart.js").TooltipItem<"bar">) =>
            ` ${ctx.parsed.y} task${ctx.parsed.y !== 1 ? "s" : ""}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#7c6fa0", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "#7c6fa0", stepSize: 1, precision: 0 },
        grid: { color: "#2a2040" },
        border: { display: false },
        beginAtZero: true,
      },
    },
  } as const;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Activity size={15} className="text-violet-400" />
        </div>
        <h2 className="text-base font-semibold text-white">Sprint Velocity</h2>
      </div>

      {/* <div className="w-px self-stretch bg-white/10" />  */}

      <div className="flex-1 min-h-0 w-full p-2">
        <Bar data={data} options={options} className="w-full" />
      </div>
    </div>
  );
}
