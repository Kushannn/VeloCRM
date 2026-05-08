import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 },
      );
    }

    console.log("clerkId ", clerkId);

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate slug
    const baseSlug = generateSlug(name);
    const slug = `${baseSlug}-${Date.now()}`; // prevents duplicate errors

    const organization = await prisma.organization.create({
      data: {
        name,
        ownerId: dbUser.id,
        slug,
      },
    });

    await prisma.userOrganization.create({
      data: {
        userId: dbUser.id,
        organizationId: organization.id,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ success: true, organization }, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
