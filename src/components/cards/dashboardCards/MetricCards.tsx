"use client";

import { Card } from "@heroui/react";
import { ClipboardList, Layers, UserSearch } from "lucide-react";

export default function MetricCards({
  noOfProjects,
  activeTasks,
  totalLeads,
}: {
  noOfProjects: number;
  activeTasks: number;
  totalLeads: number;
}) {
  return (
    <div className="flex gap-6">
      <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-52 h-36">
        <Card.Header>
          <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
            Active Projects
          </Card.Title>
        </Card.Header>
        <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
          <div className="flex justify-between items-center">
            <p>{noOfProjects}</p>
            <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
              <Layers size={20} className="text-[#ede8fb]" />
            </div>
          </div>
        </Card.Content>
        <Card.Footer className="text-[#4ade80] text-sm">
          ↑ 2 this week
        </Card.Footer>
      </Card>

      <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-52 h-36">
        <Card.Header>
          <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
            Active Tasks
          </Card.Title>
        </Card.Header>
        <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
          <div className="flex justify-between items-center">
            <p>{activeTasks}</p>
            <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
              <ClipboardList size={20} className="text-[#ede8fb]" />
            </div>
          </div>
        </Card.Content>
        <Card.Footer className="text-[#4ade80] text-sm">
          ↑ 2 this week
        </Card.Footer>
      </Card>

      <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-52 h-36">
        <Card.Header>
          <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
            Total Leads
          </Card.Title>
        </Card.Header>
        <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
          <div className="flex justify-between items-center">
            <p>{totalLeads}</p>
            <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
              <UserSearch size={20} className="text-[#ede8fb]" />
            </div>
          </div>
        </Card.Content>
        <Card.Footer className="text-[#4ade80] text-sm">
          ↑ 2 this week
        </Card.Footer>
      </Card>

      <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-5 w-52 h-36">
        <Card.Header>
          <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
            {/* <span className="text-[#8b5cf6]">○</span> */}
            Active Projects
          </Card.Title>
        </Card.Header>
        <Card.Content className="text-[#e8e4f0] text-3xl font-semibold">
          <div className="flex justify-between items-center">
            <p>{noOfProjects}</p>
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
  );
}
