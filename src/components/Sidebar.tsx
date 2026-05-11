"use client";

interface sidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

import React, { useEffect, useState } from "react";
import {
  Building,
  Home,
  FolderOpenDot,
  UserPlus,
  Users,
  Plus,
  ChevronRight,
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useAppSelector } from "@/redux/hooks";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setOrganization } from "@/redux/slices/orgSlice";

function Sidebar({ onExpandChange }: sidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [sendInviteLoading, setSendInviteLoading] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const urlSlug = params?.slug as string | undefined;
  const currentOrg = useAppSelector((state) => state.organization.currentOrg);
  const activeOrg = currentOrg;
  const user = useAppSelector((state) => state.auth.user);

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

  const allOrgs = [
    ...(user?.ownedOrganizations ?? []),
    ...(user?.membership?.map((m) => m.organization) ?? []),
  ].filter(
    (org, index, self) => self.findIndex((o) => o.id === org.id) === index,
  );

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
          orgId: activeOrg?.id,
          email,
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
      }
    } catch {
      addToast({
        title: "Could not invite user",
        variant: "solid",
        color: "danger",
      });
    }
  }

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onExpandChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onExpandChange?.(false);
  };

  const navItems = [
    {
      icon: <Home size={18} />,
      label: "Home",
      onClick: () => router.push("/dashboard"),
    },
    {
      icon: <FolderOpenDot size={18} />,
      label: "Projects",
      onClick: () => router.push(`/organization/${activeOrg?.slug}/projects`),
    },
    {
      icon: <Users size={18} />,
      label: "Employees",
      onClick: () => router.push(`/organization/${activeOrg?.id}/employees`),
    },
    {
      icon: <Home size={18} />,
      label: "Leads",
      onClick: () => {},
    },
  ];

  const actionItems = [
    {
      icon: <Plus size={18} />,
      label: "Create Organization",
      onClick: () => setIsModalOpen(true),
    },
    {
      icon: <UserPlus size={18} />,
      label: "Invite Member",
      onClick: () => setInviteModal(true),
    },
  ];

  return (
    <>
      <div
        className="relative flex flex-col h-full transition-all duration-300 ease-in-out"
        style={{ width: isExpanded ? "240px" : "64px" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#0a0a0a] border-r border-[#1f1f1f]" />

        {/* Content */}
        <div className="relative flex flex-col h-full py-4 overflow-hidden">
          {/* Org Switcher */}
          <div className="px-3 mb-4">
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors group">
                  <div className="w-8 h-8 rounded-md bg-violet-900/60 border border-violet-700/40 flex items-center justify-center flex-shrink-0">
                    <Building size={14} className="text-violet-300" />
                  </div>
                  <div
                    className="flex-1 min-w-0 transition-all duration-300 overflow-hidden"
                    style={{
                      opacity: isExpanded ? 1 : 0,
                      width: isExpanded ? "auto" : 0,
                    }}
                  >
                    <p className="text-xs font-semibold text-white truncate">
                      {activeOrg?.name ?? "Select org"}
                    </p>
                    <p className="text-[10px] text-zinc-500">Organization</p>
                  </div>
                  {isExpanded && (
                    <ChevronRight
                      size={14}
                      className="text-zinc-600 flex-shrink-0"
                    />
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Organizations"
                items={allOrgs}
                classNames={{
                  base: "bg-[#111111] border border-[#222222] rounded-xl shadow-xl",
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
                      base: "data-[hover=true]:bg-[#1a1a1a] rounded-lg",
                      title:
                        activeOrg?.id === org.id
                          ? "text-violet-400 font-medium"
                          : "text-zinc-200",
                      description: "text-zinc-600",
                    }}
                    description={org.slug}
                  >
                    {org.name}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Divider */}
          <div className="mx-3 mb-4 h-px bg-[#1f1f1f]" />

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3 flex-1">
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-left w-full group cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-zinc-400 group-hover:text-violet-400 transition-colors">
                  {item.icon}
                </div>
                <span
                  className="text-sm text-zinc-400 group-hover:text-zinc-100 transition-all duration-300 whitespace-nowrap overflow-hidden"
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    maxWidth: isExpanded ? "160px" : "0px",
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-3 my-4 h-px bg-[#1f1f1f]" />

          {/* Action Items */}
          <div className="flex flex-col gap-1 px-3">
            {actionItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors text-left w-full group cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-zinc-500 group-hover:text-violet-400 transition-colors">
                  {item.icon}
                </div>
                <span
                  className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-all duration-300 whitespace-nowrap overflow-hidden"
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    maxWidth: isExpanded ? "160px" : "0px",
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={inviteModal} onOpenChange={setInviteModal}>
        <ModalContent className="bg-[#111111] border border-[#222222]">
          <ModalHeader className="border-b border-[#1f1f1f] text-white">
            Invite People to the Organization
          </ModalHeader>
          <ModalBody>
            <p className="text-zinc-400 text-sm mb-2">
              Enter the email of the person you want to invite
            </p>
            <Input
              label="Email"
              variant="bordered"
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              classNames={{
                input: "placeholder-zinc-600 text-white",
                label: "text-zinc-400",
                inputWrapper: "bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg",
              }}
            />
          </ModalBody>
          <ModalFooter className="border-t border-[#1f1f1f]">
            <Button
              variant="ghost"
              onClick={() => setInviteModal(false)}
              className="text-zinc-400"
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={handleSendInvite}
              isLoading={sendInviteLoading}
            >
              Send Invite
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
