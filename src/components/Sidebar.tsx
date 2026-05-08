"use client";

import React, { useEffect, useState } from "react";
import { Building, Home, FolderOpenDot, UserPlus, Users } from "lucide-react";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useAppSelector } from "@/redux/hooks";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setOrganization } from "@/redux/slices/orgSlice";

function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [sendInviteLoading, setSendInviteLoading] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const dispatch = useDispatch();
  const params = useParams();
  const urlSlug = params?.slug as String | undefined;
  const currentOrg = useAppSelector((state) => state.organization.currentOrg);

  useEffect(() => {
    if (urlSlug && user?.membership) {
      const matchedOrg = user.membership.find(
        (m) => m.organization.slug === urlSlug,
      )?.organization;

      if (matchedOrg && matchedOrg.id !== currentOrg?.id) {
        dispatch(setOrganization(matchedOrg));
      }
    }
  }, [urlSlug]);

  const activeOrg = currentOrg;

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
          orgId: user?.membership?.[0]?.organizationId,
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

  const allOrgs = [
    ...(user?.ownedOrganizations ?? []),
    ...(user?.membership?.map((m) => m.organization) ?? []),
  ].filter(
    (org, index, self) => self.findIndex((o) => o.id === org.id) === index, // dedupe
  );

  return (
    <>
      <div className="w-full sm:w-64 p-4 flex flex-col gap-4 ml-3 min-h-full rounded-xl bg-gradient-to-br from-[#121213] to-[#1c1d1e]  ">
        <Dropdown>
          <DropdownTrigger>
            <div className="h-12 sm:h-14 cursor-pointer mt-2 font-bold text-base sm:text-lg p-2 hover:bg-[#171717] rounded-md flex items-center gap-2">
              <Building />
              <span className="truncate">
                {activeOrg?.name ?? "Select organization"}
              </span>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Organizations"
            items={allOrgs}
            classNames={{
              base: "bg-[#1a1a1a] border border-gray-700 rounded-lg",
            }}
          >
            {(org) => (
              <DropdownItem
                key={org.id}
                onClick={() => {
                  dispatch(setOrganization(org));
                  router.push(`/organization/${org.slug}/projects`);
                }}
                classNames={{
                  base: "data-[hover=true]:bg-[#2a2a2a]",
                  title:
                    activeOrg?.id === org.id ? "text-purple-400" : "text-white",
                  description: "text-gray-500",
                }}
              >
                {org.name}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
        <div
          className="flex items-center gap-2 text-gray-400 text-sm p-2 hover:bg-[#171717] rounded-md cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span>+</span>
          <span>Create new organization</span>
        </div>
        <div
          className="flex items-center gap-4 font-bold hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base"
          onClick={() => {
            router.push("/");
          }}
        >
          <Home className="text-[#4a2040]" />
          <span>Home</span>
        </div>
        <div
          onClick={() => {
            router.push(
              "/organization/" +
                user?.membership?.[0]?.organization?.slug +
                "/projects",
            );
          }}
          className="flex items-center gap-4 font-bold hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base"
        >
          <FolderOpenDot className="text-[#4a2040]" />
          <span>Projects</span>
        </div>
        <div
          className="flex items-center gap-4 font-bold hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base"
          onClick={() => {
            router.push(
              "/organization/" +
                user?.membership?.[0]?.organizationId +
                "/employees",
            );
          }}
        >
          <Users className="text-[#4a2040]" />
          <span>Employees</span>
        </div>
        <div className="flex items-center gap-4 font-bold hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base">
          <Home className="text-[#4a2040]" />
          <span>Leads</span>
        </div>
        <div
          className="flex items-center gap-4 font-bold hover:bg-black p-2 rounded-md cursor-pointer text-sm sm:text-base"
          onClick={() => setInviteModal(true)}
        >
          <UserPlus className="text-[#4a2040]" />
          <span>Invite</span>
        </div>
      </div>

      <Modal
        isOpen={inviteModal}
        onOpenChange={setInviteModal}
        className="bg-[#1a1a1a]  "
      >
        <ModalContent className="bg-[#1a1a1a]  ">
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
                input: "  placeholder-white",
                label: " ",
                inputWrapper:
                  "bg-[#262626] border border-gray-700 rounded-lg   focus-within:ring-0 focus-within:ring-offset-0",
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
