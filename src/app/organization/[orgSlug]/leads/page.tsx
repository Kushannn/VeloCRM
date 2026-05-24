import { LeadsDashboard } from "@/components/leads/leadsDashboard/LeadsDashboard";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function page({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const clerkUser = await currentUser();

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser?.id,
    },
  });

  const leads = await prisma.lead.findMany({
    where: { organizationId: org?.id },
    include: { assignedTo: true, activities: true, tags: true },
  });

  return <LeadsDashboard org={org} leads={leads} user={dbUser} />;
}
