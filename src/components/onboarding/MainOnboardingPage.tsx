"use client";

import { useEffect, useState } from "react";
import { InviteModal } from "../InviteUserModal";
import CreateOrganization from "../createOrganization/CreateOrganization";
import { UserType } from "@/lib/types";
import { useAppDispatch } from "@/redux/hooks";

export default function MainOnboardingPage(user: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-[#09080f]">
        <InviteModal />

        <div className="bg-[#110f1a] border border-[#2a2040] rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-medium text-[#e8e4f0]">Welcome 👋</h1>
          <p className="text-[#7c6fa0] text-sm">
            You're not part of any organization yet.
          </p>
          <p onClick={() => setIsModalOpen(true)}>Create an Organization</p>
          <p className="text-[#4d3d7a] text-xs">
            Or ask your admin to invite you via email.
          </p>
        </div>

        <CreateOrganization
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setOrganizationName={setOrganizationName}
        />
      </div>
    </>
  );
}
