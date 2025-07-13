"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  addToast,
  DateRangePicker,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface CreateSprintProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSprintCreated?: () => void;
  userId: string;
}

export default function CreateSprint({
  isOpen,
  onClose,
  projectId,
  onSprintCreated,
  userId,
}: CreateSprintProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateValue, setDateValue] = useState<any>(undefined);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !dateValue) {
      addToast({
        title: "All required fields must be filled.",
        variant: "solid",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert DateValue to ISO strings
      const startDate = dateValue.start.toDate("UTC").toISOString();
      const endDate = dateValue.end.toDate("UTC").toISOString();

      const res = await fetch(
        `/api/project/${projectId}/sprint/create-sprint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            startDate,
            endDate,
            userId,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        addToast({
          title: "Sprint created successfully!",
          variant: "solid",
          color: "success",
        });
        onClose();
        setTitle("");
        setDescription("");
        setDateValue(null);
        onSprintCreated?.();
      } else {
        addToast({
          title: data.error || "Something went wrong.",
          variant: "solid",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: "Failed to create sprint.",
        variant: "solid",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

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
              Create Sprint
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="Sprint Title"
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
                placeholder="Sprint description..."
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

              <DateRangePicker
                label="Select Duration"
                variant="bordered"
                value={dateValue}
                minValue={parseDate(new Date().toISOString().split("T")[0])}
                onChange={(newRange: any) => setDateValue(newRange)}
                classNames={{
                  base: "bg-[#262626] text-white rounded-md",
                  label: "text-gray-400",
                  calendar: "bg-gray-800 text-white",
                  selectorButton: "bg-gray-700 text-gray-200",
                  selectorIcon: "text-purple-400",
                  popoverContent: "bg-gray-900  shadow-lg",
                  calendarContent: "bg-gray-800",
                }}
                className="font-black"
              />
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
                {loading ? "Creating..." : "Create Sprint"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
