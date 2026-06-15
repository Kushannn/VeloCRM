"use client";

import { Button, Modal, toast, useOverlayState } from "@heroui/react";

import { useEffect, useRef, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";

import CreateTask from "@/components/tasks/createTask/CreateTask";
import TaskColumns from "@/components/tasks/taskColumns";
import { ColumnType, TaskType, UserType } from "@/lib/types";
import { useParams } from "next/navigation";
import TaskCard from "../tasks/taskCard";
import TaskDrawer from "../tasks/TaskDrawer";
import { createPortal } from "react-dom";
import { debounce } from "lodash";
import { TaskBoardSkeleton } from "@/app/organization/[orgSlug]/projects/[projectSlug]/sprint/[sprintSlug]/loading";

type TaskStatus = "IN_PROGRESS" | "PENDING" | "COMPLETED";

export default function SprintDashboard({
  sprint,
  project,
  dbUser,
}: {
  sprint: any;
  project: any;
  dbUser: UserType | null;
}) {
  const [localSprint, setLocalSprint] = useState(sprint);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  // const [openDescModal, setOpenDescModal] = useState(false);

  //This determines which task has been selected to show the details
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  //This determines which task has been selected to drag
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const params = useParams<{
    orgId: string;
    projectId: string;
    sprintId: string;
  }>();
  const descState = useOverlayState();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const calculateDaysRemaining = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (today < start) {
      return Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    if (today > end) return 0;

    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const debouncedUpdate = useRef(
    debounce(async (taskId: string, status: string) => {
      try {
        const res = await fetch(`/api/task/${taskId}/update-task-status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, userId: dbUser?.id }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Task status updated!");
        } else {
          throw new Error("Update failed");
        }
      } catch (err) {
        toast.danger("Failed to update task status");
      }
    }, 1000),
  ).current;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = localSprint.tasks.find((t: any) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // optimistic update
    setLocalSprint((prev: any) => ({
      ...prev,
      tasks: prev.tasks.map((t: any) =>
        t.id === taskId ? { ...t, status: newStatus } : t,
      ),
    }));

    debouncedUpdate(taskId, newStatus);
  };

  const columns: ColumnType[] = [
    {
      key: "IN_PROGRESS",
      label: "In Progress",
      tasks:
        localSprint.tasks.filter((t: any) => t.status === "IN_PROGRESS") || [],
      dot: "bg-blue-500",
      badge: "bg-blue-500/10 text-blue-400",
      empty: "No tasks in progress.",
    },
    {
      key: "PENDING",
      label: "On Hold",
      tasks: localSprint.tasks.filter((t: any) => t.status === "PENDING") || [],
      dot: "bg-yellow-400",
      badge: "bg-yellow-400/10 text-yellow-400",
      empty: "No tasks on hold.",
    },
    {
      key: "COMPLETED",
      label: "Completed",
      tasks:
        localSprint.tasks.filter((t: any) => t.status === "COMPLETED") || [],
      dot: "bg-green-500",
      badge: "bg-green-500/10 text-green-400",
      empty: "No completed tasks.",
    },
  ];

  function getProgress(startDate: Date, endDate: Date) {
    const now = new Date();
    const total = new Date(endDate).getTime() - new Date(startDate).getTime();
    const passed = now.getTime() - new Date(startDate).getTime();
    return Math.min(100, Math.max(0, (passed / total) * 100));
  }

  const progress = getProgress(localSprint.startDate, localSprint.endDate);
  const isActive = progress > 0 && progress < 100;

  const handleTaskDetailsUpdate = async (task: TaskType) => {
    try {
      // Basic safety checks
      if (!task) {
        console.log("Task data missing");
        return;
      }

      if (!task.id) {
        console.log("Task ID missing");
        return;
      }

      // Prevent empty updates
      const hasValidData =
        task.title ||
        task.description ||
        task.status ||
        task.priority ||
        task.dueDate ||
        task.assignedToId;

      if (!hasValidData) {
        console.log("No valid fields to update");
        return;
      }

      // Optional sanitization
      const payload = {
        title: task.title?.trim(),
        description: task.description?.trim(),
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedToId: task.assignedToId,
        userId: dbUser?.id,
      };

      const response = await fetch(`/api/task/${task.id}/update-task-details`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.error || "Update failed");
        return;
      }

      setLocalSprint((prev: any) => ({
        ...prev,
        tasks: prev.tasks.map((t: TaskType) =>
          t.id === task.id
            ? {
                ...t,
                ...payload,
              }
            : t,
        ),
      }));

      setSelectedTask(null);
    } catch (error) {
      console.log("Update failed", error);
    }
  };

  return (
    <>
      <div className="h-full space-y-6 flex flex-col">
        {/* Header */}
        <div className="bg-[#110f1a] border border-[#2a2040] hover:border-[#3d2d6b] rounded-xl p-4 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-55">
            {isActive && (
              <p className="flex gap-3 text-[#7c6fa0] items-center text-sm mb-2">
                Active Sprint
                <span className="w-2 h-2 bg-green-700 animate-pulse rounded-xl"></span>
              </p>
            )}
            <h1 className="text-3xl font-medium text-[#e8e4f0]">
              {localSprint.title}
            </h1>
            {localSprint.description && (
              <p
                onClick={() => descState.open()}
                className="text-sm text-[#b8aed4] line-clamp-2 mt-2"
              >
                {localSprint.description}
              </p>
            )}
          </div>

          <div className="items-center rounded-xl border border-zinc-800 flex gap-10 p-3 bg-[#1a1232]">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              {new Date(localSprint.startDate).toLocaleDateString()}
            </div>
            <div className="h-5 w-px bg-zinc-500"></div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              {new Date(localSprint.endDate).toLocaleDateString()}
            </div>
            <div className="h-5 w-px bg-zinc-500"></div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4" />
              {calculateDaysRemaining(
                localSprint.startDate,
                localSprint.endDate,
              )}{" "}
              days
            </div>
          </div>

          <Button
            onClick={() => setOpenTaskModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c3fc4] border border-[#2a2040] text-[#ede8fb] hover:bg-[#8b5cf6] hover:border-[#3d2d6b] hover:text-white active:bg-[#4c2d9e] transition-all text-sm font-medium hover:scale-105 duration-300"
          >
            <span className="text-lg leading-none">+</span>
            New Task
          </Button>
        </div>

        {/* Board */}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            const task =
              columns
                .flatMap((col) => col.tasks)
                .find((t) => t.id === active.id) ?? null;
            setActiveTask(task);
          }}
          onDragEnd={(e) => {
            setActiveTask(null);
            handleDragEnd(e);
          }}
          onDragCancel={() => setActiveTask(null)}
          sensors={sensors}
        >
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
            {columns.map((col) => (
              <TaskColumns
                key={col.key}
                col={col}
                onTaskClick={(task: TaskType) => setSelectedTask(task)}
              />
            ))}
          </div>

          <DragOverlay
            dropAnimation={{
              duration: 180,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
          >
            {activeTask ? (
              <TaskCard task={activeTask} onClick={() => {}} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Create Task */}
      <CreateTask
        isOpen={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        sprintId={params?.sprintId}
        sprint={localSprint}
        project={project}
        onTaskCreated={() => location.reload()}
      />

      {/* Description Modal */}
      <Modal state={descState}>
        <Modal.Backdrop
          variant="blur"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <Modal.Container className="max-w-lg w-full">
            <Modal.Dialog className="bg-[#111111] border border-[#1f1f1f] rounded-2xl text-white">
              {({ close }) => (
                <>
                  <Modal.Header className="border-b border-[#1f1f1f] px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                      <Modal.Heading className="text-lg font-semibold">
                        Sprint Description
                      </Modal.Heading>
                      <Modal.CloseTrigger className="hover:bg-white/5 rounded-lg p-1" />
                    </div>
                  </Modal.Header>
                  <Modal.Body className="px-6 py-4">
                    <p className="text-zinc-400 text-sm whitespace-pre-line leading-relaxed">
                      {localSprint.description}
                    </p>
                  </Modal.Body>
                  <Modal.Footer className="border-t border-[#1f1f1f] px-6 py-4 flex justify-end">
                    <Button
                      variant="ghost"
                      onPress={close}
                      className="text-zinc-400 hover:text-white"
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {typeof window !== "undefined" &&
        createPortal(
          <TaskDrawer
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={(task) => handleTaskDetailsUpdate(task)}
          />,
          document.body,
        )}
    </>
  );
}
