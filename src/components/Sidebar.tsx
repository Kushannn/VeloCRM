"use client";

import React, { useEffect, useState } from "react";
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
import { redirect } from "next/navigation";
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
import Link from "next/link";

function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [organizationName, setOrganizationName] = useState<string | null>(null);

  const [sendInviteLoading, setSendInviteLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const [inviteModal, setInviteModal] = useState(false);

  const [email, setEmail] = useState("");

  async function handleSendInvite() {
    if (!email) {
      addToast({
        title: " Email is required",
        variant: "solid",
        color: "danger",
      });
      return;
    }

    setSendInviteLoading(true);

    try {
      const res = await fetch("/api/invites/send-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log("Error inviting usre", user);
      return;
    }
  }

  return (
    <>
      <div className="w-64 p-4 flex flex-col gap-4">
        <div
          className="h-14 cursor-pointer mt-4 font-bold text-lg p-2 hover:bg-[#171717] rounded-md text-white flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span>
            <Building />
          </span>
          <span>
            {user?.ownedOrganizations
              ? user.ownedOrganizations[0].name
              : "Create an organization"}
          </span>
        </div>
        <div className="flex pl-4 h-14 cursor-pointer rounded-md gap-4 items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <Home className="text-sky-300" />
          Home
        </div>
        <div className=" pl-4 flex gap-4 h-14 cursor-pointer rounded-md items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <BookCheck className="text-sky-300" />
          Sprints
        </div>
        <div className=" pl-4 flex rounded-md gap-4 h-14 curosr-pointer items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <ClipboardList className="text-sky-300" />
          Tasks
        </div>
        <div className=" pl-4 flex gap-4 h-14 rounded-md cursor-pointer items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <Home className="text-sky-300" />
          Leads
        </div>
        <Link
          href={
            "/organization/" + user?.membership?.organizationId + "/projects"
          }
          className=" pl-4 flex gap-4 h-14 rounded-md cursor-pointer items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2"
          // onClick={() =>
          //   redirect(
          //     "/organization/" + user?.membership?.organizationId + "/projects"
          //   )
          // }
        >
          <FolderOpenDot className="text-sky-300" />
          Projects
        </Link>
        <div
          className=" pl-4 flex gap-4 h-14 rounded-md cursor-pointer items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2"
          onClick={() => setInviteModal(true)}
        >
          <UserPlus className="text-sky-300" />
          Invite
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
