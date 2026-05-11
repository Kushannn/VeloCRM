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
  const currentOrg = useAppSelector((state) => state.organization.currentOrg);

  async function handleSubmit(close: () => void) {
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
          organizationId: currentOrg?.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addToast({
          title: "Project created successfully!",
          variant: "solid",
          color: "success",
        });
        setProjectName("");
        setDescription("");
        close();
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
      console.log("Are we even coming here ? ", loading);
      setLoading(false);
      console.log("Are we even coming here2  ? ", loading);
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
            <ModalHeader className="  text-2xl font-semibold">
              Create Projects
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="Project Name"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Enter name..."
                value={projectName}
                isRequired
                onChange={(e) => setProjectName(e.target.value)}
                classNames={{
                  input: "  placeholder-gray-400",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-[#262626] border border-gray-700 rounded-lg   focus-within:ring-0 focus-within:ring-offset-0",
                }}
              />
              <Input
                label="Project Description"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                classNames={{
                  input: "  placeholder-gray-400",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-[#262626] border border-gray-700 rounded-lg   focus-within:ring-0 focus-within:ring-offset-0",
                }}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={close}
                disabled={loading}
                className=" "
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => handleSubmit(close)}
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
