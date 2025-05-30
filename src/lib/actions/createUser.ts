import { prisma } from "../prisma";
import { UserType } from "@/models/User";

export async function createUser(user: UserType) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.clerkId },
    });
    if (existingUser) {
      return { success: true, alreadyExists: true };
    }

    await prisma.user.create({
      data: {
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: "user",
        createdAt: new Date(),
      },
    });

    return { success: true, alreadyExists: false };
  } catch (error) {
    console.error("Error inserting user:", error);
    return { success: false, error };
  }
}
