"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { ProjectType, SprintType } from "@/lib/types";

interface CreateTaskProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  onTaskCreated?: () => void;
  sprint: SprintType;
  project: ProjectType;
}

export default function CreateTask({
  isOpen,
  onClose,
  sprintId,
  onTaskCreated,
  sprint,
  project,
}: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Low");
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      addToast({
        title: "Title is required.",
        variant: "solid",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/project/${project.id}/sprint/${sprint.id}/create-task`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
            assignedTo,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        addToast({
          title: "Task created successfully!",
          variant: "solid",
          color: "success",
        });
        setTitle("");
        setDescription("");
        setStatus("Todo");
        setPriority("Low");
        onClose();
        onTaskCreated?.();
      } else {
        addToast({
          title: data.error || "Something went wrong.",
          variant: "solid",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: "Failed to create task.",
        variant: "solid",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size="lg"
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3] w-full max-w-2xl",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="text-white text-2xl font-semibold">
              Create Task
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="Task Title"
                placeholder="Enter title..."
                value={title}
                variant="bordered"
                onChange={(e: any) => setTitle(e.target.value)}
                classNames={{
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0 focus-within:ring-offset-0",
                }}
              />

              <Textarea
                label="Description"
                placeholder="Task description..."
                variant="bordered"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                classNames={{
                  input: "text-white placeholder-gray-400",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0 focus-within:ring-offset-0",
                }}
              />

              <div>
                <Select
                  label="Assign To"
                  selectedKeys={[assignedTo]}
                  onSelectionChange={(keys: any) =>
                    setAssignedTo(Array.from(keys)[0] as string)
                  }
                  classNames={{
                    base: "bg-[#262626] border border-gray-700 text-white rounded-lg",
                    label: "text-gray-300",
                  }}
                >
                  {project?.projectUsers?.map((user) => (
                    <SelectItem key={user.user.id}>{user.user.name}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex gap-4">
                <Select
                  label="Status"
                  selectedKeys={[status]}
                  onSelectionChange={(keys: any) =>
                    setStatus(Array.from(keys)[0] as string)
                  }
                  classNames={{
                    base: "bg-[#262626] border border-gray-700 text-white rounded-lg",
                    label: "text-gray-300",
                  }}
                >
                  <SelectItem key="Todo">Todo</SelectItem>
                  <SelectItem key="In Progress">In Progress</SelectItem>
                  <SelectItem key="Done">Done</SelectItem>
                </Select>

                <Select
                  label="Priority"
                  selectedKeys={[priority]}
                  onSelectionChange={(keys: any) =>
                    setPriority(Array.from(keys)[0] as string)
                  }
                  classNames={{
                    base: "bg-[#262626] border border-gray-700 text-white rounded-lg",
                    label: "text-gray-300",
                  }}
                >
                  <SelectItem key="Low">Low</SelectItem>
                  <SelectItem key="Medium">Medium</SelectItem>
                  <SelectItem key="High">High</SelectItem>
                </Select>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={close}
                disabled={loading}
                className="text-white"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
