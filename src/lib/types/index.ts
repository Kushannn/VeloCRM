export interface OrganizationType {
  id: string;
  name: string;
  ownerId: string;
  // add any other fields you want to include here
}

export interface UserType {
  clerkId: string;
  email: string;
  name?: string;
  image?: string;
  ownedOrganizations?: OrganizationType[]; // add this line
}
