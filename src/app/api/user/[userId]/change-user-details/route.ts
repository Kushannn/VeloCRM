import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User does not exist" },
        { status: 404 },
      );
    }

    const { name, role, email } = body;

    if (!name && !role && !email) {
      return NextResponse.json(
        { success: false, error: "No fields provided to update" },
        { status: 400 },
      );
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email is already in use" },
          { status: 409 },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        role: true,
      },
    });

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user:", error);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
