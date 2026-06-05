import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { title, description, startDate, endDate, userId } = await req.json();

    console.log("userId ", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Title, Start Date, and End Date are required" },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { organization: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const sprint = await prisma.$transaction(async (tx) => {
      const createdSprint = await tx.sprint.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          createdById: userId,
          organizationId: project.organizationId,
          projectId,
          slug: `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        },
      });

      await tx.activityLog.create({
        data: {
          type: "SPRINT_CREATED",
          projectId,
          sprintId: createdSprint.id,
          userId,
        },
      });
    });

    return NextResponse.json({ success: true, sprint }, { status: 201 });
  } catch (error) {
    console.error("[CREATE_SPRINT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
