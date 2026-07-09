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

  let decoded: { inviteId: string };

  try {
    decoded = jwt.verify(token, process.env.INVITE_SECRET!) as {
      inviteId: string;
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

    console.error(error);

    return NextResponse.json(
      { success: false, error: "Could not verify token" },
      { status: 400 },
    );
  }

  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "No email found for user" },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User is not signed up with VeloCRM" },
        { status: 403 },
      );
    }

    // Find invite using the token (DB is the source of truth)
    const invite = await prisma.invite.findUnique({
      where: {
        token,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { success: false, error: "Invite is no longer valid" },
        { status: 400 },
      );
    }

    // Token must belong to the invite we decoded
    if (invite.id !== decoded.inviteId) {
      return NextResponse.json(
        { success: false, error: "Invalid invite token" },
        { status: 400 },
      );
    }

    console.log("email invite", invite.email);
    console.log("email ", email);
    // Email must match invite
    if (invite.email !== email) {
      return NextResponse.json(
        { success: false, error: "Email mismatch" },
        { status: 403 },
      );
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Invite has already been used" },
        { status: 409 },
      );
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "Invite link has expired" },
        { status: 410 },
      );
    }

    const existingMembership = await prisma.userOrganization.findFirst({
      where: {
        userId: dbUser.id,
        organizationId: invite.orgId,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { success: false, error: "User is already in the organization" },
        { status: 400 },
      );
    }

    // Atomically claim the invite
    const claimed = await prisma.invite.updateMany({
      where: {
        id: invite.id,
        token,
        status: "PENDING",
      },
      data: {
        status: "ACCEPTED",
      },
    });

    if (claimed.count === 0) {
      return NextResponse.json(
        { success: false, error: "Invite already used" },
        { status: 409 },
      );
    }

    await prisma.userOrganization.create({
      data: {
        userId: dbUser.id,
        organizationId: invite.orgId,
        role: "MEMBER",
      },
    });

    const org = await prisma.organization.findUnique({
      where: {
        id: invite.orgId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined the organization",
      data: org,
    });
  } catch (error) {
    console.error("Error adding user to organization:", error);

    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
