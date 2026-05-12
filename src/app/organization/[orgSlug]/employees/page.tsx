import { Card, CardBody } from "@heroui/react";
import { notFound, useParams } from "next/navigation";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { prisma } from "@/lib/prisma";
import { EmployeeDetails } from "@/components/employeeDetails/EmployeeDetails";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });

  const members = await prisma.userOrganization.findMany({
    where: { organizationId: organization?.id },
    include: { user: true },
  });

  if (!organization) return notFound();

  return (
    <>
      <EmployeeDetails members={members} organization={organization} />
    </>
  );
}
