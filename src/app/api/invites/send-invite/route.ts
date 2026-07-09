import { auth } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/sendEmail";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { orgId, email } = await req.json();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId! },
  });

  if (!dbUser) {
    return Response.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  }

  const membershipRole = await prisma.userOrganization.findFirst({
    where: {
      userId: dbUser?.id,
      organizationId: orgId,
      role: "ADMIN",
    },
  });

  if (!userId) return new Response("Unauthorized", { status: 401 });

  if (!orgId || !email) {
    return Response.json(
      { success: false, error: "orgId and email are required" },
      { status: 400 },
    );
  }

  // Authorization: caller must belong to the org they're inviting into,
  // and must have permission to invite (adjust role check to your setup)
  if (!membershipRole) {
    return new Response("Forbidden", { status: 403 });
  }

  const existing = await prisma.invite.findFirst({
    where: { orgId, email, status: "PENDING", expiresAt: { gt: new Date() } },
  });
  if (existing) {
    return Response.json(
      {
        success: false,
        error: "An active invite already exists for this email",
      },
      { status: 409 },
    );
  }

  const secret = process.env.INVITE_SECRET;
  if (!secret) throw new Error("Missing INVITE_SECRET");

  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  // Keep the JWT payload minimal — just enough to look up the real record.
  // The invite row (not the token contents) is the source of truth for
  // org/email/status, so the token can't be replayed after acceptance.
  const invite = await prisma.invite.create({
    data: { orgId, email, invitedBy: dbUser.id, expiresAt, token: "" },
  });

  const token = jwt.sign({ inviteId: invite.id }, secret, { expiresIn: "3d" });

  await prisma.invite.update({
    where: { id: invite.id },
    data: { token },
  });

  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding?token=${token}`;

  await sendEmail({
    to: email,
    subject: "You're invited to join our organization",
    html: `<p>Make sure to sign up to VeloCRM first</p><br/><p>You've been invited to join our organization. <a href="${inviteLink}">Click here to accept the invitation</a>.</p>`,
  });

  return Response.json({ success: true, message: "Invite sent" });
}
