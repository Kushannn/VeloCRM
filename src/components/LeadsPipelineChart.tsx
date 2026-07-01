"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type PipelineItem = {
  status: string;
  count: number;
};

export function LeadPipelineChart({ pipeline }: { pipeline: PipelineItem[] }) {
  const hasLeads =
    pipeline.length > 0 && pipeline.some((item) => item.count > 0);

  if (!hasLeads) {
    return (
      <div className="flex h-full min-h-75 items-center justify-center">
        <p className="text-[#b8aed4] text-2xl font-bold">No leads available!</p>
      </div>
    );
  }

  const data = {
    labels: pipeline.map((p) => p.status.replace("_", " ")),
    datasets: [
      {
        data: pipeline.map((p) => p.count),
        backgroundColor: [
          "#378ADD",
          "#8b5cf6",
          "#8b5cf6",
          "#fb923c",
          "#fb923c",
          "#4ade80",
          "#f87171",
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#7c6fa0",
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#7c6fa0",
          stepSize: 1,
        },
        grid: {
          color: "#2a2040",
        },
        border: {
          display: false,
        },
      },
    },
  } as const;

  return (
    <div className="h-75">
      <Bar data={data} options={options} />
    </div>
  );
}
