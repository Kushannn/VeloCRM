import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { getOrgMembershipById } from "@/lib/utils/authorizeUserOrgProject";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;

  const access = await getOrgMembershipById(orgId);

  if (!access) {
    return NextResponse.json(
      { error: "Not a member of the organization" },
      { status: 403 },
    );
  }

  try {
    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 },
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: { projects: true },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      projects: organization.projects,
    });
  } catch (error) {
    console.error("[GET_PROJECTS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
