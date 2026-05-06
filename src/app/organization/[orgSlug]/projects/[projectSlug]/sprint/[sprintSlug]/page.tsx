import SprintDashboard from "@/components/sprint/SprintDashboard";
import { prisma } from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{
    orgId: string;
    projectSlug: string;
    sprintSlug: string;
  }>;
}) {
  const { orgId, projectSlug, sprintSlug } = await params;
  const sprint = await prisma.sprint.findFirst({
    where: {
      slug: sprintSlug,
      project: {
        slug: projectSlug,
      },
    },
    include: {
      tasks: true,
    },
  });

  const project = await prisma.project.findUnique({
    where: {
      slug: projectSlug,
    },
  });

  if (!sprint) {
    return <div className="p-10 text-white text-center">Sprint not found</div>;
  }

  return (
    <SprintDashboard
      sprint={JSON.parse(JSON.stringify(sprint))}
      project={JSON.parse(JSON.stringify(project))}
      params={params}
    />
  );
}
