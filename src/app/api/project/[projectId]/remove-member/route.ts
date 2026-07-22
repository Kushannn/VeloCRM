import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { prisma } from "@/lib/prisma";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userIds, projectId } = body;

    if (!projectId || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid projectId or userIds array." },
        { status: 400 },
      );
    }

    const access = await getProjectAccessById(projectId);

    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (access.role !== "MEMBER" && access.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const validUserIds = userIds.filter((id: string) => ObjectId.isValid(id));

    if (validUserIds.length === 0) {
      return NextResponse.json(
        { error: "No valid userIds provided." },
        { status: 400 },
      );
    }

    // Confirm which of these are actually current members before removing
    const existing = await prisma.userProject.findMany({
      where: {
        projectId,
        userId: { in: validUserIds },
      },
      select: { userId: true },
    });

    const removableIds = existing.map((e) => e.userId);

    if (removableIds.length === 0) {
      return NextResponse.json(
        { message: "None of the provided users are members of this project." },
        { status: 200 },
      );
    }

    // Guard: don't allow removing the project's owner/creator via this route
    // const project = await prisma.project.findUnique({
    //   where: { id: projectId },
    //   select: { createdById: true },
    // });

    // if (project?.createdById && removableIds.includes(project.createdById)) {
    //   return NextResponse.json(
    //     { error: "The project owner cannot be removed from the project." },
    //     { status: 400 },
    //   );
    // }

    await prisma.userProject.deleteMany({
      where: {
        projectId,
        userId: { in: removableIds },
      },
    });

    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectUsers: {
          take: 3,
          select: {
            id: true,
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
        _count: {
          select: { sprints: true, tasks: true, projectUsers: true },
        },
      },
    });

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Project not found after update." },
        { status: 404 },
      );
    }

    // Notify each removed user on their own channel, and everyone still
    // on the project so their member lists/avatars stay in sync.
    await Promise.all([
      ...removableIds.map((userId) =>
        pusherServer.trigger(`private-user-${userId}`, "removed-from:project", {
          projectId,
        }),
      ),
      pusherServer.trigger(`private-project-${projectId}`, "members:removed", {
        userIds: removableIds,
        project: updatedProject,
      }),
    ]);

    return NextResponse.json(
      {
        message: "Users removed from project successfully.",
        project: updatedProject,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[REMOVE_MEMBER_FROM_PROJECT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
