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
  DatePicker,
  DateField,
  Calendar,
  DateValue,
  toast,
} from "@heroui/react";
import { ProjectType, SprintType } from "@/lib/types";
import { getLocalTimeZone } from "@internationalized/date";

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
        <Select.Trigger className="w-full h-10 bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg px-3 text-[#e8e4f0] flex items-center justify-between cursor-pointer transition-colors">
          <Select.Value className="[&_.label]:text-[#7c6fa0] text-[#7c6fa0]" />
          <Select.Indicator className="text-[#7c6fa0]" />
        </Select.Trigger>
        <Select.Popover className="bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl shadow-black/40">
          <ListBox className="outline-none text-[#e8e4f0] p-1 space-y-1">
            {children}
          </ListBox>
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
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleDateChange = (val: DateValue | null) => {
    if (!val) return;
    setDueDate(val.toDate(getLocalTimeZone()));
  };

  const handleSubmit = async (close: () => void) => {
    if (!title.trim()) {
      toast.danger("Title is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/task/create-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          assignedTo,
          dueDate: dueDate?.toISOString(),
          projectId: project.id,
          sprintId: sprint.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Task created successfully");
        setTitle("");
        setDescription("");
        setStatus("PENDING");
        setPriority("LOW");
        setAssignedTo("");
        onTaskCreated?.();
        close();
      } else {
        toast.danger("Something went wrong");
      }
    } catch {
      toast.danger("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal state={state}>
      <Modal.Backdrop
        variant="blur"
        className="fixed inset-0 z-50 bg-[#09080f]/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <Modal.Container className="max-w-2xl w-full">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />
                <Modal.Header className="border-b border-[#2a2040]">
                  {/* <div className="flex items-center justify-between w-full"> */}
                  <Modal.Heading className="text-2xl font-semibold text-[#e8e4f0]">
                    Create Task
                  </Modal.Heading>
                  {/* </div> */}
                </Modal.Header>

                <Modal.Body className="py-6 px-6 space-y-4">
                  {/* Title */}
                  <TextField name="title" className="w-full">
                    <Label className="text-[#b8aed4] text-sm">Task Title</Label>
                    <textarea
                      placeholder="Enter title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 resize-none focus:outline-none focus:border-[#6c3fc4] mt-1 transition-colors"
                    />
                    <FieldError className="text-[#f87171] text-xs" />
                  </TextField>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[#b8aed4] text-sm">
                      Description
                    </label>
                    <textarea
                      placeholder="Task description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 resize-none focus:outline-none focus:border-[#6c3fc4] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-[#b8aed4] text-sm">Assign To</span>

                    <Select
                      aria-label="Assign To"
                      value={assignedTo}
                      onChange={(val) => setAssignedTo(String(val ?? ""))}
                    >
                      <Select.Trigger className="w-full h-10 bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg px-3 text-[#e8e4f0] flex items-center justify-between cursor-pointer z-50 transition-colors">
                        <Select.Value className="text-[#7c6fa0] text-sm" />
                        <Select.Indicator className="text-[#7c6fa0]" />
                      </Select.Trigger>
                      <Select.Popover className="bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl shadow-black/40 p-1 z-100">
                        <ListBox className="outline-none space-y-1">
                          {project?.projectUsers?.map((u) => (
                            <ListBox.Item
                              key={u.id}
                              id={u.userId}
                              textValue={u.user?.name ?? "Unknown"}
                              className="px-3 py-2 text-[#e8e4f0] hover:bg-[#2a2040] rounded-lg cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#6c3fc4] flex items-center justify-center text-[#ede8fb] text-sm font-semibold shrink-0 overflow-hidden">
                                  {u.user?.image ? (
                                    <img
                                      src={u.user.image}
                                      alt={u.user.name ?? ""}
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  ) : (
                                    (u.user?.name?.[0]?.toUpperCase() ?? "?")
                                  )}
                                </div>

                                <div className="flex flex-col">
                                  <span className="text-[#e8e4f0] text-sm font-medium leading-tight">
                                    {u.user?.name ?? "Unknown"}
                                  </span>
                                  <span className="text-[#7c6fa0] text-xs leading-tight">
                                    {u.user?.email ?? ""}
                                  </span>
                                </div>
                              </div>
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

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
                          className="px-3 text-[#e8e4f0] hover:bg-[#2a2040] rounded-lg cursor-pointer"
                        >
                          <Label className="[&_.label]:text-[#7c6fa0] text-[#7c6fa0]">
                            {s.label}
                          </Label>
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
                          className="px-3 text-[#e8e4f0] hover:bg-[#2a2040] rounded-lg cursor-pointer"
                        >
                          <Label className="[&_.label]:text-[#7c6fa0] text-[#7c6fa0]">
                            {p.label}
                          </Label>
                        </ListBox.Item>
                      ))}
                    </StyledSelect>
                  </div>

                  <div>
                    <DatePicker
                      className="w-64"
                      name="date"
                      onChange={handleDateChange}
                    >
                      <Label className="text-[#b8aed4] text-sm">Due Date</Label>
                      <DateField.Group
                        fullWidth
                        className="bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg transition-colors"
                      >
                        <DateField.Input>
                          {(segment) => (
                            <DateField.Segment
                              segment={segment}
                              className="text-[#e8e4f0] focus:bg-[#6c3fc4]/20 rounded px-0.5"
                            />
                          )}
                        </DateField.Input>
                        <DateField.Suffix>
                          <DatePicker.Trigger className="text-[#7c6fa0] hover:text-[#8b5cf6] px-2">
                            <DatePicker.TriggerIndicator />
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>
                      <DatePicker.Popover className="bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl shadow-black/40 p-3">
                        <Calendar aria-label="Event date">
                          <Calendar.Header className="flex items-center justify-between mb-2">
                            <Calendar.YearPickerTrigger>
                              <Calendar.YearPickerTriggerHeading className="text-[#e8e4f0] font-medium" />
                              <Calendar.YearPickerTriggerIndicator className="text-[#7c6fa0]" />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton
                              slot="previous"
                              className="text-[#7c6fa0] hover:text-[#e8e4f0] p-1 rounded"
                            />
                            <Calendar.NavButton
                              slot="next"
                              className="text-[#7c6fa0] hover:text-[#e8e4f0] p-1 rounded"
                            />
                          </Calendar.Header>
                          <Calendar.Grid>
                            <Calendar.GridHeader>
                              {(day) => (
                                <Calendar.HeaderCell className="text-[#4d3d7a] text-xs font-medium">
                                  {day}
                                </Calendar.HeaderCell>
                              )}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                              {(date) => (
                                <Calendar.Cell
                                  date={date}
                                  className="text-[#e8e4f0] text-sm rounded hover:bg-[#6c3fc4]/20 data-selected:bg-[#6c3fc4]"
                                />
                              )}
                            </Calendar.GridBody>
                          </Calendar.Grid>
                          <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                              {({ year }) => (
                                <Calendar.YearPickerCell
                                  year={year}
                                  className="text-[#e8e4f0] hover:bg-[#2a2040] data-selected:bg-[#6c3fc4]"
                                />
                              )}
                            </Calendar.YearPickerGridBody>
                          </Calendar.YearPickerGrid>
                        </Calendar>
                      </DatePicker.Popover>
                    </DatePicker>
                  </div>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#2a2040] px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onPress={close}
                    isDisabled={loading}
                    className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232] cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => handleSubmit(close)}
                    isPending={loading}
                    className="cursor-pointer bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] p-2 rounded-xl transition-colors"
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
