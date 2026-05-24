import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, organizationId, description } = await req.json();

    if (!name || !organizationId) {
      return NextResponse.json(
        { error: "Name and organization ID are required" },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      include: { ownedOrganizations: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isOwner = dbUser.ownedOrganizations.some(
      (org: any) => org.id === organizationId,
    );

    const isMemberAdmin = await prisma.userOrganization.findFirst({
      where: { userId: dbUser.id, organizationId, role: "ADMIN" },
    });

    if (!isOwner && !isMemberAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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
      { userId: dbUser.id, projectId: project.id }, // for owners
      ...orgMembers
        .filter((m) => m.userId !== dbUser.id) // avoid duplicate if owner is also admin
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

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
