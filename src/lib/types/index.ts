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
  createdAt: string;
  ownedOrganizations?: OrganizationType[];
  membership?: MembershipType | null;
}

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}
