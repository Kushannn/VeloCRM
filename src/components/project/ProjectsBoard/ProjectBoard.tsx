"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import StatusColumn from "./ProjectStatusColumn";
import ProjectCard from "./ProjectCard";
import { ProjectType } from "@/lib/types";
import debounce from "lodash/debounce";
import { addToast } from "@heroui/react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { updateProject } from "@/redux/slices/projectSlice";
import useFetchProjects from "@/hooks/useFetchProjects";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

const columns = [
  { id: "in-progress", title: "In Progress", status: "IN_PROGRESS" },
  { id: "active", title: "Active", status: "ACTIVE" },
  { id: "completed", title: "Completed", status: "COMPLETED" },
] as const;

export default function ProjectBoard() {
  useFetchProjects();

  const projects = useAppSelector((state) => state.projects.projects ?? []);
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
  const dispatch = useAppDispatch();

  // Debounced function to update project status on backend
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
        if (!res.ok) throw new Error("Failed to update project status");

        const data = await res.json();
        if (data.success) {
          addToast({
            title: "Status updated successfully!",
            variant: "solid",
            color: "success",
          });
        } else {
          throw new Error("Backend update failed");
        }
      } catch (error) {
        addToast({
          title: "Failed to update status.",
          variant: "solid",
          color: "danger",
        });
        console.error("Failed to update project status:", error);
      }
    }, 2000)
  ).current;

  const handleDragStart = (event: DragStartEvent) => {
    const dragged = projects.find((p) => p.id === event.active.id);
    setActiveProject(dragged || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProject(null);
    const { active, over } = event;
    if (!over || !active.id) return;

    // If dropped in same column AND same position, do nothing
    if (active.id === over.id) return;

    const draggedProject = projects.find((p) => p.id === active.id);
    if (!draggedProject) return;

    // ✅ Get the new status directly from columns array
    const column = columns.find((col) => col.id === over.id);
    if (!column) return;

    const newStatus = column.status;
    if (draggedProject.status === newStatus) return;

    // ✅ Optimistically update Redux
    dispatch(updateProject({ ...draggedProject, status: newStatus }));

    // ✅ Trigger backend update
    debouncedStatusUpdate(draggedProject.id, newStatus);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    // <div className="flex gap-6">
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex gap-6">
        {columns.map(({ id, title, status }) => (
          <StatusColumn
            key={id}
            id={id}
            title={title}
            projects={projects.filter((p) => p.status === status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProject ? (
          <div className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md">
            <h3 className="font-medium text-neutral-100">
              {activeProject?.name}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              {activeProject?.description}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
    // </div>
  );
}
