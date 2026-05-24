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
} from "lucide-react";

export function getFeedMessage(item: FeedItem): string {
  const actor = item.user?.name ?? "Someone";

  switch (item.kind) {
    case "lead_activity":
      const activityMessages = {
        NOTE: `${actor} added a note on lead "${item.lead.name}"`,
        CALL: `${actor} logged a call with "${item.lead.name}"`,
        EMAIL: `${actor} sent an email to "${item.lead.name}"`,
        MEETING: `${actor} had a meeting with "${item.lead.name}"`,
        FOLLOW_UP: `${actor} followed up with "${item.lead.name}"`,
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
  }
}

export function getFeedIcon(item: FeedItem): LucideIcon {
  switch (item.kind) {
    case "lead_activity":
      const icons = {
        NOTE: FileText,
        CALL: Phone,
        EMAIL: Mail,
        MEETING: Calendar,
        FOLLOW_UP: Bell,
      };
      return icons[item.type] ?? FileText;

    case "lead_created":
      return UserPlus;

    case "task":
      const taskIcons = {
        PENDING: Circle,
        IN_PROGRESS: Loader,
        COMPLETED: CircleCheck,
      };
      return taskIcons[item.status] ?? Circle;
  }
}
