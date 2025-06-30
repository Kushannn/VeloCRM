import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; sprintId: string }> }
) {
  const { projectId, sprintId } = await params;

  try {
    if (!sprintId) {
      return NextResponse.json(
        { error: "Sprint ID is required" },
        { status: 400 }
      );
    }
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId, projectId },
      include: {
        tasks: {
          include: {
            assignedTo: true,
          },
        },
        createdBy: true,
        notes: true,
      },
    });

    if (!sprint) {
      return NextResponse.json({ error: "No sprint found!" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      sprint: sprint,
    });
  } catch (error) {}
}
