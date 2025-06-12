import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const { userIds } = body;

    if (!projectId || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid projectId or userIds array." },
        { status: 400 }
      );
    }

    const validUserIds = userIds.filter((id: string) => ObjectId.isValid(id));

    if (validUserIds.length === 0) {
      return NextResponse.json(
        { error: "No valid userIds provided." },
        { status: 400 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADD_MEMBER_TO_PROJECT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
