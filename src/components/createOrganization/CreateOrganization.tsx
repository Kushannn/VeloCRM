"use client";

import { useState } from "react";
import {
  Modal,
  toast,
  Button,
  Input,
  TextField,
  Label,
  FieldError,
} from "@heroui/react";
import { useAppDispatch } from "@/redux/hooks";
import { setOrganization } from "@/redux/slices/orgSlice";
import { addOwnedOrganization } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface CreateOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
  setOrganizationName: (name: string) => void;
  // This prop is used to set the organization name in the parent component
  onSuccess: () => void;
}

export default function CreateOrganization({
  isOpen,
  onClose,
  setOrganizationName,
}: CreateOrganizationProps) {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dispatch = useAppDispatch();

  async function handleSubmit() {
    if (!orgName.trim()) {
      toast.danger("Organization name is required!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/organization/create-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: orgName }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Organization successfully created", {
          description: "You will be shown data for the new organization",
        });
        dispatch(addOwnedOrganization(data.organization));
        dispatch(setOrganization(data.organization));
        onClose();
        setOrgName("");
        setOrganizationName(data.organization.name);
        Cookies.set("orgSlug", data.organization.slug, {
          expires: 30,
          path: "/",
        });
        router.push(`/organization/${data.organization.slug}/dashboard`);
      } else {
        toast.danger("Something went wrong");
      }
    } catch (err) {
      toast.danger("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <Modal.Backdrop variant="blur" className="bg-[#09080f]/60">
        <Modal.Container className="max-w-2xl w-full">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />

                <Modal.Header className="border-b border-[#2a2040] pb-4">
                  <Modal.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                    Create Organization
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-2 space-y-4">
                  <TextField name="name" className="flex-1">
                    <Label className="text-gray-300 text-sm pb-2">
                      Organization Name
                    </Label>
                    <Input
                      placeholder="Enter organization name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="bg-[#0e0c17] border border-[#2a2040] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/40 transition-colors w-full"
                    />
                    <FieldError />
                  </TextField>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#2a2040] pt-6">
                  <Button
                    variant="ghost"
                    onPress={onClose}
                    isDisabled={loading}
                    className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={handleSubmit}
                    isPending={loading}
                    className="bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] transition-colors"
                  >
                    {loading ? "Creating..." : "Create"}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
