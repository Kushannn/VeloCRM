"use client";

import BorderGlow from "@/components/ui/BorderGlow";
import CreateSprint from "@/components/createSprint/CreateSprint";
// import GlareHover from "@/components/ui/GlareHover";
import { ProjectType } from "@/lib/types";
import { ProgressBar } from "@heroui/react";
import {
  Calendar,
  CalendarRange,
  ChevronRight,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectDetailsMetricCards from "./ProjectDetailMetricCards";

type Props = {
  project: ProjectType | null;
  orgSlug: string;
  projectSlug: string;
  user: any;
};

export default function SingleProjectDetails({
  project,
  orgSlug,
  projectSlug,
  user,
}: Props) {
  const router = useRouter();

  // console.log("project ", project);

  function getProgress(startDate: Date, endDate: Date) {
    const now = new Date();
    const total = new Date(endDate).getTime() - new Date(startDate).getTime();
    const passed = now.getTime() - new Date(startDate).getTime();
    return Math.min(100, Math.max(0, (passed / total) * 100));
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

        {/* Stats row */}
        <div className="flex gap-3">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-center min-w-20">
            <p className="text-2xl font-bold text-white">
              {project?.sprints?.length ?? 0}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Sprints</p>
          </div>
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-3 text-center min-w-20">
            <p className="text-2xl font-bold text-white">
              {project?.projectUsers?.length ?? 0}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Members</p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div>
        <ProjectDetailsMetricCards project={project} />
      </div>

      {/* Main content */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl w-full h-full">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1f1f1f]">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Users size={15} className="text-violet-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Members</h2>
            <span className="ml-auto text-xs text-zinc-400 font-bold bg-[#1a1a1a] px-2 py-0.5 rounded-full">
              {project?.projectUsers?.length ?? 0}
            </span>
          </div>

          <div className="p-4 space-y-2 max-h-100 overflow-y-auto">
            {project?.projectUsers?.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-sm">
                No members yet
              </div>
            ) : (
              project?.projectUsers?.map((projectUser) => (
                <div
                  key={projectUser?.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-transparent hover:border-[#2a2a2a] transition-all"
                >
                  {projectUser?.user?.image ? (
                    <img
                      src={projectUser.user.image}
                      alt={projectUser.user.name ?? "User"}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-violet-900/40 border border-violet-700/30 flex items-center justify-center shrink-0 text-sm font-semibold text-violet-300">
                      {projectUser?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {projectUser?.user?.name}
                    </p>
                    <p className="text-zinc-500 text-xs truncate">
                      {projectUser?.user?.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl w-full">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1f1f1f]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap size={15} className="text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Sprints</h2>
            <span className="ml-auto text-xs text-zinc-400 bg-[#1a1a1a] px-2 py-0.5 rounded-full font-bold">
              {project?.sprints?.length ?? 0}
            </span>

            {/* CreateSprint trigger */}
            <CreateSprint
              projectId={project?.id ?? ""}
              userId={user?.id ?? ""}
            />
          </div>

          <div className="p-4 space-y-3 max-h-100 overflow-y-auto ">
            {project?.sprints?.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-sm">
                No sprints yet
              </div>
            ) : (
              project?.sprints?.map((sprint) => {
                const progress = getProgress(
                  sprint?.startDate,
                  sprint?.endDate,
                );
                const isActive = progress > 0 && progress < 100;
                const isCompleted = progress >= 100;

                return (
                  <div
                    key={sprint?.id}
                    className="group p-4 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-transparent hover:border-[#2a2a2a] transition-all cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/organization/${orgSlug}/projects/${projectSlug}/sprint/${sprint?.slug}`,
                      )
                    }
                  >
                    {/* Sprint header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-lg truncate py-2">
                          {sprint?.title}
                        </p>
                        {sprint?.description && (
                          <p className="text-zinc-500 text-md mt-0.5 truncate">
                            {sprint.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isCompleted
                              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                              : isActive
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                          }`}
                        >
                          {isCompleted
                            ? "Done"
                            : isActive
                              ? "Active"
                              : "Upcoming"}
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <ProgressBar value={progress} aria-label="sprint-details">
                        <ProgressBar.Output />
                        <ProgressBar.Track>
                          <ProgressBar.Fill />
                        </ProgressBar.Track>
                      </ProgressBar>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
                          <CalendarRange size={10} />
                          <span>
                            {new Date(sprint?.startDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                              },
                            )}
                            {" → "}
                            {new Date(sprint?.endDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-zinc-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
