import UserProfilePage from "@/components/userProfilePage/UserProfilePage";
import { prisma } from "@/lib/prisma";
import { FeedItem } from "@/lib/types";
import { getCurrentUser } from "@/lib/utils/authorizeUserOrgProject";

export default async function page() {
  const user = await getCurrentUser();

  const userOrg = await prisma.userOrganization.findFirst({
    where: {
      userId: user?.id,
    },
  });

  const organization = await prisma.organization.findUnique({
    where: {
      id: userOrg?.organizationId,
    },
  });

  const [totalProjects, totalTasks, totalLeads] = await Promise.all([
    prisma.userProject.count({
      where: {
        userId: user?.id,
      },
    }),
    prisma.task.findMany({
      where: {
        assignedToId: user?.id,
      },
    }),
    prisma.lead.count({
      where: {
        createdById: user?.id,
      },
    }),
  ]);

  const logs = await prisma.activityLog.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      user: true,
      task: true,
      sprint: true,
    },
  });

  const feed: FeedItem[] = logs
    .filter((log) => log.task && log.user && log.sprint)
    .map((log) => ({
      kind: "task",
      id: log.id,
      createdAt: log.createdAt,
      title: log.task!.title,
      status: log.task!.status,
      user: {
        name: log.user!.name,
        image: log.user!.image,
      },
      sprint: {
        title: log.sprint!.title,
      },
    }));

  return (
    <>
      <UserProfilePage
        user={user!}
        organization={organization}
        totalProjects={totalProjects}
        totalLeads={totalLeads}
        tasks={totalTasks}
        feed={feed}
      />
    </>
  );
}
