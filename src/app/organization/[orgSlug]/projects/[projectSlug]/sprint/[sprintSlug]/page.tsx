import SprintDashboard from "@/components/sprint/SprintDashboard";
import { prisma } from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{
    projectSlug: string;
    sprintSlug: string;
  }>;
}) {
  const { projectSlug, sprintSlug } = await params;

  const project = await prisma.project.findUnique({
    where: {
      slug: projectSlug,
    },
  });

  const sprint = await prisma.sprint.findFirst({
    where: {
      slug: sprintSlug,
      projectId: project?.id,
    },
    include: {
      tasks: true,
    },
  });

  if (!sprint) {
    return <div className="p-10 text-white text-center">Sprint not found</div>;
  }

  return (
    <SprintDashboard
      sprint={JSON.parse(JSON.stringify(sprint))}
      project={JSON.parse(JSON.stringify(project))}
    />
  );
}
