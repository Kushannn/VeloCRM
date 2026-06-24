import { LeadActivityType } from "@prisma/client";

export interface OrganizationType {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  slug: string;
}

export interface MembershipType {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  organization: OrganizationType;
}

export interface UserType {
  id: string;
  clerkId: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: string | null;
  // createdAt: string;
  ownedOrganizations?: OrganizationType[];
  membership?: MembershipType[] | null;
}

export type TaskStatus = "IN_PROGRESS" | "PENDING" | "COMPLETED";

export interface ColumnType {
  key: TaskStatus;
  label: string;
  tasks: TaskType[];
  dot: string;
  badge: string;
  empty: string;
}

export interface TaskType {
  id: string;
  title: string;
  description?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
  sprintId: string;
  projectId?: string | null;
  assignedToId?: string | null;
  createdById: string;
  dueDate: Date | null;
}

export interface SprintType {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  slug: string;

  createdById: string;
  organizationId: string;
  projectId: string;

  createdBy?: UserType;
  organization?: OrganizationType;
  project?: ProjectType;
  tasks?: TaskType[];
}

export interface ProjectUserType {
  id: string;
  userId: string;
  projectId: string;
  user: UserType | null;
}

export interface ProjectType {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: Date;
  // updatedAt: Date;
  organizationId: string;
  projectUsers: ProjectUserType[];
  sprints: SprintType[] | null;
}

export interface Leads {
  id: string;
  name: string;
  // role: string;
  status: string;
  email: string | null;
  source: string;
  company: string | null;
  phone: string | null;
  notes: string | null;
  expectedClose: Date | null;
}

type BaseActivity = {
  createdAt: Date;
};

type LeadActivityFeed = BaseActivity & {
  kind: "lead_activity";
  type: LeadActivityType;
  note: string | null;
  user: { name: string | null; image: string | null };
  lead: { name: string };
};

type LeadCreatedFeed = BaseActivity & {
  kind: "lead_created";
  name: string;
  status: string;
  assignedTo: { name: string | null } | null;
  user: { name: string | null; image: string | null };
};

type TaskFeed = BaseActivity & {
  kind: "task";
  title: string;
  status: TaskStatus;
  user: { name: string | null; image: string | null };
  sprint: { title: string };
};

export type FeedItem = LeadActivityFeed | LeadCreatedFeed | TaskFeed;

export type TaskStats = {
  total: number;
  // overdueTask: {
  //
  // }[];
  dueTodayTasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: Date | null;
    sprint: { title: string };
    project: { name: string } | null;
  }[];
  dueSoonTasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: Date | null;
    sprint: { title: string };
    project: { name: string } | null;
  }[];
  // noDueDateTasks: typeof overdueTask;
};

export type SprintsCompactDetailsForDashboard = {
  id: string;
  title: string;
  project: string;
  total: number;
  completed: number;
  percent: number;
  daysLeft: number;
};
