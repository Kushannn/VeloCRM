import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SingleProjectDetails from "@/components/project/ProjectDetails/SingleProjectDetails";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page({
  params,
}: {
  params: Promise<{ projectSlug: string; orgSlug: string }>;
}) {
  const { projectSlug, orgSlug } = await params;
  const clerkUser = await currentUser();
  const user = clerkUser
    ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
      }
    : null;

  // Get org by slug instead of using Redux
  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });

  if (!organization) return notFound();

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    include: {
      projectUsers: {
        include: { user: true },
      },
      sprints: true,
    },
  });

  if (!project) return notFound();

  return (
    <SingleProjectDetails
      project={project}
      orgSlug={orgSlug}
      projectSlug={projectSlug}
      user={user}
    />
  );
}
