"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import SprintColumns from "./SprintColumns";
import { ProjectType, SprintType, TaskType } from "@/lib/types";
import debounce from "lodash/debounce";
import { addToast } from "@heroui/react";
import SprintTaskCard from "./SprintTasksCard";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

interface SprintBoardProps {
  sprint: SprintType;
  project: ProjectType;
  onSprintUpdated?: () => void;
}

// const TASK_STATUSES: ("PENDING" | "IN_PROGRESS" | "COMPLETED")[] = [
//   "PENDING",
//   "IN_PROGRESS",
//   "COMPLETED",
// ];

const TASK_STATUSES = [
  { id: "IN_PROGRESS", title: "In Progress", status: "IN_PROGRESS" },
  { id: "PENDING", title: "Pending", status: "PENDING" },
  { id: "COMPLETED", title: "Completed", status: "COMPLETED" },
] as const;

export default function SprintBoard({
  sprint,
  project,
  onSprintUpdated,
}: SprintBoardProps) {
  const [tasks, setTasks] = useState<TaskType[]>(sprint?.tasks || []);

  useEffect(() => {
    setTasks(sprint?.tasks || []);
  }, [sprint?.tasks]);

  const [activeTask, setAcitveTask] = useState<TaskType | null>();

  const debouncedUpdate = useRef(
    debounce(async (taskId: string, status: string) => {
      try {
        const res = await fetch(`/api/task/${taskId}/update-task-status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (data.success) {
          addToast({
            title: "Task status updated!",
            variant: "solid",
            color: "success",
          });
          onSprintUpdated?.();
        } else {
          throw new Error("Update failed");
        }
      } catch (err) {
        addToast({
          title: "Failed to update task status",
          variant: "solid",
          color: "danger",
        });
        console.error("Error updating task status:", err);
      }
    }, 1000)
  ).current;

  const handleDragStart = (event: DragStartEvent) => {
    const dragged = tasks.find((p) => p.id === event.active.id);
    setAcitveTask(dragged || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setAcitveTask(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const column = TASK_STATUSES.find((status) => status.id === over.id);
    if (!column || task.status === column.status) return;

    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, status: column.status } : t
    );
    setTasks(updatedTasks);

    debouncedUpdate(task.id, column.status);
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
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {TASK_STATUSES.map(({ id, title, status }) => (
          <SprintColumns
            key={id}
            id={id}
            title={title}
            tasks={tasks.filter((t) => t.status === status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <SprintTaskCard task={activeTask!} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
