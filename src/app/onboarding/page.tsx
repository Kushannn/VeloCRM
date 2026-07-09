import MainOnboardingPage from "@/components/onboarding/MainOnboardingPage";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const clerkUser = await currentUser();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser?.id },
    include: {
      userProjects: {
        include: { project: true },
      },
      membership: {
        include: { organization: true },
      },
    },
  });

  if (dbUser?.membership.length != 0) {
    console.log("redirecting from onboarding page ");
    redirect("/dashboard");
  }

  return <MainOnboardingPage user={dbUser} />;
}
