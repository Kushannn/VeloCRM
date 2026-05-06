import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SingleProjectDetails from "@/components/project/ProjectDetails/SingleProjectDetails";
import { currentUser } from "@clerk/nextjs/server";
export default async function Page({
  params,
}: {
  params: { projectId: string; orgId: string };
}) {
  const { projectId, orgId } = params;
  const user = await currentUser();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      projectUsers: {
        include: {
          user: true,
        },
      },
      sprints: true,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <SingleProjectDetails
      project={project}
      orgId={orgId}
      projectId={params.projectId}
      user={user}
    />
  );
}
