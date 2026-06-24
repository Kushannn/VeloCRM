import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { prisma } from "@/lib/prisma";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userIds, projectId } = body;

    if (!projectId || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid projectId or userIds array." },
        { status: 400 },
      );
    }

    const access = await getProjectAccessById(projectId);

    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (access.role !== "MEMBER" && access.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const validUserIds = userIds.filter((id: string) => ObjectId.isValid(id));

    if (validUserIds.length === 0) {
      return NextResponse.json(
        { error: "No valid userIds provided." },
        { status: 400 },
      );
    }

    const existing = await prisma.userProject.findMany({
      where: {
        projectId,
        userId: { in: validUserIds },
      },
      select: { userId: true },
    });

    const existingIds = new Set(existing.map((e: any) => e.userId));

    const newEntries = validUserIds
      .filter((id) => !existingIds.has(id))
      .map((userId) => ({
        userId,
        projectId,
      }));

    if (newEntries.length > 0) {
      await prisma.userProject.createMany({
        data: newEntries,
      });
    }

    return NextResponse.json(
      { message: "Users added to project successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADD_MEMBER_TO_PROJECT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
