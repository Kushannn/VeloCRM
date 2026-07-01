import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  console.log("user", user);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "User does not exist" },
      { status: 404 },
    );
  }

  await prisma.user.update({
    where: {
      clerkId: userId,
    },
    data: {
      image: body.image,
    },
  });

  return Response.json({ success: true });
}
