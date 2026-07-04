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
import { useParams, usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setOrganization } from "@/redux/slices/orgSlice";
import Cookies from "js-cookie";

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

  const pathname = usePathname();

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

        toast.success("User invited successfully", {
          description: "An email has been sent to the user!",
        });
      }
    } catch {
      toast.danger("Could not invite user");
    }
  }

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
        <div className="absolute inset-0 bg-[#09080f] border-r border-[#1f1f1f]" />

        <div className="relative flex flex-col h-full py-4 overflow-hidden">
          <div className="pr-3 mb-4">
            <Dropdown>
              <Dropdown.Trigger className="w-57.5">
                <div className="ml-2 flex items-center gap-3 rounded-lg border border-[#3d2d6b] bg-[#1a1232] px-3 py-2 hover:bg-[#2a2040] hover:border-[#4c2d9e] transition-all">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2d1d5e] border border-[#4c2d9e]">
                    <Building size={18} className="text-[#c4a8f5]" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-semibold text-[#e8e4f0]">
                      {activeOrg?.name ?? "Select organization"}
                    </p>

                    <p className="truncate text-xs text-[#7c6fa0]">
                      Organization
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="ml-2 shrink-0 text-[#7c6fa0]"
                  />
                </div>
              </Dropdown.Trigger>

              {/* Dropdown */}
              <Dropdown.Popover className="bg-[#1a1232] border border-[#3d2d6b] rounded-md shadow-2xl p-2 min-w-64">
                <Dropdown.Menu
                  className="outline-none"
                  onAction={async (key) => {
                    const org = allOrgs.find((o) => o.id === key);
                    if (!org) return;

                    dispatch(setOrganization(org));
                    Cookies.set("orgSlug", org.slug);

                    const currentSection =
                      pathname?.split("/").slice(3).join("/") ?? "dashboard";
                    router.push(`/organization/${org.slug}/${currentSection}`);
                  }}
                >
                  {allOrgs.map((org) => (
                    <Dropdown.Item
                      key={org.id}
                      id={org.id}
                      textValue={org.name}
                      className={`rounded-md px-3 py-3 transition-colors cursor-pointer
                        ${
                          activeOrg?.id === org.id
                            ? "bg-[#2d1d5e] border border-[#4c2d9e]"
                            : "hover:bg-[#2a2040]"
                        }
                      `}
                    >
                      <Label
                        className={`font-medium ${
                          activeOrg?.id === org.id
                            ? "text-[#c4a8f5]"
                            : "text-[#e8e4f0]"
                        }`}
                      >
                        {org.name}
                      </Label>
                      {/* 
                      <Description className="text-xs text-[#7c6fa0]">
                        {org.slug}
                      </Description> */}
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
        <Modal.Backdrop variant="blur" className="bg-[#09080f]/60">
          <Modal.Container className="max-w-2xl w-full">
            <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
              {({ close }) => (
                <>
                  <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />

                  <Modal.Header className="border-b border-[#2a2040] pb-4">
                    <Modal.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                      Invite User
                    </Modal.Heading>
                  </Modal.Header>

                  <Modal.Body className="space-y-4 p-4">
                    <p className="text-[#7c6fa0] text-sm w-full">
                      Enter the email of the person you want to invite
                    </p>

                    <Input
                      placeholder="Enter email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#0e0c17] border border-[#2a2040] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/40 transition-colors w-full"
                    />
                  </Modal.Body>

                  <Modal.Footer className="border-t border-[#2a2040] pt-6">
                    <Button
                      variant="ghost"
                      onPress={close}
                      isPending={sendInviteLoading}
                      className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="secondary"
                      onPress={handleSendInvite}
                      isPending={sendInviteLoading}
                      className="bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] transition-colors"
                    >
                      {sendInviteLoading ? "Sending" : "Send Invite"}
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <CreateOrganization
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setOrganizationName={setOrganizationName}
        onSuccess={() => router.refresh()}
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
