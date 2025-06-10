import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.INVITE_SECRET!) as {
      orgId: string;
      email: string;
    };
    const { orgId, email } = decoded;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user || user.emailAddresses[0].emailAddress !== email) {
      return NextResponse.json(
        { success: false, error: "Email mismatch" },
        { status: 403 }
      );
    }

    const existingMembership = await prisma.userOrganization.findFirst({
      where: {
        userId,
        organizationId: orgId,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { success: false, error: "User is already in the organization" },
        { status: 400 }
      );
    }

    await prisma.userOrganization.create({
      data: {
        userId,
        organizationId: orgId,
        role: "MEMBER",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined the organization",
    });
  } catch (error) {
    console.error("Error verifying token or adding user:", error);
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
