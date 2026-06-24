import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getProjectAccessById,
  getProjectMembership,
} from "@/lib/utils/authorizeUserOrgProject";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const { status, userId, projectId } = await req.json();

    const access = await getProjectAccessById(projectId);

    if (!access) {
      return NextResponse.json(
        { success: false, error: "Could not get membership with project" },
        { status: 403 },
      );
    }

    if (!taskId || !status) {
      return NextResponse.json(
        { success: false, error: "Task ID and status are required" },
        { status: 400 },
      );
    }

    // 1. Fetch current status BEFORE updating
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { status: true, projectId: true, title: true },
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 },
      );
    }

    if (!existingTask.projectId) {
      return NextResponse.json(
        { success: false, error: "Task is not associated with a project" },
        { status: 400 },
      );
    }
    // 2. Run update + activity log in one transaction
    const [updatedTask] = await prisma.$transaction([
      prisma.task.update({
        where: { id: taskId },
        data: { status },
      }),
      prisma.activityLog.create({
        data: {
          type: status === "COMPLETED" ? "TASK_COMPLETED" : "TASK_UPDATED",
          projectId: existingTask.projectId,
          taskId,
          userId: userId ?? null,
          metadata: {
            from: existingTask.status,
            to: status,
            taskTitle: existingTask.title,
          },
        },
      }),
    ]);

    return NextResponse.json(
      { success: true, task: updatedTask },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
