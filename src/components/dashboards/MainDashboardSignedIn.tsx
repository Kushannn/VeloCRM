"use client";

import { Card } from "@heroui/react";

import { MembershipRole, projectStatus } from "@prisma/client";
import {
  FeedItem,
  SprintsCompactDetailsForDashboard,
  TaskStats,
} from "@/lib/types";
import { LeadPipelineChart } from "../LeadsPipelineChart";
import MetricCards from "../cards/dashboardCards/MetricCards";
import { InviteModal } from "../InviteUserModal";
import RecentActivityCard from "../cards/dashboardCards/RecentActivityCard";
import SprintDetailsCard from "../cards/dashboardCards/SprintDetailsCard";
import TasksDueSoonCard from "../cards/dashboardCards/TasksDueSoonCard";

interface userType {
  clerkId: string;
  createdAt: Date;
  email: string;
  id: string;
  image: string | null;
  name: string | null;
  role: string;
  membership: {
    id: string;
    role: MembershipRole;
    userId: string;
    organizationId: string;
    organization: {
      id: string;
      name: string;
      createdAt: Date;
      slug: string;
      ownerId: string;
    };
  }[];
  userProjects: {
    id: string;
    userId: string;
    projectId: string;
    project: {
      id: string;
      name: string;
      description: string | null;
      createdAt: Date;
      organizationId: string;
      slug: string;
      status: projectStatus;
    };
  }[];
}

type PipelineItem = {
  status: string;
  count: number;
};

type Props = {
  firstName: string;
  todayShort: string;
  user: userType;
  activeTasks: number;
  totalLeads: number;
  feed: FeedItem[];
  sprintsDetails: SprintsCompactDetailsForDashboard[];
  dueTasks: TaskStats;
  pipelineData: PipelineItem[];
};

export default function MainDasboardSignedIn({
  firstName,
  todayShort,
  user,
  activeTasks,
  totalLeads,
  feed,
  sprintsDetails,
  dueTasks,
  pipelineData,
}: Props) {
  const noOfProjects = user?.userProjects?.length ?? 0;

  return (
    <>
      <div className="px-4 space-y-6 pb-42 bg-[#09080f]">
        <h1 className="text-3xl font-bold">Welcome back, {firstName}</h1>

        {/* Cards */}
        <div className="flex gap-6">
          <MetricCards
            noOfProjects={noOfProjects}
            activeTasks={activeTasks}
            totalLeads={totalLeads}
          />
        </div>

        {/* card row 1  */}
        <div className="flex gap-4 items-stretch">
          <div className="w-1/2 flex flex-col">
            <RecentActivityCard feed={[]} />
          </div>

          <div className="w-1/2 flex flex-col">
            <SprintDetailsCard sprintsDetails={sprintsDetails} />
          </div>
        </div>

        {/* card row 2  */}
        <div className="flex gap-4 items-stretch mb-4">
          <div className="w-1/2 flex flex-col">
            <TasksDueSoonCard dueTasks={dueTasks} />
          </div>

          <div className="w-1/2 flex flex-col">
            <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
              <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
                <Card.Title className="text-[#7c6fa0] text-md font-semibold uppercase tracking-wide">
                  Leads Pipeline
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <LeadPipelineChart pipeline={pipelineData} />
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      <InviteModal />
    </>
  );
}
