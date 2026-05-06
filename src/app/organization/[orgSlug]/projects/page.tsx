import { prisma } from "@/lib/prisma";
import ProjectSummaryDashboard from "@/components/project/projectSummarDashboard/ProjectSummarDashboard";
import { currentUser } from "@clerk/nextjs/server";
import { useEffect } from "react";

export default async function Page({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  const user = await currentUser();

  const projects = await prisma.project.findMany({
    where: { organizationId: orgId },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  const members = await prisma.userOrganization.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      user: true,
    },
  });

  return (
    <ProjectSummaryDashboard
      orgId={orgId}
      projects={projects}
      organization={organization}
      organizationMembers={members}
      user={user}
    />
  );
}
