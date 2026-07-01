import ProjectSummaryDashboard from "@/components/project/projectSummarDashboard/ProjectSummarDashboard";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const clerkUser = await currentUser();

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser?.id ?? "" },
    include: { ownedOrganizations: true },
  });
  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });

  if (!organization) return notFound();

  const projects = await prisma.project.findMany({
    where: {
      organizationId: organization.id,
    },
    include: {
      // sprints: true,
      _count: {
        select: {
          sprints: true,
          tasks: true,
        },
      },
    },
  });

  const members = await prisma.userOrganization.findMany({
    where: { organizationId: organization.id },
    include: { user: true },
  });

  return (
    <ProjectSummaryDashboard
      orgId={organization.id}
      orgSlug={orgSlug}
      projects={projects}
      organization={organization}
      organizationMembers={members}
      user={user}
    />
  );
}
