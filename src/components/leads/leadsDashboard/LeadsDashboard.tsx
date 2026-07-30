"use client";

import {
  Button,
  Select,
  ListBox,
  TextField,
  Input,
  Label,
} from "@heroui/react";
import { ListFilter, Plus, Search, LayoutGrid, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AddLead from "../addLead/AddLead";
import { Leads } from "@/lib/types";
import { useRouter } from "next/navigation";
import { LeadsKanbanBoard } from "../LeadsKanbanBoard";
import LeadsTable from "../LeadsTable";
import { usePusherEvents } from "@/hooks/pusher/usePusherEvents";

export function LeadsDashboard({
  org,
  leads,
  user,
}: {
  org: any;
  leads: Leads[];
  user: any;
}) {
  const router = useRouter();

  const [localLeads, setLocalLeads] = useState(leads);
  const [openAddLead, setOpenAddLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Leads | null>(null);
  const [filters, setFilters] = useState({ status: "", source: "" });
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "board">("table");

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const res = await fetch(
      `/api/organization/${org.id}/leads/${leadId}/update-lead-status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      },
    );
    if (!res.ok) throw new Error("Failed to update lead status");
    router.refresh();
  };

  const filteredLeads = useMemo(() => {
    return localLeads.filter((lead) => {
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (
        search &&
        !lead.name?.toLowerCase().includes(search.toLowerCase()) &&
        !lead.email?.toLowerCase().includes(search.toLowerCase()) &&
        !lead.company?.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [localLeads, filters, search]);

  const handleAddLead = () => {
    setEditingLead(null);
    setOpenAddLead(true);
  };

  const handleEditLead = (lead: Leads) => {
    setEditingLead(lead);
    setOpenAddLead(true);
  };

  usePusherEvents(`private-org-${org.id}`, {
    "lead:added": (data) => {
      setLocalLeads((prev) => [...prev, data.lead]);
    },
    "lead:updated": (data) => {
      setLocalLeads((prev) =>
        prev.map((l) => (l.id === data.lead.id ? data.lead : l)),
      );
    },
  });

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col">
            <p className="text-[11px] font-medium uppercase tracking-widest text-violet-400 mb-1">
              {org.name}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <div className="flex w-full sm:w-auto gap-1 bg-[#0e0c17] border border-[#2a2040] rounded-xl p-1">
              <button
                onClick={() => setView("table")}
                className={`flex-1 cursor-pointer sm:flex-none p-2 rounded-lg transition-colors ${
                  view === "table"
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                aria-label="Table view"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setView("board")}
                className={`flex-1 cursor-pointer sm:flex-none p-2 rounded-lg transition-colors ${
                  view === "board"
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                aria-label="Board view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            <Button
              className="w-full sm:w-fit px-3 py-4 text-md items-center gap-2 bg-[#6c3fc4] hover:scale-105 hover:bg-[#8b5cf6] text-[#ede8fb] text-sm font-medium rounded-xl transition-colors duration-300 cursor-pointer"
              onClick={handleAddLead}
            >
              <Plus />
              Add new lead
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 my-4">
          <TextField
            name="search"
            className="w-full md:flex-1 md:max-w-4xl relative text-[#7c6fa0]"
            value={search}
            onChange={setSearch}
          >
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c6fa0] pointer-events-none z-10"
            />
            <Input
              className="pl-9 pr-9 bg-[#0e0c17] text-[13px] text-[#7c6fa0] placeholder:text-[#7c6fa0] border border-white/[0.07] hover:border-white/[0.14] focus-visible:ring-0 focus-visible:border-white/20 data-[focus-visible=true]:ring-0 data-[focus-visible=true]:border-white/20 data-[focus-visible=true]:shadow-none rounded-xl"
              placeholder="Search leads..."
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors z-10 cursor-pointer"
              >
                ✕
              </button>
            )}
          </TextField>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 md:gap-3">
            <Select
              aria-label="Filter by status"
              className="w-full sm:w-36 md:w-40 bg-[#0e0c17] rounded-lg border-2 border-white/[0.07]"
              value={filters.status || "ALL"}
              onChange={(value) =>
                setFilters((f) => ({
                  ...f,
                  status: value === "ALL" ? "" : String(value),
                }))
              }
            >
              <Select.Trigger className="bg-[#0e0c17] rounded-lg text-[#7c6fa0] min-h-11">
                <div className="flex items-center gap-2">
                  <ListFilter size={16} />
                  <Select.Value className="text-[#7c6fa0]" />
                </div>
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover className="rounded-xl overflow-hidden bg-[#0e0c17] border border-[#2a2040] outline-none ring-0 shadow-none focus:outline-none focus:ring-0 [&::before]:hidden [&::after]:hidden">
                <ListBox className="bg-[#0e0c17]">
                  {[
                    { id: "ALL", label: "All Statuses" },
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
                      className="hover:bg-[#1a1232] transition-colors border-none"
                    >
                      <Label className="text-[#b8aed4]">{s.label}</Label>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              aria-label="Filter by source"
              className="w-full sm:w-36 md:w-40 bg-[#0e0c17] rounded-lg border-2 border-white/[0.07]"
              value={filters.source || "ALL"}
              onChange={(value) =>
                setFilters((f) => ({
                  ...f,
                  source: value === "ALL" ? "" : String(value),
                }))
              }
            >
              <Select.Trigger className="bg-[#0e0c17] rounded-lg text-[#b8aed4] min-h-11">
                <div className="flex items-center gap-2">
                  <ListFilter size={16} />
                  <Select.Value className="text-[#b8aed4]" />
                </div>
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover className="rounded-xl overflow-hidden bg-[#0e0c17] border border-[#2a2040] outline-none ring-0 shadow-none focus:outline-none focus:ring-0 [&::before]:hidden [&::after]:hidden">
                <ListBox className="bg-[#0e0c17] border-none">
                  {[
                    { id: "ALL", label: "All Sources" },
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
                      className="hover:bg-[#1a1232] transition-colors border-none"
                    >
                      <Label className="text-[#b8aed4]">{s.label}</Label>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {(filters.status || filters.source) && (
              <button
                onClick={() => setFilters({ status: "", source: "" })}
                className="w-full sm:w-auto text-center text-xs text-zinc-500 hover:text-white transition-colors px-2 py-2 rounded hover:bg-[#1a1a1a]"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-x-auto">
          {view === "table" ? (
            <LeadsTable
              filteredLeads={filteredLeads}
              onEditLead={handleEditLead}
            />
          ) : (
            <LeadsKanbanBoard
              leads={filteredLeads}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      <AddLead
        isOpen={openAddLead}
        onClose={() => {
          setOpenAddLead(false);
          setEditingLead(null);
        }}
        organizationId={org.id}
        editingLead={editingLead}
        onSuccess={() => router.refresh()}
        user={user}
      />
    </>
  );
}
