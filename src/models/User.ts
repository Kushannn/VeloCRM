export interface UserType {
  clerkId: string;
  email: string;
  name?: string;
  image?: string;
  role?: "user" | "admin";
  createdAt?: Date;
}
