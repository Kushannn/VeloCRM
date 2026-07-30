"use client";

import { SprintType } from "@/lib/types";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Activity, Dot } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export function ProjectTaskOverview({
  sprints,
}: {
  sprints?: SprintType[] | null;
}) {
  const allTasks = sprints?.flatMap((sprint) => sprint.tasks ?? []) ?? [];

  const completed = allTasks.filter((t) => t.status === "COMPLETED").length;
  const inProgress = allTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const pending = allTasks.filter((t) => t.status === "PENDING").length;

  const data = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [completed, inProgress, pending],
        backgroundColor: ["#4ade80", "#8b5cf6", "#475569"],
        hoverBackgroundColor: ["#86efac", "#a78bfa", "#64748b"],
        borderWidth: 2,
        borderColor: "#161622",
        hoverBorderColor: "#161622",
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%",
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: import("chart.js").TooltipItem<"doughnut">) =>
            ` ${ctx.label}: ${ctx.parsed} task${ctx.parsed !== 1 ? "s" : ""}`,
        },
      },
    },
  } as const;

  return (
    <div className="flex flex-col gap-4 bg-[#110f1a] rounded-2xl">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Activity size={15} className="text-violet-400" />
        </div>
        <h2 className="text-base font-semibold text-white">Sprint Velocity</h2>
      </div>
      <div className="flex items-center gap-4 w-full p-4">
        {/* Donut with total overlay */}
        <div
          className="relative shrink-0"
          style={{ width: "280px", height: "280px" }}
        >
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-semibold text-white/90">
              {completed + inProgress + pending}
            </span>
            <span className="text-[10px] text-white/35">tasks</span>
          </div>
        </div>

        <div className="w-px self-stretch bg-white/10" />

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Dot size={40} className="text-[#4ade80] animate-pulse" />
              <p className="text-lg text-white/50">Completed</p>
            </div>
            <span className="text-lg font-medium text-white/80">
              {completed}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Dot size={40} className="text-[#8b5cf6] text-lg animate-pulse" />
              <p className="text-lg text-white/50">In progress</p>
            </div>
            <span className="text-lg font-medium text-white/80">
              {inProgress}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Dot size={40} className="text-[#475569] text-lg animate-pulse" />
              <p className="text-lg text-white/50">Pending</p>
            </div>
            <span className="text-lg font-medium text-white/80">{pending}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
