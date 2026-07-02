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
      { status: 401 },
    );
  }

  let decoded: { orgId: string; email: string };

  try {
    decoded = jwt.verify(token, process.env.INVITE_SECRET!) as {
      orgId: string;
      email: string;
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { success: false, error: "Invite link has expired" },
        { status: 410 },
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, error: "Invalid invite token" },
        { status: 400 },
      );
    }

    console.error("Error verifying token:", error);
    return NextResponse.json(
      { success: false, error: "Could not verify token" },
      { status: 400 },
    );
  }

  try {
    const { orgId, email } = decoded;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User is not signed up with VeloCRM" },
        { status: 403 },
      );
    }

    if (!user || user.emailAddresses[0].emailAddress !== email) {
      return NextResponse.json(
        { success: false, error: "Email mismatch" },
        { status: 403 },
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
        { status: 400 },
      );
    }

    await prisma.userOrganization.create({
      data: {
        userId: dbUser!.id,
        organizationId: orgId,
        role: "MEMBER",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined the organization",
    });
  } catch (error) {
    console.error("Error adding user to organization:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
