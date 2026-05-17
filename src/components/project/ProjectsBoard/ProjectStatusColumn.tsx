"use client";

import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ProjectCard from "./ProjectCard";
import { ProjectType } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";

interface StatusColumnProps {
  id: string;
  title: string;
  projects: ProjectType[];
}

export default function StatusColumn({
  id,
  title,
  projects,
}: StatusColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col w-full sm:w-100 lg:w-120
        min-h-120 sm:min-h-150
        rounded-xl
        bg-linear-to-b from-[#121018] to-[#232124]
        p-6
        shadow-lg shadow-black/60
        border border-neutral-800
        text-neutral-100
        select-none
        overflow-visible
        sm:shrink-0
        transition-colors
      `}
    >
      <h2 className="mb-5 text-xl font-semibold tracking-wide text-neutral-200">
        {title}
      </h2>
      <SortableContext
        id={id}
        items={projects?.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className="flex flex-col space-y-4 overflow-auto"
          style={{ maxHeight: "calc(100vh - 280px)" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
