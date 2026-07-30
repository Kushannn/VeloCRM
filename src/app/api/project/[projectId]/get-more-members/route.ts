import { prisma } from "@/lib/prisma";
import { getProjectAccessById } from "@/lib/utils/authorizeUserOrgProject";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const access = await getProjectAccessById(projectId);

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");

  const projectUsers = await prisma.userProject.findMany({
    where: { projectId: projectId },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      user: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
  });

  return NextResponse.json({
    members: projectUsers.map((pu) => pu.user),
  });
}
