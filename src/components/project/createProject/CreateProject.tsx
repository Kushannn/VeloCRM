"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import { useAppSelector } from "@/redux/hooks";

interface CreateProjectProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProject({ isOpen, onClose }: CreateProjectProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  async function handleSubmit() {
    if (!projectName.trim()) {
      addToast({
        title: "Project name is required",
        variant: "solid",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/project/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description,
          organizationId: user?.ownedOrganizations?.[0]?.id || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addToast({
          title: "Project created successfully!",
          variant: "solid",
          color: "success",
        });
        onClose();
        setProjectName("");
        setDescription("");
      } else {
        addToast({
          title: data.error || "Something went wrong.",
          variant: "solid",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: "Failed to create organization.",
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
              Create Projects
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="Project Name"
                labelPlacement="outside"
                placeholder="Enter name..."
                value={projectName}
                isRequired
                onChange={(e) => setProjectName(e.target.value)}
                classNames={{
                  input: "text-white placeholder-gray-400",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0 focus-within:ring-offset-0",
                }}
              />
              <Input
                label="Project Description"
                labelPlacement="outside"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                classNames={{
                  input: "text-white placeholder-gray-400",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0 focus-within:ring-offset-0",
                }}
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
                {loading ? "Creating..." : "Create"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
