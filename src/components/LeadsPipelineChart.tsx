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
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#7c6fa0", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "#7c6fa0", stepSize: 1 },
        grid: { color: "#2a2040" },
        border: { display: false },
        beginAtZero: true,
      },
    },
  } as const;

  return <Bar data={data} options={options} />;
}
