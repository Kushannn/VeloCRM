import SprintDashboard from "@/components/sprint/SprintDashboard";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page({
  params,
}: {
  params: Promise<{
    projectSlug: string;
    sprintSlug: string;
  }>;
}) {
  const { projectSlug, sprintSlug } = await params;

  const user = await currentUser();

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user?.id,
    },
  });

  const project = await prisma.project.findUnique({
    where: {
      slug: projectSlug,
    },
    include: {
      projectUsers: {
        include: {
          user: true,
        },
      },
    },
  });

  const sprint = await prisma.sprint.findFirst({
    where: {
      slug: sprintSlug,
      projectId: project?.id,
    },
    include: {
      tasks: {
        include: {
          assignedTo: true,
          createdBy: true,
        },
      },
    },
  });

  if (!sprint) {
    return <div className="p-10 text-white text-center">Sprint not found</div>;
  }

  return (
    <SprintDashboard
      sprint={JSON.parse(JSON.stringify(sprint))}
      project={JSON.parse(JSON.stringify(project))}
      dbUser={dbUser}
    />
  );
}
