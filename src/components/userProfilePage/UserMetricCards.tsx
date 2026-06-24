"use client";

import { Card } from "@heroui/react";
import { ClipboardList, Layers, UserSearch } from "lucide-react";

export function UserMetricCards({
  totalProjects,
  totalLeads,
  totalTasks,
}: {
  totalProjects: number;
  totalTasks: number;
  totalLeads: number;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-4 md:gap-6">
        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-4 sm:p-5 w-full sm:w-[calc(50%-12px)] xl:w-52 h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Total Projects
            </Card.Title>
          </Card.Header>

          <Card.Content className="text-[#e8e4f0] text-2xl sm:text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{totalProjects}</p>

              <div className="bg-[#2d1d5e] rounded-lg h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                <Layers size={18} className="sm:w-5 sm:h-5 text-[#ede8fb]" />
              </div>
            </div>
          </Card.Content>

          <Card.Footer className="text-[#4ade80] text-xs sm:text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>

        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-4 sm:p-5 w-full sm:w-[calc(50%-12px)] xl:w-52 h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Total Tasks
            </Card.Title>
          </Card.Header>

          <Card.Content className="text-[#e8e4f0] text-2xl sm:text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{totalTasks}</p>

              <div className="bg-[#2d1d5e] rounded-lg h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                <ClipboardList
                  size={18}
                  className="sm:w-5 sm:h-5 text-[#ede8fb]"
                />
              </div>
            </div>
          </Card.Content>

          <Card.Footer className="text-[#4ade80] text-xs sm:text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>

        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-4 sm:p-5 w-full sm:w-[calc(50%-12px)] xl:w-52 h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Total Leads
            </Card.Title>
          </Card.Header>

          <Card.Content className="text-[#e8e4f0] text-2xl sm:text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>{totalLeads}</p>

              <div className="bg-[#2d1d5e] rounded-lg h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                <UserSearch
                  size={18}
                  className="sm:w-5 sm:h-5 text-[#ede8fb]"
                />
              </div>
            </div>
          </Card.Content>

          <Card.Footer className="text-[#4ade80] text-xs sm:text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>

        <Card className="bg-[#110f1a] hover:bg-[#1a1232] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors duration-200 rounded-xl p-4 sm:p-5 w-full sm:w-[calc(50%-12px)] xl:w-52 h-36">
          <Card.Header>
            <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              Completed Tasks
            </Card.Title>
          </Card.Header>

          <Card.Content className="text-[#e8e4f0] text-2xl sm:text-3xl font-semibold">
            <div className="flex justify-between items-center">
              <p>44</p>

              <div className="bg-[#2d1d5e] rounded-lg h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                <Layers size={18} className="sm:w-5 sm:h-5 text-[#ede8fb]" />
              </div>
            </div>
          </Card.Content>

          <Card.Footer className="text-[#4ade80] text-xs sm:text-sm">
            ↑ 2 this week
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}
