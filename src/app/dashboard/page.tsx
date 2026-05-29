import MainDashboardSignedIn from "@/components/dashboards/MainDashboardSignedIn";
import { prisma } from "@/lib/prisma";
import { FeedItem } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  await wait(10000);

  if (!clerkUser) redirect("/sign-in");

  const now = new Date();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      userProjects: {
        include: { project: true },
      },
      membership: {
        include: { organization: true },
      },
    },
  });

  if (!dbUser) redirect("/sign-in");

  if (!dbUser.membership || dbUser.membership.length == 0) {
    redirect("/onboarding");
  }

  const userProjectIds = dbUser?.userProjects.map((up) => up.projectId);

  const activeSprints = await prisma.sprint.findMany({
    where: {
      projectId: { in: userProjectIds },
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      tasks: {
        select: { status: true },
      },
      project: {
        select: { name: true },
      },
    },
    orderBy: { endDate: "asc" },
  });

  const sprintProgress = activeSprints.map((sprint) => {
    const total = sprint.tasks.length;
    const completed = sprint.tasks.filter(
      (t) => t.status === "COMPLETED",
    ).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    const daysLeft = Math.ceil(
      (sprint.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      id: sprint.id,
      title: sprint.title,
      project: sprint.project?.name ?? "Unknown",
      total,
      completed,
      percent,
      daysLeft,
    };
  });

  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 14);

  const activeTasks = await prisma.task.findMany({
    where: {
      assignedToId: dbUser?.id,
      status: { not: "COMPLETED" },
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      sprint: { select: { title: true } },
      project: { select: { name: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  const taskStats = {
    total: activeTasks.length,
    // overdueTasks: activeTasks.filter((t) => t.dueDate && t.dueDate < now),
    dueTodayTasks: activeTasks.filter(
      (t) =>
        t.dueDate &&
        t.dueDate >= now &&
        t.dueDate.toDateString() === now.toDateString(),
    ),
    dueSoonTasks: activeTasks.filter(
      (t) => t.dueDate && t.dueDate > now && t.dueDate <= threeDaysFromNow,
    ),
    // noDueDateTasks: activeTasks.filter((t) => !t.dueDate),
  };

  const totalLeads = await prisma.lead.count();

  if (!dbUser) redirect("/sign-in");

  const firstName = clerkUser.firstName || "";
  const todayShort = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const orgProjects = await prisma.project.findMany({
    where: { organizationId: dbUser.membership[0].organizationId },
    select: { id: true },
  });

  const projectIds = orgProjects.map((p) => p.id);

  const recentTasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      title: true,
      status: true,
      createdAt: true,
      sprint: { select: { title: true } },
      createdBy: { select: { name: true, image: true } },
    },
  });

  const recentLeadActivity = await prisma.leadActivity.findMany({
    where: {
      lead: { organizationId: dbUser.membership[0].organizationId },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      type: true,
      note: true,
      createdAt: true,
      user: { select: { name: true, image: true } },
      lead: { select: { name: true } },
    },
  });

  const recentLeads = await prisma.lead.findMany({
    where: { organizationId: dbUser.membership[0].organizationId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      name: true,
      status: true,
      createdAt: true,
      assignedTo: { select: { name: true, image: true } },
      createdByUser: { select: { name: true, image: true } },
    },
  });

  const feed: FeedItem[] = [
    ...recentLeadActivity.map((a) => ({
      kind: "lead_activity" as const,
      createdAt: a.createdAt,
      type: a.type,
      note: a.note,
      user: a.user,
      lead: a.lead,
    })),
    ...recentLeads.map((l) => ({
      kind: "lead_created" as const,
      createdAt: l.createdAt,
      name: l.name,
      status: l.status,
      assignedTo: l.assignedTo,
      user: l.createdByUser,
    })),
    ...recentTasks.map((t) => ({
      kind: "task" as const,
      createdAt: t.createdAt,
      title: t.title,
      status: t.status,
      createdBy: t.createdBy,
      sprint: t.sprint,
      user: t.createdBy,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  const leadPipeline = await prisma.lead.groupBy({
    by: ["status"],
    where: { organizationId: dbUser.membership[0].organizationId },
    _count: { id: true },
  });

  const statusOrder = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
  ];

  const pipeline = statusOrder.map((status) => ({
    status,
    count: leadPipeline.find((l) => l.status === status)?._count.id ?? 0,
  }));

  return (
    <MainDashboardSignedIn
      firstName={firstName}
      todayShort={todayShort}
      user={dbUser}
      activeTasks={taskStats.total}
      totalLeads={totalLeads}
      feed={feed}
      sprintsDetails={sprintProgress}
      dueTasks={taskStats}
      pipelineData={pipeline}
    />
  );
}
