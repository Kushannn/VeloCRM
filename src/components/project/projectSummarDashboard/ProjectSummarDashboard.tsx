"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import {
  CircleCheck,
  CirclePause,
  CircleUser,
  Pause,
  Plus,
  Zap,
} from "lucide-react";
import CreateProject from "../createProject/CreateProject";
import AddMemberModal from "../AddMemberModal/AddMemberModal";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

type Props = {
  orgId: string;
  orgSlug: string;
  projects: any[];
  organization: any;
  organizationMembers: any[];
  user: any;
};

export default function ProjectSummaryDashboard({
  orgId,
  orgSlug,
  projects: initialProjects,
  organization,
  organizationMembers,
  user,
}: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openOptions, setOpenOptions] = useState<string | null>(null);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [selectedProjectStatus, setSelectedProjectStatus] = useState("ACTIVE");

  const router = useRouter();

  const STATUS_DISPLAY: Record<string, string> = {
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
  };

  const debouncedStatusUpdate = useRef(
    debounce(async (projectId: string, newStatus: string) => {
      try {
        const res = await fetch(
          `/api/project/${projectId}/upate-project-status`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          },
        );

        const data = await res.json();

        if (data.success) {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === projectId ? { ...p, status: newStatus } : p,
            ),
          );

          addToast({
            title: "Status updated!",
            color: "success",
          });
        }
      } catch {
        addToast({
          title: "Failed to update",
          color: "danger",
        });
      }
    }, 2000),
  ).current;

  const handleProjectStatusChange = (id: string, status: string) => {
    debouncedStatusUpdate(id, status);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/project/${projectId}/delete-project`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        addToast({ title: "Project deleted successfully", color: "success" });
      } else {
        addToast({ title: data.error || "Failed to delete", color: "danger" });
      }
    } catch {
      addToast({ title: "Failed to delete project", color: "danger" });
    }
  };

  const filteredProjects = selectedProjectStatus
    ? projects.filter((p) => p.status === selectedProjectStatus)
    : projects;

  console.log("user owned org ", user);
  console.log("projects ", projects);

  return (
    <>
      <div className="px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl">Projects</h1>
            <p className="text-sm sm:text-base">Track all the projects here!</p>
          </div>
          <Button
            className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800   shadow-md shadow-purple-500/20"
            onClick={() => setOpenProjectModal(true)}
          >
            <Plus /> <span>Create New</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[
            {
              label: "Active",
              value: "ACTIVE",
              cardClass:
                "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-colors border-t-2 border-t-emerald-500/60",
              emoji: Zap,
              activeColor: "text-emerald-400",
            },
            {
              label: "On Hold",
              value: "ON_HOLD",
              cardClass:
                "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-colors border-t-2 border-t-amber-500/60",
              emoji: CirclePause,
              activeColor: "text-amber-400",
            },
            {
              label: "Completed",
              value: "COMPLETED",
              cardClass:
                "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-colors border-t-2 border-t-violet-500/60",
              emoji: CircleCheck,
              activeColor: "text-violet-400",
            },
          ].map((stat, idx) => {
            const isSelected = selectedProjectStatus === stat.value;
            return (
              <Card
                key={idx}
                isPressable
                onClick={() =>
                  setSelectedProjectStatus(isSelected ? "" : stat.value)
                }
                className={`${stat.cardClass} ${isSelected ? "ring-1 ring-white/20" : ""}`}
              >
                <CardBody className="flex flex-row justify-between items-center px-4 py-3">
                  <div className="flex items-center gap-3">
                    <stat.emoji
                      size={20}
                      className={isSelected ? stat.activeColor : "text-white"}
                    />
                    <p className="text-base font-medium">{stat.label}</p>
                  </div>
                  <div
                    className={`text-xl font-bold ${isSelected ? stat.activeColor : "text-white"}`}
                  >
                    {projects.filter((p) => p.status === stat.value).length}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No projects found.
            </p>
          ) : (
            filteredProjects.map((project: any, index: number) => (
              <Card
                key={project.id || index}
                className={`w-sm p-4 bg-[#191919] `}
              >
                <CardHeader className="flex justify-between items-center">
                  {user.ownedOrganizations?.map(
                    (org: any) =>
                      org.id === project.organizationId ||
                      org === project.organizationId,
                  ) ? (
                    <select
                      defaultValue={project.status || "ACTIVE"}
                      onChange={(e) =>
                        handleProjectStatusChange(project.id, e.target.value)
                      }
                      className="p-2 cursor-pointer   shadow-lg rounded-md z-10 bg-white/10 backdrop-blur-md border border-white/20 text-sm"
                    >
                      <option
                        className="bg-black backdrop-blur-md  "
                        value="ACTIVE"
                      >
                        Active
                      </option>
                      <option
                        className="bg-black backdrop-blur-md  "
                        value="ON_HOLD"
                      >
                        On Hold
                      </option>
                      <option
                        className="bg-black backdrop-blur-md  "
                        value="COMPLETED"
                      >
                        Completed
                      </option>
                    </select>
                  ) : (
                    <Chip
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black  ",
                      }}
                    >
                      {STATUS_DISPLAY[project.status] || "Status"}
                    </Chip>
                  )}

                  <span
                    className="relative cursor-pointer text-2xl font-bold"
                    onClick={() =>
                      setOpenOptions(
                        openOptions === project.id ? null : project.id,
                      )
                    }
                  >
                    ...
                    {openOptions === project.id && (
                      <div className="absolute right-0 mt-2 w-40   shadow-lg rounded-md z-10 bg-white/10 backdrop-blur-md border border-white/20 text-sm">
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
                            handleDeleteProject(project.id);
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
                  <h1 className="  text-xl font-bold">{project.name}</h1>
                  <p className="text-sm text-gray-300 pt-2">
                    {project.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {/* <Card className="flex-1 bg-[#62A388]"> */}
                    <Card className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl  ">
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
                        `/organization/${orgSlug}/projects/${project.slug}`,
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
        organizationMembers={organizationMembers}
        projectId={projectId}
      />
    </>
  );
}
