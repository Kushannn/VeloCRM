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
  toast,
  Button,
  Input,
  Modal,
  Dropdown,
  Description,
  Label,
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
      // addToast({
      //   title: "Email is required",
      //   variant: "solid",
      //   color: "danger",
      // });
      toast.danger("Email is required");
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
        // addToast({
        //   title: "User invited successfully",
        //   variant: "solid",
        //   color: "success",
        // });
        toast.success("User invited successfully");
      }
    } catch {
      // addToast({
      //   title: "Could not invite user",
      //   variant: "solid",
      //   color: "danger",
      // });
      toast.danger("Could not invite user");
    }
  }

  // const handleMouseEnter = () => {
  //   setIsExpanded(true);
  //   onExpandChange?.(true);
  // };

  // const handleMouseLeave = () => {
  //   setIsExpanded(false);
  //   onExpandChange?.(false);
  // };

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
      onClick: () => router.push(`/organization/${activeOrg?.slug}/employees`),
    },
    {
      icon: <Home size={18} />,
      label: "Leads",
      onClick: () => router.push(`/organization/${activeOrg?.slug}/leads`),
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
              {/* Trigger — first child */}
              <Dropdown.Trigger>
                <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors group">
                  <div className="w-8 h-8 rounded-md bg-violet-900/60 border border-violet-700/40 flex items-center justify-center shrink-0">
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
                      className="text-zinc-600 shrink-0"
                    />
                  )}
                </div>
              </Dropdown.Trigger>

              {/* Popover */}
              <Dropdown.Popover className="bg-[#111111] border border-[#222222] rounded-xl shadow-xl p-1">
                <Dropdown.Menu className="outline-none">
                  {allOrgs.map((org) => (
                    <Dropdown.Item
                      key={org.id}
                      id={org.id}
                      textValue={org.name}
                      onAction={() => {
                        dispatch(setOrganization(org));
                        router.push(`/organization/${org.slug}/projects`);
                      }}
                      className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] ${
                        activeOrg?.id === org.id
                          ? "text-violet-400"
                          : "text-zinc-200"
                      }`}
                    >
                      <Label>{org.name}</Label>
                      <Description className="text-zinc-600 text-xs">
                        {org.slug}
                      </Description>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
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
                <div className="w-8 h-8 flex items-center justify-center shrink-0 text-zinc-400 group-hover:text-violet-400 transition-colors">
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
                <div className="w-8 h-8 flex items-center justify-center shrink-0 text-zinc-500 group-hover:text-violet-400 transition-colors">
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
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm" />

        <Modal.Container className="bg-[#111111] border border-[#222222] max-w-md">
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.Header className="border-b border-[#1f1f1f] text-white">
                  <Modal.Heading>
                    Invite People to the Organization
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="space-y-4">
                  <p className="text-zinc-400 text-sm">
                    Enter the email of the person you want to invite
                  </p>

                  <Input
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder-zinc-600"
                  />
                </Modal.Body>

                <Modal.Footer className="border-t border-[#1f1f1f]">
                  <Button
                    variant="ghost"
                    onPress={close}
                    className="text-zinc-400"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="secondary"
                    onPress={handleSendInvite}
                    isPending={sendInviteLoading}
                  >
                    Send Invite
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal>

      <CreateOrganization
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setOrganizationName={setOrganizationName}
      />
      <CreateProject
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}

export default Sidebar;
