import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const { orgId } = await params;

  try {
    const members = await prisma.userOrganization.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            userProjects: {
              where: {
                project: {
                  organizationId: orgId,
                },
              },
              select: {
                projectId: true,
              },
            },
          },
        },
      },
    });

    //formatting the members so that we get can array of projectIds
    const formattedMembers = members.map((member) => ({
      id: member.id,
      role: member.role,
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        image: member.user.image,
        projectIds: member.user.userProjects.map((up) => up.projectId),
      },
    }));

    return NextResponse.json({ success: true, members: formattedMembers });
  } catch (error) {
    console.error("Failed to fetch organization members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members." },
      { status: 500 }
    );
  }
}
