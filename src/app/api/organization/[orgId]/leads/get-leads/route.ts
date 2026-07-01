import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrgMembershipById } from "@/lib/utils/authorizeUserOrgProject";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;

  const access = await getOrgMembershipById(orgId);

  if (!access) {
    return NextResponse.json(
      { success: false, error: "No membership with organization" },
      { status: 403 },
    );
  }

  try {
    if (!orgId) {
      return NextResponse.json(
        { success: false, error: "Organization ID is required." },
        { status: 400 },
      );
    }

    const leads = await prisma.lead.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
