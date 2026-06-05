import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const body = await req.json();

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedToId,
      userId,
    } = body;

    // console.log("body ", body);

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 },
      );
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        assignedToId: true,
        projectId: true,
      },
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

    const changes = [];

    if (existingTask.title !== title) {
      changes.push({
        field: "title",
        from: existingTask.title,
        to: title,
      });
    }

    if (existingTask.description !== description) {
      changes.push({
        field: "description",
        from: existingTask.description,
        to: description,
      });
    }

    if (existingTask.status !== status) {
      changes.push({
        field: "status",
        from: existingTask.status,
        to: status,
      });
    }

    if (existingTask.priority !== priority) {
      changes.push({
        field: "priority",
        from: existingTask.priority,
        to: priority,
      });
    }

    if (
      existingTask.dueDate?.toISOString() !==
      (dueDate ? new Date(dueDate).toISOString() : undefined)
    ) {
      changes.push({
        field: "dueDate",
        from: existingTask.dueDate,
        to: dueDate,
      });
    }

    if (existingTask.assignedToId !== assignedToId) {
      changes.push({
        field: "assignedTo",
        from: existingTask.assignedToId,
        to: assignedToId,
      });
    }

    const [updatedTask] = await prisma.$transaction([
      prisma.task.update({
        where: { id: taskId },
        data: {
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          assignedToId: assignedToId,
        },
      }),

      prisma.activityLog.create({
        data: {
          type:
            existingTask.status !== status
              ? status === "COMPLETED"
                ? "TASK_COMPLETED"
                : "TASK_STATUS_CHANGED"
              : "TASK_UPDATED",

          projectId: existingTask.projectId,
          taskId,
          userId: userId ?? null,

          metadata: {
            taskTitle: title,
            changes,
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        task: updatedTask,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating task:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
