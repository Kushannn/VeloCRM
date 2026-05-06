"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProjectType } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { setSelectedProject } from "@/redux/slices/projectSlice";

interface ProjectCardProps {
  project: ProjectType;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();

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

  // // This is to redirect on one click of the mouse
  // const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  // const handlePointerDown = (e: React.PointerEvent) => {
  //   pointerDownRef.current = { x: e.clientX, y: e.clientY };
  // };

  // const handlePointerUp = (e: React.PointerEvent) => {
  //   if (!pointerDownRef.current) return;

  //   const dx = e.clientX - pointerDownRef.current.x;
  //   const dy = e.clientY - pointerDownRef.current.y;
  //   const distance = Math.sqrt(dx * dx + dy * dy);

  //   if (distance < 5 && !isDragging) {
  //     dispatch(setSelectedProject(project));
  //     router.push(
  //       `/organization/${project.organizationId}/projects/${project.id}`
  //     );
  //   }

  //   pointerDownRef.current = null;
  // };

  const handleClick = () => {
    console.log("Handle click called");
    if (!isDragging) {
      dispatch(setSelectedProject(project));
      router.push(
        `/organization/${project.organizationId}/projects/${project.id}`
      );
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      tabIndex={0}
      style={style}
      onClick={() => {
        handleClick();
      }}
      // onPointerDown={handlePointerDown}
      // onPointerUp={handlePointerUp}
      className={`
        transform-gpu
        cursor-grab rounded-xl border border-[#181621]/80
        bg-gradient-to-br from-[#171320] to-[#232124]
        shadow-md transition-all duration-300
        px-4 py-5 sm:p-6
        w-full
        min-h-[104px] sm:min-h-[120px] md:min-h-[132px]
        outline-none focus-visible:ring-2 focus-visible:ring-violet-900
        select-none hover:shadow-4xl hover:z-50
      `}
    >
      <h1 className="font-bold text-neutral-50 text-lg sm:text-xl md:text-2xl mb-1 truncate">
        {project?.name}
      </h1>
      <p className="mt-1 text-sm sm:text-base md:text-lg font-medium text-neutral-400 line-clamp-2 select-text">
        {project?.description}
      </p>
    </div>
  );
}
