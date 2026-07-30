import MainDashboardSignedIn from "@/components/dashboards/MainDashboardSignedIn";
import { prisma } from "@/lib/prisma";
import { FeedItem } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: Promise<{ orgSlug: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { orgSlug } = await params;

  const [org, clerkUser] = await Promise.all([
    prisma.organization.findUnique({
      where: { slug: orgSlug },
      select: { id: true },
    }),
    currentUser(),
  ]);

  if (!clerkUser) redirect("/sign-in");

  const now = new Date();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      userProjects: {
        select: {
          projectId: true,
          project: { select: { organizationId: true } },
        },
      },
      membership: {
        select: { organizationId: true },
      },
    },
  });

  if (!dbUser) redirect("/sign-in");

  if (!dbUser.membership || dbUser.membership.length === 0) {
    redirect("/onboarding");
  }

  // Validate the org id in the URL against actual memberships — never trust
  // the param blindly, since a user could type any id into the address bar.
  const activeMembership = dbUser.membership.find(
    (m) => m.organizationId === org?.id,
  );

  if (!activeMembership) {
    redirect("/"); // let the landing page resolve a valid org for them
  }

  const activeOrgId = activeMembership.organizationId;

  const userProjectIds = dbUser.userProjects
    .filter((up) => up.project.organizationId === activeOrgId)
    .map((up) => up.projectId);

  // const activeSprints = await prisma.sprint.findMany({
  //   where: {
  //     projectId: { in: userProjectIds },
  //     startDate: { lte: now },
  //     endDate: { gte: now },
  //   },
  //   include: {
  //     tasks: { select: { status: true } },
  //     project: { select: { name: true } },
  //   },
  //   orderBy: { endDate: "asc" },
  // });

  const [
    activeSprints,
    activeTasks,
    recentSprints,
    recentTasks,
    recentLeadActivity,
    leadPipeline,
  ] = await Promise.all([
    prisma.sprint.findMany({
      where: {
        projectId: { in: userProjectIds },
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        tasks: { select: { status: true } },
        project: { select: { name: true } },
      },
      orderBy: { endDate: "asc" },
    }),
    prisma.task.findMany({
      where: {
        assignedToId: dbUser.id,
        status: { not: "COMPLETED" },
        project: { organizationId: activeOrgId },
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
    }),
    prisma.sprint.findMany({
      where: { projectId: { in: userProjectIds } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        title: true,
        createdAt: true,
        project: { select: { name: true } },
        endDate: true,
        createdBy: { select: { name: true, image: true } },
      },
    }),
    prisma.task.findMany({
      where: { project: { organizationId: activeOrgId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        title: true,
        status: true,
        createdAt: true,
        sprint: { select: { title: true } },
        createdBy: { select: { name: true, image: true } },
      },
    }),
    prisma.leadActivity.findMany({
      where: { lead: { organizationId: activeOrgId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        type: true,
        note: true,
        createdAt: true,
        previousStatus: true, // needed for STATUS_CHANGE transition
        newStatus: true, // needed for STATUS_CHANGE transition
        user: { select: { id: true, name: true, image: true } },
        lead: { select: { id: true, name: true } }, // id needed, not just name
      },
    }),
    // prisma.lead.findMany({
    //   where: { organizationId: activeOrgId },
    //   orderBy: { createdAt: "desc" },
    //   take: 10,
    //   select: {
    //     name: true,
    //     status: true,
    //     createdAt: true,
    //     assignedTo: { select: { name: true, image: true } },
    //     createdByUser: { select: { name: true, image: true } },
    //   },
    // }),
    prisma.lead.groupBy({
      by: ["status"],
      where: { organizationId: activeOrgId },
      _count: { id: true },
    }),
  ]);

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

  // const activeTasks = await prisma.task.findMany({
  //   where: {
  //     assignedToId: dbUser.id,
  //     status: { not: "COMPLETED" },
  //     project: { organizationId: activeOrgId },
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     status: true,
  //     priority: true,
  //     dueDate: true,
  //     sprint: { select: { title: true } },
  //     project: { select: { name: true } },
  //   },
  //   orderBy: { dueDate: "asc" },
  // });

  const taskStats = {
    total: activeTasks.length,
    dueTodayTasks: activeTasks.filter(
      (t) =>
        t.dueDate &&
        t.dueDate >= now &&
        t.dueDate.toDateString() === now.toDateString(),
    ),
    dueSoonTasks: activeTasks.filter(
      (t) => t.dueDate && t.dueDate > now && t.dueDate <= threeDaysFromNow,
    ),
  };

  const firstName = clerkUser.firstName || "";
  const todayShort = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  // const orgProjects = await prisma.project.findMany({
  //   where: { organizationId: activeOrgId },
  //   select: { id: true },
  // });

  // const projectIds = orgProjects.map((p) => p.id);

  // const recentProjects = await prisma.project.findMany({
  //   where: { organizationId: activeOrgId },
  //   orderBy:{createdAt:"desc"},
  //   take:10,
  //   select:{
  //     name:true,
  //     status:true,
  //   }
  // });

  // const recentSprints = await prisma.sprint.findMany({
  //   where: { organizationId: activeOrgId },
  //   orderBy: { createdAt: "desc" },
  //   take: 10,
  //   select: {
  //     title: true,
  //     status: true,
  //   },
  // });

  // const recentTasks = await prisma.task.findMany({
  //   where: { project: { organizationId: activeOrgId } },
  //   orderBy: { createdAt: "desc" },
  //   take: 10,
  //   select: {
  //     title: true,
  //     status: true,
  //     createdAt: true,
  //     sprint: { select: { title: true } },
  //     createdBy: { select: { name: true, image: true } },
  //   },
  // });

  // const recentLeadActivity = await prisma.leadActivity.findMany({
  //   where: { lead: { organizationId: activeOrgId } },
  //   orderBy: { createdAt: "desc" },
  //   take: 10,
  //   select: {
  //     type: true,
  //     note: true,
  //     createdAt: true,
  //     user: { select: { name: true, image: true } },
  //     lead: { select: { name: true } },
  //   },
  // });

  // const recentLeads = await prisma.lead.findMany({
  //   where: { organizationId: activeOrgId },
  //   orderBy: { createdAt: "desc" },
  //   take: 10,
  //   select: {
  //     name: true,
  //     status: true,
  //     createdAt: true,
  //     assignedTo: { select: { name: true, image: true } },
  //     createdByUser: { select: { name: true, image: true } },
  //   },
  // });

  const feed: FeedItem[] = [
    ...recentLeadActivity.map((a) => ({
      kind: "lead_activity" as const,
      createdAt: a.createdAt,
      type: a.type,
      activityType: a.type, // matches LeadActivityFeed's duplicate field
      note: a.note,
      user: a.user,
      lead: a.lead,
      transition:
        a.previousStatus && a.newStatus
          ? { from: a.previousStatus, to: a.newStatus }
          : undefined,
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
    ...recentSprints.map((s) => ({
      kind: "sprint_created" as const,
      createdAt: s.createdAt,
      title: s.title,
      project: s.project,
      user: s.createdBy,
      endDate: s.endDate,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  // const leadPipeline = await prisma.lead.groupBy({
  //   by: ["status"],
  //   where: { organizationId: activeOrgId },
  //   _count: { id: true },
  // });

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

  //Calculating total , since we already have per status sum of leads
  const totalLeads = pipeline.reduce((sum, p) => sum + p.count, 0);

  return (
    <MainDashboardSignedIn
      orgId={org!.id}
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
