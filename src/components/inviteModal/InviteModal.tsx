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

interface CreateOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
  setOrganizationName: (name: string) => void;
}

export default function CreateOrganization({
  isOpen,
  onClose,
  setOrganizationName,
}: CreateOrganizationProps) {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {}

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
              Invite People To Your Organizaiton
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="Email ID "
                placeholder="Enter email..."
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
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
                {loading ? "Inviting..." : "Invite"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
