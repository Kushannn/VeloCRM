import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;

  console.log("This the organizaiton id ", orgId);

  try {
    if (!orgId) {
      return NextResponse.json(
        { success: false, error: "Organization ID is required." },
        { status: 400 }
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
      { status: 500 }
    );
  }
}
