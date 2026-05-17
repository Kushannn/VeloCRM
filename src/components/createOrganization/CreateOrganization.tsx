"use client";

import { useState } from "react";
import {
  Modal,
  toast,
  Button,
  Input,
  TextField,
  Label,
  FieldError,
} from "@heroui/react";

interface CreateOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
  setOrganizationName: (name: string) => void;
  // This prop is used to set the organization name in the parent component
}

export default function CreateOrganization({
  isOpen,
  onClose,
  setOrganizationName,
}: CreateOrganizationProps) {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!orgName.trim()) {
      toast.danger("Organization name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/organization/create-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: orgName }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Organization created successfully!");
        onClose();
        setOrgName("");
        setOrganizationName(data.organization.name);
      } else {
        toast.danger("Something went wrong");
      }
    } catch (err) {
      toast.danger("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <Modal.Backdrop variant="blur" className={"bg-[#292f46]/50"}>
        <Modal.Container
          size="lg"
          className="border border-[#292f46] bg-[#19172c] text-[#a8b0d3] w-full max-w-2xl"
        >
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="hover:bg-white/5 active:bg-white/10" />
                <Modal.Header className="border-b border-[#292f46]">
                  <Modal.Heading className="text-white text-2xl font-semibold">
                    Create Organization
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-6 space-y-4">
                  <TextField name="name" className="flex-1">
                    <Label className="text-gray-300 text-sm">
                      Organization Name
                    </Label>
                    <Input
                      placeholder="Enter lead name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                    />
                    <FieldError />
                  </TextField>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#292f46]">
                  <Button
                    variant="primary"
                    onPress={onClose}
                    isDisabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={handleSubmit}
                    isPending={loading}
                  >
                    {loading ? "Creating..." : "Create"}
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
