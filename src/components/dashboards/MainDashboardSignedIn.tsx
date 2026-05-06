"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  firstName: string;
  todayShort: string;
};

export default function MainDasboardSignedIn({ firstName, todayShort }: Props) {
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
    <>
      <div className="p-4 space-y-6">
        <h1 className="text-3xl font-bold">Welcome back, {firstName}</h1>

        <p className="text-gray-400">{todayShort}</p>

        <div className="flex gap-6">
          <Card className="w-1/2 bg-[#242124] border border-gray-800">
            <CardHeader>Recent Activity</CardHeader>
            <CardBody>
              <p>✅ You closed a deal</p>
            </CardBody>
          </Card>

          <Card className="w-1/2 bg-[#242124] border border-gray-800">
            <CardHeader>Recent Activity</CardHeader>
            <CardBody>
              <p>📞 Follow-up call done</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={showModal} onOpenChange={setShowModal}>
        <ModalContent>
          <ModalHeader>You've been invited!</ModalHeader>
          <ModalBody>
            <p>Do you want to accept the invite?</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAcceptInvite}>Accept</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
