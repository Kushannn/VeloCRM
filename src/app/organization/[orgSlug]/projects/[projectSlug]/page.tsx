import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SingleProjectDetails from "@/components/project/ProjectDetails/SingleProjectDetails";
import { currentUser } from "@clerk/nextjs/server";

type ActivityItem = {
  id: string;
  type: "SPRINT_CREATED" | "TASK_CREATED" | "TASK_COMPLETED" | "TASK_UPDATED";
  title: string;
  subtitle?: string;
  date: Date;
  user?: { name: string | null; image: string | null } | null;
};

export default async function Page({
  params,
}: {
  params: Promise<{ projectSlug: string; orgSlug: string }>;
}) {
  const { projectSlug, orgSlug } = await params;
  const clerkUser = await currentUser();
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser?.id },
  });

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
      sprints: {
        include: {
          tasks: true,
        },
      },
      tasks: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project) return notFound();

  return (
    <SingleProjectDetails
      project={project}
      orgSlug={orgSlug}
      projectSlug={projectSlug}
      user={dbUser}
    />
  );
}
