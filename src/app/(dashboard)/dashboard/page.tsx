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

import { useAppSelector } from "@/redux/hooks";
import { useUser } from "@clerk/nextjs";
import useFetchUser from "@/hooks/useFetchUser";

export default function DashboardPage() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  useFetchUser();
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

  if (!reduxUser) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Welcome back, {reduxUser.name} 👋
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Here’s your CRM dashboard overview
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <Card className="w-full md:w-1/2 relative p-[2px] rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#ec4899_0%,#8b5cf6_25%,#3b82f6_50%,#8b5cf6_75%,#ec4899_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused] [--border-angle:0deg] z-0 rounded-xl" />

            <div className="relative h-full rounded-[calc(0.75rem-2px)] bg-[#141414] z-10">
              <CardHeader className="border-b border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Recent Activity
                </h2>
              </CardHeader>
              <CardBody className="text-[#B0B0B0] space-y-2 text-sm sm:text-base">
                <p>✅ You closed a deal with XYZ Corp.</p>
                <p>📞 Follow-up call with Emma completed.</p>
                <p>📩 Sent email to new lead: Ankit Patel.</p>
              </CardBody>
            </div>
          </Card>

          <Card className="w-full md:w-1/2 relative p-[2px] rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#ec4899_0%,#8b5cf6_25%,#3b82f6_50%,#8b5cf6_75%,#ec4899_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused] [--border-angle:0deg] z-0 rounded-xl" />

            <div className="relative h-full rounded-[calc(0.75rem-2px)] bg-[#141414] z-10">
              <CardHeader className="border-b border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Recent Activity
                </h2>
              </CardHeader>
              <CardBody className="text-[#B0B0B0] space-y-2 text-sm sm:text-base">
                <p>✅ You closed a deal with XYZ Corp.</p>
                <p>📞 Follow-up call with Emma completed.</p>
                <p>📩 Sent email to new lead: Ankit Patel.</p>
              </CardBody>
            </div>
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
