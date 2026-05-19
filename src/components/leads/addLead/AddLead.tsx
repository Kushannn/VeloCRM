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
  DatePicker,
  DateField,
  Calendar,
  Select,
  ListBox,
} from "@heroui/react";

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
    company: "",
    source: "",
    notes: "",
    expectedClose: "",
    status: "",
  });

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
          company: "",
          source: "",
          notes: "",
          expectedClose: "",
          status: "",
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
      <Modal.Backdrop
        variant="blur"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-10"
      >
        <Modal.Container className="max-w-4xl w-full ">
          <Modal.Dialog className="bg-[#19172c] border border-[#292f46] text-[#a8b0d3] rounded-xl w-full">
            {({ close }) => (
              <>
                <Modal.Header className="border-b border-[#292f46] flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <Modal.Heading className="text-2xl font-semibold text-white">
                      Add lead
                    </Modal.Heading>
                    <Modal.CloseTrigger className="hover:bg-white/5 bg-mist-900 rounded-xl" />
                  </div>
                </Modal.Header>

                <Modal.Body className="py-6 px-4 space-y-4">
                  {/* Row 1 - Name + Email */}
                  <div className="flex gap-4">
                    <TextField name="name" className="flex-1">
                      <Label className="text-gray-300 text-sm">Name *</Label>
                      <Input
                        placeholder="Enter lead name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="email" className="flex-1">
                      <Label className="text-gray-300 text-sm">Email</Label>
                      <Input
                        placeholder="Enter lead email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  {/* Row 2 - Phone + Company */}
                  <div className="flex gap-4">
                    <TextField name="phone" className="flex-1">
                      <Label className="text-gray-300 text-sm">Phone</Label>
                      <Input
                        placeholder="Enter lead phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
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
                        className="bg-[#262626] border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full px-3 py-2"
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  {/* Row 3 - Source + Expected Close */}
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-gray-300 text-sm">Source</label>
                      <Select
                        aria-label="Source"
                        value={formData.source}
                        onChange={(val) => handleChange("source", String(val))}
                      >
                        <Select.Trigger className="bg-[#262626] border border-gray-700 rounded-lg px-3 py-2 text-white w-full flex items-center justify-between">
                          <Select.Value className="text-white text-sm" />
                          <Select.Indicator className="text-gray-400" />
                        </Select.Trigger>
                        <Select.Popover className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl p-1 z-100">
                          <ListBox className="outline-none space-y-1">
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
                                className="px-3 py-2 text-white hover:bg-[#2a2a2a] rounded-lg cursor-pointer"
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
                          className="bg-[#262626] border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                        >
                          <DateField.Input>
                            {(segment) => (
                              <DateField.Segment
                                segment={segment}
                                className="text-white focus:bg-violet-500/20 rounded px-0.5"
                              />
                            )}
                          </DateField.Input>
                          <DateField.Suffix>
                            <DatePicker.Trigger className="text-gray-400 hover:text-white">
                              <DatePicker.TriggerIndicator />
                            </DatePicker.Trigger>
                          </DateField.Suffix>
                        </DateField.Group>

                        <DatePicker.Popover className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl p-2 z-100">
                          <Calendar>
                            <Calendar.Header className="flex items-center justify-between px-2 py-1">
                              <Calendar.YearPickerTrigger className="flex items-center gap-1 text-white text-sm font-medium">
                                <Calendar.YearPickerTriggerHeading />
                                <Calendar.YearPickerTriggerIndicator />
                              </Calendar.YearPickerTrigger>
                              <div className="flex gap-1">
                                <Calendar.NavButton
                                  slot="previous"
                                  className="text-gray-400 hover:text-white p-1 rounded"
                                />
                                <Calendar.NavButton
                                  slot="next"
                                  className="text-gray-400 hover:text-white p-1 rounded"
                                />
                              </div>
                            </Calendar.Header>

                            <Calendar.Grid className="w-full">
                              <Calendar.GridHeader>
                                {(day) => (
                                  <Calendar.HeaderCell className="text-zinc-500 text-xs font-medium text-center py-1">
                                    {day}
                                  </Calendar.HeaderCell>
                                )}
                              </Calendar.GridHeader>
                              <Calendar.GridBody>
                                {(date) => (
                                  <Calendar.Cell
                                    date={date}
                                    className="text-sm text-zinc-300 hover:bg-violet-500/20 data-selected:bg-violet-600 data-selected:text-white rounded-lg text-center py-1 cursor-pointer"
                                  />
                                )}
                              </Calendar.GridBody>
                            </Calendar.Grid>

                            <Calendar.YearPickerGrid>
                              <Calendar.YearPickerGridBody>
                                {({ year }) => (
                                  <Calendar.YearPickerCell
                                    year={year}
                                    className="text-sm text-zinc-300 hover:bg-violet-500/20 data-selected:bg-violet-600 data-selected:text-white rounded-lg text-center py-1 cursor-pointer"
                                  />
                                )}
                              </Calendar.YearPickerGridBody>
                            </Calendar.YearPickerGrid>
                          </Calendar>
                        </DatePicker.Popover>
                      </DatePicker>
                    </div>
                  </div>

                  {/* Notes */}
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
