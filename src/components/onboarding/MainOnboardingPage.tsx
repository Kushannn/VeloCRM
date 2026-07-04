"use client";

import { useState } from "react";
import { InviteModal } from "../InviteUserModal";
import CreateOrganization from "../createOrganization/CreateOrganization";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function MainOnboardingPage(user: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-[#09080f]">
        <InviteModal />

        <div className="bg-[#110f1a] border border-[#2a2040] rounded-2xl p-10 h-full w-full text-center relative overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#6c3fc4]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-[#1a1232] border border-[#3d2d6b] flex items-center justify-center mb-6">
              <span className="text-4xl">👋</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-[#e8e4f0] leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#c4a8f5] bg-clip-text text-transparent">
                VeloCRM
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-[#7c6fa0] text-base max-w-sm leading-relaxed">
              You're not part of any organization yet. Create your first
              workspace to start managing projects and collaborating with your
              team.
            </p>

            {/* CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 px-8 py-3 rounded-xl bg-[#6c3fc4] hover:bg-[#8b5cf6] text-[#ede8fb] font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#6c3fc4]/25"
            >
              Create Organization
            </button>

            {/* Footer */}
            <div className="mt-6 flex items-center gap-2 text-sm text-[#7c6fa0]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
                />
              </svg>

              <span>Or ask your administrator to invite you via email.</span>
            </div>
          </div>
        </div>

        <CreateOrganization
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setOrganizationName={setOrganizationName}
          onSuccess={() => router.refresh()}
        />
      </div>
    </>
  );
}
