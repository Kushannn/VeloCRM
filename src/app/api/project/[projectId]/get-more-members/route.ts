import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");

  const projectUsers = await prisma.userProject.findMany({
    where: { projectId: id },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json({
    members: projectUsers.map((pu) => pu.user),
  });
}
