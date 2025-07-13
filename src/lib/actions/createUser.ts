import { prisma } from "../prisma";
// import { UserType } from "../types";

interface CreateUserInput {
  clerkId: string;
  email?: string;
  name: string;
  image?: string;
}

export async function createUser(user: CreateUserInput) {
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
        email: user.email || "",
        name: user.name,
        role: "USER",
        createdAt: new Date(),
      },
    });

    return { success: true, alreadyExists: false };
  } catch (error) {
    console.error("Error inserting user:", error);
    return { success: false, error };
  }
}
