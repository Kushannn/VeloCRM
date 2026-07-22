import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";
import { pusherServer } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  try {
    const { status } = await req.json();

    if (!projectId || !status) {
      return NextResponse.json(
        { success: false, error: "Project ID and status are required" },
        { status: 400 },
      );
    }

    const access = await getProjectAccessById(projectId);
    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    const members = await prisma.userProject.findMany({
      where: { projectId },
      select: { userId: true },
    });

    try {
      await Promise.all([
        ...members.map((m) =>
          pusherServer.trigger(
            `private-user-${m.userId}`,
            "project:status-changed",
            { projectId, status },
          ),
        ),
        pusherServer.trigger(
          `private-project-${projectId}`,
          "project:status-changed",
          { projectId, status },
        ),
      ]);
    } catch (pusherError) {
      console.error("Pusher trigger failed:", pusherError);
    }

    return NextResponse.json(
      { success: true, project: updatedProject },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
