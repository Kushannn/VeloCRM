"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Modal, Button, toast } from "@heroui/react";
import { useDispatch } from "react-redux";
import { setOrganization } from "@/redux/slices/orgSlice";
import Cookies from "js-cookie";

export function InviteModal() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setInviteToken(token);
      setShowModal(true);
    }
  }, [searchParams]);

  const handleAcceptInvite = async () => {
    if (!inviteToken) return;
    setLoading(true);

    const res = await fetch("/api/invites/verify-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: inviteToken }),
    });
    const result = await res.json();

    if (result.success) {
      dispatch(setOrganization(result.data));
      Cookies.set("orgSlug", result.data.slug);
      toast.success("Successfully joined the organization!");
      setShowModal(false);

      router.replace(`/organization/${result.data.slug}/dashboard`);
    } else {
      toast.danger(result.error || "Failed to join.");
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={showModal} onOpenChange={setShowModal}>
      <Modal.Backdrop variant="blur" className="bg-[#09080f]/60">
        <Modal.Container className="w-full max-w-2xl">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
            <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />
            <Modal.Header className="border-b border-[#2a2040] pb-4">
              <Modal.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                You've been invited to a organization !
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-4 p-4">
              <p className="text-[#7c6fa0] text-sm w-full">
                Do you want to accept the invite?
              </p>
            </Modal.Body>

            <Modal.Footer className="border-t border-[#2a2040] pt-6">
              <Button
                variant="ghost"
                onPress={() => setShowModal(false)}
                isDisabled={loading}
                className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
              >
                Cancel
              </Button>

              <Button
                variant="secondary"
                onPress={handleAcceptInvite}
                isDisabled={loading}
                className="bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] transition-colors"
              >
                {loading ? "Accepting" : "Accept Invite"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
