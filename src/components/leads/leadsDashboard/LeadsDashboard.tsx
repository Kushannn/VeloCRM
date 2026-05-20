"use client";

import {
  Button,
  Pagination,
  SearchField,
  Table,
  Select,
  ListBox,
} from "@heroui/react";
import { ListFilter, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AddLead from "../addLead/AddLead";
import { Leads } from "@/lib/types";
import { useRouter } from "next/navigation";

const columns = [
  { id: "name", name: "Name" },
  { id: "company", name: "Company" },
  { id: "status", name: "Status" },
  { id: "email", name: "Email" },
  { id: "source", name: "Source" },
  { id: "actions", name: "Actions" },
];

const ROWS_PER_PAGE = 4;

export function LeadsDashboard({ org, leads }: { org: any; leads: Leads[] }) {
  const router = useRouter();

  const [openAddLead, setOpenAddLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Leads | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
  });
  const [search, setSearch] = useState("");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
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
  }, [leads, filters, search]);

  const totalPages = Math.ceil(filteredLeads.length / ROWS_PER_PAGE);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredLeads.slice(start, start + ROWS_PER_PAGE);
  }, [page, filteredLeads]);

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, filteredLeads.length);

  const handleAddLead = () => {
    setEditingLead(null);
    setOpenAddLead(true);
  };

  const handleEditLead = (lead: Leads) => {
    setEditingLead(lead);
    setOpenAddLead(true);
  };

  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-white/75 text-4xl p-2">Leads</span>
            <span className="text-white/55 text-lg m-2 ">
              Manage and nurture your primary business relationships
            </span>
          </div>
          <Button
            className="px-3 py-4 text-md font-medium flex items-center rounded-md"
            onClick={handleAddLead}
          >
            <Plus />
            Add new lead
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-3 my-4">
            <SearchField
              name="search"
              className="flex-1 max-w-4xl"
              variant="secondary"
              value={search}
              onChange={setSearch}
            >
              <SearchField.Group className="flex items-center gap-2 bg-[#111111] border border-white/[0.07] hover:border-white/[0.14] focus-within:border-white/20 rounded-xl px-3 py-2 transition-all duration-200">
                <SearchField.SearchIcon className="text-white/25 shrink-0 w-4 h-4" />
                <SearchField.Input
                  className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 focus:outline-none"
                  placeholder="Search leads..."
                />
                <SearchField.ClearButton className="text-white/25 hover:text-white/60 transition-colors" />
              </SearchField.Group>
            </SearchField>

            <Select
              aria-label="Filter by status"
              value={filters.status}
              onChange={(val) =>
                setFilters((f) => ({
                  ...f,
                  status: val === "ALL" ? "" : String(val),
                }))
              }
              placeholder="Status"
            >
              <Select.Trigger className="bg-[#111111] border border-white/[0.07] hover:border-white/[0.14] rounded-xl px-3 py-2 text-white text-sm flex items-center gap-2 min-w-35">
                <ListFilter />
                <Select.Value className="text-white/60 text-sm" />
                <Select.Indicator className="text-white/25" />
              </Select.Trigger>
              <Select.Popover className="bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-xl p-1 z-100">
                <ListBox className="outline-none space-y-1">
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
                      textValue={s.label}
                      className="px-3 py-2 text-sm text-white hover:bg-[#2a2a2a] rounded-lg cursor-pointer"
                    >
                      {s.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Source Filter */}
            <Select
              aria-label="Filter by source"
              value={filters.source}
              onChange={(val) =>
                setFilters((f) => ({
                  ...f,
                  source: val === "ALL" ? "" : String(val),
                }))
              }
              placeholder="Source"
            >
              <Select.Trigger className="bg-[#111111] border border-white/[0.07] hover:border-white/[0.14] rounded-xl px-3 py-2 text-white text-sm flex items-center gap-2 min-w-35">
                <ListFilter />
                <Select.Value className="text-white/60 text-sm" />
                <Select.Indicator className="text-white/25" />
              </Select.Trigger>
              <Select.Popover className="bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-xl p-1 z-100">
                <ListBox className="outline-none space-y-1">
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
                      textValue={s.label}
                      className="px-3 py-2 text-sm text-white hover:bg-[#2a2a2a] rounded-lg cursor-pointer"
                    >
                      {s.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {(filters.status || filters.source) && (
              <button
                onClick={() => setFilters({ status: "", source: "" })}
                className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#1a1a1a]"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div>
          <Table
            className="p-0 border-none bg-transparent min-h-screen"
            variant="secondary"
          >
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Leads table"
                className="min-w-150 bg-[#0d0d0d] rounded-xl border border-[#1f1f1f]"
              >
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Column
                      isRowHeader={column.id === "name"}
                      className="bg-[#111111] text-zinc-400 text-lg font-semibold uppercase tracking-wider px-4 py-3 border-b border-[#1f1f1f]"
                    >
                      {column.name}
                    </Table.Column>
                  )}
                </Table.Header>

                <Table.Body
                  items={paginatedItems}
                  className="divide-y divide-[#1f1f1f]"
                  renderEmptyState={() => (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                      No leads found. Try adjusting your filters.
                    </div>
                  )}
                >
                  {(lead) => (
                    <Table.Row className="bg-[#0e0e0e]! border-b border-[#1f1f1f] hover:bg-[#141414]! data-hovered:bg-[#0e0e0e]!">
                      <Table.Collection items={columns}>
                        {(column) => (
                          <Table.Cell className="px-4 py-3 text-md text-zinc-300">
                            {column.id === "actions" ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs"
                                  onPress={() => handleEditLead(lead)}
                                >
                                  <Pencil className=" text-white" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-red-400"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            ) : column.id === "status" ? (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  lead.status === "NEW"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : lead.status === "CONTACTED"
                                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                      : lead.status === "QUALIFIED"
                                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                        : lead.status === "PROPOSAL_SENT"
                                          ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                          : lead.status === "NEGOTIATION"
                                            ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                            : lead.status === "WON"
                                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                              >
                                {lead.status}
                              </span>
                            ) : (
                              String(lead[column.id as keyof typeof lead] ?? "")
                            )}
                          </Table.Cell>
                        )}
                      </Table.Collection>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>

            <Table.Footer className="flex items-center justify-between px-4 py-3 border-t border-[#1f1f1f] bg-[#0d0d0d] rounded-b-xl">
              <Pagination size="sm">
                <Pagination.Summary className="text-xs text-zinc-500">
                  {start} to {end} of {leads.length} results
                </Pagination.Summary>
                <Pagination.Content className="flex items-center gap-1">
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page === 1}
                      onPress={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-[#1a1a1a] rounded disabled:opacity-30 transition-colors"
                    >
                      <Pagination.PreviousIcon />
                      Prev
                    </Pagination.Previous>
                  </Pagination.Item>

                  {pages.map((p) => (
                    <Pagination.Item key={p}>
                      <Pagination.Link
                        isActive={p === page}
                        onPress={() => setPage(p)}
                        className={`w-7 h-7 text-xs rounded flex items-center justify-center transition-colors ${
                          p === page
                            ? "bg-violet-600 text-white"
                            : "text-zinc-400 hover:bg-[#1a1a1a] hover:text-white"
                        }`}
                      >
                        {p}
                      </Pagination.Link>
                    </Pagination.Item>
                  ))}

                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={page === totalPages}
                      onPress={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-[#1a1a1a] rounded disabled:opacity-30 transition-colors"
                    >
                      Next
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </Table.Footer>
          </Table>
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
      />
    </>
  );
}
