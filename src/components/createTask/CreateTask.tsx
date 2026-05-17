"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Label,
  Input,
  FieldError,
  Select,
  ListBox,
  useOverlayState,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { ProjectType, SprintType } from "@/lib/types";

interface CreateTaskProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  onTaskCreated?: () => void;
  sprint: SprintType;
  project: ProjectType;
}

// Reusable styled select to avoid repeating compound structure
function StyledSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <p className="text-gray-300 text-sm">{label}</p>

      {/* Select has NO Label child at all */}
      <Select
        aria-label={label}
        value={value}
        onChange={(val) => onChange(String(val ?? ""))}
      >
        <Select.Trigger className="w-full h-10 bg-[#262626] border border-gray-700 rounded-lg px-3 text-white flex items-center justify-between">
          <Select.Value className="text-white text-sm" />
          <Select.Indicator className="text-gray-400" />
        </Select.Trigger>
        <Select.Popover className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl">
          <ListBox className="outline-none p-1 space-y-1">{children}</ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}

export default function CreateTask({
  isOpen,
  onClose,
  sprintId,
  onTaskCreated,
  sprint,
  project,
}: CreateTaskProps) {
  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [priority, setPriority] = useState("LOW");
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = async (close: () => void) => {
    if (!title.trim()) {
      addToast({ title: "Title is required.", color: "danger" });
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
        },
      );

      const data = await res.json();

      if (data.success) {
        addToast({ title: "Task created successfully!", color: "success" });
        setTitle("");
        setDescription("");
        setStatus("PENDING");
        setPriority("LOW");
        setAssignedTo("");
        onTaskCreated?.();
        close();
      } else {
        addToast({
          title: data.error || "Something went wrong.",
          color: "danger",
        });
      }
    } catch {
      addToast({ title: "Failed to create task.", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal state={state}>
      <Modal.Backdrop
        variant="blur"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <Modal.Container className="max-w-2xl w-full">
          <Modal.Dialog className="bg-[#19172c] border border-[#292f46] text-[#a8b0d3] rounded-xl">
            {({ close }) => (
              <>
                <Modal.Header className="border-b border-[#292f46] px-6 py-6">
                  <div className="flex items-center justify-between w-full">
                    <Modal.Heading className="text-2xl font-semibold">
                      Create Task
                    </Modal.Heading>
                    <Modal.CloseTrigger className="hover:bg-white/5 active:bg-white/10 p-2 rounded-xl" />
                  </div>
                </Modal.Header>

                <Modal.Body className="py-6 px-6 space-y-4">
                  {/* Title */}
                  <TextField name="title" className="w-full">
                    <Label className="text-gray-300 text-sm">Task Title</Label>
                    <textarea
                      placeholder="Enter title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 px-3 py-2 resize-none focus:outline-none focus:border-violet-500/50 mt-1"
                    />
                    <FieldError />
                  </TextField>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm">Description</label>
                    <textarea
                      placeholder="Task description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 px-3 py-2 resize-none focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  {/* Assign to */}
                  <Select
                    value={assignedTo}
                    onChange={(val) => setAssignedTo(String(val ?? ""))}
                    className="w-full"
                  >
                    <Label className="text-gray-300 text-sm">Assign To</Label>
                    <Select.Trigger className="w-full bg-[#262626] border border-gray-700 rounded-lg px-3 py-2 text-white flex items-center justify-between">
                      <Select.Value className="text-white" />
                      <Select.Indicator className="text-gray-400" />
                    </Select.Trigger>
                    <Select.Popover className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl p-1">
                      <ListBox>
                        {project?.projectUsers?.map((u) => (
                          <ListBox.Item
                            key={u.id}
                            id={u.id}
                            textValue={u.user?.name ?? "Unknown"}
                            className="px-3 py-2 text-white hover:bg-[#2a2a2a] rounded-lg cursor-pointer"
                          >
                            <Label>{u.user?.name ?? "Unknown"}</Label>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {/* Status + Priority */}
                  <div className="flex gap-4">
                    <StyledSelect
                      label="Status"
                      value={status}
                      onChange={setStatus}
                    >
                      {[
                        { id: "PENDING", label: "Pending" },
                        { id: "IN_PROGRESS", label: "In Progress" },
                        { id: "COMPLETED", label: "Completed" },
                      ].map((s) => (
                        <ListBox.Item
                          key={s.id}
                          id={s.id}
                          textValue={s.label}
                          className="px-3 text-white hover:bg-[#2a2a2a] rounded-lg cursor-pointer"
                        >
                          <Label>{s.label}</Label>
                          {/* <ListBox.ItemIndicator /> */}
                        </ListBox.Item>
                      ))}
                    </StyledSelect>

                    <StyledSelect
                      label="Priority"
                      value={priority}
                      onChange={setPriority}
                    >
                      {[
                        { id: "LOW", label: "Low" },
                        { id: "MEDIUM", label: "Medium" },
                        { id: "HIGH", label: "High" },
                      ].map((p) => (
                        <ListBox.Item
                          key={p.id}
                          id={p.id}
                          textValue={p.label}
                          className="px-3 text-white hover:bg-[#2a2a2a] rounded-lg cursor-pointer"
                        >
                          <Label>{p.label}</Label>
                          {/* <ListBox.ItemIndicator /> */}
                        </ListBox.Item>
                      ))}
                    </StyledSelect>
                  </div>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#292f46] px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onPress={close}
                    isDisabled={loading}
                    className="text-white cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => handleSubmit(close)}
                    isPending={loading}
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded-xl "
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
