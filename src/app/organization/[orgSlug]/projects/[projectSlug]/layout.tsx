import { redirect, notFound } from "next/navigation";
import {
  getProjectMembership,
  getCurrentUser,
} from "@/lib/utils/authorizeUserOrgProject";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectSlug: string; organizationSlug: string }>;
}) {
  const { projectSlug, organizationSlug } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const projectMembership = getProjectMembership(projectSlug, organizationSlug);

  return <>{children}</>;
}
