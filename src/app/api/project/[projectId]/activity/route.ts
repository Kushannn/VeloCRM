import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const cursor = new URL(req.url).searchParams.get("cursor");

  if (!projectId) {
    return NextResponse.json(
      { error: "No projectId provided" },
      { status: 404 },
    );
  }

  const logs = await prisma.activityLog.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 20,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: { select: { name: true, image: true } },
      task: { select: { title: true } },
      sprint: {
        select: {
          title: true,
          endDate: true,
          project: { select: { name: true } },
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json({
    items: logs,
    nextCursor: logs.length === 20 ? logs[logs.length - 1].id : null,
  });
}
