"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
  addToast,
} from "@heroui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { CircleUser, Plus } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import CreateProject from "@/components/project/createProject/CreateProject";
import debounce from "lodash/debounce";
import { ProjectType } from "@/lib/types";
import AddMemberModal from "@/components/project/AddMemberModal/AddMemberModal";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

export default function DashboardPage() {
  const STATUS_DISPLAY: Record<string, string> = {
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
  };

  const user = useAppSelector((state) => state.auth.user);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const params = useParams() as { orgId: string };
  const orgId = params.orgId;
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const [organization, setOrganization] = useState<any>(null);

  const [openOptions, setOpenOptions] = useState<string | null>(null);

  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);

  const [orgMembers, setOrgMembers] = useState<
    {
      id: string;
      role: string;
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
      };
    }[]
  >([]);

  useEffect(() => {
    const getOrganization = async () => {
      if (!orgId) return;

      try {
        const res = await fetch(`/api/organization/get-organization/${orgId}`);
        const data = await res.json();
        if (data.success) {
          setOrganization(data);
        }
      } catch (err) {
        console.error("Error fetching organization:", err);
      }
    };

    const getOrganizationMembers = async () => {
      if (!orgId) return;

      try {
        const res = await fetch(
          `/api/organization/get-organization-members/${orgId}`
        );
        const data = await res.json();

        if (data.success) {
          setOrgMembers(data.members);
        }
      } catch (error) {
        console.log("Error fetching organization members", error);
      }
    };

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
    getOrganization();
    getOrganizationMembers();
  }, []);

  useEffect(() => {
    console.log("user", user);
  });

  const debouncedStatusUpdate = useRef(
    debounce(async (projectId: string, newStatus: string) => {
      try {
        const res = await fetch(
          `/api/project/upate-project-status/${projectId}`,
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
      <div className="p-4 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl">Projects</h1>
            <p className="text-sm sm:text-base">Track all the projects here!</p>
          </div>
          <button
            className="flex items-center gap-2 bg-[#0a2540cc] text-sky-300 hover:bg-black p-2 rounded-md font-bold"
            onClick={() => setOpenProjectModal(true)}
          >
            <Plus /> <span>Create New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[
            {
              label: "Active",
              color: "from-[#3a7bd5] to-[#3a6073]",
              text: "#dbeafe",
            },
            {
              label: "On Hold",
              color: "from-[#FF512F] to-[#F09819]",
              text: "#fef3c7",
            },
            {
              label: "Completed",
              color: "from-[#11998e] to-[#38ef7d]",
              text: "#bbf7d0",
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className={`w-full bg-gradient-to-br ${stat.color} text-[${stat.text}]`}
            >
              <CardBody className="flex flex-row justify-between items-center px-4 py-6">
                <div className="flex flex-col">
                  <p className="text-2xl">{stat.label}</p>
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
                className={`w-full p-4 ${
                  project.status === "ACTIVE"
                    ? "bg-gradient-to-br from-[#3a7bd5] to-[#3a6073] text-[#dbeafe]"
                    : project.status === "ON HOLD"
                    ? "bg-gradient-to-br from-[#FF512F] to-[#F09819] text-[#fef3c7]"
                    : project.status === "COMPLETED"
                    ? "bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-[#bbf7d0]"
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
                      className="bg-gray-700 text-white rounded-md p-2 cursor-pointer"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
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
                      <div className="absolute right-0 mt-2 w-40 bg-white text-white shadow-lg rounded-md z-10 bg-gradient-to-br from-[#232526] to-[#414345] text-sm">
                        <button
                          className="block w-full px-4 py-2 text-left"
                          onClick={() => {
                            setOpenAddMemberModal(true);
                            setOpenOptions(null);
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
                    <Card className="flex-1 bg-gray-700">
                      <CardBody className="flex justify-between items-center">
                        Sprints <span>{project.sprints || 0}</span>
                      </CardBody>
                    </Card>
                    <Card className="flex-1 bg-gray-700">
                      <CardBody className="flex justify-between items-center">
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

                  <Link
                    href={`/organization/${orgId}/projects/${project.id}`}
                    className="cursor-pointer hover:bg-gray-800 px-4 py-2 rounded-md text-white font-bold"
                  >
                    View Details
                  </Link>
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
      />
    </>
  );
}
