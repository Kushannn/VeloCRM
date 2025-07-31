"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar,
  Divider,
} from "@heroui/react";
import {
  ClipboardList,
  User,
  Calendar,
  Star,
  Flag,
  ChevronRight,
  X,
  Target,
} from "lucide-react";
import { TaskType, UserType, SprintType, ProjectType } from "@/lib/types";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskType & {
    assignedTo?: UserType | null;
    createdBy?: UserType | null;
    sprint?: SprintType | null;
    project?: ProjectType | null;
  };
}

const priorityColors: Record<string, string> = {
  LOW: "bg-green-900 text-green-300",
  MEDIUM: "bg-yellow-900 text-yellow-200",
  HIGH: "bg-red-900 text-red-200",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-950 text-yellow-200",
  IN_PROGRESS: "bg-blue-950 text-blue-200",
  COMPLETED: "bg-green-950 text-green-200",
};

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
}: TaskDetailsModalProps) {
  const project = useAppSelector((state) => state.projects.selectedProject);
  const sprint = project?.sprints?.find(
    (sprint) => sprint?.id === task?.sprintId
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size="lg"
      classNames={{
        base: "bg-gradient-to-br from-[#171320] to-[#232124] text-[#e0e3ef] border border-[#21203a] w-full max-w-4xl rounded-2xl",
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            {/* Header with fixed title */}
            <ModalHeader className="flex items-center gap-3 border-b border-[#292f46] mb-5">
              <ClipboardList className="w-7 h-7 text-purple-300" />
              <h2 className="text-2xl font-bold text-white">Task Details</h2>
            </ModalHeader>

            <ModalBody className="py-3 space-y-6">
              {/* Task Title above description */}
              <div>
                <label className="uppercase text-sm font-semibold text-gray-400 tracking-wide">
                  Title
                </label>
                <h3 className="text-xl mb-4 sm:text-2xl font-semibold text-white truncate">
                  {task.title}
                </h3>
                <label className="uppercase text-sm font-semibold text-gray-400 tracking-wide">
                  Description
                </label>
                <p className="mt-2 text-base sm:text-lg text-gray-200 break-words">
                  {task.description || (
                    <span className="italic text-gray-400">No description</span>
                  )}
                </p>
              </div>

              <Divider className="bg-gray-800" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <label className="uppercase text-md font-semibold text-gray-400 tracking-wide flex gap-2">
                    <span>
                      <Target className="w-6 h-6" />
                    </span>
                    Status
                  </label>
                  <div
                    className={`mt-1 ml-3 inline-block px-3 py-1 rounded-lg font-semibold text-white ${
                      statusColors[task.status] || "bg-gray-700"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="uppercase text-md font-semibold text-gray-400 tracking-wide flex gap-2">
                    <span>
                      <Flag className="w-6 h-6" />
                    </span>
                    Priority
                  </label>
                  <div
                    className={`mt-1 ml-3 inline-block px-3 py-1 rounded-lg font-semibold uppercase ${
                      priorityColors[task.priority] || "bg-gray-700 text-white"
                    }`}
                  >
                    {task.priority}
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="uppercase text-md font-semibold text-gray-400 tracking-wide flex gap-2">
                    <User className="w-5  h-5" />
                    Assigned to
                  </label>
                  <div className="mt-1 flex items-center gap-2 text-white ml-2">
                    {task.assignedTo?.image ? (
                      <Avatar
                        src={task.assignedTo.image}
                        name={task.assignedTo.name || "User"}
                        size="sm"
                      />
                    ) : (
                      <Avatar
                        name={task.assignedTo?.name || "User"}
                        size="sm"
                        color="secondary"
                      />
                    )}
                    <span className="truncate max-w-xs">
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>
                </div>

                {/* Created by */}
                <div className="flex items-center">
                  <label className="uppercase text-md font-semibold text-gray-400 tracking-wide flex gap-2">
                    <User className="w-5 h-5" />
                    Created by
                  </label>
                  <div className="mt-1 flex items-center gap-2 text-white ml-2">
                    {task.createdBy?.image ? (
                      <Avatar
                        src={task.createdBy.image}
                        name={task.createdBy.name || "User"}
                        size="sm"
                      />
                    ) : (
                      <Avatar
                        name={task.createdBy?.name || "User"}
                        size="sm"
                        color="primary"
                      />
                    )}
                    <span className="truncate max-w-xs">
                      {task.createdBy?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <Divider className="bg-gray-800" />

              {/* Sprint, Project, Created at */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <ChevronRight className="text-indigo-400 w-6 h-6" />
                  <span className="font-semibold text-white">Sprint:</span>
                  <span className="truncate max-w-xs">
                    {sprint?.title || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <ChevronRight className="text-green-300 w-6 h-6" />
                  <span className="font-semibold text-white">Project:</span>
                  <span className="truncate max-w-xs">
                    {project?.name || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300 mt-4">
                <Calendar className="text-blue-400 w-6 h-6" />
                <span className="font-semibold text-white">Created at:</span>
                <span className="truncate max-w-xs">
                  {new Date(task.createdAt).toLocaleString()}
                </span>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
