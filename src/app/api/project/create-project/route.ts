import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrgMembershipById } from "@/lib/utils/authorizeUserOrgProject";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function POST(req: Request) {
  try {
    const { name, organizationId, description } = await req.json();

    const access = await getOrgMembershipById(organizationId);

    if (!access) {
      return NextResponse.json(
        { error: "No organization found for the id" },
        { status: 500 },
      );
    }

    if (access.role != "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized for this action" },
        { status: 403 },
      );
    }

    if (!name || !organizationId) {
      return NextResponse.json(
        { error: "Name and organization ID are required" },
        { status: 400 },
      );
    }

    const slug = `${generateSlug(name)}-${Date.now()}`;

    const project = await prisma.project.create({
      data: {
        name,
        organizationId,
        description: description || "",
        slug,
      },
    });

    // below steps are to add the admins to the project automatically upon creation of the project

    const orgMembers = await prisma.userOrganization.findMany({
      where: {
        organizationId,
        role: "ADMIN",
      },
    });

    const projectUsers = [
      { userId: access.userId, projectId: project.id }, // for owners
      ...orgMembers
        .filter((m) => m.userId !== access.userId) // avoid duplicate if owner is also admin
        .map((m) => ({ userId: m.userId, projectId: project.id })),
    ];

    await Promise.all(
      projectUsers.map((pu) =>
        prisma.userProject.upsert({
          where: {
            userId_projectId: {
              userId: pu.userId,
              projectId: pu.projectId,
            },
          },
          update: {},
          create: pu,
        }),
      ),
    );

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        projectUsers: {
          include: {
            user: true,
          },
        },
        _count: {
          select: { projectUsers: true },
        },
      },
    });

    return NextResponse.json({ success: true, fullProject }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
