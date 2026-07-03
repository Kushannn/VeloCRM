"use client";

import { toast } from "@heroui/react";
import { CircleCheck, CirclePause, Plus, Zap } from "lucide-react";
import CreateProject from "../createProject/CreateProject";
import AddMemberModal from "../AddMemberModal/AddMemberModal";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import ProjectMembersModal from "./ProjectMembersModal";
import SingleProjectCard from "./SingleProjectCard";

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

  //Below are for infinite scroll
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [membersPage, setMembersPage] = useState(1);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersHasMore, setMembersHasMore] = useState(true);

  const openMembersModal = (project: any) => {
    setSelectedProjectId(project.id);
    setProjectMembers(project.projectUsers.map((pu: any) => pu.user));
    setMembersPage(1);
    setMembersHasMore(
      project._count.projectUsers > project.projectUsers.length,
    );
  };

  const closeMembersModal = () => {
    setSelectedProjectId(null);
    setProjectMembers([]);
    setMembersPage(1);
    setMembersHasMore(true);
  };

  const loadMoreMembers = useCallback(async () => {
    if (membersLoading || !membersHasMore || !selectedProjectId) return;
    setMembersLoading(true);

    try {
      const res = await fetch(
        `/api/project/${selectedProjectId}/get-more-members/?page=${membersPage + 1}&limit=20`,
      );
      const data = await res.json();
      const newMembers = data.members ?? [];

      if (newMembers.length === 0) {
        setMembersHasMore(false);
      } else {
        setProjectMembers((prev) => [...prev, ...newMembers]);
        setMembersPage((p) => p + 1);
      }
    } catch {
      toast.danger("Failed to load members");
    } finally {
      setMembersLoading(false);
    }
  }, [membersPage, membersLoading, membersHasMore, selectedProjectId]);

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

  const refreshProject = async (id: string) => {
    const res = await fetch(`/api/project/${id}`);
    const updatedProject = await res.json();

    setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));
  };

  return (
    <>
      <div className="px-4 space-y-6 bg-[#09080f] min-h-screen">
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
            filteredProjects.map((project: any, index: number) => (
              <SingleProjectCard
                key={project.id}
                project={project}
                orgSlug={orgSlug}
                user={user}
                openOptions={openOptions}
                setOpenOptions={setOpenOptions}
                onStatusChange={handleProjectStatusChange}
                onDelete={handleDeleteProject}
                onAddMember={(id) => {
                  setOpenAddMemberModal(true);
                  setProjectId(id);
                }}
                onOpenMembers={openMembersModal}
              />
            ))
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
        refreshProject={refreshProject}
      />

      <ProjectMembersModal
        isOpen={!!selectedProjectId}
        members={projectMembers}
        isLoading={membersLoading}
        onClose={closeMembersModal}
        onLoadMore={loadMoreMembers}
      />
    </>
  );
}
