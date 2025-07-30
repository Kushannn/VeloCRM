"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Avatar,
  Modal,
} from "@heroui/react";
import { TaskType, UserType, ProjectType, SprintType } from "@/lib/types";
import {
  User,
  ClipboardList,
  ChevronRight,
  Star,
  Flag,
  CalendarDays,
} from "lucide-react";
import { useEffect } from "react";

interface TaskDetailsCardProps {
  task: TaskType & {
    assignedTo?: UserType | null;
    createdBy?: UserType | null;
    sprint?: SprintType | null;
    project?: ProjectType | null;
  };
  isOpen?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
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

export default function TaskDetailsCard({
  task,
  onEdit,
  onDelete,
  onClose,
  isOpen,
}: TaskDetailsCardProps) {
  useEffect(() => {
    console.log("This is called");
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="lg">
        <Card className="max-w-lg mx-auto rounded-2xl bg-gradient-to-br from-[#171320] to-[#232124] border border-neutral-800 shadow-xl text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ClipboardList className="w-7 h-7 text-purple-300" />
              <h2 className="font-extrabold text-2xl">{task.title}</h2>
            </div>
            <span
              className={`
        ml-10 px-3 py-1 rounded-lg font-bold text-sm tracking-wide 
        ${statusColors[task.status] || "bg-gray-800 text-gray-100"}
        `}
            >
              {task.status.replace("_", " ")}
            </span>
          </CardHeader>
          <CardBody>
            <div className="mb-4 space-y-2">
              <p className="text-gray-300 text-base">
                {task.description || (
                  <span className="italic">No description</span>
                )}
              </p>
              <Divider className="my-3 bg-gray-800" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold uppercase ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <Flag className="ml-4 w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-400">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-fuchsia-300" />
                  <span className="font-medium text-gray-100">
                    Assigned to:
                  </span>
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
                  <span className="ml-1 text-gray-300">
                    {task.assignedTo?.name || "Unassigned"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-500" />
                  <span className="font-medium text-gray-100">Created by:</span>
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
                  <span className="ml-1 text-gray-300">
                    {task.createdBy?.name || "Unknown"}
                  </span>
                </div>

                <Divider className="my-2 bg-gray-800" />

                <div className="flex items-center gap-2">
                  <ChevronRight className="text-indigo-400 w-4 h-4" />
                  <span className="font-medium text-gray-100">Sprint:</span>
                  <span className="ml-1 text-gray-300">
                    {task.sprint?.title || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="text-green-300 w-4 h-4" />
                  <span className="font-medium text-gray-100">Project:</span>
                  <span className="ml-1 text-gray-300">
                    {task.project?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="text-blue-400 w-4 h-4" />
                  <span className="font-medium text-gray-100">Created at:</span>
                  <span className="ml-1 text-gray-300">
                    {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="flex mt-6 gap-4">
                {onEdit && (
                  <Button color="primary" className="flex-1" onClick={onEdit}>
                    Edit Task
                  </Button>
                )}
                {onDelete && (
                  <Button color="danger" className="flex-1" onClick={onDelete}>
                    Delete Task
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}
