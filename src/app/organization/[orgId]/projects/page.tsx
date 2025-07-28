"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import CreateProject from "@/components/project/createProject/CreateProject";
import AddMemberModal from "@/components/project/AddMemberModal/AddMemberModal";
import { useAppSelector } from "@/redux/hooks";
import useFetchOrganization from "@/hooks/useFetchOrganization";
import useFetchOrgMembers from "@/hooks/useFetchOrgMembers";
import ProjectBoard from "@/components/project/ProjectsBoard/ProjectBoard";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  useFetchOrganization();
  useFetchOrgMembers();

  const organization = useAppSelector((state) => state.organization.currentOrg);
  const orgMembers = useAppSelector((state) => state.organization.members);

  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [projectId, setProjectId] = useState("");

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-5xl">Projects</h1>
            <p className="text-sm mt-5 sm:text-2xl">
              Track all the projects here!
            </p>
          </div>

          <Button
            className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md shadow-purple-500/20"
            onClick={() => setOpenProjectModal(true)}
          >
            <Plus /> <span>Create New</span>
          </Button>
        </div>

        <ProjectBoard />
      </div>

      <CreateProject
        isOpen={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
      />

      <AddMemberModal
        isOpen={openAddMemberModal}
        onClose={() => setOpenAddMemberModal(false)}
        organization={organization}
        organizationMembers={orgMembers}
        projectId={projectId}
      />
    </>
  );
}
