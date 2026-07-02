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
          body: JSON.stringify({ userIds: selectedUserIds, projectId }),
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
      <Modal.Backdrop variant="blur" className="bg-[#09080f]/60">
        <Modal.Container className="max-w-2xl w-full ">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />
                <Modal.Header className="border-b border-[#2a2040] pb-4">
                  <Modal.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                    Select a Member
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="px-6 *:py-6 space-y-3 max-h-100 overflow-y-auto">
                  {organizationMembers.length === 0 ? (
                    <p className="text-center text-sm text-[#7c6fa0]">
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
                              ? "bg-[#2d1d5e] border-[#6c3fc4]"
                              : "bg-[#1a1232] border-[#3d2d6b] hover:border-[#4c2d9e]"
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
                              <div className="w-10 h-10 rounded-full bg-[#2d1d5e] border border-[#3d2d6b] flex items-center justify-center">
                                <CircleUser
                                  size={20}
                                  className="text-[#c4a8f5]"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-[#e8e4f0]">
                                {member.user.name ?? "Unknown"}
                              </p>
                              <p className="text-sm text-[#7c6fa0]">
                                {member.user.email}
                              </p>
                            </div>
                          </div>

                          <Button
                            variant={isSelected ? "primary" : "secondary"}
                            size="sm"
                            onPress={() => handleSelect(member.user.id)}
                            className={
                              isSelected
                                ? "bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb]"
                                : "bg-[#1a1232] border border-[#3d2d6b] hover:border-[#4c2d9e] text-[#b8aed4] hover:text-[#e8e4f0]"
                            }
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
                    className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => handleSubmit(close)}
                    isDisabled={selectedUserIds.length === 0}
                    className="bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] transition-colors"
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
