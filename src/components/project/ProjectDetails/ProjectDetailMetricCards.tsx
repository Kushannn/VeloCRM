"use client";

import { ProjectType, TaskType } from "@/lib/types";
import { Card } from "@heroui/react";
import { Layers } from "lucide-react";

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
  return (
    <>
      <div className="flex gap-6">
        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-xs h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Total Sprints
            </Card.Title>
          </Card.Header>
          <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{project?.sprints?.length}</p>
              <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
                <Layers size={20} className="text-[#ede8fb]" />
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="text-[#4ade80] text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>

        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-xs h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Total Members
            </Card.Title>
          </Card.Header>
          <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{project?.projectUsers.length}</p>
              <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
                <Layers size={20} className="text-[#ede8fb]" />
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="text-[#4ade80] text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>

        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-xs h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Tasks (Overall)
            </Card.Title>
          </Card.Header>
          <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{project?._count?.tasks}</p>
              <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
                <Layers size={20} className="text-[#ede8fb]" />
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="text-[#4ade80] text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>

        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-xs h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Tasks In Progress
            </Card.Title>
          </Card.Header>
          <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{activeTasks}</p>
              <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
                <Layers size={20} className="text-[#ede8fb]" />
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="text-[#4ade80] text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}
