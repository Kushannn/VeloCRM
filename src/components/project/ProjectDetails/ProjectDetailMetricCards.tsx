"use client";

import { ProjectType, TaskType } from "@/lib/types";
import { Card } from "@heroui/react";
import { Layers, Users, CheckSquare, Activity } from "lucide-react";

type ProjectWithExtras = ProjectType & {
  tasks: TaskType[];
  _count: {
    tasks: number;
  };
};

export default function ProjectDetailsMetricCards({
  project,
}: {
  project: ProjectWithExtras | null;
}) {
  const activeTasks =
    project?.tasks?.filter((task) => task.status === "IN_PROGRESS").length ?? 0;

  const statCards = [
    {
      title: "Total Sprints",
      value: project?.sprints?.length,
      icon: Layers,
    },
    {
      title: "Total Members",
      value: project?.projectUsers.length,
      icon: Users,
    },
    {
      title: "Tasks (Overall)",
      value: project?._count?.tasks,
      icon: CheckSquare,
    },
    {
      title: "Tasks In Progress",
      value: activeTasks,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map(({ title, value, icon: Icon }) => (
        <Card
          key={title}
          className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-full h-36"
        >
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide">
              {title}
            </Card.Title>
          </Card.Header>
          <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{value ?? "—"}</p>
              <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#ede8fb]" />
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="text-[#4ade80] text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}
