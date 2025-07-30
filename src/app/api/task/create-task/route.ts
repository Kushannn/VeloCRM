import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

import { TaskStatus, TaskPriority } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
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
    }: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      assignedTo?: string;
      projectId: string;
      sprintId: string;
    } = await req.json();

    if (!title || !projectId || !sprintId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const sprintExists = await prisma.sprint.findUnique({
      where: { id: sprintId },
    });

    if (!sprintExists) {
      return NextResponse.json(
        { success: false, error: "Sprint not found" },
        { status: 404 }
      );
    }

    const taskStatus: TaskStatus = status
      ?.toUpperCase()
      .replace(" ", "_") as TaskStatus;
    const taskPriority: TaskPriority = priority?.toUpperCase() as TaskPriority;

    const createdTask = await prisma.task.create({
      data: {
        title,
        description,
        status: taskStatus || TaskStatus.PENDING,
        priority: taskPriority || TaskPriority.MEDIUM,
        sprintId,
        projectId,
        createdById: user.id,
        assignedToId: assignedTo || undefined,
      },
    });

    return NextResponse.json({ success: true, task: createdTask });
  } catch (error) {
    console.error("Create Task Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
