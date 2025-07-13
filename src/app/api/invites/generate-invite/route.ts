import jwt from "jsonwebtoken";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { orgId, email } = await req.json();
  const { userId } = await auth();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const token = jwt.sign({ orgId, email }, process.env.INVITE_SECRET!, {
    expiresIn: "2d",
  });

  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invite?token=${token}`;

  return Response.json({ success: true, inviteLink });
}
