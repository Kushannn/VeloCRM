"use client";

import { useEffect, useState } from "react";
import {
  toast,
  Modal,
  Button,
  Input,
  useOverlayState,
  TextField,
  Label,
  FieldError,
  DatePicker,
  DateField,
  Calendar,
  Select,
  ListBox,
} from "@heroui/react";
import { Leads, UserType } from "@/lib/types";

interface AddLeadProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onSuccess?: () => void;
  editingLead?: Leads | null;
  user: UserType;
}

export default function AddLead({
  isOpen,
  onClose,
  organizationId,
  onSuccess,
  editingLead,
  user,
}: //   onSuccess,
AddLeadProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    notes: "",
    expectedClose: "",
    status: "",
  });

  useEffect(() => {
    if (editingLead) {
      setFormData({
        name: editingLead.name || "",
        email: editingLead.email || "",
        phone: editingLead.phone || "",
        company: editingLead.company || "",
        source: editingLead.source || "",
        notes: editingLead.notes || "",
        expectedClose: editingLead.expectedClose
          ? new Date(editingLead.expectedClose).toISOString()
          : "",
        status: editingLead.status || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "",
        notes: "",
        expectedClose: "",
        status: "",
      });
    }
  }, [editingLead, isOpen]);

  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const [loading, setLoading] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (!formData.name.trim()) {
      toast.danger("Lead name is required");
      return;
    }

    setLoading(true);

    try {
      const endpoint = editingLead
        ? `/api/organization/${organizationId}/leads/${editingLead.id}`
        : `/api/organization/${organizationId}/leads/add-lead`;

      const method = editingLead ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          organizationId,
          user,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          editingLead
            ? "Lead updated successfully!"
            : "Lead created successfully!",
        );

        onClose();

        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          source: "",
          notes: "",
          expectedClose: "",
          status: "",
        });

        onSuccess?.();
      } else {
        toast.danger(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.danger(
        editingLead ? "Failed to update lead." : "Failed to create lead.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop
        variant="blur"
        className="fixed inset-0 z-50 bg-[#09080f]/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <Modal.Container className="max-w-3xl w-full">
          <Modal.Dialog className="bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40 max-w-3xl w-full">
            {({ close }) => (
              <>
                <Modal.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />
                <Modal.Header className="border-b border-[#2a2040] p-2">
                  <Modal.Heading className="text-2xl font-semibold text-[#e8e4f0]">
                    Add Leads
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body className="py-6 px-4 space-y-4">
                  <div className="flex gap-4">
                    <TextField name="name" className="flex-1" isRequired>
                      <Label className="text-gray-300 text-sm">Name</Label>
                      <Input
                        placeholder="Enter lead name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 transition-colors data-focused:border-[#6c3fc4] data-focused:outline-none data-focused:ring-0 data-focused:shadow-none"
                      />
                      <FieldError className="text-[#f87171] text-xs" />
                    </TextField>

                    <TextField name="email" className="flex-1">
                      <Label className="text-gray-300 text-sm">Email</Label>
                      <Input
                        placeholder="Enter lead email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 transition-colors data-focused:border-[#6c3fc4] data-focused:outline-none data-focused:ring-0 data-focused:shadow-none"
                      />
                      <FieldError className="text-[#f87171] text-xs" />
                    </TextField>
                  </div>

                  <div className="flex gap-4">
                    <TextField name="phone" className="flex-1">
                      <Label className="text-gray-300 text-sm">Phone</Label>
                      <Input
                        placeholder="Enter lead phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 transition-colors data-focused:border-[#6c3fc4] data-focused:outline-none data-focused:ring-0 data-focused:shadow-none"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="company" className="flex-1">
                      <Label className="text-gray-300 text-sm">Company</Label>
                      <Input
                        placeholder="Enter company name"
                        value={formData.company}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                        className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 transition-colors data-focused:border-[#6c3fc4] data-focused:outline-none data-focused:ring-0 data-focused:shadow-none"
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-gray-300 text-sm">Source</label>
                      <Select
                        aria-label="Source"
                        value={formData.source}
                        onChange={(val) => handleChange("source", String(val))}
                      >
                        <Select.Trigger className="w-full h-10 bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg px-3 text-[#e8e4f0] flex items-center justify-between cursor-pointer transition-colors">
                          <Select.Value className="[&_.label]:text-[#7c6fa0] text-[#7c6fa0]" />
                          <Select.Indicator className="text-[#7c6fa0]" />
                        </Select.Trigger>
                        <Select.Popover className="bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl shadow-black/40">
                          <ListBox className="outline-none text-[#e8e4f0] p-1 space-y-1">
                            {[
                              { id: "WEBSITE", label: "Website" },
                              { id: "REFERRAL", label: "Referral" },
                              { id: "SOCIAL_MEDIA", label: "Social Media" },
                              { id: "EMAIL_CAMPAIGN", label: "Email Campaign" },
                              { id: "COLD_CALL", label: "Cold Call" },
                              { id: "EXHIBITION", label: "Exhibition" },
                              { id: "OTHER", label: "Other" },
                            ].map((s) => (
                              <ListBox.Item
                                key={s.id}
                                id={s.id}
                                textValue={s.label}
                                className="px-3 text-[#e8e4f0] hover:bg-[#2a2040] rounded-lg cursor-pointer"
                              >
                                {s.label}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-gray-300 text-sm">Status</label>

                      <Select
                        aria-label="Status"
                        value={formData.status}
                        onChange={(val) => handleChange("status", String(val))}
                      >
                        <Select.Trigger className="w-full h-10 bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg px-3 text-[#e8e4f0] flex items-center justify-between cursor-pointer transition-colors">
                          <Select.Value className="[&_.label]:text-[#7c6fa0] text-[#7c6fa0]" />
                          <Select.Indicator className="text-[#7c6fa0]" />
                        </Select.Trigger>

                        <Select.Popover className="bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl shadow-black/40">
                          <ListBox className="outline-none text-[#e8e4f0] p-1 space-y-1">
                            {[
                              { id: "NEW", label: "New" },
                              { id: "CONTACTED", label: "Contacted" },
                              { id: "QUALIFIED", label: "Qualified" },
                              { id: "PROPOSAL_SENT", label: "Proposal Sent" },
                              { id: "NEGOTIATION", label: "Negotiation" },
                              { id: "WON", label: "Won" },
                              { id: "LOST", label: "Lost" },
                            ].map((s) => (
                              <ListBox.Item
                                key={s.id}
                                id={s.id}
                                textValue={s.label}
                                className="px-3 text-[#e8e4f0] hover:bg-[#2a2040] rounded-lg cursor-pointer"
                              >
                                {s.label}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <Label className="text-gray-300 text-sm">
                        Expected Close Date
                      </Label>
                      <DatePicker
                        name="expectedClose"
                        onChange={(date) =>
                          handleChange(
                            "expectedClose",
                            date ? date.toString() : "",
                          )
                        }
                      >
                        <DateField.Group
                          fullWidth
                          className="bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg transition-colors"
                        >
                          <DateField.Input>
                            {(segment) => (
                              <DateField.Segment
                                segment={segment}
                                className="text-[#7c6fa0] focus:bg-[#6c3fc4]/20 rounded px-0.5"
                              />
                            )}
                          </DateField.Input>
                          <DateField.Suffix>
                            <DatePicker.Trigger className="text-[#7c6fa0] hover:text-[#8b5cf6] px-2">
                              <DatePicker.TriggerIndicator className="text-[#7c6fa0]" />
                            </DatePicker.Trigger>
                          </DateField.Suffix>
                        </DateField.Group>

                        <DatePicker.Popover className="bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl shadow-black/40 p-3">
                          <Calendar>
                            <Calendar.Header className="flex items-center justify-between mb-2">
                              <Calendar.YearPickerTrigger>
                                <Calendar.YearPickerTriggerHeading className="text-[#e8e4f0] font-medium" />
                                <Calendar.YearPickerTriggerIndicator className="text-[#7c6fa0]" />
                              </Calendar.YearPickerTrigger>
                              <Calendar.NavButton
                                slot="previous"
                                className="text-[#7c6fa0] hover:text-[#3d2d6b] p-1 rounded"
                              />
                              <Calendar.NavButton
                                slot="next"
                                className="text-[#7c6fa0] hover:text-[#3d2d6b] p-1 rounded"
                              />
                            </Calendar.Header>

                            <Calendar.Grid className="w-full">
                              <Calendar.GridHeader>
                                {(day) => (
                                  <Calendar.HeaderCell className="text-[#4d3d7a] text-xs font-medium">
                                    {day}
                                  </Calendar.HeaderCell>
                                )}
                              </Calendar.GridHeader>
                              <Calendar.GridBody>
                                {(date) => (
                                  <Calendar.Cell
                                    date={date}
                                    className="text-[#e8e4f0] text-sm rounded hover:bg-[#6c3fc4]/20 data-selected:bg-[#6c3fc4]"
                                  />
                                )}
                              </Calendar.GridBody>
                            </Calendar.Grid>

                            <Calendar.YearPickerGrid>
                              <Calendar.YearPickerGridBody>
                                {({ year }) => (
                                  <Calendar.YearPickerCell
                                    year={year}
                                    className="text-[#e8e4f0] hover:bg-[#2a2040] data-selected:bg-[#6c3fc4]"
                                  />
                                )}
                              </Calendar.YearPickerGridBody>
                            </Calendar.YearPickerGrid>
                          </Calendar>
                        </DatePicker.Popover>
                      </DatePicker>
                    </div>
                  </div>

                  <TextField name="notes" className="w-full">
                    <Label className="text-[#b8aed4] text-sm">Notes</Label>
                    <textarea
                      placeholder="Optional notes"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      rows={3}
                      className="w-full bg-[#0e0c17] border border-[#3d2d6b] hover:border-[#4c2d9e] rounded-lg text-[#e8e4f0] placeholder-[#7c6fa0] px-3 py-2 transition-colors data-focused:border-[#6c3fc4] data-focused:outline-none data-focused:ring-0 data-focused:shadow-none"
                    />
                    <FieldError />
                  </TextField>
                </Modal.Body>

                <Modal.Footer className="border-t border-[#292f46] pt-4">
                  <Button
                    variant="primary"
                    onPress={close}
                    className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
                    // disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    // color="primary"
                    onPress={handleSubmit}
                    // isLoading={loading}
                    className="bg-[#6c3fc4] hover:bg-[#8b5cf6] active:bg-[#4c2d9e] text-[#ede8fb] transition-colors"
                  >
                    {loading
                      ? editingLead
                        ? "Updating..."
                        : "Creating..."
                      : editingLead
                        ? "Update Lead"
                        : "Create Lead"}
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
