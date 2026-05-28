import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { membership: true },
  });

  if (!dbUser) redirect("/sign-in");
  if (!dbUser.membership || dbUser.membership.length === 0)
    redirect("/onboarding");

  return <>{children}</>;
}
