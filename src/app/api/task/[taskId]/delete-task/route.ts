import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";
import { pusherServer } from "@/lib/pusher";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    const { projectId, sprintId } = await req.json();
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const access = await getProjectAccessById(projectId);
    if (!access) {
      return NextResponse.json(
        { error: "Could not perform the action" },
        { status: 403 },
      );
    }

    await prisma.activityLog.deleteMany({ where: { taskId } });

    await prisma.task.delete({ where: { id: taskId } });

    await pusherServer.trigger(`private-sprint-${sprintId}`, "task:deleted", {
      taskId: taskId,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
