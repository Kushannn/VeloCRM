"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Modal, Button } from "@heroui/react";

export function InviteModal() {
  const [showModal, setShowModal] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setInviteToken(token);
      setShowModal(true);
    }
  }, [searchParams]);

  const handleAcceptInvite = async () => {
    if (!inviteToken) return;

    const res = await fetch("/api/invites/verify-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: inviteToken }),
    });

    const result = await res.json();

    if (result.success) {
      alert("Successfully joined the organization!");
      setShowModal(false);
      router.replace("/dashboard");
    } else {
      alert(result.error || "Failed to join.");
    }
  };

  return (
    <Modal>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>You've Been Invited!</Modal.Header>
            <Modal.Body>
              <p>Do you accept the invite?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleAcceptInvite}>Accept</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
