"use client";

import { Button, Modal, toast, useOverlayState } from "@heroui/react";

import { useRef, useState } from "react";
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
import { usePusherEvents } from "@/hooks/pusher/usePusherEvents";

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
          body: JSON.stringify({
            status,
            userId: dbUser?.id,
            projectId: project?.id,
          }),
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
        projectId: project?.id,
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

  const handleTaskDelete = async (task: TaskType) => {
    try {
      const res = await fetch(`/api/task/${task.id}/delete-task`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project?.id, sprintId: sprint?.id }),
      });

      if (!res.ok) {
        toast.danger("The task could not be deleted");
        return;
      }

      setLocalSprint((prev: any) => ({
        ...prev,
        tasks: prev.tasks.filter((t: TaskType) => t.id !== task.id),
      }));

      setSelectedTask(null);
    } catch (error) {
      toast.danger("Could not delete task");
      console.log("error ", error);
    }
  };

  usePusherEvents(`private-sprint-${sprint.id}`, {
    "task:created": (data: { task: TaskType }) => {
      console.log("data ", data);
      setLocalSprint((prev: any) => {
        if (data.task.sprintId !== prev.id) return prev;
        if (prev.tasks.some((t: TaskType) => t.id === data.task.id))
          return prev;
        return { ...prev, tasks: [...prev.tasks, data.task] };
      });
    },

    "task:deleted": (data: { taskId: string }) =>
      setLocalSprint((prev: any) => ({
        ...prev,
        tasks: prev.tasks.filter((t: any) => t.id !== data.taskId),
      })),
  });

  return (
    <>
      <div className="h-full space-y-6 flex flex-col">
        <div className="bg-[#110f1a] border border-[#2a2040] hover:border-[#3d2d6b] rounded-xl p-3 sm:p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {isActive && (
                <p className="flex gap-2 text-[#7c6fa0] items-center text-xs mb-1">
                  Active Sprint
                  <span className="w-2 h-2 bg-green-700 animate-pulse rounded-xl" />
                </p>
              )}
              <h1 className="text-xl sm:text-2xl font-medium text-[#e8e4f0] truncate">
                {localSprint.title}
              </h1>
              {localSprint.description && (
                <p
                  onClick={() => descState.open()}
                  className="text-xs text-[#b8aed4] line-clamp-1 mt-1 cursor-pointer"
                >
                  {localSprint.description}
                </p>
              )}
            </div>

            <Button
              onClick={() => setOpenTaskModal(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6c3fc4] border border-[#2a2040] text-[#ede8fb] hover:bg-[#8b5cf6] hover:border-[#3d2d6b] hover:text-white active:bg-[#4c2d9e] transition-all text-sm font-medium hover:scale-105 duration-300"
            >
              <span className="text-base leading-none">+</span>
              New Task
            </Button>
          </div>

          <div className="flex items-center rounded-lg border border-zinc-800 bg-[#1a1232] px-3 py-2 gap-2 sm:gap-4 w-full sm:w-fit">
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              {new Date(localSprint.startDate).toLocaleDateString()}
            </div>
            <div className="h-4 w-px bg-zinc-600" />
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              {new Date(localSprint.endDate).toLocaleDateString()}
            </div>
            <div className="h-4 w-px bg-zinc-600" />
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {calculateDaysRemaining(
                localSprint.startDate,
                localSprint.endDate,
              )}{" "}
              days
            </div>
          </div>
        </div>

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
      <CreateTask
        isOpen={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        sprintId={params?.sprintId}
        sprint={localSprint}
        project={project}
        onTaskCreated={(newTask: TaskType) => {
          setLocalSprint((prev: any) => {
            if (prev.tasks.some((t: TaskType) => t.id === newTask.id))
              return prev;
            return { ...prev, tasks: [...prev.tasks, newTask] };
          });
          setOpenTaskModal(false);
        }}
      />

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
            onDelete={(task) => handleTaskDelete(task)}
          />,
          document.body,
        )}
    </>
  );
}
