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
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface CreateSprintProps {
  projectId: string;
  onSprintCreated?: () => void;
  userId: string;
}

export default function CreateSprint({
  projectId,
  // onSprintCreated,
  userId,
}: CreateSprintProps) {
  const state = useOverlayState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateValue, setDateValue] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(close: () => void) {
    if (!title.trim() || !dateValue) {
      addToast({
        title: "All required fields must be filled.",
        color: "danger",
      });
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
        addToast({ title: "Sprint created successfully!", color: "success" });
        setTitle("");
        setDescription("");
        setDateValue(null);
        // onSprintCreated?.();
        close(); // ← close modal on success
      } else {
        addToast({
          title: data.error || "Something went wrong.",
          color: "danger",
        });
      }
    } catch {
      addToast({ title: "Failed to create sprint.", color: "danger" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal state={state}>
      {/* First child = trigger */}
      <Button
        className="bg-linear-to-r from-[#893168] to-purple-700"
        onPress={state.open}
      >
        Create Sprint
      </Button>

      <Modal.Backdrop variant="blur" className="bg-[#292f46]/50">
        <Modal.Container className="max-w-2xl w-full">
          <Modal.Dialog className="bg-[#19172c] border border-[#292f46] text-[#a8b0d3]">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="hover:bg-white/5 active:bg-white/10" />

                <Modal.Header className="border-b border-[#292f46]">
                  <Modal.Heading className="text-2xl font-semibold">
                    Create Sprint
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-6 space-y-4">
                  {/* Title */}
                  <TextField name="title" className="w-full">
                    <Label className="text-gray-300 text-sm">
                      Sprint Title
                    </Label>
                    <Input
                      placeholder="Enter title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 px-3 py-2"
                    />
                    <FieldError />
                  </TextField>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-300 text-sm">Description</label>
                    <textarea
                      placeholder="Sprint description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 px-3 py-2 resize-none"
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
                      <Label className="text-gray-300 text-sm">
                        Select Duration
                      </Label>

                      <DateField.Group className="bg-[#262626] border border-gray-700 rounded-lg">
                        <DateField.InputContainer className="text-white px-3 py-2">
                          <DateField.Input slot="start">
                            {(segment) => (
                              <DateField.Segment
                                segment={segment}
                                className="text-white focus:bg-violet-500/20 rounded px-0.5"
                              />
                            )}
                          </DateField.Input>
                          <DateRangePicker.RangeSeparator className="text-gray-400 mx-1" />
                          <DateField.Input slot="end">
                            {(segment) => (
                              <DateField.Segment
                                segment={segment}
                                className="text-white focus:bg-violet-500/20 rounded px-0.5"
                              />
                            )}
                          </DateField.Input>
                        </DateField.InputContainer>

                        <DateField.Suffix>
                          <DateRangePicker.Trigger className="text-gray-400 hover:text-violet-400 px-2">
                            <DateRangePicker.TriggerIndicator />
                          </DateRangePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>

                      <FieldError className="text-red-400 text-xs" />

                      <DateRangePicker.Popover className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl p-3">
                        <RangeCalendar aria-label="Choose sprint duration">
                          <RangeCalendar.Header className="flex items-center justify-between mb-2">
                            <RangeCalendar.YearPickerTrigger>
                              <RangeCalendar.YearPickerTriggerHeading className="text-white font-medium" />
                              <RangeCalendar.YearPickerTriggerIndicator className="text-gray-400" />
                            </RangeCalendar.YearPickerTrigger>
                            <div className="flex gap-1">
                              <RangeCalendar.NavButton
                                slot="previous"
                                className="text-gray-400 hover:text-white p-1 rounded"
                              />
                              <RangeCalendar.NavButton
                                slot="next"
                                className="text-gray-400 hover:text-white p-1 rounded"
                              />
                            </div>
                          </RangeCalendar.Header>

                          <RangeCalendar.Grid>
                            <RangeCalendar.GridHeader>
                              {(day) => (
                                <RangeCalendar.HeaderCell className="text-gray-500 text-xs font-medium">
                                  {day}
                                </RangeCalendar.HeaderCell>
                              )}
                            </RangeCalendar.GridHeader>
                            <RangeCalendar.GridBody>
                              {(date) => (
                                <RangeCalendar.Cell
                                  date={date}
                                  className="text-white text-sm rounded hover:bg-violet-500/20 data-selected:bg-violet-600 data-selection-start:bg-violet-700 data-selection-end:bg-violet-700"
                                />
                              )}
                            </RangeCalendar.GridBody>
                          </RangeCalendar.Grid>
                        </RangeCalendar>
                      </DateRangePicker.Popover>
                    </DateRangePicker>
                  </div>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#292f46]">
                  <Button
                    variant="ghost"
                    onPress={close}
                    isDisabled={loading}
                    className="text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => handleSubmit(close)}
                    isPending={loading}
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
