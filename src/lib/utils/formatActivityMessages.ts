import { CircleCheck, PartyPopper, Pencil, Rocket } from "lucide-react";
import { UserType } from "../types";

export type ActivityLog = {
  id: string;
  type: "SPRINT_CREATED" | "TASK_CREATED" | "TASK_UPDATED" | "TASK_COMPLETED";
  metadata?: { from?: string; to?: string; taskTitle?: string } | null;
  user?: UserType;
  task: { title: string } | null;
  sprint: { title: string } | null;
  createdAt: Date;
};

export const TYPE_CONFIG: Record<
  ActivityLog["type"],
  { icon: React.ElementType; color: string }
> = {
  SPRINT_CREATED: { icon: Rocket, color: "bg-blue-500/10 text-blue-400" },
  TASK_CREATED: {
    icon: CircleCheck,
    color: "bg-emerald-500/10 text-emerald-400",
  },
  TASK_UPDATED: { icon: Pencil, color: "bg-amber-500/10 text-amber-400" },
  TASK_COMPLETED: {
    icon: PartyPopper,
    color: "bg-purple-500/10 text-purple-400",
  },
};

export const STATUS_COLORS: Record<string, string> = {
  TODO: "bg-slate-500/10 text-slate-400",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400",
  IN_REVIEW: "bg-amber-500/10 text-amber-400",
  COMPLETED: "bg-emerald-500/10 text-emerald-400",
};

export function formatActivityMessages(log: ActivityLog): string {
  const taskTitle =
    log.task?.title ?? log.metadata?.taskTitle ?? "Unknown task";
  const sprintTitle = log.sprint?.title ?? "Unknown sprint";

  switch (log.type) {
    case "SPRINT_CREATED":
      return `Sprint "${sprintTitle}" was created`;
    case "TASK_CREATED":
      return `Task "${taskTitle}" was added`;
    case "TASK_UPDATED":
      return `Task "${taskTitle}" moved from ${log.metadata?.from} → ${log.metadata?.to}`;
    case "TASK_COMPLETED":
      return `Task "${taskTitle}" was completed`;
  }
}
