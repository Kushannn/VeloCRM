"use client";

import CreateSprint from "@/components/sprint/createSprint/CreateSprint";
import { ProjectType, TaskType, UserType } from "@/lib/types";
import { Chip } from "@heroui/react";
import { Calendar, ChevronLeft, ChevronRight, Plus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectDetailsMetricCards from "./ProjectDetailMetricCards";
import ProjectSprintCarousel from "./ProjectSprintCarousel/ProjectSprintCarousel";
import { useState } from "react";
import { ProjectActivityLogs } from "./ProjectActivityLogs/ProjectActivityLogs";
import { ProjectSprintVelocity } from "./ProjectSprintVelocity/ProjectSprintVelocity";
import { ProjectTaskOverview } from "./ProjectTaskOverview/ProjectTaskOverview";

const PAGE_SIZE = 4;

type ProjectWithExtras = ProjectType & {
  tasks: TaskType[];
  _count: {
    tasks: number;
  };
};

type Props = {
  project: ProjectWithExtras | null;
  orgSlug: string;
  projectSlug: string;
  user: UserType | null;
};

export default function SingleProjectDetails({
  project,
  orgSlug,
  projectSlug,
  user,
}: Props) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [animating, setAnimating] = useState(false);
  const totalPages = Math.ceil((project?.sprints?.length ?? 0) / PAGE_SIZE);
  const visibleSprints = project?.sprints?.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const [openSprintModal, setOpenSprintModal] = useState(false);

  //Function for the nextpage animation of sprints
  function goNext() {
    if (animating) return;
    setDirection(1);
    setAnimating(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setAnimating(false);
    }, 250);
  }

  //Function for the prevpage animation of sprints
  function goPrev() {
    if (animating) return;
    setDirection(-1);
    setAnimating(true);
    setTimeout(() => {
      setPage((p) => p - 1);
      setAnimating(false);
    }, 250);
  }

  function getStatusConfig(status: string | undefined) {
    switch (status) {
      case "ACTIVE":
        return {
          label: "Active",
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/30",
          dot: "bg-emerald-400",
        };
      case "ON_HOLD":
        return {
          label: "On Hold",
          color: "text-amber-400",
          bg: "bg-amber-500/10 border-amber-500/30",
          dot: "bg-amber-400",
        };
      case "COMPLETED":
        return {
          label: "Completed",
          color: "text-violet-400",
          bg: "bg-violet-500/10 border-violet-500/30",
          dot: "bg-violet-400",
        };
      default:
        return {
          label: status ?? "Unknown",
          color: "text-zinc-400",
          bg: "bg-zinc-500/10 border-zinc-500/30",
          dot: "bg-zinc-400",
        };
    }
  }

  const statusConfig = getStatusConfig(project?.status);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#e8e4f0] tracking-tight">
              {project?.name}
            </h1>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`}
              />
              {statusConfig.label}
            </span>
          </div>

          {project?.description && (
            <p className="text-[#b8aed4] text-sm max-w-xl">
              {project.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-[#7c6fa0] text-sm">
            <Calendar size={20} />
            <span>
              Created{" "}
              {project?.createdAt
                ? new Date(project.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="min-w-0 w-full">
        <ProjectDetailsMetricCards project={project} />
      </div>

      {/* Main content */}

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">Sprints</span>
            <Chip size="sm">{project?.sprints?.length}</Chip>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenSprintModal(true)}
              className=" flex items-center gap-2 bg-[#6c3fc4] hover:scale-105 hover:bg-[#8b5cf6] text-[#ede8fb] text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-300 w-fit cursor-pointer"
            >
              <Plus size={16} />
              Create New
            </button>
            <CreateSprint
              isOpen={openSprintModal}
              onClose={() => setOpenSprintModal(false)}
              onSuccess={() => router.refresh()}
              projectId={project?.id ?? ""}
              userId={user?.id ?? ""}
            />
          </div>
        </div>

        {/* Grid wrapper with floating arrows — outside the header */}
        <div className="relative mt-4">
          {page > 0 && (
            <button
              onClick={goPrev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#1a1030] border border-[#2a2040] hover:border-purple-500/60 flex items-center justify-center text-purple-400 hover:text-purple-300 transition shadow-lg cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          <div className="overflow-hidden">
            <div
              className="relative py-3"
              style={{
                transform: animating
                  ? `translateX(${direction > 0 ? "-100%" : "100%"})`
                  : "translateX(0)",
                opacity: animating ? 0 : 1,
                transition:
                  "transform 0.25s ease-in-out, opacity 0.25s ease-in-out",
              }}
            >
              <ProjectSprintCarousel sprints={visibleSprints} />
            </div>
          </div>

          {page < totalPages - 1 && (
            <button
              onClick={goNext}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#1a1030] border border-[#2a2040] hover:border-purple-500/60 flex items-center justify-center text-purple-400 hover:text-purple-300 transition shadow-lg cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <div className="bg-[#110f1a] border border-[#1f1f1f] rounded-2xl w-full h-80">
            <ProjectSprintVelocity sprints={project?.sprints} />
          </div>

          <div className="w-full border border-[#2a2040] rounded-2xl">
            <ProjectTaskOverview sprints={project?.sprints} />
          </div>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl w-full">
          <ProjectActivityLogs projectId={project?.id} />
        </div>
      </div>
    </div>
  );
}
