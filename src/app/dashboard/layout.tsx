// app/dashboard/layout.tsx
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
    select: {
      id: true,
      _count: { select: { membership: true } },
    },
  });

  if (!dbUser) redirect("/sign-in");
  if (dbUser._count.membership === 0) redirect("/onboarding");

  return <>{children}</>;
}
