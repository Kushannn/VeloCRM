import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const awaitedParams = await params;

    const { status } = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id: awaitedParams.projectId },
      data: { status },
    });

    return NextResponse.json(
      { success: true, project: updatedProject },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
