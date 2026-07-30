import { LeadActivity, LeadActivityType } from "@prisma/client";
import { FeedItem } from "@/lib/types";

type LeadActivityWithRelations = LeadActivity & {
  user?: { name: string | null; image: string | null } | null;
  lead?: { id: string; name: string } | null;
};

export function leadActivityToFeedItem(
  log: LeadActivityWithRelations,
): FeedItem | null {
  if (!log.lead || !log.user) return null;

  switch (log.type as LeadActivityType) {
    case "CREATED":
      return {
        kind: "lead_activity",
        type: log.type,
        activityType: log.type,
        note: log.note,
        user: log.user,
        lead: { id: log.lead.id, name: log.lead.name },
        createdAt: log.createdAt,
      };

    case "NOTE":
    case "CALL":
    case "EMAIL":
    case "MEETING":
    case "FOLLOW_UP":
      return {
        kind: "lead_activity",
        type: log.type,
        activityType: log.type,
        note: log.note,
        user: log.user,
        lead: { id: log.lead.id, name: log.lead.name },
        createdAt: log.createdAt,
      };

    case "STATUS_CHANGE":
      if (!log.previousStatus || !log.newStatus) return null; // guard against legacy rows created before this migration
      return {
        kind: "lead_activity",
        type: log.type,
        activityType: log.type,
        note: log.note,
        user: log.user,
        lead: { id: log.lead.id, name: log.lead.name },
        createdAt: log.createdAt,
        transition: { from: log.previousStatus, to: log.newStatus },
      };

    default:
      return null;
  }
}
