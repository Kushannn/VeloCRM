import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

import { TaskStatus, TaskPriority } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      projectId,
      sprintId,
      dueDate,
    }: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      assignedTo?: string;
      projectId: string;
      sprintId: string;
      dueDate: Date;
    } = await req.json();

    if (!title || !projectId || !sprintId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    const sprintExists = await prisma.sprint.findUnique({
      where: { id: sprintId },
    });

    if (!sprintExists) {
      return NextResponse.json(
        { success: false, error: "Sprint not found" },
        { status: 404 },
      );
    }

    const taskStatus: TaskStatus = status
      ?.toUpperCase()
      .replace(" ", "_") as TaskStatus;
    const taskPriority: TaskPriority = priority?.toUpperCase() as TaskPriority;

    const result = await prisma.$transaction(async (tx) => {
      const createdTask = await tx.task.create({
        data: {
          title,
          description,
          status: taskStatus || TaskStatus.PENDING,
          priority: taskPriority || TaskPriority.MEDIUM,
          sprintId,
          projectId,
          createdById: user.id,
          assignedToId: assignedTo || undefined,
          dueDate,
        },
        include: {
          assignedTo: { select: { image: true, name: true, id: true } },
        },
      });
      const activityLog = await tx.activityLog.create({
        data: {
          type: "TASK_CREATED",
          projectId,
          taskId: createdTask.id,
          userId: user.id,
          sprintId,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
          task: { select: { title: true } },
          sprint: { select: { title: true } },
        },
      });

      return { createdTask, activityLog };
    });

    await pusherServer.trigger(`private-project-${projectId}`, "activity:new", {
      log: result.activityLog,
    });

    console.log("Sprint id", sprintId);

    await pusherServer.trigger(`private-sprint-${sprintId}`, "task:created", {
      task: result.createdTask,
    });

    return NextResponse.json({ success: true, task: result.createdTask });
  } catch (error) {
    console.error("Create Task Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
