export interface OrganizationType {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
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
  name?: string;
  image?: string | null;
  role: string;
  // createdAt: string;
  ownedOrganizations?: OrganizationType[];
  membership?: MembershipType | null;
}

// export interface SprintType {
//   id: string;
//   title: string;
//   description?: string;
//   startDate: Date;
//   endDate: Date;
//   createdAt: Date;

//   createdById: string;
//   organizationId: string;
//   projectId: string;
// }

export interface TaskType {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  sprintId: string;
  projectId?: string;
  assignedToId?: string;
  createdById: string;
}

export interface SprintType {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;

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
  user: UserType;
}

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  projectUsers: ProjectUserType[];
  sprints: SprintType[];
}
