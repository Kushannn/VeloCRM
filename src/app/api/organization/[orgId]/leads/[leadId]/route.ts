import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrgMembershipById } from "@/lib/utils/authorizeUserOrgProject";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orgId: string; leadId: string }> },
) {
  const { orgId, leadId } = await params;

  try {
    const body = await req.json();

    const access = await getOrgMembershipById(orgId);

    if (!access) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication with organization failed",
        },
        { status: 403 },
      );
    }

    const userId = access.userId;

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found",
        },
        { status: 404 },
      );
    }

    if (existingLead.organizationId !== orgId) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead does not belong to this organization",
        },
        { status: 403 },
      );
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        name: typeof body.name === "string" ? body.name : undefined,
        email: typeof body.email === "string" ? body.email : undefined,
        phone: typeof body.phone === "string" ? body.phone : undefined,
        company: typeof body.company === "string" ? body.company : undefined,
        source: typeof body.source === "string" ? body.source : undefined,
        notes: typeof body.notes === "string" ? body.notes : undefined,
        value: typeof body.value === "number" ? body.value : undefined,
        expectedClose: body.expectedClose
          ? new Date(body.expectedClose)
          : undefined,
        assignedToId:
          typeof body.assignedToId === "string" ? body.assignedToId : undefined,
        status: typeof body.status === "string" ? body.status : undefined,
      },
    });

    if (body.status && body.status !== existingLead.status) {
      console.log("updating the status");
      const activityLog = await prisma.leadActivity.create({
        data: {
          leadId,
          type: "STATUS_CHANGE",
          note: `Status changed from ${existingLead.status} to ${body.status}`,
          userId,
          previousStatus: existingLead.status,
          newStatus: updatedLead.status,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
          lead: { select: { id: true, name: true } },
        },
      });

      console.log("logs ", activityLog);

      try {
        await pusherServer.trigger(`private-org-${orgId}`, "lead:updated", {
          log: activityLog,
          lead: updatedLead,
        });
      } catch (error) {
        console.error("Pusher trigger failed for lead status change:", error);
      }
    }

    // try {
    //   await pusherServer.trigger(`private-org-${orgId}`, "lead:updated", {
    //     lead: updatedLead,
    //   });
    // } catch (error) {
    //   console.error("Pusher trigger failed for lead update:", error);
    // }

    return NextResponse.json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    console.error("Failed to update lead:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update lead",
      },
      { status: 500 },
    );
  }
}
