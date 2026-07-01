"use client";

import { TaskType } from "@/lib/types";
import {
  Calendar,
  DateField,
  DatePicker,
  Input,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useEffect, useState } from "react";
// import {parseDate} from "@in"

const priorityOptions = [
  {
    id: "LOW",
    label: "Low",
    dot: "#60a5fa",
  },
  {
    id: "MEDIUM",
    label: "Medium",
    dot: "#8b5cf6",
  },
  {
    id: "HIGH",
    label: "High",
    dot: "#f87171",
  },
];

export default function TaskDrawer({
  task,
  onClose,
  onUpdate,
}: {
  task: any | null;
  onClose: () => void;
  onUpdate: (task: TaskType) => void;
}) {
  const [localTask, setLocalTask] = useState(task);

  const hasChanges = JSON.stringify(localTask) != JSON.stringify(task);

  const handleSave = async () => {
    await onUpdate(localTask);
    onClose();
  };

  useEffect(() => {
    setLocalTask(task);
  }, [task?.id]);

  return (
    <>
      {/* Backdrop */}
      {task && (
        <div className="fixed inset-0 bg-black/50 z-110" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-110 z-110
        transform transition-transform duration-300 ease-in-out
        ${task ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full bg-[#110f1a] border-l border-[#2a2040] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#2a2040]">
            <span className="text-md text-[#7c6fa0] font-medium uppercase tracking-wider">
              Task Details
            </span>
            <button
              onClick={onClose}
              className="text-[#7c6fa0] hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          {task && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Title */}
              {/* <h2 className="text-md font-medium text-[#e8e4f0]">Title</h2> */}

              <div>
                <Label className="text-xs text-[#b8aed4] uppercase tracking-wider">
                  Title
                </Label>
                <Input
                  value={localTask?.title}
                  onChange={(e) =>
                    setLocalTask({ ...localTask, title: e.target.value })
                  }
                  className="w-full bg-[#0e0c17] border border-[#2a2040] rounded-lg px-3 py-2 text-md text-[#e8e4f0] placeholder-[#4d3d7a] focus:outline-none focus:border-[#6c3fc4] focus:ring-1 focus:ring-[#6c3fc4]/30
                transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  className="w-40"
                  placeholder="Priority"
                  value={localTask?.priority}
                  onChange={(value) => {
                    setLocalTask({ ...localTask, priority: value });
                  }}
                >
                  <Label className="text-xs text-[#b8aed4] uppercase tracking-wider">
                    Priority
                  </Label>
                  <Select.Trigger className="bg-[#0e0c17] border border-[#2a2040] hover:border-[#3d2d6b] data-open:border-[#6c3fc4] data-open:ring-2 data-open:ring-[#6c3fc4]/20 rounded-lg px-3 py-1.5 text-xs text-[#c4a8f5] focus:outline-none transition-all duration-200">
                    <Select.Value className="flex items-center gap-1.5 text-[#e8e4f0] placeholder:text-[#7c6fa0]" />
                    <Select.Indicator className="text-[#7c6fa0] data-open:text-[#8b5cf6] transition-colors" />
                  </Select.Trigger>

                  <Select.Popover className="bg-[#1D1B26] border border-[#2a2040] rounded-xl p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(108,63,196,0.12)] animate-in fade-in-0 zoom-in-95">
                    <ListBox className="outline-none">
                      {priorityOptions.map((p) => (
                        <ListBox.Item
                          key={p.id}
                          id={p.id}
                          textValue={p.label}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-[#c4a8f5] font-medium cursor-pointer hover:bg-[#2d1d5e] hover:text-[#ede8fb] selected:bg-[#2d1d5e] selected:text-[#ede8fb] focus:outline-none focus:bg-[#2d1d5e] transition-colors duration-100"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: p.dot }}
                          />
                          <Label className="text-inherit">{p.label}</Label>
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  className="w-40"
                  placeholder="Status"
                  value={localTask?.priority}
                  onChange={(value) =>
                    setLocalTask({ ...localTask, status: value })
                  }
                >
                  <Label className="text-xs text-[#b8aed4] uppercase tracking-wider">
                    Status
                  </Label>
                  <Select.Trigger className="bg-[#0e0c17] border border-[#2a2040] hover:border-[#3d2d6b] data-open:border-[#6c3fc4] data-open:ring-2 data-open:ring-[#6c3fc4]/20 rounded-lg px-3 py-1.5 text-xs text-[#c4a8f5] focus:outline-none transition-all duration-200">
                    <Select.Value className="flex items-center gap-1.5 text-[#e8e4f0] placeholder:text-[#7c6fa0]" />
                    <Select.Indicator className="text-[#7c6fa0] data-open:text-[#8b5cf6] transition-colors" />
                  </Select.Trigger>

                  <Select.Popover className="bg-[#1D1B26] border border-[#2a2040] rounded-xl p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(108,63,196,0.12)] animate-in fade-in-0 zoom-in-95">
                    <ListBox className="outline-none">
                      {priorityOptions.map((p) => (
                        <ListBox.Item
                          key={p.id}
                          id={p.id}
                          textValue={p.label}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-[#c4a8f5] font-medium cursor-pointer hover:bg-[#2d1d5e] hover:text-[#ede8fb] selected:bg-[#2d1d5e] selected:text-[#ede8fb] focus:outline-none focus:bg-[#2d1d5e] transition-colors duration-100"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: p.dot }}
                          />
                          <Label className="text-inherit">{p.label}</Label>
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-[#b8aed4] mb-2 uppercase tracking-wider">
                  Description
                </p>
                <Input
                  value={localTask?.description}
                  onChange={(e) =>
                    setLocalTask({ ...localTask, description: e.target.value })
                  }
                  className="w-full bg-[#0e0c17] border border-[#2a2040] rounded-lg px-3 py-2 text-md text-[#e8e4f0] placeholder-[#4d3d7a] focus:outline-none focus:border-[#6c3fc4] focus:ring-1 focus:ring-[#6c3fc4]/30
                transition-all duration-200"
                />
              </div>

              {/* Assignee */}
              <div>
                <p className="text-xs text-[#b8aed4] mb-2 uppercase tracking-wider">
                  Assignee
                </p>
                <div className="flex items-center gap-2">
                  <img
                    src={task.assignedTo?.image}
                    className="w-7 h-7 rounded-full border border-[#2a2040]"
                  />
                  <span className="text-sm text-[#e8e4f0]">
                    {task.assignedTo?.name}
                  </span>
                </div>
              </div>

              {/* Due date */}
              <div>
                <p className="text-xs text-[#b8aed4] mb-2 uppercase tracking-wider">
                  Due Date
                </p>
                <div className="text-sm text-[#e8e4f0]">
                  <DatePicker
                    name="date"
                    value={
                      localTask?.dueDate
                        ? parseDate(localTask?.dueDate.split("T")[0])
                        : null
                    }
                    onChange={(value) =>
                      setLocalTask({ ...localTask, dueDate: value?.toString() })
                    }
                    // className="bg-[#1D1B26]"
                  >
                    <DateField.Group
                      fullWidth
                      className="bg-[#0e0c17] border border-[#2a2040] text-[#c4a8f5] placeholder-[#4d3d7a] focus:outline-none focus:border-[#6c3fc4] focus:ring-1 focus:ring-[#6c3fc4]/30
                transition-all duration-200"
                    >
                      <DateField.Input>
                        {(segment) => <DateField.Segment segment={segment} />}
                      </DateField.Input>
                      <DateField.Suffix>
                        <DatePicker.Trigger>
                          <DatePicker.TriggerIndicator />
                        </DatePicker.Trigger>
                      </DateField.Suffix>
                    </DateField.Group>
                    <DatePicker.Popover
                      className="bg-[#1D1B26] text-white p-3"
                      style={{ minWidth: 280 }}
                    >
                      <Calendar
                        aria-label="Event date"
                        // className="bg-[#1D1B26]"
                        // style={{ width: 300 }}
                      >
                        <Calendar.Header>
                          <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                          </Calendar.YearPickerTrigger>
                          <Calendar.NavButton slot="previous" />
                          <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                          <Calendar.GridHeader>
                            {(day) => (
                              <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                            )}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>
                            {(date) => (
                              <Calendar.Cell
                                date={date}
                                className="hover:bg-purple-800"
                              />
                            )}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                          <Calendar.YearPickerGridBody>
                            {({ year }) => (
                              <Calendar.YearPickerCell year={year} />
                            )}
                          </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                      </Calendar>
                    </DatePicker.Popover>
                  </DatePicker>
                </div>
              </div>

              {hasChanges && (
                <div className="p-4 border-t border-[#2a2040]">
                  <button
                    onClick={handleSave}
                    className="w-full py-2 rounded-lg bg-[#6c3fc4] border border-[#2a2040] text-[#ede8fb] hover:bg-[#8b5cf6] hover:border-[#3d2d6b] active:bg-[#4c2d9e] transition-all duration-200 text-sm font-medium hover:scale-105 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
