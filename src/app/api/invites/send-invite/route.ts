import { auth } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  const { orgId, email } = await req.json();
  const { userId } = await auth();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const secret = process.env.INVITE_SECRET;
  if (!secret) throw new Error("Missing INVITE_SECRET");

  const token = jwt.sign({ orgId, email }, secret, { expiresIn: "3d" });
  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?token=${token}`;

  await sendEmail({
    to: email,
    subject: "You're invited to join our organization",
    html: `<p>Make sure to signup to VeloCRM first</p> <br/> <p>You’ve been invited to join our organization. <a href="${inviteLink}">Click here to accept the invitation</a>.</p>`,
  });

  return Response.json({ success: true, message: "Invite sent" });
}
