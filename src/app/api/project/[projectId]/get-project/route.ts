import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  try {
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const access = await getProjectAccessById(projectId);

    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        sprints: true,
        tasks: true,
        projectUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: project,
    });
  } catch (error) {
    console.error("[GET_PROJECT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
