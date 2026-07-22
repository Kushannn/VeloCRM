import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { pusherServer } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";
import {
  getProjectAccessById,
  getOrgMembershipById,
  getCurrentUser,
} from "@/lib/utils/authorizeUserOrgProject";

const hasProjectAccess = async (projectId: string) =>
  (await getProjectAccessById(projectId)) !== null;

const hasOrgAccess = async (orgId: string) =>
  (await getOrgMembershipById(orgId)) !== null;

type ChannelRule = {
  prefix: string;
  authorize: (resourceId: string) => Promise<boolean>;
};

const channelRules: ChannelRule[] = [
  {
    prefix: "private-project-",
    authorize: hasProjectAccess,
  },
  {
    prefix: "private-sprint-",
    authorize: async (sprintId) => {
      const sprint = await prisma.sprint.findUnique({
        where: { id: sprintId },
        select: { projectId: true },
      });
      if (!sprint) return false;
      return hasProjectAccess(sprint.projectId);
    },
  },
  {
    prefix: "private-org-",
    authorize: hasOrgAccess,
  },
  {
    prefix: "private-user-",
    authorize: async (targetUserId) => {
      const user = await getCurrentUser();
      return user?.id === targetUserId;
    },
  },
];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const socketId = formData.get("socket_id") as string;
  const channel = formData.get("channel_name") as string;

  const rule = channelRules.find((r) => channel.startsWith(r.prefix));
  if (!rule) return new Response("Forbidden", { status: 403 });

  const resourceId = channel.replace(rule.prefix, "");
  const allowed = await rule.authorize(resourceId);
  if (!allowed) return new Response("Forbidden", { status: 403 });

  const authResponse = pusherServer.authorizeChannel(socketId, channel);
  return NextResponse.json(authResponse);
}
