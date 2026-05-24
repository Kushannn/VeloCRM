"use client";

import { useState } from "react";
import { Modal, Button, useOverlayState, toast } from "@heroui/react";
import { CircleUser } from "lucide-react";

interface AddMemberModalProps {
  organization: any;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  organizationMembers: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }[];
}

export default function AddMemberModal({
  isOpen,
  onClose,
  organization,
  projectId,
  organizationMembers,
}: AddMemberModalProps) {
  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  function handleSelect(userId: string) {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  }

  async function handleSubmit(close: () => void) {
    if (selectedUserIds.length === 0) {
      toast.danger("No users selected");
      return;
    }

    try {
      const res = await fetch(
        `/api/project/${projectId}/add-member-to-project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: selectedUserIds }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add members");
      }

      toast.success("Members added successfully");
      setSelectedUserIds([]);
      close();
    } catch {
      toast.danger("Error adding members");
    }
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop
        variant="blur"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <Modal.Container className="max-w-2xl w-full ">
          <Modal.Dialog className="bg-[#19172c] border border-[#292f46] text-[#a8b0d3] rounded-xl shadow-2xl">
            {({ close }) => (
              <>
                <Modal.Header className="border-b border-[#292f46] px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <Modal.Heading className="text-2xl font-semibold">
                      Select a Member
                    </Modal.Heading>
                    <Modal.CloseTrigger className="hover:bg-white/5 active:bg-white/10 rounded-lg p-1" />
                  </div>
                </Modal.Header>

                <Modal.Body className="px-6 *:py-6 space-y-3 max-h-100 overflow-y-auto">
                  {organizationMembers.length === 0 ? (
                    <p className="text-center text-sm text-gray-400">
                      No members found.
                    </p>
                  ) : (
                    organizationMembers.map((member) => {
                      const isSelected = selectedUserIds.includes(
                        member.user.id,
                      );
                      return (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            isSelected
                              ? "bg-violet-500/10 border-violet-500/30"
                              : "bg-[#262626] border-gray-700 hover:border-gray-600"
                          } h-16 my-4`}
                        >
                          <div className="flex items-center gap-3">
                            {member.user.image ? (
                              <img
                                src={member.user.image}
                                alt={member.user.name ?? "User"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-violet-900/40 border border-violet-700/30 flex items-center justify-center">
                                <CircleUser
                                  size={20}
                                  className="text-violet-300"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white">
                                {member.user.name ?? "Unknown"}
                              </p>
                              <p className="text-sm text-gray-400">
                                {member.user.email}
                              </p>
                            </div>
                          </div>

                          <Button
                            variant={isSelected ? "primary" : "secondary"}
                            // color="primary"
                            size="sm"
                            onPress={() => handleSelect(member.user.id)}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Button>
                        </div>
                      );
                    })
                  )}
                </Modal.Body>

                <Modal.Footer className="border-t border-[#292f46] px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onPress={close}
                    className="text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => handleSubmit(close)}
                    isDisabled={selectedUserIds.length === 0}
                  >
                    Confirm ({selectedUserIds.length})
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
