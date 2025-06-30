"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
  addToast,
  Button,
} from "@heroui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { CircleUser, Plus } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import CreateProject from "@/components/project/createProject/CreateProject";
import debounce from "lodash/debounce";
import { ProjectType } from "@/lib/types";
import AddMemberModal from "@/components/project/AddMemberModal/AddMemberModal";
import { useAppSelector } from "@/redux/hooks";
import useFetchOrganization from "@/hooks/useFetchOrganization";
import useFetchOrgMembers from "@/hooks/useFetchOrgMembers";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const STATUS_DISPLAY: Record<string, string> = {
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
  };

  const user = useAppSelector((state) => state.auth.user);

  useFetchOrganization();
  useFetchOrgMembers();

  const organization = useAppSelector((state) => state.organization.currentOrg);
  const orgMembers = useAppSelector((state) => state.organization.members);

  const params = useParams() as { orgId: string };
  const orgId = params.orgId;

  const router = useRouter();

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div>
        {orgMembers.map((member) => {
          return (
            <Card className="bg-red-500 shadow-lg shadow-white/10">
              <CardBody className="bg-[#6554AF]">
                <div className="flex flex-row justify-between">
                  <div>
                    <img src={member?.user?.image!} />
                  </div>

                  <div>
                    <div className="text-md text-black font-semibold">
                      {member?.user.name}
                    </div>
                    <div className="text-sm text-white">
                      {member?.user.email}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-white">Birthday</div>
                    <div className="text-md text-black font-semibold">
                      13 Nov 2003
                    </div>
                  </div>

                  <div>
                    <div className="text-sm whiter">Age</div>
                    <div className="text-md text-black font-semibold">21</div>
                  </div>

                  <div>
                    <div className="text-sm white">Position</div>
                    <div className="text-md text-black font-semibold">
                      MERN STACK INTERN
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
