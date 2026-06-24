import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const access = await getProjectAccessById(projectId);

    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (access.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized for this action" },
        { status: 403 },
      );
    }

    // Deleting all related items since mongoDB does not allow cascading
    await prisma.userProject.deleteMany({ where: { projectId } });
    await prisma.task.deleteMany({ where: { projectId } });
    await prisma.note.deleteMany({ where: { projectId } });
    await prisma.sprint.deleteMany({ where: { projectId } });

    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
