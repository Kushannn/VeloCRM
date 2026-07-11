import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { pusherServer } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const socketId = formData.get("socket_id") as string;
  const channel = formData.get("channel_name") as string;

  if (channel.startsWith("private-project-")) {
    const requestedProjectId = channel.replace("private-project-", "");

    const membership = await prisma.userProject.findFirst({
      where: { userId: dbUser.id, projectId: requestedProjectId },
    });

    if (!membership) {
      return new Response("Forbidden", { status: 403 });
    }
  } else if (channel.startsWith("private-org-")) {
    const requestedOrgId = channel.replace("private-org-", "");

    const membership = await prisma.userOrganization.findFirst({
      where: { userId: dbUser.id, organizationId: requestedOrgId },
    });

    if (!membership) {
      return new Response("Forbidden", { status: 403 });
    }
  } else {
    // Unknown channel pattern — reject rather than silently authorize
    return new Response("Forbidden", { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channel);
  return NextResponse.json(authResponse);
}
