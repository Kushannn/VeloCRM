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
import { UserType } from "@/lib/types";
import { useUserStore } from "@/stores/setUserStore";

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const setUserGlobal = useUserStore((state) => state.setUser);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/get-user");
      const data = await res.json();
      setUser(data);
      setUserGlobal(data);
    }
    fetchUser();
  }, []);

  // Detect invite token
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setInviteToken(token);
      setShowModal(true);
    }
  }, [searchParams]);

  const handleAcceptInvite = async () => {
    if (!inviteToken) return;

    const res = await fetch("/api/invites/accept-invite", {
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

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-gray-400">Here’s your CRM dashboard overview</p>
        </div>

        <div className="flex flex-row gap-10">
          <Card className="bg-[#141414] w-xl">
            <CardHeader className="border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                Recent Activity
              </h2>
            </CardHeader>
            <CardBody className="text-[#B0B0B0] space-y-2">
              <p>✅ You closed a deal with XYZ Corp.</p>
              <p>📞 Follow-up call with Emma completed.</p>
              <p>📩 Sent email to new lead: Ankit Patel.</p>
            </CardBody>
          </Card>

          <Card className="bg-[#141414] w-xl">
            <CardHeader className="border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                Today's Tasks
              </h2>
            </CardHeader>
            <CardBody>
              <ul className="text-[#B0B0B0] list-disc pl-6 space-y-2">
                <li>Call lead: John Doe</li>
                <li>Prepare proposal for ACME Corp</li>
                <li>Email follow-up to Sam</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={showModal} onOpenChange={setShowModal}>
        <ModalContent>
          <ModalHeader>You've been invited!</ModalHeader>
          <ModalBody>
            <p>
              You’ve received an invite to join an organization. Do you want to
              accept it?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleAcceptInvite}>
              Accept Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
