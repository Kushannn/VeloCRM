"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProjectType } from "@/lib/types";
import React from "react";

interface ProjectCardProps {
  project: ProjectType;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      tabIndex={0}
      style={style}
      className={`
        cursor-grab rounded-xl border border-[#181621]/80
        bg-gradient-to-br from-[#171320] to-[#232124]
        shadow-md transition-all duration-300
        px-4 py-5 sm:p-6
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
        min-h-[104px] sm:min-h-[120px] md:min-h-[132px]
        outline-none focus-visible:ring-2 focus-visible:ring-violet-900
        select-none
        overflow-hidden
        hover:scale-[1.05] hover:shadow-2xl hover:z-50
      `}
    >
      <h1
        className="
          font-bold text-neutral-50 text-lg sm:text-xl md:text-2xl mb-1
          truncate
        "
        title={project?.name}
      >
        {project?.name}
      </h1>
      <p
        className="
          mt-1 text-sm sm:text-base md:text-lg font-medium text-neutral-400
          line-clamp-2
          select-text
          /* no overflow to avoid scrollbar */
        "
        title={project?.description}
      >
        {project?.description}
      </p>
    </div>
  );
}
