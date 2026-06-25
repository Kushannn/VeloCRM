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
  params: Promise<{ projectSlug: string; orgSlug: string }>;
}) {
  const { projectSlug, orgSlug } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const projectMembership = getProjectMembership(projectSlug, orgSlug);

  return <>{children}</>;
}
