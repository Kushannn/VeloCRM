import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { title, description, startDate, endDate, userId } = await req.json();
    const { projectId } = await params;

    const access = await getProjectAccessById(projectId);

    if (!access) {
      return NextResponse.json(
        { error: "Could not perform the action " },
        { status: 403 },
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const sprint = await prisma.$transaction(async (tx) => {
      const createdSprint = await tx.sprint.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          createdById: userId,
          organizationId: access.project.project.organizationId,
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
