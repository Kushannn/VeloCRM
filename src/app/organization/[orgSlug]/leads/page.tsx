import { LeadsDashboard } from "@/components/leads/leadsDashboard/LeadsDashboard";
import { prisma } from "@/lib/prisma";

export default async function page({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });

  const leads = await prisma.lead.findMany({
    where: { organizationId: org?.id },
    include: { assignedTo: true, activities: true, tags: true },
  });

  return <LeadsDashboard org={org} leads={leads} />;
}
