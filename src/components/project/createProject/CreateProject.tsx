"use client";

import { useState } from "react";
import {
  Modal,
  Button,
  Input,
  toast,
  TextField,
  Label,
  FieldError,
  useOverlayState,
} from "@heroui/react";
import { useAppSelector } from "@/redux/hooks";

interface CreateProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProject({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const currentOrg = useAppSelector((state) => state.organization.currentOrg);

  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

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
        onSuccess();
        close();
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
      <Modal.Backdrop variant="blur" className="bg-[#09080f]/60">
        <Modal.Container className="w-full max-w-2xl">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />

                <Modal.Header className="border-b border-[#2a2040] pb-4">
                  <Modal.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                    Create Project
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-6 space-y-4 px-2">
                  <TextField name="name" isRequired className="w-full">
                    <Label className="text-[#b8aed4] text-sm">
                      Project Name
                    </Label>
                    <textarea
                      placeholder="Enter project name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] focus:border-[#6c3fc4] focus:outline-none placeholder-[#7c6fa0] rounded-lg text-[#e8e4f0] px-3 py-2 transition-colors"
                    />
                    <FieldError className="text-[#f87171] text-xs" />
                  </TextField>

                  <TextField name="description" className="w-full">
                    <Label className="text-[#b8aed4] text-sm">
                      Description
                    </Label>
                    <textarea
                      placeholder="Description.."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] focus:border-[#6c3fc4] focus:outline-none rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] w-full px-3 py-2 resize-none transition-colors"
                    />
                    <FieldError className="text-[#f87171] text-xs" />
                  </TextField>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#292f46] py-2">
                  <Button
                    variant="ghost"
                    onPress={close}
                    className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    isPending={loading}
                    onPress={() => handleSubmit(close)}
                    className="bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] transition-colors"
                  >
                    {loading ? "Creating" : "Create"}
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
