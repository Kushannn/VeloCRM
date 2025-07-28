"use client";

import React, { useState } from "react";
import {
  Building,
  Home,
  BookCheck,
  FolderOpenDot,
  UserPlus,
  ClipboardList,
  Users,
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
      <div
        className="w-full sm:w-64 p-4 flex flex-col gap-4 ml-3 min-h-full rounded-xl text-white"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
          // Optional: subtle border to separate from main content
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          className="h-12 sm:h-14 cursor-pointer mt-2 font-bold text-base sm:text-lg p-2 rounded-md text-white flex items-center gap-2 transition-colors duration-300"
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
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

        <div
          className="flex items-center gap-4 font-bold cursor-pointer text-sm sm:text-base p-2 rounded-md transition-colors duration-300"
          onClick={() => {
            router.push("/");
          }}
          style={{ color: "#d1d5db" }} // soft gray color
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Home className="text-[#9e94a8]" />
          <span>Home</span>
        </div>

        <div
          onClick={() => {
            router.push(
              "/organization/" + user?.membership?.organizationId + "/projects"
            );
          }}
          className="flex items-center gap-4 font-bold cursor-pointer text-sm sm:text-base p-2 rounded-md transition-colors duration-300"
          style={{ color: "#d1d5db" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <FolderOpenDot className="text-[#9e94a8]" />
          <span>Projects</span>
        </div>

        <div
          className="flex items-center gap-4 font-bold cursor-pointer text-sm sm:text-base p-2 rounded-md transition-colors duration-300"
          onClick={() => {
            router.push(
              "/organization/" + user?.membership?.organizationId + "/employees"
            );
          }}
          style={{ color: "#d1d5db" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Users className="text-[#9e94a8]" />
          <span>Employees</span>
        </div>

        <div
          className="flex items-center gap-4 font-bold cursor-pointer text-sm sm:text-base p-2 rounded-md transition-colors duration-300"
          onClick={() => {
            router.push(
              "/organization/" + user?.membership?.organizationId + "/leads"
            );
          }}
          style={{ color: "#d1d5db" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Home className="text-[#9e94a8]" />
          <span>Leads</span>
        </div>

        <div
          className="flex items-center gap-4 font-bold cursor-pointer text-sm sm:text-base p-2 rounded-md transition-colors duration-300"
          onClick={() => setInviteModal(true)}
          style={{ color: "#d1d5db" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <UserPlus className="text-[#9e94a8]" />
          <span>Invite</span>
        </div>
      </div>

      {/* Invite Modal */}
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
