import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the orgId from the URL
    const orgId = req.nextUrl.pathname.split("/").pop();

    const { userIds } = await req.json();

    if (!Array.isArray(userIds) || !orgId) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const existingMemberships = await prisma.userOrganization.findMany({
      where: {
        userId: { in: userIds },
      },
    });

    const alreadyInOrgUserIds = new Set(
      existingMemberships.map((m) => m.userId)
    );
    const eligibleUserIds = userIds.filter(
      (id) => !alreadyInOrgUserIds.has(id)
    );

    const newMemberships = eligibleUserIds.map((userId) => ({
      userId,
      organizationId: orgId,
      role: "MEMBER" as const,
    }));

    if (newMemberships.length > 0) {
      await prisma.userOrganization.createMany({
        data: newMemberships,
      });
    }

    return NextResponse.json({
      success: true,
      added: newMemberships.length,
      skipped: userIds.length - newMemberships.length,
    });
  } catch (error) {
    console.error("[ADD_ORG_MEMBERS_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
