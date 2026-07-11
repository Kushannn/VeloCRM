import { ActivityLog, ActivityType } from "@prisma/client";
import { FeedItem, TaskStatus } from "@/lib/types";

type ActivityLogWithRelations = ActivityLog & {
  user?: { name: string | null; image: string | null } | null;
  task?: { title: string } | null;
  sprint?: { title: string; project?: { name: string } | null } | null;
};

type UpdateMetadata = {
  from?: TaskStatus;
  to?: TaskStatus;
  taskTitle?: string;
};

export function activityLogToFeedItem(
  log: ActivityLogWithRelations,
): FeedItem | null {
  const user = log.user ?? null;
  const metadata = (log.metadata ?? {}) as UpdateMetadata;

  switch (log.type as ActivityType) {
    case "SPRINT_CREATED":
      if (!log.sprint) return null;
      return {
        kind: "sprint_created",
        title: log.sprint.title,
        project: log.sprint.project ?? null,
        user,
        createdAt: log.createdAt,
        endDate: (log as any).sprint.endDate, // include endDate in your query select
      };

    case "TASK_CREATED":
      if (!log.task || !log.sprint) return null;
      return {
        kind: "task",
        title: log.task.title,
        status: "PENDING",
        user: user!,
        sprint: log.sprint,
        createdAt: log.createdAt,
      };

    case "TASK_COMPLETED":
      if (!log.task || !log.sprint) return null;
      return {
        kind: "task",
        title: log.task.title,
        status: "COMPLETED",
        user: user!,
        sprint: log.sprint,
        createdAt: log.createdAt,
      };

    case "TASK_UPDATED":
      if ((!log.task && !metadata.taskTitle) || !log.sprint) return null;
      return {
        kind: "task",
        title: log.task?.title ?? metadata.taskTitle!,
        status: metadata.to ?? "IN_PROGRESS",
        user: user!,
        sprint: log.sprint,
        createdAt: log.createdAt,
        transition:
          metadata.from && metadata.to
            ? { from: metadata.from, to: metadata.to }
            : undefined,
      };

    default:
      return null; // unmapped type — same null-guard pattern as MainDashboardSignedIn
  }
}
