import { FeedItem } from "@/lib/types";
import {
  Bell,
  Calendar,
  Circle,
  CircleCheck,
  FileText,
  Loader,
  Mail,
  Phone,
  UserPlus,
  LucideIcon,
  RefreshCcw,
  Rocket,
} from "lucide-react";

const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

function formatLeadStatus(status: string): string {
  return LEAD_STATUS_LABELS[status] ?? status;
}

export function getFeedMessage(item: FeedItem): string {
  const actor = item.user?.name ?? "Someone";

  switch (item.kind) {
    case "lead_activity":
      const activityMessages = {
        CREATED: `${actor} added a new lead ${item.lead.name}`,
        NOTE: `${actor} added a note on lead "${item.lead.name}"`,
        CALL: `${actor} logged a call with "${item.lead.name}"`,
        EMAIL: `${actor} sent an email to "${item.lead.name}"`,
        MEETING: `${actor} had a meeting with "${item.lead.name}"`,
        FOLLOW_UP: `${actor} followed up with "${item.lead.name}"`,
        STATUS_CHANGE: item.transition
          ? `${actor} moved "${item.lead.name}" from ${formatLeadStatus(item.transition.from)} to ${formatLeadStatus(item.transition.to)}`
          : item.note
            ? `${actor} ${item.note.charAt(0).toLowerCase() + item.note.slice(1)} on lead "${item.lead.name}"`
            : `${actor} changed the status of "${item.lead.name}"`,
      };
      return (
        activityMessages[item.type] ??
        `${actor} updated lead "${item.lead.name}"`
      );

    case "lead_created":
      return `${actor} added a new lead "${item.name}"`;

    case "task":
      const taskMessages = {
        PENDING: `${actor} created task "${item.title}" in ${item.sprint.title}`,
        IN_PROGRESS: `${actor} started working on "${item.title}"`,
        COMPLETED: `${actor} completed "${item.title}" in ${item.sprint.title}`,
      };
      return (
        taskMessages[item.status] ?? `${actor} updated task "${item.title}"`
      );
    case "sprint_created":
      const formatDate = (date: Date | string | undefined | null) => {
        if (!date) return "an unspecified date";
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "an unspecified date";
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };
      return `${actor} created the sprint ${item.title} for project ${item.project?.name ?? "Unknown"} from ${formatDate(item.createdAt)} to ${formatDate(item.endDate)}`;
    default:
      return "";
  }
}

export function getFeedIcon(item: FeedItem): LucideIcon {
  switch (item.kind) {
    case "lead_activity":
      const icons = {
        CREATED: UserPlus,
        NOTE: FileText,
        CALL: Phone,
        EMAIL: Mail,
        MEETING: Calendar,
        FOLLOW_UP: Bell,
        STATUS_CHANGE: RefreshCcw,
      };
      return icons[item.type] ?? FileText;

    case "lead_created":
      return UserPlus;

    case "sprint_created":
      return Rocket;

    case "task":
      const taskIcons = {
        PENDING: Circle,
        IN_PROGRESS: Loader,
        COMPLETED: CircleCheck,
      };
      return taskIcons[item.status] ?? Circle;
    default:
      return FileText;
  }
}
