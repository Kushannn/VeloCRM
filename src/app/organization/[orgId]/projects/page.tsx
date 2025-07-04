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

  const [openProjectModal, setOpenProjectModal] = useState(false);
  const params = useParams() as { orgId: string };
  const orgId = params.orgId;
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const [openOptions, setOpenOptions] = useState<string | null>(null);

  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);

  const [projectId, setProjectId] = useState("");

  const router = useRouter();

  useEffect(() => {
    // const getOrganizationMembers = async () => {
    //   if (!orgId) return;

    //   try {
    //     const res = await fetch(
    //       `/api/organization/get-organization-members/${orgId}`
    //     );
    //     const data = await res.json();

    //     if (data.success) {
    //       setOrgMembers(data.members);
    //     }
    //   } catch (error) {
    //     console.log("Error fetching organization members", error);
    //   }
    // };

    const getProjects = async () => {
      if (!orgId) return;

      try {
        const res = await fetch(`/api/project/get-projects/${orgId}`);
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    getProjects();
    // getOrganizationMembers();
  }, []);

  const debouncedStatusUpdate = useRef(
    debounce(async (projectId: string, newStatus: string) => {
      try {
        const res = await fetch(
          `/api/project/${projectId}/upate-project-status`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
        );
        if (!res.ok) {
          throw new Error("Failed to update project status");
        }
        const data = await res.json();

        if (data.success) {
          setProjects((prevProjects) =>
            prevProjects?.map((project) =>
              project.id === projectId
                ? { ...project, status: newStatus }
                : project
            )
          );

          addToast({
            title: "Status updated edited!",
            variant: "solid",
            color: "success",
          });
        }
      } catch (err) {
        addToast({
          title: "Failed to update status.",
          variant: "solid",
          color: "danger",
        });
        console.error("Debounced status update failed:", err);
      }
    }, 2000)
  ).current;

  const handleProjectStatusChange = (projectId: string, newStatus: string) => {
    debouncedStatusUpdate(projectId, newStatus);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl">Projects</h1>
            <p className="text-sm sm:text-base">Track all the projects here!</p>
          </div>
          <Button
            className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md shadow-purple-500/20"
            onClick={() => setOpenProjectModal(true)}
          >
            <Plus /> <span>Create New</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[
            {
              label: "Active",
              color: "from-[#0d9488] via-[#0e7490] to-[#1e40af]",
              text: "#dbeafe",
            },
            {
              label: "On Hold",
              color: "from-[#f59e0b] via-[#ea580c] to-[#b91c1c]",
              text: "#fef3c7",
            },
            {
              label: "Completed",
              color: "from-[#15803d] via-[#115e59] to-[#164e63]",
              text: "#bbf7d0",
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className={`w-full bg-gradient-to-br ${stat.color} text-[${stat.text}] h-20`}
            >
              <CardBody className="flex flex-row justify-between items-center px-4 py-3">
                <div className="flex flex-col">
                  <p className="text-xl">{stat.label}</p>
                  <p className="text-sm">{stat.label} Projects</p>
                </div>
                <div className="text-xl">12</div>
              </CardBody>
              <Divider />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No projects found.
            </p>
          ) : (
            projects.map((project: any, index: number) => (
              <Card
                key={project.id || index}
                className={`w-sm p-4 ${
                  project.status === "ACTIVE"
                    ? "bg-gradient-to-tr from-[#0d9488] via-[#0e7490] to-[#1e40af]"
                    : project.status === "ON HOLD"
                    ? "bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#b91c1c]"
                    : project.status === "COMPLETED"
                    ? "bg-gradient-to-tl from-[#15803d] via-[#115e59] to-[#164e63]"
                    : "bg-gray-600 text-white"
                }`}
              >
                <CardHeader className="flex justify-between items-center">
                  {user.ownedOrganizations?.some(
                    (org: any) =>
                      org.id === project.organizationId ||
                      org === project.organizationId
                  ) ? (
                    <select
                      defaultValue={project.status || "ACTIVE"}
                      onChange={(e) =>
                        handleProjectStatusChange(project.id, e.target.value)
                      }
                      className="p-2 cursor-pointer text-white shadow-lg rounded-md z-10 bg-white/10 backdrop-blur-md border border-white/20 text-sm"
                    >
                      <option
                        className="bg-black backdrop-blur-md text-white"
                        value="ACTIVE"
                      >
                        Active
                      </option>
                      <option
                        className="bg-black backdrop-blur-md text-white"
                        value="ON_HOLD"
                      >
                        On Hold
                      </option>
                      <option
                        className="bg-black backdrop-blur-md text-white"
                        value="COMPLETED"
                      >
                        Completed
                      </option>
                    </select>
                  ) : (
                    <Chip
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      {STATUS_DISPLAY[project.status] || "Status"}
                    </Chip>
                  )}

                  <span
                    className="relative cursor-pointer text-2xl font-bold"
                    onClick={() =>
                      setOpenOptions(
                        openOptions === project.id ? null : project.id
                      )
                    }
                  >
                    ...
                    {openOptions === project.id && (
                      <div className="absolute right-0 mt-2 w-40 text-white shadow-lg rounded-md z-10 bg-white/10 backdrop-blur-md border border-white/20 text-sm">
                        <button
                          className="block w-full px-4 py-2 text-left"
                          onClick={() => {
                            setOpenAddMemberModal(true);
                            setOpenOptions(null);
                            setProjectId(project.id);
                          }}
                        >
                          Add new member
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left"
                          onClick={() => {
                            console.log("Edit clicked");
                            setOpenOptions(null);
                          }}
                        >
                          Remove a member
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left"
                          onClick={() => {
                            console.log("Delete clicked");
                            setOpenOptions(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </span>
                </CardHeader>

                <CardBody>
                  <h1 className="text-white text-xl font-bold">
                    {project.name}
                  </h1>
                  <p className="text-sm text-gray-300 pt-2">
                    {project.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {/* <Card className="flex-1 bg-[#62A388]"> */}
                    <Card className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl text-white">
                      <CardBody className="flex flex-col justify-between items-center">
                        Sprints <span>{project.sprints || 0}</span>
                      </CardBody>
                    </Card>
                    <Card className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl text-white">
                      <CardBody className="flex flex-col justify-between items-center">
                        Tasks <span>{project.tasks || 0}</span>
                      </CardBody>
                    </Card>
                  </div>
                </CardBody>

                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(3)].map((_, i) => (
                      <CircleUser
                        key={i}
                        width={32}
                        height={32}
                        className={`${i !== 0 ? "-ml-2" : ""}`}
                      />
                    ))}
                  </div>

                  <div
                    onClick={() =>
                      router.push(
                        `/organization/${orgId}/projects/${project.id}`
                      )
                    }
                    className="cursor-pointer hover:bg-white/10 px-4 py-2 rounded-md text-white font-bold"
                  >
                    View Details
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
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
