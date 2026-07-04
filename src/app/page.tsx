import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import HomeSignedOut from "@/components/HomeSignedOut";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        membership: {
          include: { organization: true },
        },
      },
    });

    if (!dbUser) redirect("/sign-in");

    if (!dbUser.membership || dbUser.membership.length === 0) {
      redirect("/onboarding");
    }

    const cookieStore = await cookies();
    const activeOrgIdFromCookie = cookieStore.get("activeOrgId")?.value;

    const activeMembership =
      dbUser.membership.find(
        (m) => m.organizationId === activeOrgIdFromCookie,
      ) ?? dbUser.membership[0];

    redirect(`/organization/${activeMembership.organization.slug}/dashboard`);
  }

  return (
    <main>
      <SignedOut>
        <HomeSignedOut />
      </SignedOut>
    </main>
  );
}
