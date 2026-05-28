import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const body = await req.json();

    const { title, description, status, priority, dueDate, assignedToId } =
      body;

    // console.log("body ", body);

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 },
      );
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: assignedToId,
      },
    });

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
