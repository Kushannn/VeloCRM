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
  Textarea,
  addToast,
} from "@heroui/react";
import { useParams } from "next/navigation";

interface AddLeadProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  //   onSuccess?: () => void;
}

export default function AddLead({
  isOpen,
  onClose,
  organizationId,
}: //   onSuccess,
AddLeadProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (!formData.name.trim()) {
      addToast({
        title: "Lead name is required",
        variant: "solid",
        color: "danger",
      });
      return;
    }

    const finalData = { ...formData, organizationId };

    setLoading(true);
    try {
      const res = await fetch(
        `/api/organization/${organizationId}/leads/add-lead`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...finalData,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        addToast({
          title: "Lead created successfully!",
          variant: "solid",
          color: "success",
        });
        onClose();
        setFormData({
          name: "",
          email: "",
          phone: "",
          source: "",
          notes: "",
        });
        // onSuccess?.();
      } else {
        addToast({
          title: data.error || "Something went wrong.",
          variant: "solid",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: "Failed to create lead.",
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
              Create Lead
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="flex gap-4">
                <Input
                  label="Name"
                  placeholder="Enter lead name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white placeholder-gray-400",
                    label: "text-gray-300",
                    inputWrapper:
                      "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
                  }}
                />
                <Input
                  label="Email"
                  placeholder="Enter lead email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white placeholder-gray-400",
                    label: "text-gray-300",
                    inputWrapper:
                      "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
                  }}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  label="Phone"
                  placeholder="Enter lead phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white placeholder-gray-400",
                    label: "text-gray-300",
                    inputWrapper:
                      "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
                  }}
                />
                <Input
                  label="Source"
                  placeholder="Lead source (e.g., LinkedIn, Website)"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-white placeholder-gray-400",
                    label: "text-gray-300",
                    inputWrapper:
                      "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
                  }}
                />
              </div>
              <Textarea
                label="Notes"
                placeholder="Optional notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                variant="bordered"
                classNames={{
                  input: "text-white placeholder-gray-400",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
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
