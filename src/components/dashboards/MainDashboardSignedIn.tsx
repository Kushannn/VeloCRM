"use client";

import { Card } from "@heroui/react";
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
import MagicBento from "../ui/MagicBento";
import { useState } from "react";
import { usePusherChannels } from "@/hooks/pusher/usePusherChannels";
import { activityLogToFeedItem } from "@/lib/utils/activityLogsToFeedItem";

interface userType {
  clerkId: string;
  createdAt: Date;
  email: string;
  id: string;
  image: string | null;
  name: string | null;
  role: string | null;
  membership: {
    organizationId: string;
  }[];
  userProjects: {
    projectId: string;
    project: {
      organizationId: string;
    };
  }[];
}

type PipelineItem = {
  status: string;
  count: number;
};

type Props = {
  orgId: string;
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
  orgId,
  firstName,
  user,
  activeTasks,
  totalLeads,
  feed: initialFeed,
  sprintsDetails,
  dueTasks,
  pipelineData,
}: Props) {
  const [feed, setFeed] = useState<FeedItem[] | null>(initialFeed);

  const myProjectIds = user.userProjects
    .filter((p) => p.project.organizationId === orgId)
    .map((p) => p.projectId);

  usePusherChannels<{ log: Parameters<typeof activityLogToFeedItem>[0] }>(
    myProjectIds.map((id) => `private-project-${id}`),
    "activity:new",
    (data) => {
      const feedItem = activityLogToFeedItem(data.log);
      setFeed((prev) => [feedItem!, ...(prev ?? [])]);
    },
  );

  const noOfProjects = user.userProjects.filter(
    (p) => p.project.organizationId == orgId,
  ).length;

  return (
    <>
      <div className="px-4 space-y-6 pb-4 bg-[#09080f]">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {firstName}
        </h1>

        <MetricCards
          noOfProjects={noOfProjects}
          activeTasks={activeTasks}
          totalLeads={totalLeads}
        />

        <div className="space-y-6 pb-4">
          <MagicBento
            cards={[
              <RecentActivityCard feed={feed} />,
              <SprintDetailsCard sprintsDetails={sprintsDetails} />,
              <TasksDueSoonCard dueTasks={dueTasks} />,
              <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full flex flex-col">
                <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
                  <Card.Title className="text-[#7c6fa0] text-md font-semibold uppercase tracking-wide">
                    Leads Pipeline
                  </Card.Title>
                </Card.Header>
                <Card.Content className="flex-1 min-h-0">
                  <LeadPipelineChart pipeline={pipelineData} />
                </Card.Content>
              </Card>,
            ]}
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            glowColor="139, 92, 246"
          />
        </div>

        {/* <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2">
            <div className="lg:h-125">
              <RecentActivityCard feed={feed} />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="lg:h-125">
              <SprintDetailsCard sprintsDetails={sprintsDetails} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2">
            <div className="lg:h-125">
              <TasksDueSoonCard dueTasks={dueTasks} />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="lg:h-125">
              <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full flex flex-col">
                <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
                  <Card.Title className="text-[#7c6fa0] text-md font-semibold uppercase tracking-wide">
                    Leads Pipeline
                  </Card.Title>
                </Card.Header>

                <Card.Content className="flex-1 min-h-0">
                  <LeadPipelineChart pipeline={pipelineData} />
                </Card.Content>
              </Card>
            </div>
          </div>
        </div> */}
      </div>
      <InviteModal />
    </>
  );
}
