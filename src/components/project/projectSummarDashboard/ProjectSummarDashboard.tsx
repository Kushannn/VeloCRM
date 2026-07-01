"use client";

import {
  toast,
  Select,
  Label,
  Description,
  ListBox,
  Header,
} from "@heroui/react";
import {
  CircleCheck,
  CirclePause,
  CircleUser,
  Plus,
  Zap,
  ArrowRight,
  NotebookText,
} from "lucide-react";
import CreateProject from "../createProject/CreateProject";
import AddMemberModal from "../AddMemberModal/AddMemberModal";
import { useRef, useState } from "react";
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
          toast.success("Status updated!");
        }
      } catch {
        toast.danger("Failed to update");
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
        toast.success("Project deleted successfully");
      } else {
        toast.danger("Failed to delete");
      }
    } catch {
      toast.danger("Failed to delete project");
    }
  };

  const filteredProjects = selectedProjectStatus
    ? projects.filter((p) => p.status === selectedProjectStatus)
    : projects;

  return (
    <>
      <div className="px-4 space-y-6 bg-[#09080f] min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#e8e4f0] mb-2">
              Projects
            </h1>
            <p className="text-sm text-[#7c6fa0]">
              Track all your projects here
            </p>
          </div>
          <button
            onClick={() => setOpenProjectModal(true)}
            className="  w-full sm:w-fit flex items-center justify-center gap-2 bg-[#6c3fc4] hover:bg-[#8b5cf6]hover:scale-105 text-[#ede8fb] text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-300 cursor-pointer"
          >
            <Plus size={16} />
            Create New
          </button>
        </div>

        {/* Status filter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              label: "Active",
              value: "ACTIVE",
              icon: Zap,
              color: "text-[#4ade80]",
              bg: "bg-[#14301e]",
              border: "border-[#4ade80]/20",
              activeBorder: "border-[#4ade80]/60",
            },
            {
              label: "On Hold",
              value: "ON_HOLD",
              icon: CirclePause,
              color: "text-[#fb923c]",
              bg: "bg-[#3a1f07]",
              border: "border-[#fb923c]/20",
              activeBorder: "border-[#fb923c]/60",
            },
            {
              label: "Completed",
              value: "COMPLETED",
              icon: CircleCheck,
              color: "text-[#8b5cf6]",
              bg: "bg-[#2d1d5e]",
              border: "border-[#8b5cf6]/20",
              activeBorder: "border-[#8b5cf6]/60",
            },
          ].map((stat) => {
            const isSelected = selectedProjectStatus === stat.value;
            const Icon = stat.icon;
            return (
              <div
                key={stat.value}
                onClick={() =>
                  setSelectedProjectStatus(isSelected ? "" : stat.value)
                }
                className={`cursor-pointer rounded-xl px-4 sm:px-5 py-4 border transition-all duration-200 flex items-center justify-between
                  ${
                    isSelected
                      ? `${stat.bg} ${stat.activeBorder}`
                      : "bg-[#110f1a] border-[#2a2040] hover:border-[#3d2d6b]"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isSelected ? stat.color : "text-[#7c6fa0]"}
                  />
                  <p
                    className={`text-lg sm:text-xl font-medium ${
                      isSelected ? stat.color : "text-[#e8e4f0]"
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
                <p
                  className={`text-2xl font-semibold ${isSelected ? stat.color : "text-[#e8e4f0]"}`}
                >
                  {projects.filter((p) => p.status === stat.value).length}
                </p>
              </div>
            );
          })}
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-[#7c6fa0] col-span-full py-12">
              No projects found.
            </p>
          ) : (
            filteredProjects.map((project: any, index: number) => {
              const statusConfig = {
                ACTIVE: {
                  color: "text-[#4ade80]",
                  bg: "bg-[#14301e]",
                  border: "border-[#4ade80]/20",
                },
                ON_HOLD: {
                  color: "text-[#fb923c]",
                  bg: "bg-[#3a1f07]",
                  border: "border-[#fb923c]/20",
                },
                COMPLETED: {
                  color: "text-[#8b5cf6]",
                  bg: "bg-[#2d1d5e]",
                  border: "border-[#8b5cf6]/20",
                },
              }[project.status as "ACTIVE" | "ON_HOLD" | "COMPLETED"] ?? {
                color: "text-[#7c6fa0]",
                bg: "bg-[#1a1232]",
                border: "border-[#2a2040]",
              };

              const isOwner = user.ownedOrganizations?.some(
                (org: any) =>
                  org.id === project.organizationId ||
                  org === project.organizationId,
              );

              return (
                <div
                  key={project.id || index}
                  className="bg-[#110f1a] border border-[#2a2040] hover:border-[#3d2d6b] rounded-xl p-5 flex flex-col gap-4 transition-colors duration-200"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2">
                    {isOwner ? (
                      <Select
                        value={project.status || "ACTIVE"}
                        onChange={(key) =>
                          handleProjectStatusChange(project.id, key as string)
                        }
                      >
                        <Select.Trigger
                          className={`text-xs font-medium px-2.5 py-1 rounded-xl border cursor-pointer outline-none min-h-0 h-fit
      ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}
                        >
                          <Select.Value
                            className={`text-xs font-medium ${statusConfig.color} mr-4`}
                          />
                          <Select.Indicator className="text-white/50" />
                        </Select.Trigger>
                        <Select.Popover className="bg-[#0e0c17] rounded-xl border border-white/10">
                          <ListBox>
                            <ListBox.Item
                              className=" w-full px-4 py-2.5 text-left hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                              id="ACTIVE"
                              textValue="Active"
                            >
                              <Label className="text-xs text-[#4ade80]">
                                Active
                              </Label>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item
                              id="ON_HOLD"
                              textValue="On Hold"
                              className="w-full px-4 py-2.5 text-left hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                            >
                              <Label className="text-xs text-[#fb923c] ">
                                On Hold
                              </Label>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item
                              className="w-full px-4 py-2.5 text-left hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                              id="COMPLETED"
                              textValue="Completed"
                            >
                              <Label className="text-xs text-[#8b5cf6] ">
                                Completed
                              </Label>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    ) : (
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}
                      >
                        {STATUS_DISPLAY[project.status] || "Status"}
                      </span>
                    )}

                    {/* Options menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenOptions(
                            openOptions === project.id ? null : project.id,
                          )
                        }
                        className="text-[#7c6fa0] hover:text-[#e8e4f0] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a2040] transition-colors text-lg font-bold"
                      >
                        ···
                      </button>
                      {openOptions === project.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl z-20 overflow-hidden">
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-[#b8aed4] hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                            onClick={() => {
                              setOpenAddMemberModal(true);
                              setOpenOptions(null);
                              setProjectId(project.id);
                            }}
                          >
                            Add member
                          </button>
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-[#b8aed4] hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                            onClick={() => setOpenOptions(null)}
                          >
                            Remove member
                          </button>
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-[#f87171] hover:bg-[#2d0f0f] transition-colors"
                            onClick={() => {
                              handleDeleteProject(project.id);
                              setOpenOptions(null);
                            }}
                          >
                            Delete project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project name + description */}
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#e8e4f0] mb-1 wrap-break-word">
                      {project.name}
                    </h2>
                    <p className="text-sm text-[#7c6fa0] leading-relaxed line-clamp-3 wrap-break-word">
                      {project.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0e0c17] border border-[#2a2040] rounded-xl px-3 py-2.5 flex items-center gap-3">
                      <Zap size={16} className={statusConfig.color} />
                      <div>
                        <p className="text-[11px] text-[#7c6fa0]">Sprints</p>
                        <p className="text-base font-semibold text-[#e8e4f0]">
                          {project._count.sprints || 0}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#0e0c17] border border-[#2a2040] rounded-xl px-3 py-2.5 flex items-center gap-3">
                      <NotebookText size={16} className={statusConfig.color} />
                      <div>
                        <p className="text-[11px] text-[#7c6fa0]">Tasks</p>
                        <p className="text-base font-semibold text-[#e8e4f0]">
                          {project._count.tasks || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between pt-2 border-t border-[#2a2040]">
                    <div className="flex items-center">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2d1d5e] border-2 border-[#09080f] flex items-center justify-center ${i !== 0 ? "-ml-2" : ""}`}
                        >
                          <CircleUser
                            size={14}
                            className="sm:w-3.5 sm:h-3.5 text-[#c4a8f5]"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        router.push(
                          `/organization/${orgSlug}/projects/${project.slug}`,
                        )
                      }
                      className="flex items-center gap-1.5 text-sm text-[#8b5cf6] hover:text-[#c4a8f5] transition-colors font-medium cursor-pointer"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <CreateProject
        isOpen={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
        onSuccess={() => router.refresh()}
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
