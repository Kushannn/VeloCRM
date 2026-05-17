"use client";

import { useState } from "react";
import {
  toast,
  Modal,
  Button,
  Input,
  useOverlayState,
  TextField,
  Label,
  FieldError,
} from "@heroui/react";
import { useParams } from "next/navigation";

interface AddLeadProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  //   onSuccess?: () => void;
}

export default function AddLead({
  isOpen,
  onClose,
  organizationId,
}: //   onSuccess,
AddLeadProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    notes: "",
  });

  const state = useOverlayState();

  const [loading, setLoading] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (!formData.name.trim()) {
      // addToast({
      //   title: "Lead name is required",
      //   variant: "solid",
      //   color: "danger",
      // });

      toast.danger("Lead name is required");

      return;
    }

    const finalData = { ...formData, organizationId };

    setLoading(true);
    try {
      const res = await fetch(
        `/api/organization/${organizationId}/leads/add-lead`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...finalData,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        // addToast({
        //   title: "Lead created successfully!",
        //   variant: "solid",
        //   color: "success",
        // });

        toast.success("Lead created successfully!");

        onClose();
        setFormData({
          name: "",
          email: "",
          phone: "",
          source: "",
          notes: "",
        });
        // onSuccess?.();
      } else {
        // addToast({
        //   title: data.error || "Something went wrong.",
        //   variant: "solid",
        //   color: "danger",
        // });
        toast.danger("Something went wrong");
      }
    } catch (err) {
      toast.danger("Failed to create lead.");
      // addToast({
      //   title: "Failed to create lead.",
      //   variant: "solid",
      //   color: "danger",
      // });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop variant="blur" className="bg-[#292f46]/50">
        <Modal.Container
          size="lg"
          className="border border-[#292f46] bg-[#19172c] text-[#a8b0d3] w-full max-w-2xl"
        >
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="hover:bg-white/5 active:bg-white/10" />

                <Modal.Header className="border-b border-[#292f46]">
                  <Modal.Heading className="text-white text-2xl font-semibold">
                    Create Lead
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-6 space-y-4">
                  <div className="flex gap-4">
                    {/* <Input
                      label="Name"
                      placeholder="Enter lead name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      variant="primary"
                      classNames={{
                        input: "text-white placeholder-gray-400",
                        label: "text-gray-300",
                        inputWrapper:
                          "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
                      }}
                    /> */}

                    <TextField name="name" className="flex-1">
                      <Label className="text-gray-300 text-sm">Name</Label>
                      <Input
                        placeholder="Enter lead name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                      />
                      <FieldError />
                    </TextField>
                    {/* <Input
                      label="Email"
                      placeholder="Enter lead email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      variant="primary"
                      classNames={{
                        input: "text-white placeholder-gray-400",
                        label: "text-gray-300",
                        inputWrapper:
                          "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
                      }}
                    /> */}

                    <TextField name="email" className="flex-1">
                      <Label className="text-gray-300 text-sm">Email</Label>
                      <Input
                        placeholder="Enter lead email"
                        value={formData.email}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  <div className="flex gap-4">
                    {/* <Input
                      label="Phone"
                      placeholder="Enter lead phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      variant="primary"
                      classNames={{
                        input: "text-white placeholder-gray-400",
                        label: "text-gray-300",
                        inputWrapper:
                          "bg-[#262626] border border-gray-700 rounded-lg text-white focus-within:ring-0",
                      }}
                    /> */}
                    <TextField name="name" className="flex-1">
                      <Label className="text-gray-300 text-sm">Phone</Label>
                      <Input
                        placeholder="Enter lead phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="source" className="flex-1">
                      <Label className="text-gray-300 text-sm">Source</Label>
                      <Input
                        placeholder="Lead source (e.g., LinkedIn, Website)"
                        value={formData.source}
                        onChange={(e) => handleChange("source", e.target.value)}
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  <TextField name="notes" className="w-full">
                    <Label className="text-gray-300 text-sm">Notes</Label>
                    <textarea
                      placeholder="Optional notes"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      rows={3}
                      className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2 resize-none"
                    />
                    <FieldError />
                  </TextField>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#292f46]">
                  <Button
                    variant="primary"
                    onPress={close}
                    // disabled={loading}
                    className="text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    // color="primary"
                    onPress={handleSubmit}
                    // isLoading={loading}
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
