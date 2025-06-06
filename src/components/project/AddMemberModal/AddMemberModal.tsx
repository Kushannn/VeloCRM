"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
  Avatar,
} from "@heroui/react";
import { useUserStore } from "@/stores/setUserStore";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: any;
  organizationMembers: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  }[];
}

export default function AddMemberModal({
  isOpen,
  onClose,
  organization,
  organizationMembers,
}: AddMemberModalProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const user = useUserStore((state) => state.user);

  function handleSelect(userId: string) {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
              Select a Member
            </ModalHeader>

            <ModalBody className="space-y-4 max-h-[400px] overflow-y-auto">
              {organizationMembers.length === 0 ? (
                <p className="text-center text-sm text-gray-400">
                  No members found.
                </p>
              ) : (
                organizationMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-[#262626] rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      {member.user.image ? (
                        <img
                          src={member.user.image}
                          alt={member.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center">
                          {member.user.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold">
                          {member.user.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={
                        selectedUserIds.includes(member.user.id)
                          ? "solid"
                          : "bordered"
                      }
                      color="primary"
                      onPress={() => handleSelect(member.user.id)}
                    >
                      {selectedUserIds.includes(member.user.id)
                        ? "Selected"
                        : "Select"}
                    </Button>
                  </div>
                ))
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={close} className="text-white">
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  console.log("Selected user IDs:", selectedUserIds);
                  close();
                }}
                isDisabled={selectedUserIds.length === 0}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
