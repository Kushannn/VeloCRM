"use client";

import React, { useState } from "react";
import {
  Building,
  Home,
  BookCheck,
  FolderOpenDot,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import CreateOrganization from "./createOrganization/CreateOrganization";
import CreateProject from "./project/createProject/CreateProject";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [sendInviteLoading, setSendInviteLoading] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  async function handleSendInvite() {
    if (!email) {
      addToast({
        title: "Email is required",
        variant: "solid",
        color: "danger",
      });
      return;
    }
    setSendInviteLoading(true);
    try {
      const res = await fetch("/api/invites/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: user?.membership?.organizationId,
          email: email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendInviteLoading(false);
        addToast({
          title: "User invited successfully",
          variant: "solid",
          color: "success",
        });
        return;
      }
    } catch (error) {
      addToast({
        title: "Could not invite user",
        variant: "solid",
        color: "danger",
      });
      return;
    }
  }

  return (
    <>
      <div className="w-full sm:w-64 p-4 flex flex-col gap-4 bg-[#111] min-h-screen">
        <div
          className="h-12 sm:h-14 cursor-pointer mt-2 font-bold text-base sm:text-lg p-2 hover:bg-[#171717] rounded-md text-white flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span>
            <Building />
          </span>
          <span className="truncate">
            {user?.ownedOrganizations
              ? user?.ownedOrganizations[0]?.name
              : "Create an organization"}
          </span>
        </div>

        <div className="flex items-center gap-4 font-bold text-sky-300 bg-[#0a2540cc] hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base">
          <Home className="text-sky-300" />
          <span>Home</span>
        </div>

        <div className="flex items-center gap-4 font-bold text-sky-300 bg-[#0a2540cc] hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base">
          <BookCheck className="text-sky-300" />
          <span>Sprints</span>
        </div>

        <div className="flex items-center gap-4 font-bold text-sky-300 bg-[#0a2540cc] hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base">
          <ClipboardList className="text-sky-300" />
          <span>Tasks</span>
        </div>

        <div className="flex items-center gap-4 font-bold text-sky-300 bg-[#0a2540cc] hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base">
          <Home className="text-sky-300" />
          <span>Leads</span>
        </div>

        <div
          onClick={() => {
            router.push(
              "/organization/" + user?.membership?.organizationId + "/projects"
            );
          }}
          className="flex items-center gap-4 font-bold text-sky-300 bg-[#0a2540cc] hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base"
        >
          <FolderOpenDot className="text-sky-300" />
          <span>Projects</span>
        </div>

        <div
          className="flex items-center gap-4 font-bold text-sky-300 bg-[#0a2540cc] hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base"
          onClick={() => setInviteModal(true)}
        >
          <UserPlus className="text-sky-300" />
          <span>Invite</span>
        </div>
      </div>

      <Modal
        isOpen={inviteModal}
        onOpenChange={setInviteModal}
        className="bg-[#1a1a1a] text-white"
      >
        <ModalContent className="bg-[#1a1a1a] text-white">
          <ModalHeader className="border-b border-gray-700">
            Invite People to the Organization
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300 mb-2">
              Enter the email of the person you want to invite
            </p>
            <Input
              label="Email"
              variant="bordered"
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              classNames={{
                input: "text-white placeholder-white",
                label: "text-white",
                inputWrapper:
                  "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0 focus-within:ring-offset-0",
              }}
            />
          </ModalBody>
          <ModalFooter className="border-t border-gray-700">
            <Button variant="ghost" onClick={() => setInviteModal(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSendInvite}
              isLoading={sendInviteLoading}
            >
              Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CreateOrganization
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setOrganizationName={setOrganizationName}
      />
      <CreateProject
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </>
  );
}

export default Sidebar;
