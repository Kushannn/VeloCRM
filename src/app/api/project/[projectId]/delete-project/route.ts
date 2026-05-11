import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      include: { ownedOrganizations: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is owner or admin
    const isOwner = dbUser.ownedOrganizations.some(
      (org) => org.id === project.organizationId,
    );

    const isMemberAdmin = await prisma.userOrganization.findFirst({
      where: {
        userId: dbUser.id,
        organizationId: project.organizationId,
        role: "ADMIN",
      },
    });

    if (!isOwner && !isMemberAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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
