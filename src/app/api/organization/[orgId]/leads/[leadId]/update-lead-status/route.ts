import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrgMembershipById } from "@/lib/utils/authorizeUserOrgProject";
import { LeadStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orgId: string; leadId: string }> },
) {
  const { orgId, leadId } = await params;

  try {
    const { status: newStatus } = await req.json();

    const access = await getOrgMembershipById(orgId);

    if (!access) {
      return NextResponse.json(
        { success: false, error: "Authentication with organization failed" },
        { status: 403 },
      );
    }

    if (!orgId || !leadId || !newStatus) {
      console.log("status", newStatus);
      console.log("error here 1 ");
      return NextResponse.json(
        { success: false, error: "Org ID | Lead ID | Status are required" },
        { status: 400 },
      );
    }

    if (!Object.values(LeadStatus).includes(newStatus)) {
      console.log("error here 2 ");
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 },
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { organizationId: true, status: true },
    });

    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 },
      );
    }

    if (existingLead.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: "Lead does not belong to this organization" },
        { status: 403 },
      );
    }

    if (existingLead.status === newStatus) {
      return NextResponse.json({
        success: true,
        data: existingLead,
        noChange: true,
      });
    }

    const userId = access.userId;

    const [updatedLead] = await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { status: newStatus },
      }),
      prisma.leadActivity.create({
        data: {
          leadId,
          type: "STATUS_CHANGE",
          note: `Status changed from ${existingLead.status} to ${newStatus}`,
          userId,
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead status" },
      { status: 500 },
    );
  }
}
