"use client";

import { Button, Chip, Modal, useOverlayState } from "@heroui/react";

import { useState } from "react";
import { Calendar, Circle, Clock, Dot } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";

import CreateTask from "@/components/createTask/CreateTask";
import TaskColumns from "@/components/tasks/taskColumns";
import { ColumnType } from "@/lib/types";
import { useParams } from "next/navigation";
import MagicBento from "../MagicBento";

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
  const descState = useOverlayState();
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

  function getProgress(startDate: Date, endDate: Date) {
    const now = new Date();
    const total = new Date(endDate).getTime() - new Date(startDate).getTime();
    const passed = now.getTime() - new Date(startDate).getTime();
    return Math.min(100, Math.max(0, (passed / total) * 100));
  }

  const progress = getProgress(localSprint.startDate, localSprint.endDate);
  const isActive = progress > 0 && progress < 100;

  return (
    <>
      <div className="px-4 pb-10 min-h-screen space-y-6">
        {/* Header */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-55">
            {isActive && (
              <p className="flex gap-3 items-center text-sm mb-2">
                Active Sprint
                <span className="w-2 h-2 bg-green-700 animate-pulse rounded-xl"></span>
              </p>
            )}
            <h1 className="text-3xl font-medium text-white">
              {localSprint.title}
            </h1>

            {localSprint.description && (
              <p
                onClick={() => descState.open()}
                className="text-sm text-gray-400 line-clamp-2 mt-2"
              >
                {localSprint.description}
              </p>
            )}
          </div>

          <div className="items-center rounded-xl border border-zinc-800 flex gap-10 p-3 bg-[#16161c]">
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
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600/20 hover:border-violet-500/40 hover:text-violet-300 transition-all duration-200 text-sm font-medium 
    shadow-[0_10px_25px_rgba(196,167,255,0.25)]"
          >
            <span className="text-lg leading-none">+</span>
            New Task
          </Button>
        </div>

        {/* Board */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* No outer grid div needed */}
          <MagicBento
            cards={columns.map((col) => (
              <TaskColumns key={col.key} col={col} />
            ))}
            columns={3}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
          />
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
      {/* <Modal
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
      </Modal> */}

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
    </>
  );
}
