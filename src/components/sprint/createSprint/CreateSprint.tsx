"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Label,
  Input,
  FieldError,
  useOverlayState,
  DateField,
  RangeCalendar,
  toast,
} from "@heroui/react";
import { DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface CreateSprintProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function CreateSprint({
  projectId,
  userId,
  onClose,
  onSuccess,
  isOpen,
}: CreateSprintProps) {
  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateValue, setDateValue] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(close: () => void) {
    if (!title.trim() || !dateValue) {
      toast.danger("All required fields must be filled");
      return;
    }

    setLoading(true);
    try {
      const startDate = dateValue.start.toDate("UTC").toISOString();
      const endDate = dateValue.end.toDate("UTC").toISOString();

      const res = await fetch(
        `/api/project/${projectId}/sprint/create-sprint`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            startDate,
            endDate,
            userId,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Sprint created successfully");
        setTitle("");
        setDescription("");
        setDateValue(null);
        onSuccess();
        close(); // ← close modal on success
      } else {
        toast.danger(data.error || "Something went wrong");
      }
    } catch {
      // addToast({ title: "Failed to create sprint.", color: "danger" });
      toast.danger("Failed to create sprint");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur" className="bg-[#09080f]/60">
        <Modal.Container className="max-w-2xl w-full">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />

                <Modal.Header className="border-b border-[#2a2040] pb-4">
                  <Modal.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                    Create Sprint
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-6 space-y-4">
                  {/* Title */}
                  <TextField name="title" className="w-full">
                    <Label className="text-[#b8aed4] text-sm">
                      Sprint Title
                    </Label>
                    <Input
                      placeholder="Enter title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 transition-colors data-focused:border-[#6c3fc4] data-focused:outline-none data-focused:ring-0 data-focused:shadow-none"
                    />
                    <FieldError className="text-[#f87171] text-xs" />
                  </TextField>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[#b8aed4] text-sm">
                      Description
                    </label>
                    <textarea
                      placeholder="Sprint description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] focus:border-[#6c3fc4] focus:outline-none rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 resize-none transition-colors"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="flex flex-col gap-1">
                    <DateRangePicker
                      value={dateValue}
                      onChange={(newRange: any) => setDateValue(newRange)}
                      minValue={parseDate(
                        new Date().toISOString().split("T")[0],
                      )}
                    >
                      <Label className="text-[#b8aed4] text-sm">
                        Select Duration
                      </Label>

                      <DateField.Group className="bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg transition-colors">
                        <DateField.InputContainer className="text-[#e8e4f0] px-3 py-2">
                          <DateField.Input slot="start">
                            {(segment) => (
                              <DateField.Segment
                                segment={segment}
                                className="text-[#e8e4f0] focus:bg-[#6c3fc4]/20 rounded px-0.5"
                              />
                            )}
                          </DateField.Input>
                          <DateRangePicker.RangeSeparator className="text-[#7c6fa0] mx-1" />
                          <DateField.Input slot="end">
                            {(segment) => (
                              <DateField.Segment
                                segment={segment}
                                className="text-[#e8e4f0] focus:bg-[#6c3fc4]/20 rounded px-0.5"
                              />
                            )}
                          </DateField.Input>
                        </DateField.InputContainer>

                        <DateField.Suffix>
                          <DateRangePicker.Trigger className="text-[#000000] hover:text-[#8b5cf6] px-2">
                            <DateRangePicker.TriggerIndicator />
                          </DateRangePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>

                      <FieldError className="text-[#f87171] text-xs" />

                      <DateRangePicker.Popover className="bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl shadow-black/40 p-3">
                        <RangeCalendar aria-label="Choose sprint duration">
                          <RangeCalendar.Header className="flex items-center justify-between mb-2">
                            <RangeCalendar.YearPickerTrigger>
                              <RangeCalendar.YearPickerTriggerHeading className="text-[#e8e4f0] font-medium" />
                              <RangeCalendar.YearPickerTriggerIndicator className="text-[#7c6fa0]" />
                            </RangeCalendar.YearPickerTrigger>
                            <div className="flex gap-1">
                              <RangeCalendar.NavButton
                                slot="previous"
                                className="text-[#7c6fa0] hover:text-[#e8e4f0] p-1 rounded"
                              />
                              <RangeCalendar.NavButton
                                slot="next"
                                className="text-[#7c6fa0] hover:text-[#e8e4f0] p-1 rounded"
                              />
                            </div>
                          </RangeCalendar.Header>

                          <RangeCalendar.Grid>
                            <RangeCalendar.GridHeader>
                              {(day) => (
                                <RangeCalendar.HeaderCell className="text-[#4d3d7a] text-xs font-medium">
                                  {day}
                                </RangeCalendar.HeaderCell>
                              )}
                            </RangeCalendar.GridHeader>
                            <RangeCalendar.GridBody>
                              {(date) => (
                                <RangeCalendar.Cell
                                  date={date}
                                  className="text-[#e8e4f0]! text-sm rounded hover:bg-[#6c3fc4]/20 data-selected:bg-[#6c3fc4] data-selection-start:bg-[#4c2d9e] data-selection-end:bg-[#4c2d9e] hover:text-black "
                                />
                              )}
                            </RangeCalendar.GridBody>
                          </RangeCalendar.Grid>
                        </RangeCalendar>
                      </DateRangePicker.Popover>
                    </DateRangePicker>
                  </div>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#2a2040] pt-6">
                  <Button
                    variant="ghost"
                    onPress={close}
                    isDisabled={loading}
                    className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => handleSubmit(close)}
                    isPending={loading}
                    className="bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] transition-colors"
                  >
                    {loading ? "Creating..." : "Create Sprint"}
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
