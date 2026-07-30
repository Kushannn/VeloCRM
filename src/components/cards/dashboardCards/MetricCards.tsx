"use client";

import { Card } from "@heroui/react";
import { ClipboardList, Layers, UserSearch } from "lucide-react";

const metrics = [
  {
    key: "projects",
    label: "Active Projects",
    icon: Layers,
    // trend: "↑ 2 this week",
  },
  {
    key: "tasks",
    label: "Active Tasks",
    icon: ClipboardList,
    // trend: "↑ 2 this week",
  },
  {
    key: "leads",
    label: "Total Leads",
    icon: UserSearch,
    // trend: "↑ 2 this week",
  },
];

export default function MetricCards({
  noOfProjects,
  activeTasks,
  totalLeads,
}: {
  noOfProjects: number;
  activeTasks: number;
  totalLeads: number;
}) {
  const values: Record<string, number> = {
    projects: noOfProjects,
    tasks: activeTasks,
    leads: totalLeads,
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-6">
      {metrics.map(({ key, label, icon: Icon }) => (
        <Card
          key={key}
          className="group bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#6c3fc4]/60 rounded-xl p-4 sm:p-5 w-full sm:w-[calc(50%-12px)] xl:w-75 h-36
          transition-all duration-300 ease-out
          hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(108,63,196,0.25),0_0_0_1px_rgba(108,63,196,0.15)]
          cursor-pointer"
        >
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] group-hover:text-[#b8aed4] text-xs font-semibold uppercase tracking-wide flex items-center gap-2 transition-colors duration-300">
              {label}
            </Card.Title>
          </Card.Header>

          <Card.Content className="text-[#e8e4f0] text-2xl sm:text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p className="transition-transform duration-300 group-hover:translate-x-0.5">
                {values[key]}
              </p>

              <div
                className="bg-[#2d1d5e] group-hover:bg-[#6c3fc4] rounded-lg h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center
                transition-all duration-300 ease-out
                group-hover:scale-110 group-hover:rotate-6
                group-hover:shadow-[0_0_12px_rgba(139,92,246,0.5)]"
              >
                <Icon
                  size={18}
                  className="sm:w-5 sm:h-5 text-[#ede8fb] transition-transform duration-300"
                />
              </div>
            </div>
          </Card.Content>

          {/* <Card.Footer className="text-[#4ade80] text-xs sm:text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {trend}
          </Card.Footer> */}
        </Card>
      ))}
    </div>
  );
}
