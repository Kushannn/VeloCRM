"use client";

import { useState } from "react";
import {
  Modal,
  Button,
  Input,
  toast, // Ensure this is the correct toast import for v3
  TextField,
  Label,
  FieldError,
  useOverlayState,
  // Textarea, // HeroUI usually provides a styled Textarea
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
  const currentOrg = useAppSelector((state) => state.organization.currentOrg);

  const state = useOverlayState();

  async function handleSubmit(close: () => void) {
    if (!projectName.trim()) {
      toast.danger("Project name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/project/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          description,
          organizationId: currentOrg?.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Project created successfully!");
        setProjectName("");
        setDescription("");
        close(); // Close the modal on success
      } else {
        toast.danger(data.error || "Something went wrong");
      }
    } catch (err) {
      toast.danger("Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur" className="bg-[#292f46]/50" />
      <Modal.Container
        size="lg"
        className="border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3] w-full max-w-2xl"
      >
        <Modal.Dialog>
          <Modal.CloseTrigger className="hover:bg-white/5 active:bg-white/10" />

          <Modal.Header className="border-b border-[#292f46]">
            <Modal.Heading className="text-white text-2xl font-semibold">
              Create Project
            </Modal.Heading>
          </Modal.Header>

          <Modal.Body className="py-6 space-y-4">
            <TextField name="name" isRequired className="w-full">
              <Label className="text-gray-300 text-sm">Project Name</Label>
              <Input
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-[#262626] border border-gray-700 rounded-lg text-white"
              />
              <FieldError />
            </TextField>

            <TextField name="description" className="w-full">
              <Label className="text-gray-300 text-sm">Description</Label>
              <textarea
                placeholder="Description.."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2 resize-none"
              />
              <FieldError />
            </TextField>
          </Modal.Body>

          <Modal.Footer className="border-t border-[#292f46]">
            <Button variant="ghost" onPress={close} className="text-white">
              Cancel
            </Button>
            <Button
              variant="primary"
              isPending={loading}
              onPress={() => handleSubmit(close)}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}
