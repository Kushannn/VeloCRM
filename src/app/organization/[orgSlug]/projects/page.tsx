import ProjectSummaryDashboard from "@/components/project/projectSummaryDashboard/ProjectSummaryDashboard";
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

  const [user, organization] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: clerkUser?.id ?? "" },
      include: { ownedOrganizations: true },
    }),
    prisma.organization.findUnique({ where: { slug: orgSlug } }),
  ]);

  if (!organization) return notFound();

  const [projects, members] = await Promise.all([
    prisma.project.findMany({
      where: {
        organizationId: organization.id,
        projectUsers: {
          some: { userId: user!.id },
        },
      },
      include: {
        projectUsers: {
          take: 3,
          select: {
            id: true,
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
        _count: {
          select: { sprints: true, tasks: true, projectUsers: true },
        },
      },
    }),
    prisma.userOrganization.findMany({
      where: { organizationId: organization.id },
      select: {
        id: true,
        role: true,
        user: { select: { id: true, name: true, image: true, email: true } },
      },
    }),
  ]);

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
