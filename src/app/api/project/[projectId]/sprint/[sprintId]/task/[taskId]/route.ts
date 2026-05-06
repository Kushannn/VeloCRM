import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// API For Modifying a single task such as changing its status

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const { status, userId } = await req.json();

    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 },
      );
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: status,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("[UPDATE_TASK_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
