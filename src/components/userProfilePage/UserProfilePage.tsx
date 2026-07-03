"use client";

import { FeedItem, OrganizationType, TaskType, UserType } from "@/lib/types";
import { UserMetricCards } from "./UserMetricCards";
import RecentActivityCard from "../cards/dashboardCards/RecentActivityCard";
import AssignedTasksSummary from "./AssignedTasksSummary";
import UserDetailsBasic from "./UserDetailsBasic";

type UserProfilePageProps = UserType & {
  createdAt: Date;
  designation: string;
};

export default function UserProfilePage({
  user,
  organization,
  totalProjects,
  tasks,
  totalLeads,
  feed,
}: {
  user: UserProfilePageProps;
  organization: OrganizationType | null;
  totalProjects: number | null;
  tasks: TaskType[] | null;
  totalLeads: number | null;
  feed: FeedItem[] | null;
}) {
  return (
    <div>
      <UserDetailsBasic user={user} organization={organization} />

      <div className="mt-8">
        <UserMetricCards
          totalProjects={totalProjects}
          totalTasks={tasks?.length ?? 0}
          totalLeads={totalLeads}
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2">
            <div className="lg:h-125">
              <RecentActivityCard feed={feed} />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="lg:h-125">
              <AssignedTasksSummary tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
