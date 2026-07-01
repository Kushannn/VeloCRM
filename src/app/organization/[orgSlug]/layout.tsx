import { redirect, notFound } from "next/navigation";
import {
  getOrgBySlugForUser,
  getCurrentUser,
} from "@/lib/utils/authorizeUserOrgProject";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const org = await getOrgBySlugForUser(orgSlug);
  if (!org) notFound();
  return <>{children}</>;
}
