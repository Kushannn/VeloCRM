import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  return prisma.user.findUnique({ where: { clerkId } });
});

export const getOrgBySlugForUser = cache(async (orgSlug: string) => {
  const user = await getCurrentUser();
  if (!user) return null;

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });
  if (!org) return null;

  const membership = await prisma.userOrganization.findUnique({
    where: {
      userId_organizationId: { userId: user.id, organizationId: org.id },
    },
  });
  if (!membership) return null;

  return { ...org, currentUserRole: membership.role };
});

export const getProjectMembership = cache(
  async (projectSlug: string, organizationSlug: string) => {
    const user = await getCurrentUser();
    if (!user) return null;

    const orgMembership = await getOrgBySlugForUser(organizationSlug);

    if (!orgMembership) return null;

    const project = await prisma.project.findUnique({
      where: { slug: projectSlug },
    });

    if (!project) return null;

    const projectMembership = await prisma.userProject.findUnique({
      where: { userId_projectId: { userId: user.id, projectId: project.id } },
    });

    return projectMembership;
  },
);

// ID based guards for api's
export const getOrgMembershipById = cache(async (organizationId: string) => {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.userOrganization.findUnique({
    where: { userId_organizationId: { userId: user.id, organizationId } },
  });
});

export const getProjectAccessById = cache(async (projectId: string) => {
  const user = await getCurrentUser();
  if (!user) return null;

  const project = await prisma.userProject.findUnique({
    where: { userId_projectId: { userId: user.id, projectId } },
    select: { id: true, organizationId: true },
  });
  if (!project) return null;
  const orgMembership = await prisma.userOrganization.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: project.organizationId,
      },
    },
  });
  if (!orgMembership) return null;

  return { user, project, role: orgMembership.role };
});
