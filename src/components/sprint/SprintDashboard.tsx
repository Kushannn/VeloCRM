"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";

import CreateTask from "@/components/createTask/CreateTask";
import TaskColumns from "@/components/tasks/taskColumns";
import { ColumnType } from "@/lib/types";
import { useParams } from "next/navigation";

type TaskStatus = "IN_PROGRESS" | "PENDING" | "COMPLETED";

export default function SprintDashboard({ sprint, project }: any) {
  const [localSprint, setLocalSprint] = useState(sprint);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openDescModal, setOpenDescModal] = useState(false);
  const params = useParams<{
    orgId: string;
    projectId: string;
    sprintId: string;
  }>();
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

    try {
      await fetch(
        `/api/project/${params.projectId}/sprint/${params.sprintId}/task/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId,
            status: newStatus,
          }),
        },
      );
    } catch (error) {
      console.log("Update failed");
    }
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

  return (
    <>
      <div className="px-4 pb-10 min-h-screen space-y-6">
        {/* Header */}
        <div className="bg-[#161617] border border-gray-800 rounded-xl p-4 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[220px]">
            <h1 className="text-xl font-semibold text-white">
              {localSprint.title}
            </h1>

            {localSprint.description && (
              <p
                onClick={() => setOpenDescModal(true)}
                className="text-sm text-gray-400 line-clamp-2 cursor-pointer hover:text-white"
              >
                {localSprint.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            {new Date(localSprint.startDate).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            {new Date(localSprint.endDate).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            {calculateDaysRemaining(
              localSprint.startDate,
              localSprint.endDate,
            )}{" "}
            days
          </div>

          <Button
            onClick={() => setOpenTaskModal(true)}
            className="ml-auto bg-gradient-to-r from-[#893168] to-purple-700 text-white"
          >
            + New Task
          </Button>
        </div>

        {/* Board */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((col) => (
              <TaskColumns key={col.key} col={col} />
            ))}
          </div>
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
      <Modal
        isOpen={openDescModal}
        onOpenChange={setOpenDescModal}
        size="2xl"
        classNames={{
          base: "bg-[#2a2a2a]",
          header: "text-white border-b border-gray-700",
          body: "text-gray-300",
        }}
      >
        <ModalContent>
          <ModalHeader>Sprint Description</ModalHeader>
          <ModalBody>
            <p className="whitespace-pre-line">{localSprint.description}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
