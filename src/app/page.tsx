import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HomeSignedOut from "@/components/HomeSignedOut";
import Cookies from "js-cookie";

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

    let activeOrgSlug = Cookies.get("orgSlug");

    if (activeOrgSlug == null) {
      activeOrgSlug = dbUser.membership[0].organization.slug;
    }

    redirect(`/organization/${activeOrgSlug}/dashboard`);
  }

  return (
    <main>
      <SignedOut>
        <HomeSignedOut />
      </SignedOut>
    </main>
  );
}
